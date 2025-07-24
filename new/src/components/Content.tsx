"use client";
import React from "react";
import Main from "../ui/Main";
import Footer from "../ui/Footer";

interface AppProps {
  children: React.ReactNode;
  user: unknown;
}

const App: React.FC<AppProps> = ({ children, user }) => {
  return (
    <>
      <Main shift={!!user}>
        {children}
      </Main>
      <Footer shift={!!user} />
    </>
  );
};

export default App;
