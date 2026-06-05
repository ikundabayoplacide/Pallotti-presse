import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { store } from "./app/store.ts";
import "./index.css";
import { TranslationProvider } from "./services/googletransilate.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <TranslationProvider originalLang="en">
        <App />
      </TranslationProvider>
    </BrowserRouter>
  </Provider>,
);
