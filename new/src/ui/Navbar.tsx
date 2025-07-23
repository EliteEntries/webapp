import React from "react";

interface NavbarProps {
  children: React.ReactNode;
  styles?: string;
  fixed?: boolean;
  bottom?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ children, styles, fixed = true, bottom = false }) => {
  const positionClass = fixed
    ? bottom
      ? "fixed bottom-0 left-0"
      : "fixed top-0 left-0"
    : "relative";

  return (
    <nav
      className={`z-50 h-12 px-4 flex items-center border-b border-border bg-background/80 backdrop-blur-md lg:ml-64 ${positionClass} ${styles ?? ""} right-0`}
    >
      {children}
    </nav>
  );
};

export default Navbar;
