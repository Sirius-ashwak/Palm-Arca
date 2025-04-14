import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  gradient?: boolean;
  glowEffect?: boolean;
  hoverEffect?: boolean;
  delay?: number;
}

export function ModernCard({
  children,
  className,
  icon,
  title,
  subtitle,
  gradient = false,
  glowEffect = false,
  hoverEffect = true,
  delay = 0,
}: ModernCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md",
        gradient ? "bg-gradient-to-br from-blue-900/40 to-purple-900/40" : "bg-white/5",
        glowEffect ? "shadow-lg shadow-blue-500/20" : "",
        hoverEffect ? "transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1" : "",
        className
      )}
    >
      {/* Optional header with icon and title */}
      {(icon || title) && (
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/80 to-purple-600/80 flex items-center justify-center shadow-md">
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="font-medium text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
          </div>
        </div>
      )}
      
      {/* Card content */}
      <div className={!icon && !title ? "p-5" : "p-5 pt-4"}>
        {children}
      </div>
      
      {/* Decorative gradient corner */}
      {gradient && (
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl rounded-full"></div>
      )}
    </motion.div>
  );
}

export function ModernCardGrid({ 
  children, 
  className 
}: { 
  children: ReactNode, 
  className?: string 
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {children}
    </div>
  );
}