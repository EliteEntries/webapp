import React from "react";
import Main from "../ui/Main";
import Footer from "../ui/Footer";
import { getServerAuthUser } from "@/utils/serverAuth";

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = async ({ children }) => {
  const user = await getServerAuthUser();
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
