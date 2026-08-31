import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2,
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  FileCheck, 
  Landmark, 
  Users, 
  CheckCircle2, 
  Search, 
  Lock, 
  Receipt, 
  History, 
  TrendingUp, 
  Sparkles,
  Smartphone,
  Check
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { LogoIcon } from '../components/ui/Logo';

export default function HomePage() {
  const [quickRef, setQuickRef] = useState('');
  const navigate = useNavigate();

  const handleQuickInquiry = (e) => {
    e.preventDefault();
    if (quickRef.trim()) {
      navigate(`/pay?ref=${encodeURIComponent(quickRef.trim())}`);
    } else {
      navigate('/pay');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* -------------------------------------------------------------
          1. HERO SECTION
         ------------------------------------------------------------- */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50">
        {/* Subtle decorative background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-200/40 via-emerald-100/30 to-amber-100/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2">
                <Badge variant="primary" size="lg" dot>
                  Federal & Municipal Rental Portal
                </Badge>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
                  Ethiopian Digital Governance
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.12] tracking-tight">
                Pay Your Rent. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700">
                  Track Your Agreement.
                </span> <br />
                Stay Compliant.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                SmartRent ET connects registered rental agreements with secure digital payments, making monthly rental settlement effortless for tenants while establishing transparent records for landlords and government housing authorities.
              </p>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link to="/pay">
                  <Button
                    variant="primary"
                    size="xl"
                    className="w-full sm:w-auto shadow-lg shadow-brand-600/20"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Pay Rent
                  </Button>
                </Link>

                <a href="#how-it-works">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                    Learn How It Works
                  </Button>
                </a>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Gov-Verified</p>
                    <p className="text-[11px] text-slate-500">Official Lease IDs</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Telebirr & CBE</p>
                    <p className="text-[11px] text-slate-500">Provider Ready</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Instant Receipts</p>
                    <p className="text-[11px] text-slate-500">Audit-Proof Records</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quick Inquiry Card */}
            <div className="lg:col-span-5">
              <Card glass className="p-6 sm:p-8 shadow-xl border-emerald-100/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -z-10" />
                
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <LogoIcon className="w-8 h-8" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Rental Reference Inquiry</h3>
                      <p className="text-xs text-slate-500">Enter your official lease code</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">Live Inquiry</Badge>
                </div>

                <form onSubmit={handleQuickInquiry} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-left">
                      Rental Agreement Reference Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={quickRef}
                        onChange={(e) => setQuickRef(e.target.value)}
                        placeholder="e.g. AGR-2026-X0MTKL6A"
                        className="w-full uppercase font-mono text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 text-left">
                      Try demo: <button type="button" onClick={() => setQuickRef('AGR-2026-X0MTKL6A')} className="text-brand-600 font-semibold underline underline-offset-2">AGR-2026-X0MTKL6A</button>
                    </p>
                  </div>

                  {/* Sample Mock Preview Breakdown */}
                  <div className="bg-slate-50 rounded-xl p-3.5 text-left border border-slate-100 text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Supported Rail:</span>
                      <span className="font-medium text-slate-700">Telebirr & CBE Payment APIs</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Verification Mode:</span>
                      <span className="font-medium text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> SmartRent Core API
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Look Up Agreement & Pay
                  </Button>
                </form>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          2. TRUST / VALUE ECOSYSTEM SECTION
         ------------------------------------------------------------- */}
      <section id="ecosystem" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="primary" size="md">Integrated Ecosystem</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
              Bridging Ethiopia's Rental Market Stakeholders
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              SmartRent ET creates an interconnected digital bridge across all key parties involved in property leasing and municipal tenancy records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Stakeholder 1: Tenants */}
            <Card hoverable className="p-5 text-center flex flex-col items-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Tenants</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Effortless payment via reference number with verified rent calculations and official receipts.
              </p>
            </Card>

            {/* Stakeholder 2: Landlords */}
            <Card hoverable className="p-5 text-center flex flex-col items-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Landlords</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct lease monitoring, automated payment records, and dispute-free settlement history.
              </p>
            </Card>

            {/* Stakeholder 3: Agreements */}
            <Card hoverable className="p-5 text-center flex flex-col items-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Agreements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digitally bound lease terms, verified tenant identification, and tracked due dates.
              </p>
            </Card>

            {/* Stakeholder 4: Digital Payments */}
            <Card hoverable className="p-5 text-center flex flex-col items-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Digital Payments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated Telebirr & CBE provider abstraction for smooth, secure digital payment flows.
              </p>
            </Card>

            {/* Stakeholder 5: Government Monitoring */}
            <Card hoverable className="p-5 text-center flex flex-col items-center bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">Government</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent municipal monitoring, standardized compliance, and digital tax audit trail.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. HOW IT WORKS
         ------------------------------------------------------------- */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" size="md">Simple 3-Step Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              How SmartRent ET Works
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Paying your rent through SmartRent is fast, verified, and transparent. Follow three intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <Card hoverable className="p-8 relative flex flex-col items-start text-left bg-white">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Enter Reference Number
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Provide your unique SmartRent rental agreement reference number issued during lease registration (e.g. <span className="font-mono text-brand-700 font-medium">AGR-2026-X0MTKL6A</span>).
              </p>
            </Card>

            {/* Step 2 */}
            <Card hoverable className="p-8 relative flex flex-col items-start text-left bg-white">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-sm">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Review Payment & Agreement
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                SmartRent instantly queries the rental registry and displays your tenant name, verified rent amount, due date, and property description.
              </p>
            </Card>

            {/* Step 3 */}
            <Card hoverable className="p-8 relative flex flex-col items-start text-left bg-white">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center mb-6 shadow-sm">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Confirm & Pay
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose your preferred payment method (Telebirr or CBE), confirm the details, and receive an instant transaction reference and pending confirmation.
              </p>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link to="/pay">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Try Rental Payment Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. FEATURES SECTION
         ------------------------------------------------------------- */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" size="md">Core Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Engineered for Trust & Compliance
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Comprehensive tools designed to standardize residential and commercial rental management across Ethiopia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card hoverable className="p-7 text-left bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Rent Payments</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Eliminate cash handling and manual deposit slips. Settle rent conveniently through digital mobile money and banking channels.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hoverable className="p-7 text-left bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Rental Agreement Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track active lease validity, monthly rental schedules, and agreement identifiers linked directly to your national records.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hoverable className="p-7 text-left bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Transparent Payment Records</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every payment generates an immutable digital transaction log, protecting tenants and landlords against discrepancies.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hoverable className="p-7 text-left bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Government Compliance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fully aligned with Ethiopian municipal tenancy regulations and municipal revenue monitoring guidelines.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card hoverable className="p-7 text-left bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Transactions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Protected by JWT authentication and cryptographically signed provider webhooks for fail-safe reconciliation.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card hoverable className="p-7 text-left bg-slate-50/50">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Payment History & Audits</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instant access to verifiable lease history for lease renewals, banking credit scoring, and tax declarations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          5. TENANT SECTION
         ------------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-br from-brand-900 via-slate-900 to-navy-950 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <Badge variant="primary" size="lg" className="bg-brand-500/20 text-brand-300 border-brand-500/30">
                Built for Ethiopian Tenants
              </Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Hassle-Free Rent Settlement in Under 60 Seconds
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Pay your rent using your rental reference number and easily verify the amount before confirming. No trips to bank branches, no paper receipts to lose, and no ambiguity over due dates.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">Real-time agreement lookups verify the exact amount due</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">Designed for future integration into Telebirr & CBE apps</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-200">Official digital confirmation valid for legal tenancy protection</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/pay">
                  <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Pay Your Rent
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-2xl backdrop-blur-md text-left space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sample Tenant Receipt</span>
                  <span className="text-xs font-mono text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-800">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Tenant Name:</span>
                    <span className="font-semibold text-slate-100">betselot Wodere</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Reference ID:</span>
                    <span className="font-mono text-brand-300">AGR-2026-X0MTKL6A</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Monthly Amount:</span>
                    <span className="font-bold text-white text-base">12,000.00 ETB</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Channel:</span>
                    <span className="text-slate-200 font-medium">Telebirr / CBE Ready</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700 text-[11px] text-slate-400 text-center">
                  Official SmartRent ET Transaction Verification
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          6. LANDLORD & GOVERNMENT VALUE
         ------------------------------------------------------------- */}
      <section id="impact" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Landlord Value */}
            <Card hoverable className="p-8 text-left bg-white border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Landlords & Property Owners</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                SmartRent creates a reliable digital record of rental payments and agreements. Landlords benefit from timely rental collection, authenticated tenant identifiers, and reduced disputes.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Automated payment tracking tied to registered lease contracts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Direct reconciliation with digital banking payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Clear audit records for annual tax reporting</span>
                </li>
              </ul>
            </Card>

            {/* Government Value */}
            <Card hoverable className="p-8 text-left bg-white border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">For Government & Housing Bureaus</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Enables municipal housing offices and tax authorities to monitor lease compliance, maintain authenticated registry records, and streamline municipal housing oversight.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Standardized digital verification for rental agreements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Enhanced transparency in urban rental markets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Structured data for municipal urban planning</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          7. ABOUT SMARTRENT
         ------------------------------------------------------------- */}
      <section id="about" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="primary" size="md">About SmartRent ET</Badge>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Advancing Ethiopia's Rental Infrastructure
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            SmartRent ET was created to modernize how tenancy agreements are managed and settled across Ethiopia. By combining digital lease registries with mobile financial services such as Telebirr and CBE, we bring simplicity to tenants, accountability to landlords, and standardized compliance to government administrators.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-100">National ID & Lease Ready</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-100">Prisma & PostgreSQL Core Backend</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-100">Ethiopian Fintech Standards</span>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          8. FINAL CALL TO ACTION
         ------------------------------------------------------------- */}
      <section className="py-20 bg-brand-700 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to make rental payments simpler?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-xl mx-auto">
            Experience the simulated rental payment flow today using your rental agreement reference number.
          </p>
          <div className="pt-4">
            <Link to="/pay">
              <Button
                variant="secondary"
                size="xl"
                className="text-brand-800 font-bold hover:bg-white shadow-xl"
                rightIcon={<ArrowRight className="w-5 h-5 text-brand-700" />}
              >
                Pay Rent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
