import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./router";

// Create the router instance with our route configuration
const router = createBrowserRouter(routes);

/**
 * Main App component using the new createBrowserRouter API
 * Features lazy loading, error boundaries, and nested protected routes
 */
const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
