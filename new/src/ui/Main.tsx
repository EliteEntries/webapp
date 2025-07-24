import React from "react";


interface MainProps {
  children: React.ReactNode;
  styles?: string;
  shift?: boolean;
}

const Main: React.FC<MainProps> = ({ children, styles, shift = false }) => {
  // Footer height is h-24 (6rem)
  const shiftClass = shift ? "ml-64" : "";
  return (
    <main
      className={`w-full bg-background overflow-x-hidden pb-24 ${shiftClass} ${styles ?? ""} min-h-screen`}
    >
      {children}
    </main>
  );
};

export default Main;
