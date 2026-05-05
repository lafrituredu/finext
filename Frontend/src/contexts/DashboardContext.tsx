import { createContext, useContext, useEffect, useState} from "react";
import { TransactionsProvider } from "./TransactionContext";
import { CategoryProvider } from "./CategoryContext";
const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({children}: any) => {

    return (
        <CategoryProvider>
            <TransactionsProvider>
                {children}
            </TransactionsProvider>
        </CategoryProvider>
    )
}