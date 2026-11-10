import { expect, test } from "@playwright/test";

test("capture dashboard and detail screenshots", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/dashboard");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "e2e/screenshots/dashboard-light.png", fullPage: false });
  await page.getByTestId("disaster-map").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "e2e/screenshots/dashboard-map.png", fullPage: false });

  await page.goto("/disasters/sim-flood-005");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "e2e/screenshots/detail-provisional.png", fullPage: false });
  await page.getByTestId("disaster-map").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "e2e/screenshots/detail-map.png", fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "e2e/screenshots/dashboard-mobile.png", fullPage: false });
  await page.getByTestId("disaster-map").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: "e2e/screenshots/dashboard-map-mobile.png", fullPage: false });

  expect(testInfo.status).toBe("passed");
});
