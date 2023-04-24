import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Router } from "./Router.tsx";
import { Page } from "./components/Page.tsx";
import { ErrorBoundary } from "react-error-boundary";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Page>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Router />
      </ErrorBoundary>
    </Page>
  </React.StrictMode>
);
