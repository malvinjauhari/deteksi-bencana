import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { AppProviders } from "@/components/providers/app-providers";

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
