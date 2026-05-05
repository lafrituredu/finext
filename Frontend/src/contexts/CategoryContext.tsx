import { createContext, useContext, useEffect, useState } from "react";
import { getCategories, type Category } from "../api/CategoryService"; 
const CategoriesContext = createContext<any>(null);

export const CategoryProvider = ({children} : any) => {
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        getCategories()
            .then(data => setCategories(data))
            .catch(err => console.error(err))
    }, []);

    const refetchCategories = async () => {
        getCategories()
            .then(data => setCategories(data))
            .catch(err => console.error(err))
    }

    return (
        <CategoriesContext.Provider value={{categories,setCategories,refetchCategories}}>
            {children}
        </CategoriesContext.Provider>
    )
}

export const useCategories = () => {
  return useContext(CategoriesContext);
};

export type CategoriesContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>,
  refetchCategories: () => Promise<void>
};