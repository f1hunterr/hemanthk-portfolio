import { test, expect } from "@playwright/test";
import { openHome } from "./helpers";

const FORMSPREE = "https://formspree.io/f/mojrrnqd";

// Guards the form validation (zod schema via the react-hook-form resolver) and what gets sent
test.describe("contact form", () => {
  test("shows a message for each invalid field and sends nothing", async ({ page }) => {
    let posted = false;
    await page.route(FORMSPREE, (route) => {
      posted = true;
      return route.fulfill({ status: 200, body: "{}" });
    });
    await openHome(page, { reduced: true });

    await page.getByTestId("input-name").fill("H");
    await page.getByTestId("input-email").fill("not-an-email");
    await page.getByTestId("textarea-message").fill("short");
    await page.getByTestId("button-send-message").click();

    await expect(page.getByText("Name must be at least 2 characters.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Message must be at least 10 characters.")).toBeVisible();
    expect(posted).toBe(false);
  });

  test("sends valid input to Formspree and confirms", async ({ page }) => {
    let body: Record<string, string> | undefined;
    await page.route(FORMSPREE, (route) => {
      body = route.request().postDataJSON();
      return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await openHome(page, { reduced: true });

    await page.getByTestId("input-name").fill("Test Recruiter");
    await page.getByTestId("input-email").fill("recruiter@example.com");
    await page.getByTestId("textarea-message").fill("Hello, I would like to talk about a role.");
    await page.getByTestId("button-send-message").click();

    await expect(page.getByText("Message Sent!").first()).toBeVisible();
    expect(body).toEqual({
      name: "Test Recruiter",
      email: "recruiter@example.com",
      message: "Hello, I would like to talk about a role.",
      _gotcha: "",
    });
    await expect(page.getByTestId("input-name")).toHaveValue("");
  });
});
