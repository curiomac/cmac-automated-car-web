import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { router } from "./routes";
import { getDocumentDimentions } from "../utils/documentDimentions";

const App = () => {
  const { i18n } = useTranslation();

  // Initializing language on App loads
  useEffect(() => {
    i18n.changeLanguage("en");
  }, [i18n]);

  // Updating doc dimentions with css to root on App loads
  useEffect(() => {
    const setPropertyDimensions = () => {
      const { docHeight, docWidth } = getDocumentDimentions();

      document.documentElement.style.setProperty("--cmac-doc-height", `${docHeight}px`);
      document.documentElement.style.setProperty("--cmac-doc-width", `${docWidth}px`);
    };

    setPropertyDimensions();

    window.addEventListener("resize", setPropertyDimensions);

    return () => window.removeEventListener("resize", setPropertyDimensions);
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
