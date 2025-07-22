import { createContext, useContext, useState } from "react";

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
