import { expect, test, type Page } from "@playwright/test";

function disasterFeed(page: Page) {
  return page.getByRole("list", { name: "Daftar kejadian simulasi" });
}

test("dashboard seeds and lists simulation data", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByRole("heading", { name: "Dashboard bencana" })).toBeVisible();
  await expect(
    disasterFeed(page).getByText("Simulasi Gempa Pesisir Jawa Timur"),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/Data simulasi/i).first()).toBeVisible();
  await expect(page.getByText("Total kejadian")).toBeVisible();
});

test("dashboard filters by search query", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    disasterFeed(page).getByText("Simulasi Gempa Pesisir Jawa Timur"),
  ).toBeVisible({ timeout: 10_000 });

  await page.getByRole("searchbox", { name: "Pencarian" }).fill("longsor");
  await expect(disasterFeed(page).getByText("Simulasi Longsor Lereng")).toBeVisible();
  await expect(
    disasterFeed(page).getByText("Simulasi Gempa Pesisir Jawa Timur"),
  ).toHaveCount(0);

  await page.getByRole("searchbox", { name: "Pencarian" }).fill("zzzz");
  await expect(
    page.getByRole("heading", { name: /tidak ada kejadian yang cocok/i }),
  ).toBeVisible();
});

test("campaign status filter is applied and persisted", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(disasterFeed(page)).toBeVisible({ timeout: 10_000 });

  await page.getByLabel("Status", { exact: true }).selectOption("campaign");
  await expect(
    page.getByRole("heading", { name: /tidak ada kejadian yang cocok/i }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Status", { exact: true })).toHaveValue("campaign");

  await page.getByRole("button", { name: "Reset filter" }).click();
  await expect(disasterFeed(page)).toBeVisible();
});

test("dashboard shows a provisional score when data is incomplete", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("searchbox", { name: "Pencarian" }).fill("Data Terbatas");
  await expect(disasterFeed(page).getByText("Skor Sementara")).toBeVisible({
    timeout: 10_000,
  });
});

test("disaster detail shows the score breakdown and mitigation steps", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    disasterFeed(page).getByText("Simulasi Gempa Pesisir Jawa Timur"),
  ).toBeVisible({ timeout: 10_000 });
  await disasterFeed(page).getByRole("link", { name: /lihat analisis/i }).first().click();

  await expect(
    page.getByRole("heading", { name: /Simulasi Gempa Pesisir Jawa Timur/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /Rincian skor/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Langkah mitigasi/i })).toBeVisible();
  await expect(page.getByText("skala kejadian", { exact: true })).toBeVisible();
  await expect(page.getByText(/Kelengkapan data 100%/).first()).toBeVisible();
});

test("an unassessed disaster is labelled as not scored", async ({ page }) => {
  await page.goto("/disasters/sim-earthquake-006");
  await expect(
    page.getByRole("heading", { name: /Simulasi Gempa Minor Tanpa Rincian Data/i }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText("Belum dinilai").first()).toBeVisible();
  await expect(page.getByText(/Kelengkapan data 0%/).first()).toBeVisible();
});

test("an unknown disaster id reports not found", async ({ page }) => {
  await page.goto("/disasters/tidak-ada");
  await expect(
    page.getByRole("heading", { name: /kejadian tidak ditemukan/i }),
  ).toBeVisible({ timeout: 10_000 });
});
