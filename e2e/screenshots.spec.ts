import { expect, test } from "@playwright/test";

test("capture landing screenshots", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(2200);
  await page.screenshot({ path: "e2e/screenshots/landing-light.png" });

  await page.getByRole("button", { name: "Tema gelap" }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "e2e/screenshots/landing-dark.png" });

  await page.getByRole("button", { name: "Tema terang" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.waitForTimeout(2200);
  await page.screenshot({ path: "e2e/screenshots/landing-mobile.png" });

  await page.locator("#features-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "e2e/screenshots/landing-features.png" });

  expect(testInfo.status).toBe("passed");
});
