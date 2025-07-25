import { I18nextProvider } from "react-i18next";
import "../src/styles/gobal.css";
import "../src/styles/styles.css";
import AppRouter from "./routes";
import i18n from "./config/i18n";

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AppRouter />
    </I18nextProvider>
  );
};

export default App;
