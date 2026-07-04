/**
 * Micro-Interactions Utilities
 * Provides delightful feedback for user actions
 */

import React from "react";

export interface MicroInteractionProps {
  children: React.ReactNode;
  className?: string;
}

// ─── Scale Pulse on Click ──────────────────────────────────

export const ScalePulse: React.FC<MicroInteractionProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
        transition-transform duration-200
        hover:scale-105 active:scale-95
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ─── Fade In Animation ────────────────────────────────────

export interface FadeInProps extends MicroInteractionProps {
  delay?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ─── Slide In Animation ────────────────────────────────────

export interface SlideInProps extends MicroInteractionProps {
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) => {
  const directionClass = {
    up: "animate-slide-in",
    down: "-translate-y-2 animate-slide-in",
    left: "translate-x-2 animate-slide-in",
    right: "-translate-x-2 animate-slide-in",
  }[direction];

  return (
    <div
      className={`${directionClass} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ─── Success Checkmark Animation ──────────────────────────

export const SuccessCheckmark: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-scale-in"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ─── Error Shake Animation ─────────────────────────────────

export interface ShakeProps extends MicroInteractionProps {
  trigger?: boolean;
}

export const Shake: React.FC<ShakeProps> = ({
  children,
  className = "",
  trigger = false,
}) => {
  return (
    <div
      className={`
        ${trigger ? "animate-bounce" : ""}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ─── Bounce In Animation ───────────────────────────────────

export interface BounceInProps extends MicroInteractionProps {
  delay?: number;
}

export const BounceIn: React.FC<BounceInProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <div
      className={`animate-bounce-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ─── Hover Lift Effect ────────────────────────────────────

export interface HoverLiftProps extends MicroInteractionProps {
  amount?: "sm" | "md" | "lg";
}

export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  className = "",
  amount = "md",
}) => {
  const shadowMap = {
    sm: "hover:shadow-md hover:-translate-y-1",
    md: "hover:shadow-lg hover:-translate-y-2",
    lg: "hover:shadow-xl hover:-translate-y-4",
  };

  return (
    <div
      className={`
        transition-all duration-200 ease-out
        ${shadowMap[amount]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ─── Ripple Effect (Click Feedback) ───────────────────────

export interface RippleProps {
  children: React.ReactNode;
  className?: string;
  rippleColor?: string;
}

export const Ripple: React.FC<RippleProps> = ({
  children,
  className = "",
  rippleColor = "rgba(255, 255, 255, 0.5)",
}) => {
  const [ripples, setRipples] = React.useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "20px",
            height: "20px",
            backgroundColor: rippleColor,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.6s ease-out",
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// ─── Stagger Animation (for lists) ──────────────────────

export interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 50,
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </>
  );
};
