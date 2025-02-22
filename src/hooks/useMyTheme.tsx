// hooks/useFooterTheme.ts
'use client'
import { useTheme } from "next-themes";

const useMyTheme = () => {
  const { theme } = useTheme();

  return theme;
};

export default useMyTheme;
