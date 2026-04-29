// components/pdf/pdf-print-context.tsx
import { createContext, useContext, useRef } from "react";

type PrintContextType = {
  componentRef: React.RefObject<HTMLDivElement | null>;
};

const PrintContext = createContext<PrintContextType | null>(null);

export const PrintProvider = ({ children }: { children: React.ReactNode }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <PrintContext.Provider value={{ componentRef }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrint = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error("usePrint must be used inside PrintProvider");
  }
  return context;
};
