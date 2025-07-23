import React from "react";
import Main from "../ui/Main";
import Footer from "../ui/Footer";

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <>
      <Main>
        {children}
      </Main>
      <Footer />
    </>
  );
};

export default App;
