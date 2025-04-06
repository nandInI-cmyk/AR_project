
import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'dark' | 'spotlight';
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  className, 
  children,
  fullWidth = false,
  variant = 'default'
}) => {
  const variantClasses = {
    default: "bg-gray-900 text-white",
    primary: "bg-gradient-to-r from-orange-600 to-orange-500 text-white",
    secondary: "bg-gray-800 text-white",
    dark: "bg-black text-white",
    spotlight: "bg-gray-900 text-white relative overflow-hidden"
  };

  return (
    <section 
      id={id} 
      className={cn(
        "py-16 md:py-24",
        variantClasses[variant],
        className
      )}
    >
      {variant === 'spotlight' && (
        <div className="absolute inset-0 hero-gradient z-10" aria-hidden="true" />
      )}
      <div className={cn(
        fullWidth ? "w-full" : "max-w-7xl mx-auto px-6 md:px-10",
        variant === 'spotlight' ? "relative z-20" : ""
      )}>
        {children}
      </div>
    </section>
  );
};

export default Section;
