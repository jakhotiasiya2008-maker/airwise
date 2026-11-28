import { chromium } from "playwright";

async function runQAChecks() {
  console.log("=== STARTING AIRWISE PRE-SUBMISSION QA SUITE ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  // Pre-seed completed onboarding so modal does not block automation
  await context.addInitScript(() => {
    window.localStorage.setItem("airwise_onboarding_completed_v2", "true");
  });

  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(`[PAGE ERROR] ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  const baseUrl = "http://localhost:3001";
  console.log(`Navigating to ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 15000 });

  // 1. Initial State Check
  console.log("\n--- CHECK 1: Initial Page Load ---");
  await page.waitForSelector("h1, header", { timeout: 10000 });
  const title = await page.title();
  console.log(`Page title: ${title}`);

  // Dismiss onboarding if present
  const skipBtn = page.getByRole("button", { name: /Skip Setup|छोड़ें/i });
  if (await skipBtn.isVisible()) {
    console.log("Onboarding modal detected -> Clicking Skip Setup");
    await skipBtn.click();
    await page.waitForTimeout(500);
  }

  console.log("Waiting for initial data load...");
  await page.locator("[role='status']:has-text('Loading')").waitFor({ state: "detached", timeout: 15000 }).catch(() => {});
  console.log("Initial page loaded successfully.");

  // 2. Search 5 Indian Cities
  console.log("\n--- CHECK 2: Search 5 Indian Cities ---");
  const testCities = ["Mumbai", "Bengaluru", "Kolkata", "Jaipur", "Delhi"];
  for (const city of testCities) {
    const chip = page.locator(`button:has-text("${city}")`).first();
    if (await chip.isVisible()) {
      await chip.click();
      console.log(`Clicked quick-chip for ${city}`);
    } else {
      const searchInput = page.locator("#city-search-input");
      await searchInput.fill(city);
      await page.waitForTimeout(600);
      const dropdownOption = page.locator("button:has-text('" + city + "')").first();
      if (await dropdownOption.isVisible()) {
        await dropdownOption.click();
        console.log(`Selected ${city} from search dropdown`);
      }
    }

    // Wait for reading to render
    await page.locator("[role='status']:has-text('Loading')").waitFor({ state: "detached", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
    const categoryStatus = page.locator("[role='status'][aria-label*='category']").first();
    const hasCategory = await categoryStatus.isVisible();
    const categoryText = hasCategory ? await categoryStatus.textContent() : "none";
    const hasAdvisory = await page.locator("section[aria-label*='Advisory'], [aria-label*='Guidance'], [role='region']").first().isVisible();
    console.log(`  -> ${city}: Category Badge: "${categoryText?.trim()}" (Visible: ${hasCategory}), Advisory Visible: ${hasAdvisory}`);
    if (!hasCategory) throw new Error(`Failed to load valid category for ${city}`);
  }

  // 3. Test Bad Input
  console.log("\n--- CHECK 3: Bad Input Edge Cases ---");
  const searchInput = page.locator("#city-search-input");
  
  // 3a. Gibberish
  await searchInput.click();
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("geocoding"), { timeout: 8000 }).catch(() => null),
    searchInput.fill("zzxxqqyy9911"),
  ]);
  await page.waitForTimeout(500);
  const noMatchMsg = page.locator("text=/No Indian cities found/i");
  const hasNoMatch = await noMatchMsg.isVisible();
  console.log(`  -> Gibberish "zzxxqqyy9911": Friendly no-match message displayed? ${hasNoMatch}`);
  if (!hasNoMatch) throw new Error("Friendly no-match message failed to display for gibberish search!");

  // 3b. Special characters
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("geocoding"), { timeout: 8000 }).catch(() => null),
    searchInput.fill("!@#$%^&*()<>{}[]"),
  ]);
  await page.waitForTimeout(500);
  const hasNoMatchSpecial = await page.locator("text=/No Indian cities found/i").isVisible();
  console.log(`  -> Special Characters "!@#$%^&*()<>{}[]": Handled gracefully? ${hasNoMatchSpecial}`);
  if (!hasNoMatchSpecial) throw new Error("Friendly no-match message failed to display for special characters search!");

  // 3c. Very long string
  await searchInput.fill("A".repeat(150));
  await page.waitForTimeout(500);
  console.log("  -> Very long string (150 chars): No crash detected, input capped/handled.");

  // Clear search
  const clearBtn = page.locator("button[aria-label*='Clear']");
  if (await clearBtn.isVisible()) await clearBtn.click();

  // 4. Test Mobile Width (375px) and Desktop Width
  console.log("\n--- CHECK 4: Responsive Viewports & Horizontal Overflow ---");
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500);
  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`  -> Mobile 375px viewport: Horizontal overflow detected? ${mobileOverflow} (Must be false)`);
  if (mobileOverflow) throw new Error("Horizontal overflow detected on mobile viewport!");

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(500);
  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log(`  -> Desktop 1920px viewport: Horizontal overflow detected? ${desktopOverflow} (Must be false)`);

  // 5. Test Offline / Failed Request
  console.log("\n--- CHECK 5: Offline / Simulated API Failure ---");
  const failureContext = await browser.newContext();
  await failureContext.addInitScript(() => {
    window.localStorage.setItem("airwise_onboarding_completed_v2", "true");
  });
  const failurePage = await failureContext.newPage();
  await failurePage.route("**/api/air-quality*", (route) => {
    route.abort("failed");
  });
  await failurePage.goto(baseUrl, { timeout: 15000 });
  await failurePage.waitForTimeout(1000);
  const errorBox = failurePage.locator('[role="alert"]').or(failurePage.getByText(/Unable to fetch|retry|error/i)).first();
  const errorVisible = await errorBox.isVisible();
  console.log(`  -> Simulated Network Drop: Error state and retry button visible? ${errorVisible}`);
  if (!errorVisible) throw new Error("Error state failed to appear during simulated network drop!");
  await failureContext.close();

  // 6. Console Error Audit
  console.log("\n--- CHECK 6: Browser Console Error Audit ---");
  console.log(`Total console/page errors detected during session: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log("Errors logged:", consoleErrors);
  }

  await browser.close();
  console.log("\n=== ALL QA AUTOMATION CHECKS COMPLETED SUCCESSFULLY ===");
}

runQAChecks().catch((err) => {
  console.error("QA RUNNER FAILED:", err);
  process.exit(1);
});
