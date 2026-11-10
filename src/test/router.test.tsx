import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routes } from "@/app/router";

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return render(<RouterProvider router={router} />);
}

describe("application routing", () => {
  it("renders the home page and simulation notice", () => {
    renderRoute("/");
    expect(
      screen.getByRole("heading", { name: /memahami urgensi/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/tanpa live ai/i)).toBeInTheDocument();
  });

  it("renders the dashboard as an explicit placeholder", () => {
    renderRoute("/dashboard");
    expect(
      screen.getByRole("heading", { name: /dashboard sedang disiapkan/i }),
    ).toBeInTheDocument();
  });

  it("renders disaster detail and not-found routes", () => {
    const { unmount } = renderRoute("/disasters/sim-001");
    expect(screen.getByText("sim-001")).toBeInTheDocument();
    unmount();

    renderRoute("/unknown");
    expect(
      screen.getByRole("heading", { name: /halaman tidak ditemukan/i }),
    ).toBeInTheDocument();
  });
});
