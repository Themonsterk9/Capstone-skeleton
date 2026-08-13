import { test, expect } from "@playwright/test";

test.describe("Chat Page E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure a clean start
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test("should navigate to chat, send a message, get mock response, and clear chat", async ({ page }) => {
    // Mock the API endpoint
    await page.route("**/api/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: "Mock AI response: Frequent flyer tiers are Gold, Platinum, and Diamond.",
      });
    });

    // 1. Navigate to chat page
    await page.goto("/chat");

    // Verify title and page header are present
    await expect(page.locator("h1")).toContainText("FlyRank AI Assistant");
    
    // 2. Locate input and send button using accessible query selectors
    const chatInput = page.getByLabel("Chat message input field");
    const sendButton = page.getByRole("button", { name: "Send Message" });
    
    await expect(chatInput).toBeVisible();

    // 3. Fill input and submit
    await chatInput.fill("Tell me about airline tiers");
    await chatInput.press("Enter");

    // 4. Verify user message is displayed in window
    await expect(page.locator("text=Tell me about airline tiers")).toBeVisible();

    // 5. Verify simulated AI response is displayed and completed
    const responseLocator = page.locator("text=Mock AI response: Frequent flyer tiers are Gold, Platinum, and Diamond.");
    await expect(responseLocator).toBeVisible({ timeout: 10000 });

    // 6. Test clearing conversation
    const clearButton = page.locator("button:has-text('Clear')");
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Verify clear confirmation modal pops up
    const confirmButton = page.locator("button:has-text('Confirm Clear')");
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Verify chat bubbles are cleared and input is reset
    await expect(page.locator("text=Tell me about airline tiers")).not.toBeVisible();
    await expect(responseLocator).not.toBeVisible();
  });
});
