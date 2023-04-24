import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Leaderboard from "./views/Leaderboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Leaderboard />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
