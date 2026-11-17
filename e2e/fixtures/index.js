const base = require("@playwright/test");

/**
 * Custom Playwright fixtures.
 *
 * Extend the base `test` here to share setup across specs — e.g. seeded data,
 * authenticated contexts, or Page Object Models from `../pages`. Example:
 *
 *   const { test } = require("./fixtures");
 *
 * For now this simply re-exports the base test/expect so specs can migrate to
 * custom fixtures without changing their imports.
 */
const test = base.test.extend({
  // homePage: async ({ page }, use) => {
  //   const { HomePage } = require("../pages/HomePage");
  //   await use(new HomePage(page));
  // },
});

module.exports = { test, expect: base.expect };
