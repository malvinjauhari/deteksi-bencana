import type { RouteObject } from "react-router-dom";
import { RootLayout } from "@/app/root-layout";
import {
  DashboardRouteElement,
  DisasterDetailRouteElement,
} from "@/app/route-elements";
import { HomePage } from "@/pages/home-page";
import { NotFoundPage } from "@/pages/not-found-page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <DashboardRouteElement /> },
      { path: "disasters/:id", element: <DisasterDetailRouteElement /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
