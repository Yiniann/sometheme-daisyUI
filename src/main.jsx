import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store.js";
import { loadRuntimeConfig } from "./config/runtimeConfig";
import { Toaster } from "sonner"; 
import { initApi } from "./utils/api.js";

loadRuntimeConfig().then(() => {
  initApi();
  

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Provider store={store}>
        <>
          <Toaster
            position="top-center"
            richColors
            theme="system"
          />
          <App />
        </>
      </Provider>
    </StrictMode>
  );
});
