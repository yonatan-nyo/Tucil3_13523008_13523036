import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: lazy(() => import("./pages/Home")),
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
