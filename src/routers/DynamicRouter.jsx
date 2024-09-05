import React, { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loadable from "../components/Loadable";
import DashboardLayout from "../layout/Dashboard";
import { useKanbanContext } from "../context/KanbanContext";
// lazy load Components
const TestPage = Loadable(lazy(() => import("../pages/testPage")));
const LandingPage = Loadable(lazy(() => import("../pages/landingPage")));
const AddKanbanPage = Loadable(lazy(() => import("../pages/addKanbanPage")));

const DynamicRouter = () => {
  //const { data: routes, isLoading, isError } = useQuery(['routes'], getAllActiveKanban);
  const kanbanData = useKanbanContext();

  const transformRoutes = (routes) => {
    return routes.map((route) => {
      return {
        path: `/kanban/${route.kanban_name}/${route.mapping_key}`,
        element: <TestPage props={route} />,
      };
    });
  };
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <LandingPage />,
          },
          {
            path: "/addKanban",
            element: <AddKanbanPage />,
          },
        ].concat(
          transformRoutes([
            ...kanbanData.activeData,
            ...kanbanData.inactiveData,
          ])
        ),
      },
    ],
    { basename: "/" }
  );

  return <RouterProvider router={router} />;
};

export default DynamicRouter;
