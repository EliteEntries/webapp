import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";

interface DropdownProps {
  button: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}

const Dropdown: React.FC<DropdownProps> = ({ button, children, align = "right" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <Button
        className="focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {button}
      </Button>
      {open && (
        <div
          className={`absolute z-20 mt-2 min-w-[160px] bg-popover border border-border rounded-lg shadow-lg py-2 ${align === "right" ? "right-0" : "left-0"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
