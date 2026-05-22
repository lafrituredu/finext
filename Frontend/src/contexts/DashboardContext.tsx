import { createContext, useContext, useEffect, useState} from "react";
import { TransactionsProvider } from "./TransactionContext";
import { CategoryProvider } from "./CategoryContext";
import { BillsProvider } from "./BillContext";
import { GoalProvider } from "./GoalContext";
import { DashboardLoader } from "./DashboardLoader";
const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({children}: any) => {

    return (
        <GoalProvider>
            <CategoryProvider>
                <TransactionsProvider>
                    <BillsProvider>
                        <DashboardLoader>
                            {children}
                        </DashboardLoader>
                    </BillsProvider>
                </TransactionsProvider>
            </CategoryProvider>
        </GoalProvider>
    )
}