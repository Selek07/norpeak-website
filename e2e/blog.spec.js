const { test, expect } = require("@playwright/test");

/**
 * Smoke tests for the /blog page. React Native Web renders to <div>s, so these
 * target stable visible text rather than ARIA roles.
 */
test.describe("Blog page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("renders the featured hero", async ({ page }) => {
    await expect(page).toHaveTitle(/Nortpeak/);
    await expect(page.getByText("Beyond the Grid:")).toBeVisible();
    await expect(page.getByText("FEATURED MANUSCRIPT")).toBeVisible();
  });

  test("lists blog fragments", async ({ page }) => {
    await expect(page.getByText("Latest Fragments")).toBeVisible();
    await expect(
      page.getByText("Hardware Logic in Digital Systems")
    ).toBeVisible();
    await expect(
      page.getByText("Orbital Hierarchy & Z-Index Depth")
    ).toBeVisible();
  });

  test("reuses the site navigation and footer", async ({ page }) => {
    await expect(page.getByText("LET'S TALK")).toBeVisible();
    await expect(
      page.getByText("Engineered for the future.")
    ).toBeVisible();
  });
});
