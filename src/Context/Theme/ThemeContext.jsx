import { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useTranslation } from "react-i18next";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {theme} from "./theme";



// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();


const cacheLtr = createCache({ key: "mui" });
const cacheRtl = createCache({
  key: "mui-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});


export const ThemeContextProvider = ({ children }) => {

  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const { i18n } = useTranslation(); 


  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);


  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };


  const direction = i18n.language === "ar" ? "rtl" : "ltr";


  useEffect(() => {
    document.body.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [direction, i18n.language]);


  const cache = direction === "rtl" ? cacheRtl : cacheLtr;


  const currentTheme = useMemo(() => theme(mode, direction), [mode, direction]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={currentTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};
