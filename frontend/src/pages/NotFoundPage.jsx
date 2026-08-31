import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import { LogoIcon } from '../components/ui/Logo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mx-auto">
          <LogoIcon className="w-20 h-20" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested SmartRent ET page or resource could not be found.
        </p>
        <div className="pt-2 flex justify-center">
          <Link to="/">
            <Button variant="primary" size="lg" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
