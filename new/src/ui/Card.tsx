import React from "react";

interface CardProps {
  children: React.ReactNode;
  styles?: string;
}

const Card: React.FC<CardProps> = ({ children, styles }) => {
  return (
    <div
      className={`rounded-xl bg-background border border-border shadow-md p-6 ${styles ?? ""}`}
    >
      {children}
    </div>
  );
};

export default Card;
