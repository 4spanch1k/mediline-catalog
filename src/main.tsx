import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource-variable/inter";
import cyrillicFont from "@fontsource-variable/inter/files/inter-cyrillic-wght-normal.woff2?url";
import cyrillicExtendedFont from "@fontsource-variable/inter/files/inter-cyrillic-ext-wght-normal.woff2?url";
import "./index.css";

for (const href of [cyrillicFont, cyrillicExtendedFont]) {
  const preload = document.createElement("link");
  preload.rel = "preload";
  preload.as = "font";
  preload.type = "font/woff2";
  preload.crossOrigin = "anonymous";
  preload.href = href;
  document.head.append(preload);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
