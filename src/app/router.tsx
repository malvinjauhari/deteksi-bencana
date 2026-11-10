import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { RootLayout } from "@/app/root-layout";
import { DashboardPage } from "@/pages/dashboard-page";
import { DisasterDetailPage } from "@/pages/disaster-detail-page";
import { HomePage } from "@/pages/home-page";
import { NotFoundPage } from "@/pages/not-found-page";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "disasters/:id", element: <DisasterDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
