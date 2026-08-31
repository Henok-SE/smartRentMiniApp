import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="horizontal" size="md" theme="dark" showTagline={true} linkTo="/" />

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Ethiopia’s integrated digital rental payment and compliance infrastructure. Connecting tenants, landlords, and municipal authorities with secure, transparent digital transactions.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-emerald-400 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Telebirr & CBE Payment Rail Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">System Portal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/pay" className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  Pay Rent
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#features" className="hover:text-white transition-colors">Key Features</a>
              </li>
              <li>
                <a href="/#impact" className="hover:text-white transition-colors">Stakeholder Benefits</a>
              </li>
            </ul>
          </div>

          {/* Stakeholders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Ecosystem</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="hover:text-white transition-colors">Tenants & Lessees</li>
              <li className="hover:text-white transition-colors">Property Owners & Landlords</li>
              <li className="hover:text-white transition-colors">Subcity Housing Bureaus</li>
              <li className="hover:text-white transition-colors">Municipal Tax Authorities</li>
            </ul>
          </div>

          {/* Official Contact Info Placeholder */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Contact & Support</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@smartrent.gov.et</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+251 11 000 0000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SmartRent ET. All rights reserved. Government-Integrated Rental Payment & Management.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Compliance Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
