import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  User, 
  Receipt, 
  CreditCard, 
  Clock, 
  Copy, 
  Check, 
  RefreshCw, 
  Printer,
  ExternalLink,
  Info,
  XCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Logo, { LogoIcon } from '../components/ui/Logo';
import { 
  inquireRentalAgreement, 
  initiatePayment, 
  getPaymentStatus, 
  normalizeReference 
} from '../services/paymentService';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';

const STEPS = [
  { id: 1, name: 'Inquiry' },
  { id: 2, name: 'Review' },
  { id: 3, name: 'Method' },
  { id: 4, name: 'Confirm' },
];

const STORAGE_KEY = 'smartrent_completed_payment';

export default function PayRentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPaymentId = searchParams.get('paymentId') || '';

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [referenceInput, setReferenceInput] = useState('');
  const [inquiryResult, setInquiryResult] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('TELEBIRR');
  const [paymentResult, setPaymentResult] = useState(null);

  // Status & Error state
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const pollingRef = useRef(null);

  // 1. On Mount: Only restore if there is a specific paymentId in URL or sessionStorage
  useEffect(() => {
    const checkExistingPayment = async () => {
      let activePaymentId = urlPaymentId;
      
      if (!activePaymentId) {
        try {
          const stored = sessionStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.paymentId) {
              activePaymentId = parsed.paymentId;
            }
          }
        } catch (e) {
          console.warn('Session parse error:', e);
        }
      }

      if (activePaymentId) {
        setIsLoading(true);
        try {
          const res = await getPaymentStatus(activePaymentId);
          if (res.success && res.data) {
            const data = res.data;
            setPaymentResult({
              ...data,
              customerName: data.agreement?.tenant?.user 
                ? `${data.agreement.tenant.user.firstName} ${data.agreement.tenant.user.lastName}` 
                : 'Verified Tenant',
              referenceNumber: data.agreement?.referenceNumber || '',
              initiatedAt: data.createdAt || new Date().toISOString()
            });
            setCurrentStep(5); // Show Receipt
          }
        } catch (err) {
          console.warn('Could not restore payment state:', err.message);
          // If payment lookup fails, clear stored reference and stay at Step 1
          sessionStorage.removeItem(STORAGE_KEY);
          setCurrentStep(1);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkExistingPayment();
  }, [urlPaymentId]);

  // 2. Real-Time Status Polling (Only while status is PENDING on step 5)
  useEffect(() => {
    const shouldPoll = currentStep === 5 && 
                       paymentResult && 
                       paymentResult.status === 'PENDING' && 
                       paymentResult.paymentId;

    if (!shouldPoll) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        setIsPolling(false);
      }
      return;
    }

    setIsPolling(true);
    const paymentId = paymentResult.paymentId;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await getPaymentStatus(paymentId);
        if (res.success && res.data) {
          const updated = res.data;
          
          if (updated.status !== 'PENDING') {
            console.log(`[SmartRent Poller] Webhook resolved status: ${updated.status}`);
            setPaymentResult(prev => {
              const merged = {
                ...prev,
                ...updated,
                paidDate: updated.paidDate || new Date().toISOString(),
                status: updated.status
              };
              try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });

            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setIsPolling(false);
          }
        }
      } catch (err) {
        console.warn('[SmartRent Poller] Polling error:', err.message);
      }
    }, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [currentStep, paymentResult?.status, paymentResult?.paymentId]);

  // Handle Manual Status Refresh
  const handleManualRefreshStatus = async () => {
    if (!paymentResult?.paymentId) return;
    setIsLoading(true);
    try {
      const res = await getPaymentStatus(paymentResult.paymentId);
      if (res.success && res.data) {
        const updated = res.data;
        setPaymentResult(prev => {
          const merged = {
            ...prev,
            ...updated,
            status: updated.status
          };
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (err) {
      setErrorMsg('Could not refresh status: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Inquiry API call (Strict Database Validation)
  const handleInquiry = async (e) => {
    if (e) e.preventDefault();

    const ref = normalizeReference(referenceInput);
    if (!ref) {
      setErrorMsg('Please enter a valid rental reference number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await inquireRentalAgreement(ref);
      if (response.success && response.data) {
        setInquiryResult(response.data);
        setCurrentStep(2); // Advance to Review step only on real DB match
      } else {
        setErrorMsg('Rental agreement reference not found in the official registry.');
      }
    } catch (err) {
      // Show exact database/business error and reject invalid reference
      setErrorMsg(err.message || 'Rental agreement reference not found. Please verify the code.');
      setInquiryResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Payment Initiation API call
  const handleConfirmPayment = async () => {
    if (!inquiryResult) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        referenceNumber: inquiryResult.referenceNumber,
        amount: inquiryResult.amount,
        paymentMethod: selectedMethod,
        customerName: inquiryResult.customerName,
        customerPhoneNumber: inquiryResult.customerPhoneNumber,
      };

      const response = await initiatePayment(payload);
      if (response.success && response.data) {
        const fullPaymentData = {
          ...response.data,
          customerName: inquiryResult.customerName,
          customerPhoneNumber: inquiryResult.customerPhoneNumber,
          description: inquiryResult.description,
          initiatedAt: new Date().toISOString()
        };

        setPaymentResult(fullPaymentData);
        
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fullPaymentData));
        } catch {}

        if (fullPaymentData.paymentId) {
          setSearchParams({ paymentId: fullPaymentData.paymentId });
        }

        setCurrentStep(5); // Advance to live receipt screen
      } else {
        setErrorMsg('Payment initiation could not be completed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Make Another Payment / Reset (Clears storage and returns to clean Step 1)
  const handleReset = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSearchParams({});
    setCurrentStep(1);
    setReferenceInput('');
    setInquiryResult(null);
    setSelectedMethod('TELEBIRR');
    setPaymentResult(null);
    setErrorMsg('');
    setIsPolling(false);
  };

  const handleCopyTx = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPaid = paymentResult?.status === 'PAID';
  const isFailed = paymentResult?.status === 'FAILED';
  const isPending = paymentResult?.status === 'PENDING' || (!isPaid && !isFailed);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 tracking-wide">
              MUNICIPAL DIGITAL PAYMENT RAIL
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Rental Settlement Portal
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Lookup registered tenancy lease reference and settle monthly payments securely with automated government record sync.
          </p>
        </div>

        {/* Wizard Step Progress Bar (Only during steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-300 -z-0"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((step) => {
                const isPassed = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 ${
                        isPassed
                          ? 'bg-brand-600 text-white'
                          : isCurrent
                          ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                          : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-1.5 ${
                        isCurrent || isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Alert Box (e.g. Wrong Reference Number Rejected) */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-left">
              <span className="font-bold block">Invalid Reference</span>
              <p className="text-xs text-red-700 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STEP 1: INQUIRY (ENTER REFERENCE NUMBER)
           ------------------------------------------------------------- */}
        {currentStep === 1 && (
          <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md">
            <form onSubmit={handleInquiry} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Rental Reference Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={referenceInput}
                    onChange={(e) => {
                      setReferenceInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. AGR-2026-X0MTKL6A"
                    className="w-full uppercase font-mono text-base px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Enter the registered lease reference code. The system will look up active records directly in PostgreSQL.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="xl"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Continue
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* -------------------------------------------------------------
            STEP 2: REVIEW AGREEMENT INFORMATION
           ------------------------------------------------------------- */}
        {currentStep === 2 && inquiryResult && (
          <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md text-left space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rental Agreement</span>
                <h3 className="text-xl font-extrabold text-slate-900 font-mono">
                  {inquiryResult.referenceNumber}
                </h3>
              </div>
              <Badge variant="success" size="lg" dot>
                Verified Lease
              </Badge>
            </div>

            {/* Main Rent Highlight */}
            <div className="bg-gradient-to-br from-brand-50 to-emerald-50/50 p-5 rounded-2xl border border-brand-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-900 uppercase tracking-wider">Amount Due</p>
                <p className="text-3xl font-extrabold text-brand-700 mt-0.5">
                  {formatCurrency(inquiryResult.amount, inquiryResult.currency || 'ETB')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Due Date</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5 justify-end mt-0.5">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  {formatDate(inquiryResult.dueDate)}
                </p>
              </div>
            </div>

            {/* Customer & Lease Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Tenant / Customer Name</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {inquiryResult.customerName || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 block">Phone Number</span>
                <span className="font-mono font-semibold text-slate-900 mt-0.5 block">
                  {inquiryResult.customerPhoneNumber || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                <span className="text-xs text-slate-500 block">Description / Property</span>
                <span className="text-slate-800 mt-0.5 block font-medium">
                  {inquiryResult.description || 'Monthly residential rental payment'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row items-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => {
                  setCurrentStep(1);
                  setInquiryResult(null);
                }}
              >
                Change Reference
              </Button>

              <Button
                variant="primary"
                size="xl"
                className="w-full sm:flex-1 font-bold"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => setCurrentStep(3)}
              >
                Proceed to Payment Channel
              </Button>
            </div>
          </Card>
        )}

        {/* -------------------------------------------------------------
            STEP 3: SELECT PAYMENT METHOD
           ------------------------------------------------------------- */}
        {currentStep === 3 && inquiryResult && (
          <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md text-left space-y-6 animate-fadeIn">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 3 of 4</span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Choose Payment Method
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your preferred Ethiopian digital payment gateway to settle this rent.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Option 1: Telebirr */}
              <div
                onClick={() => setSelectedMethod('TELEBIRR')}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === 'TELEBIRR'
                    ? 'border-[#0072CE] bg-blue-50/40 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0072CE] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    tb
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">Telebirr SuperApp / USSD</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fast mobile wallet payment via Telebirr API with instant SMS verification
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'TELEBIRR' ? 'border-[#0072CE] bg-[#0072CE]' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'TELEBIRR' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {/* Option 2: CBE Birr */}
              <div
                onClick={() => setSelectedMethod('CBE')}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === 'CBE'
                    ? 'border-[#6A1A5B] bg-purple-50/40 ring-2 ring-purple-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6A1A5B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    CBE
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">Commercial Bank of Ethiopia (CBE Birr)</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct account debit or CBE Birr mobile payment rail
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === 'CBE' ? 'border-[#6A1A5B] bg-[#6A1A5B]' : 'border-slate-300'
                }`}>
                  {selectedMethod === 'CBE' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row items-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="w-full sm:flex-1"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setCurrentStep(4)}
              >
                Continue to Confirmation
              </Button>
            </div>
          </Card>
        )}

        {/* -------------------------------------------------------------
            STEP 4: CONFIRM RENTAL PAYMENT
           ------------------------------------------------------------- */}
        {currentStep === 4 && inquiryResult && (
          <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-md text-left space-y-6 animate-fadeIn">
            <div className="pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Step 4 of 4</span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Confirm Rental Payment
              </h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Tenant:</span>
                <span className="font-bold text-slate-900">{inquiryResult.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Reference:</span>
                <span className="font-mono font-bold text-brand-700">{inquiryResult.referenceNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Payment Channel:</span>
                <div>
                  {selectedMethod === 'TELEBIRR' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0072CE] text-white text-xs font-bold shadow-xs">
                      telebirr <span className="w-1.5 h-1.5 rounded-full bg-[#F8B700]"></span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#6A1A5B] text-white text-xs font-bold shadow-xs">
                      CBE Birr <span className="text-[#E5A823]">★</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-700">Total Settlement:</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatCurrency(inquiryResult.amount, inquiryResult.currency || 'ETB')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row items-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(3)}
                disabled={isLoading}
              >
                Back
              </Button>

              <Button
                variant="primary"
                size="xl"
                className="w-full sm:flex-1 font-bold"
                isLoading={isLoading}
                onClick={handleConfirmPayment}
                rightIcon={<Check className="w-5 h-5" />}
              >
                Confirm Payment
              </Button>
            </div>
          </Card>
        )}

        {/* -------------------------------------------------------------
            STEP 5: RECEIPT SCREEN (PENDING, PAID, OR FAILED)
           ------------------------------------------------------------- */}
        {currentStep === 5 && paymentResult && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* ========================================================
                5A: PAYMENT CONFIRMED / PAID STATE (SUCCESS)
               ======================================================== */}
            {isPaid && (
              <Card className="p-6 sm:p-8 bg-white border border-emerald-200 shadow-xl text-left space-y-6">
                
                {/* Official Success Header */}
                <div className="text-center pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 tracking-wide mb-2">
                    <Check className="w-3.5 h-3.5" /> PAYMENT COMPLETED • RECORDED IN GOVERNMENT REGISTRY
                  </span>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Rental Settlement Successful
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    Your monthly lease payment has been confirmed by the provider and recorded in the municipal database.
                  </p>
                </div>

                {/* Printable Official Receipt Body */}
                <div id="printable-receipt" className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <Logo variant="horizontal" size="sm" showOfficialBadge={true} />
                    <button
                      type="button"
                      onClick={() => handleCopyTx(paymentResult.transactionReference || paymentResult.paymentId || '')}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 text-xs flex items-center gap-1 cursor-pointer"
                      title="Copy Transaction Reference"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Ref'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Transaction Reference</span>
                      <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">
                        {paymentResult.transactionReference || paymentResult.paymentId}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Rental Lease Agreement</span>
                      <span className="font-mono font-bold text-brand-700 text-sm mt-0.5 block">
                        {paymentResult.referenceNumber || (inquiryResult && inquiryResult.referenceNumber)}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Payer / Tenant</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        {paymentResult.customerName || (inquiryResult && inquiryResult.customerName) || 'Verified Tenant'}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium">Settlement Channel</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                        {(paymentResult.provider === 'TELEBIRR' || paymentResult.method === 'MOBILE_MONEY' || selectedMethod === 'TELEBIRR') ? 'Telebirr Mobile Money' : 'CBE Commercial Bank Rail'}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-100 sm:col-span-2">
                      <span className="text-slate-400 block font-medium">Paid Confirmation Timestamp</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {formatDateTime(paymentResult.paidDate || new Date().toISOString())}
                      </span>
                    </div>
                  </div>

                  {/* Total Paid Row */}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-700 text-sm block">Total Settled Amount</span>
                      <span className="text-[11px] text-emerald-600 font-medium">Status: Official Receipt Verified (PAID)</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {formatCurrency(paymentResult.amount || (inquiryResult && inquiryResult.amount) || 12000, paymentResult.currency || 'ETB')}
                    </span>
                  </div>
                </div>

                {/* Actions: Print and Make Another Payment */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-1/2"
                    onClick={() => window.print()}
                    leftIcon={<Printer className="w-4 h-4" />}
                  >
                    Print / Save Receipt
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-1/2 font-bold"
                    onClick={handleReset}
                    rightIcon={<RefreshCw className="w-4 h-4" />}
                  >
                    Make Another Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* ========================================================
                5B: PAYMENT PENDING CONFIRMATION STATE
               ======================================================== */}
            {isPending && (
              <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-xl text-left space-y-6">
                
                {/* Status Header */}
                <div className="text-center pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-50">
                    <Clock className="w-8 h-8 animate-pulse" />
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="pending" size="lg" dot>
                      PAYMENT INITIATED • PENDING CONFIRMATION
                    </Badge>
                    {isPolling && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Live Syncing...
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Rental Payment Initiated
                  </h2>

                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Your payment request has been registered in the SmartRent ET registry. Final settlement will be confirmed automatically once the provider rail webhook arrives.
                  </p>
                </div>

                {/* Transaction Receipt Card */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <Logo variant="horizontal" size="sm" showOfficialBadge={true} />
                    <button
                      type="button"
                      onClick={() => handleCopyTx(paymentResult.transactionReference || paymentResult.paymentId || '')}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 text-xs flex items-center gap-1 cursor-pointer"
                      title="Copy Transaction Reference"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <span className="text-xs text-slate-500 block">Transaction Reference</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {paymentResult.transactionReference || paymentResult.paymentId || 'TXN-PENDING-REF'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Rental Reference</span>
                      <span className="font-mono font-bold text-brand-700 mt-0.5 block">
                        {paymentResult.referenceNumber || (inquiryResult && inquiryResult.referenceNumber)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Payer / Tenant</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {paymentResult.customerName || (inquiryResult && inquiryResult.customerName)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Payment Channel</span>
                      <div className="mt-1">
                        {(paymentResult.provider === 'TELEBIRR' || paymentResult.method === 'MOBILE_MONEY' || selectedMethod === 'TELEBIRR') ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0072CE] text-white text-[11px] font-bold">
                            telebirr <span className="w-1 h-1 rounded-full bg-[#F8B700]"></span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#6A1A5B] text-white text-[11px] font-bold">
                            CBE Birr <span className="text-[#E5A823]">★</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Initiated Timestamp</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {formatDateTime(paymentResult.initiatedAt || new Date().toISOString())}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-bold text-slate-700 text-sm">Amount:</span>
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatCurrency(paymentResult.amount || (inquiryResult && inquiryResult.amount), paymentResult.currency || 'ETB')}
                    </span>
                  </div>
                </div>

                {/* Status Refresh Helper */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                  <span className="text-blue-900">
                    Auto-checking payment settlement every 3 seconds...
                  </span>
                  <button
                    type="button"
                    onClick={handleManualRefreshStatus}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 font-bold hover:bg-blue-50 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Now
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-1/2"
                    onClick={handleReset}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                  >
                    Pay Another Rent
                  </Button>

                  <Link to="/" className="w-full sm:w-1/2">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Return to Portal Home
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* ========================================================
                5C: PAYMENT FAILED STATE
               ======================================================== */}
            {isFailed && (
              <Card className="p-6 sm:p-8 bg-white border border-red-200 shadow-xl text-left space-y-6">
                <div className="text-center pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50">
                    <XCircle className="w-10 h-10" />
                  </div>
                  
                  <Badge variant="danger" size="lg" dot className="mb-2">
                    PAYMENT NOT COMPLETED • PROVIDER REPORTED FAILURE
                  </Badge>

                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Payment Failed or Declined
                  </h2>

                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    {paymentResult.notes || 'The external payment provider reported that this transaction could not be completed.'}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-1/2"
                    onClick={() => setCurrentStep(3)}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                  >
                    Try Another Payment Channel
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-1/2"
                    onClick={handleReset}
                  >
                    Start Over
                  </Button>
                </div>
              </Card>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
