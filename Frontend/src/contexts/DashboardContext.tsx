import { createContext, useContext, useEffect, useState} from "react";
import { TransactionsProvider } from "./TransactionContext";
import { CategoryProvider } from "./CategoryContext";
import { BillsProvider } from "./BillContext";
import { GoalProvider } from "./GoalContext";
import { DashboardLoader } from "./DashboardLoader";
import { RecurrentTransactionsProvider } from "./RecurrentTransactionContext";
const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({children}: any) => {

    return (
        <GoalProvider>
            <CategoryProvider>
                <TransactionsProvider>
                    <BillsProvider>
                        <RecurrentTransactionsProvider>
                            <DashboardLoader>
                                {children}
                            </DashboardLoader>
                        </RecurrentTransactionsProvider>
                    </BillsProvider>
                </TransactionsProvider>
            </CategoryProvider>
        </GoalProvider>
    )
}