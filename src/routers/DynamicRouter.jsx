import React, { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loadable from "../components/Loadable";
import DashboardLayout from "../layout/Dashboard";
import { useKanbanContext } from "../context/KanbanContext";
import ActiveKanban from "../pages/activeKanbanPage";
// lazy load Components
//const TestPage = Loadable(lazy(() => import("../pages/testPage")));
const LandingPage = Loadable(lazy(() => import("../pages/landingPage")));
const AddKanbanPage = Loadable(lazy(() => import("../pages/addKanbanPage")));
const InActiveKanbanPege = Loadable(lazy(()=> import("../pages/inActiveKanbanPage")))
//const ActiveKanbanPage = Loadable(lazy(()=> import("../pages/activeKanbanPage")))


const DynamicRouter = () => {
  //const { data: routes, isLoading, isError } = useQuery(['routes'], getAllActiveKanban);
  const kanbanData = useKanbanContext();

  const transformRoutes = (routes) => {
    return routes.map((route) => {
      return {
        path: `/kanban/${route.mapping_key}`,
        element: <ActiveKanban props={route} />,
      };
    });
  };

  const transformInactiveRoutes = (routes)=>{
    return routes.map((route) => {
      return {
        path: `/kanban/${route.mapping_key}`,
        element: process.env.REACT_APP_MASTER_MODE=="false"?<LandingPage/>:<InActiveKanbanPege kanbanMappingKey={route.mapping_key} />,
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
            element: process.env.REACT_APP_MASTER_MODE=="false"?<LandingPage/>:<AddKanbanPage />,
          },
        ].concat(
          transformRoutes([
            ...kanbanData.activeData,
            //...kanbanData.inactiveData,
          ])
        ).concat(
          transformInactiveRoutes([
            ...kanbanData.inactiveData,
          ])
        ),
      },
    ],
    { basename: "/kanbansys" }
  );

  return <RouterProvider router={router} />;
};

export default DynamicRouter;
