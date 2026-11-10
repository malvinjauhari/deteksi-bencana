import { expect, test } from "@playwright/test";

test("hero renders the backdrop image with readable content", async ({ page }) => {
  const failedRequests: string[] = [];
  page.on("requestfailed", (request) => failedRequests.push(request.url()));

  await page.goto("/");

  const heroImage = page.locator('img[src="/images/hero-unsplash.webp"]');
  await expect(heroImage).toBeVisible();

  const loaded = await heroImage.evaluate((image) => {
    const element = image as HTMLImageElement;
    return element.complete && element.naturalWidth > 0;
  });
  expect(loaded).toBe(true);

  await expect(page.getByRole("heading", { name: /dari informasi/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /jelajahi dashboard/i })).toBeVisible();
  expect(failedRequests).toEqual([]);
});

test("hero animation settles into a visible state", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { name: /dari informasi/i });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("opacity", "1");
  await expect(page.locator('img[src="/images/hero-unsplash.webp"]')).toHaveCSS("opacity", "1");
});

test("reduced motion disables decorative animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const heading = page.getByRole("heading", { name: /dari informasi/i });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("opacity", "1");

  const animationNames = await page
    .locator('img[src="/images/hero-unsplash.webp"], section[aria-labelledby="hero-title"] *')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).animationName),
    );
  expect(animationNames.every((name) => name === "none")).toBe(true);
});

test("scroll reveals feature content", async ({ page }) => {
  await page.goto("/");
  await page.locator("#features-title").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: /jelas saat informasi/i })).toBeVisible();
  await expect(page.getByText(/peta yang mudah dipahami/i)).toBeVisible();
});

test("dark mode keeps the hero readable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Tema gelap" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("heading", { name: /dari informasi/i })).toBeVisible();
});

test("mobile viewport keeps the hero usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.getByRole("link", { name: /jelajahi dashboard/i })).toBeVisible();
});
