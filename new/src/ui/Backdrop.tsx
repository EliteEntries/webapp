
"use client";
import React from "react";

interface BackdropProps {
  show: boolean;
  onClicked: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ show, onClicked }) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClicked}
      aria-label="Close sidebar"
    />
  );
};

export default Backdrop;
