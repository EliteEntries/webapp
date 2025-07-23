"use client";
import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";

import Navbar from "../ui/Navbar";
import Sidebar from "../ui/Sidebar";
import Dropdown from "./Dropdown";
import Button from "./Button";

interface NavProps {
  children?: React.ReactNode;
}

const menu = [
  { label: "Home", href: "/" },
  { label: "Connections", href: "/connections" },
  { label: "Settings", href: "/settings" },
  { label: "About", href: "/about" },
];

const Nav: React.FC<NavProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handler to close sidebar from Sidebar or Backdrop
  const handleCloseSidebar = () => setSidebarOpen(false);

  // Google sign-in handler
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      // Optionally handle error
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar show={sidebarOpen} onClose={handleCloseSidebar}>
        <div className="flex flex-col h-full w-full">
          <div className="flex-1 flex flex-col gap-2 pt-6 px-4">
            {menu.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition font-medium py-2 px-3 rounded-lg"
                onClick={handleCloseSidebar}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="p-4">
            <Button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition" onClick={handleGoogleLogin}>
              Log In
            </Button>
          </div>
        </div>
      </Sidebar>

      {/* Navbar */}
      <Navbar styles="">
        {/* Hamburger (mobile only) */}
        <button
          className="lg:hidden mr-2 p-2 rounded-md hover:bg-accent focus:outline-none"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        {/* Spacer for left */}
        <div className="flex-1" />
        {/* User icon (right) */}
        <div className="ml-auto">
          <Dropdown
            button={
              <span className="p-2 rounded-full hover:bg-accent focus:outline-none block">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.2 3.6-4 6-4s6 1.8 6 4"/></svg>
              </span>
            }
            align="right"
          >
            <Button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition text-sm" onClick={handleGoogleLogin}>
              Log In
            </Button>
          </Dropdown>
        </div>
      </Navbar>
    </>
  );
};

export default Nav;
