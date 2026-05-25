import { createContext, useContext, useEffect, useState } from "react";
import { getGoals, type Goal } from "../api/GoalService"; 


export type GoalsContextType = {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>,
  refetchGoals: () => Promise<void>
};

const GoalsContext = createContext<GoalsContextType | any>(null);

export const GoalProvider = ({children} : any) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    useEffect(() => {
        getGoals()
            .then(data => setGoals(data))
            .catch(err => console.error(err))
    }, []);

    const refetchGoals = async () => {
        getGoals()
            .then(data => setGoals(data))
            .catch(err => console.error(err))
    }

    return (
        <GoalsContext.Provider value={{goals,setGoals,refetchGoals}}>
            {children}
        </GoalsContext.Provider>
    )
}

export const useGoals = () => {
  return useContext(GoalsContext);
};