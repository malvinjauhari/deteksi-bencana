import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routes } from "@/app/routes";
import { ThemeProvider } from "@/components/providers/theme-provider";

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
}

describe("application routing and shell", () => {
  it("renders the landing content and simulation limitations", () => {
    renderRoute("/");
    expect(screen.getByRole("heading", { name: /dari informasi menjadi tindakan/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /teknologi membantu/i })).toBeInTheDocument();
    expect(screen.getAllByText(/bukan data langsung|bukan sistem peringatan dini resmi/i).length).toBeGreaterThan(0);
  });

  it("renders the dashboard with seeded simulation data", async () => {
    renderRoute("/dashboard");
    // The dashboard route is lazy-loaded and the seed runs asynchronously.
    expect(
      await screen.findByRole("heading", { name: "Dashboard bencana" }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Simulasi Gempa Pesisir Jawa Timur/i, undefined, {
        timeout: 5000,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Data simulasi/i).length).toBeGreaterThan(0);
  });

  it("renders disaster detail and not-found routes", async () => {
    const { unmount } = renderRoute("/disasters/sim-earthquake-001");
    expect(
      await screen.findByRole("heading", { name: /Simulasi Gempa Pesisir Jawa Timur/i }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Rincian skor/i)).toBeInTheDocument();
    expect(screen.getByText(/Langkah mitigasi/i)).toBeInTheDocument();
    unmount();

    renderRoute("/unknown");
    expect(screen.getByRole("heading", { name: /halaman tidak ditemukan/i })).toBeInTheDocument();
  });

  it("reports an unknown disaster id as not found", async () => {
    renderRoute("/disasters/sim-001");
    expect(
      await screen.findByRole("heading", { name: /kejadian tidak ditemukan/i }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ID sim-001/i)).toBeInTheDocument();
  });

  it("opens the accessible mobile dialog and navigates", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    await user.click(screen.getByRole("button", { name: /buka menu navigasi/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Dashboard" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dashboard bencana" })).toBeInTheDocument();
  });

  it("closes the mobile dialog with the Escape key", async () => {
    const user = userEvent.setup();
    renderRoute("/");
    const trigger = screen.getByRole("button", { name: /buka menu navigasi/i });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
