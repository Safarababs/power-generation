// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "react-ui";
import { tokens, components } from "react-ui/themes/light";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider tokens={tokens} components={components}>
    <App />
  </ThemeProvider>,
);

// serviceWorkerRegistration.register();
