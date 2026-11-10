import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routes } from "@/app/router";
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

  it("renders the dashboard as an explicit empty state", () => {
    renderRoute("/dashboard");
    expect(screen.getByRole("heading", { name: /data lokal belum tersedia/i })).toBeInTheDocument();
  });

  it("renders disaster detail and not-found routes", () => {
    const { unmount } = renderRoute("/disasters/sim-001");
    expect(screen.getByText(/ID sim-001/i)).toBeInTheDocument();
    unmount();

    renderRoute("/unknown");
    expect(screen.getByRole("heading", { name: /halaman tidak ditemukan/i })).toBeInTheDocument();
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
