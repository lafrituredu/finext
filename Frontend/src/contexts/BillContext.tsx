import { createContext, useContext, useEffect, useState } from "react";
import { getBills, type Bill } from "../api/BillService"; 
const BillsContext = createContext<any>(null);

export const BillsProvider = ({ children }: any) => {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    getBills()
        .then(data => setBills(data))
        .catch(err => console.error(err))
  }, []);

  const refetchBills = async () => {
    getBills()
        .then(data => setBills(data))
        .catch(err => console.error(err))
};

  return (
    <BillsContext.Provider value={{ bills, setBills, refetchBills }}>
      {children}
    </BillsContext.Provider>
  );
};

export const useBills = () => {
  return useContext(BillsContext);
};


export type BillsContextType = {
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>,
  refetchBills: () => Promise<void>
};