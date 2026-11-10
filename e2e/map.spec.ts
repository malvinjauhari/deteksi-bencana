import { expect, test, type Page } from "@playwright/test";

async function blockMapTiles(page: Page) {
  await page.route("**/*tile.openstreetmap.org/**/*", (route) => route.abort());
}

test("map renders keyboard-focusable markers with a coordinate alternative", async ({ page }) => {
  await blockMapTiles(page);
  await page.goto("/dashboard");

  const map = page.getByTestId("disaster-map");
  await expect(map).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(6);
  await expect(
    page.getByRole("heading", { name: "Daftar lokasi dan koordinat" }),
  ).toBeVisible();
  await expect(page.getByText("-7.2504, 112.7688", { exact: true })).toBeVisible();

  const firstMarker = page.locator(".leaflet-marker-icon").first();
  await firstMarker.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".leaflet-popup-content")).toContainText(
    "Simulasi Gempa Pesisir Jawa Timur",
  );
});

test("failed map tiles produce an explicit fallback without hiding data", async ({ page }) => {
  await blockMapTiles(page);
  await page.goto("/dashboard");

  await expect(page.getByRole("alert")).toContainText(
    "Tile peta tidak dapat dimuat",
    { timeout: 10_000 },
  );
  await expect(
    page.getByRole("heading", { name: "Daftar lokasi dan koordinat" }),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Daftar kejadian simulasi" }),
  ).toBeVisible();
});

test("map markers follow the active filters", async ({ page }) => {
  await blockMapTiles(page);
  await page.goto("/dashboard");
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(6, {
    timeout: 10_000,
  });

  await page.getByRole("searchbox", { name: "Pencarian" }).fill("longsor");
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(1);
  await expect(page.locator(".leaflet-marker-icon")).toHaveAttribute(
    "title",
    "Simulasi Longsor Lereng",
  );
});

test("detail map shows one marker and readable coordinates", async ({ page }) => {
  await blockMapTiles(page);
  await page.goto("/disasters/sim-earthquake-001");

  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(1, {
    timeout: 10_000,
  });
  await expect(page.getByText("-7.2504, 112.7688", { exact: true })).toBeVisible();
});

test("dashboard and map fit mobile, tablet, and desktop without overflow", async ({ page }) => {
  await blockMapTiles(page);
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/dashboard");
  await expect(page.getByTestId("disaster-map")).toBeVisible({ timeout: 10_000 });

  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByTestId("disaster-map")).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Pencarian" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);

    const mapBounds = await page.getByTestId("disaster-map").boundingBox();
    expect(mapBounds).not.toBeNull();
    expect(mapBounds?.width).toBeLessThanOrEqual(width);
  }
});
