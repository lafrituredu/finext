import { createContext, useContext, useState } from "react";

const ToggleContext = createContext<any>(null);

export function ToggleContainer({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ToggleContext.Provider value={{ selected, setSelected }}>
      <div className="relative bg-[#EFEFEF] dark:bg-[#0F1732] w-full px-2 py-1 rounded-3xl flex justify-between items-center gap-5 border border-[#0000001a] mb-4 montserrat">
        {children}
      </div>
    </ToggleContext.Provider>
  );
}

export function useToggle() {
  return useContext(ToggleContext);
}