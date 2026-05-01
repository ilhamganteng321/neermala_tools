// src/hooks/use-funfact.ts
import { useState, useCallback } from "react";
import { defaultFunFact, type FunFact } from "@/data/types/funfact";

export const useFunFact = () => {
  const [funfact, setFunfact] = useState<FunFact>(defaultFunFact);

  const updateField = useCallback(
    <K extends keyof FunFact>(key: K, value: FunFact[K]) => {
      setFunfact((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setFunfact(defaultFunFact);
  }, []);

  const setImage = useCallback(
    (image: string | null) => {
      updateField("image", image);
    },
    [updateField],
  );

  return {
    funfact,
    updateField,
    setImage,
    reset,
  };
};
