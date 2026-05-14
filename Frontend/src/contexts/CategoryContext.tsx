import { createContext, useContext, useEffect, useState } from "react";
import { getCategories, type Category } from "../api/CategoryService";


export type CategoriesContextType = {
  categories: Category[];
  loading: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  refetchCategories: () => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export const CategoryProvider = ({ children }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const refetchCategories = async () => {
    setLoading(true);
    getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <CategoriesContext.Provider value={{ categories, loading, setCategories, refetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error("useCategories must be used within a CategoryProvider");
  return context;
};