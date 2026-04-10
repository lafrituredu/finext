import { createContext, useContext, useState } from "react";

const ToggleContext = createContext<any>(null);

export function ToggleContainer({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ToggleContext.Provider value={{ selected, setSelected }}>
      <div className="flex w-fit border border-gray-500 rounded-full overflow-hidden">
        {children}
      </div>
    </ToggleContext.Provider>
  );
}

export function useToggle() {
  return useContext(ToggleContext);
}