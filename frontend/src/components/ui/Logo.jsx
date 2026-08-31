import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SmartRent ET Official Logo Icon SVG
 */
export function LogoIcon({ className = "w-10 h-10", isDark = false }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="SmartRent ET Logo"
    >
      {/* Chimney */}
      <rect
        x="124"
        y="22"
        width="22"
        height="42"
        rx="3.5"
        fill={isDark ? "#38BDF8" : "#0F2942"}
      />

      {/* House Base (Emerald Green Body) */}
      <path
        d="M 100 48 L 46 88 V 162 C 46 168.6 51.4 174 58 174 H 142 C 148.6 174 154 168.6 154 162 V 88 Z"
        fill="#00B67A"
      />

      {/* Navy / Dark Roof */}
      <path
        d="M 94.2 24.8 C 97.6 22.4 102.4 22.4 105.8 24.8 L 175.2 73.8 C 179.8 77 180.2 83.6 176 87.2 L 173.5 89.3 C 169.6 92.6 163.8 92.1 160.5 88.2 L 100 44.5 L 39.5 88.2 C 36.2 92.1 30.4 92.6 26.5 89.3 L 24 87.2 C 19.8 83.6 20.2 77 24.8 73.8 Z"
        fill={isDark ? "#F8FAFC" : "#0F2942"}
      />

      {/* Security Shield Outline */}
      <path
        d="M 100 97 C 107.5 94.5 120.5 93.8 124.5 99.5 C 125.8 102 126 112 125 123.5 C 123.2 136.5 112.5 147.5 100 153.5 C 87.5 147.5 76.8 136.5 75 123.5 C 74 112 74.2 102 75.5 99.5 C 79.5 93.8 92.5 94.5 100 97 Z"
        fill="#00B67A"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Verified Checkmark */}
      <path
        d="M 89.5 124 L 97 131.5 L 112 116.5"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * SmartRent ET Brand Logo Component
 * 
 * @param {Object} props
 * @param {'horizontal' | 'stacked' | 'icon'} [props.variant='horizontal']
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {'light' | 'dark'} [props.theme='light']
 * @param {boolean} [props.showTagline=true]
 * @param {boolean} [props.showOfficialBadge=false]
 * @param {string} [props.linkTo]
 * @param {string} [props.className]
 */
export default function Logo({
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  showTagline = true,
  showOfficialBadge = false,
  linkTo,
  className = '',
}) {
  const isDark = theme === 'dark';

  // Sizing mappings
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.14em]',
    md: 'text-xl tracking-[0.16em]',
    lg: 'text-2xl tracking-[0.18em]',
    xl: 'text-3xl sm:text-4xl tracking-[0.2em]',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.2em]',
    md: 'text-[11px] tracking-[0.22em]',
    lg: 'text-xs tracking-[0.24em]',
    xl: 'text-sm tracking-[0.28em]',
  };

  const content = () => {
    // 1. ICON ONLY
    if (variant === 'icon') {
      return <LogoIcon className={iconSizes[size] || size} isDark={isDark} />;
    }

    // 2. STACKED LOGO (Exact replica of brand design sheet)
    if (variant === 'stacked') {
      return (
        <div className={`flex flex-col items-center text-center ${className}`}>
          <div className="transition-transform duration-300 hover:scale-105">
            <LogoIcon className={iconSizes[size] || 'w-24 h-24'} isDark={isDark} />
          </div>

          <div className="mt-4">
            <h1
              className={`font-black uppercase font-sans ${titleSizes[size] || titleSizes.lg} ${
                isDark ? 'text-white' : 'text-[#0F2942]'
              }`}
            >
              SMARTRENT ET
            </h1>

            {/* Emerald Green Accent Line */}
            <div className="w-full h-0.5 sm:h-[3px] bg-[#00B67A] rounded-full my-2.5 max-w-xs mx-auto" />

            {showTagline && (
              <div
                className={`font-semibold uppercase ${subtitleSizes[size] || subtitleSizes.md} ${
                  isDark ? 'text-slate-300' : 'text-[#0F2942]'
                } leading-relaxed`}
              >
                <div>GOVERNMENT-INTEGRATED</div>
                <div>RENTAL PAYMENTS</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 3. HORIZONTAL LOGO (For Navbar, Header, Footer)
    return (
      <div className={`flex items-center gap-3 group ${className}`}>
        <div className="transition-transform duration-300 group-hover:scale-105 shrink-0">
          <LogoIcon className={iconSizes[size] || 'w-10 h-10'} isDark={isDark} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-black uppercase font-sans ${titleSizes[size] || 'text-lg tracking-[0.12em]'} ${
                isDark ? 'text-white' : 'text-[#0F2942]'
              }`}
            >
              SMARTRENT <span className="text-[#00B67A]">ET</span>
            </span>

            {showOfficialBadge && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wide">
                OFFICIAL
              </span>
            )}
          </div>

          {showTagline && (
            <span
              className={`font-medium ${subtitleSizes[size] || 'text-[10px] tracking-[0.15em]'} uppercase whitespace-nowrap ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              } hidden sm:inline-block`}
            >
              Government-Integrated Rental Payments
            </span>
          )}
        </div>
      </div>
    );
  };

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block focus:outline-none">
        {content()}
      </Link>
    );
  }

  return content();
}
