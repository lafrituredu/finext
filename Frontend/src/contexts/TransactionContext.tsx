import { createContext, useContext, useEffect, useState } from "react";
import { getTransactions, type Transaction } from "../api/TransactionService"; 

export type TransactionContextType = {
  transactions: Transaction[];
  loading: boolean;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  refetchTransactions: () => Promise<void>;
};

const TransactionsContext = createContext<TransactionContextType | null>(null);
export const TransactionsProvider = ({ children }: any) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    getTransactions()
        .then(data => setTransactions(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
  }, []);

  const refetchTransactions = async () => {
    setLoading(false)
    getTransactions()
        .then(data => setTransactions(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
};

  return (
    <TransactionsContext.Provider value={{ transactions, loading, setTransactions, refetchTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionsContext)

  if (!context) {
    throw new Error("useTransactions must be used inside TransactionsProvider")
  }

  return context
}