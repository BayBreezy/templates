export const useTheme = () => {
  const mode = useColorMode();
  const toggleColorMode = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
  };

  return { mode, toggleColorMode };
};
