import { createContext, useContext, useEffect, useState } from "react";
import { getRecurrentTransactions, type RecurrentTransaction } from "../api/RecurrentTransactionService";

const RecurrentTransactionsContext = createContext<any>(null);

export const RecurrentTransactionsProvider = ({ children }: any) => {
  const [recurrentTransactions, setRecurrentTransactions] = useState<RecurrentTransaction[]>([]);

  useEffect(() => {
    getRecurrentTransactions()
      .then(data => setRecurrentTransactions(data))
      .catch(err => console.error(err))
  }, []);

  const refetchRecurrentTransactions = async () => {
    getRecurrentTransactions()
      .then(data => setRecurrentTransactions(data))
      .catch(err => console.error(err))
  };

  return (
    <RecurrentTransactionsContext.Provider value={{ recurrentTransactions, setRecurrentTransactions, refetchRecurrentTransactions }}>
      {children}
    </RecurrentTransactionsContext.Provider>
  );
};

export const useRecurrentTransactions = () => {
  return useContext(RecurrentTransactionsContext);
};

export type RecurrentTransactionsContextType = {
  recurrentTransactions: RecurrentTransaction[];
  setRecurrentTransactions: React.Dispatch<React.SetStateAction<RecurrentTransaction[]>>,
  refetchRecurrentTransactions: () => Promise<void>
};
