
import React from 'react';
import { Loader2 } from 'lucide-react';

export const InputField = ({ label, type = "text", placeholder, value, onChange, mask, disabled, onBlur }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all ${disabled ? 'bg-slate-100 text-slate-500' : ''}`}
    />
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = "", isLoading = false, disabled }: any) => {
  const baseStyle = "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:pointer-events-none";
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-200",
    secondary: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700",
    outline: "border-2 border-brand-500 text-brand-600 hover:bg-brand-50",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} disabled={isLoading || disabled}>
      {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : children}
    </button>
  );
};

export const Badge = ({ children, variant = "default", className = "" }: any) => {
    const variants: any = {
        default: "bg-slate-100 text-slate-800",
        secondary: "bg-blue-100 text-blue-800",
        outline: "border border-slate-200 text-slate-800",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
};

export const Card = ({ children, className = "" }: any) => (
    <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ children, className = "" }: any) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = "" }: any) => (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
);

export const CardContent = ({ children, className = "" }: any) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);