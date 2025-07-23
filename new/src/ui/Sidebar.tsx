
import React from "react";
import Backdrop from "./Backdrop";

interface SidebarProps {
  children: React.ReactNode;
  styles?: string;
  width?: string; // e.g. 'w-64'
  show?: boolean; // for mobile slide-in
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ children, styles, width = "w-64", show = false, onClose }) => {
  // Mobile: slide in/out
  // lg+: always visible
  return (
    <>
      {/* Backdrop for mobile */}
      <Backdrop show={!!show && window.innerWidth < 1024} onClicked={onClose ?? (() => {})} />
      <aside
        className={`
          fixed top-0 left-0 h-screen z-[110] bg-background border-r border-border
          ${width}
          transition-transform duration-300
          ${styles ?? ""}
          lg:flex
          lg:translate-x-0
          ${show ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          lg:flex
          flex
        `}
      >
        {children}
      </aside>
    </>
  );
};

export default Sidebar;
