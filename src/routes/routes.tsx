import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Components
const Home = lazy(() => import("../pages/home/index"));

// Suspense Fallback
const withSuspense = (Component: React.FC) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

// Router Exports
export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(Home),
  },
]);
