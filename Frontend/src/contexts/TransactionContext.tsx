import { createContext, useContext, useEffect, useState } from "react";
import { getTransactions, type Transaction } from "../api/TransactionService"; 
const TransactionsContext = createContext<any>(null);

export const TransactionsProvider = ({ children }: any) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions()
        .then(data => setTransactions(data))
        .catch(err => console.error(err))
  }, []);

  const refetchTransactions = async () => {
    getTransactions()
        .then(data => setTransactions(data))
        .catch(err => console.error(err))
};

  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions, refetchTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  return useContext(TransactionsContext);
};


export type TransactionsContextType = {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  refetchTransactions: () => Promise<void>
};