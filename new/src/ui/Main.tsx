import React from "react";

interface MainProps {
  children: React.ReactNode;
  styles?: string;
}

const Main: React.FC<MainProps> = ({ children, styles }) => {
  // Footer height is h-24 (6rem)
  return (
    <main
      className={`fixed top-12 right-0 left-0 lg:left-64 bg-background overflow-x-hidden pb-24 ${styles ?? ""} h-full`}
    >
      {children}
    </main>
  );
};

export default Main;
