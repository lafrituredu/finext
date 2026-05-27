import { createContext, useContext, useEffect, useState } from "react";
import { getRecurrentTransactions, type RecurrentTransaction } from "../api/RecurrentTransactionService";

export type RecurrentTransactionsContextType = {
  // Shared recurrent transactions state used by different components.
  recurrentTransactions: RecurrentTransaction[];
  setRecurrentTransactions: React.Dispatch<React.SetStateAction<RecurrentTransaction[]>>,
  refetchRecurrentTransactions: () => Promise<void>
};


const RecurrentTransactionsContext = createContext<RecurrentTransactionsContextType | null>(null);

export const RecurrentTransactionsProvider = ({ children }: any) => {
  // Store recurrent transactions in one place for the whole app area.
  const [recurrentTransactions, setRecurrentTransactions] = useState<RecurrentTransaction[]>([]);

  useEffect(() => {
    // Load recurrent transactions when the provider starts.
    getRecurrentTransactions()
      .then(data => setRecurrentTransactions(data))
      .catch(err => console.error(err))
  }, []);

  const refetchRecurrentTransactions = async () => {
    // Reload recurrent transactions after create, update, delete, or generate.
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
  // Small helper to read the recurrent transactions context.
  return useContext(RecurrentTransactionsContext);
};
