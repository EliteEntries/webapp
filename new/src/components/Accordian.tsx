'use client';

import React from "react";
import Button from "./Button";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClick: () => void;
  styles?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, open, onClick, styles }) => {
  return (
    <div className={`rounded-xl border border-border bg-background shadow-sm ${styles ?? ""}`}>
      <Button
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-foreground focus:outline-none"
        onClick={onClick}
        aria-expanded={open}
        popOnHover= {false}
      >
        <span>{title}</span>
        <span className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}> 
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </span>
      </Button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 py-4 px-4" : "max-h-0 py-0 px-4"}`}
        aria-hidden={!open}
      >
        {open && children}
      </div>
    </div>
  );
};

export default Accordion;
