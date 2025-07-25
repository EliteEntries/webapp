
"use client";
import React, { useEffect, useState } from "react";
import Backdrop from "./Backdrop";

interface SidebarProps {
  children: React.ReactNode;
  styles?: string;
  width?: string; // e.g. 'w-64'
  show?: boolean; // for mobile slide-in
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ children, styles, width = "w-64", show = false, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return (
    <>
      {/* Backdrop for mobile */}
      <Backdrop show={!!show && isMobile} onClicked={onClose ?? (() => {})} />
      <aside
        className={`
          fixed top-0 left-0 h-screen z-[110] bg-background
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
