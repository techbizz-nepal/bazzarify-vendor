"use client";

import { createContext, ReactNode, useState } from "react";

type TSessionContextValue = {
  session: boolean;
  toggleSession: () => void;
};
const SessionContext = createContext<TSessionContextValue | null>(null);

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState(false);
  const toggleSession = () => {
    setSession((prevState) => !prevState);
  };

  return (
    <SessionContext.Provider value={{ session, toggleSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
