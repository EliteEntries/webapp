import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  popOnHover?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className = "", onClick, popOnHover = true }) => {
  const popClass = popOnHover ? "transition-transform duration-150 hover:scale-105 active:scale-95" : "";
  return (
    <div
      className={`cursor-pointer select-none ${popClass} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
};

export default Button;
