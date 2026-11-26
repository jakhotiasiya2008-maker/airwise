import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

const FFMPEG_PATH = ffmpegInstaller.path;
const FFPROBE_PATH = ffprobeInstaller.path;

const BASE_URL = process.env.DEPLOYED_URL || "http://localhost:3001";
const RECORDING_DIR = path.resolve("./demo/recordings");
const OUTPUT_MP4 = path.resolve("./demo/airwise-india-demo.mp4");

// Clear past recordings
if (fs.existsSync(RECORDING_DIR)) {
  fs.rmSync(RECORDING_DIR, { recursive: true, force: true });
}
fs.mkdirSync(RECORDING_DIR, { recursive: true });

async function smoothScroll(page, targetY, durationMs = 1400) {
  await page.evaluate(
    ({ targetY, durationMs }) => {
      return new Promise((resolve) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();

        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / durationMs);
          const ease =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          window.scrollTo(0, startY + diff * ease);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    },
    { targetY, durationMs }
  );
  await page.waitForTimeout(600);
}

async function setCaption(page, text) {
  await page.evaluate((captionText) => {
    let el = document.getElementById("demo-caption-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "demo-caption-overlay";
      Object.assign(el.style, {
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        color: "#ffffff",
        padding: "15px 32px",
        borderRadius: "9999px",
        fontSize: "21px",
        fontWeight: "700",
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
        boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.18)",
        zIndex: "999999",
        textAlign: "center",
        pointerEvents: "none",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        maxWidth: "88%",
        letterSpacing: "-0.01em",
        backdropFilter: "blur(14px)",
      });
      document.body.appendChild(el);
    }
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(10px) scale(0.98)";
    setTimeout(() => {
      el.textContent = captionText;
      el.style.opacity = "1";
      el.style.transform = "translateX(-50%) translateY(0) scale(1)";
    }, 150);
  }, text);
}

async function injectCursor(page) {
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "demo-custom-cursor";
    Object.assign(cursor.style, {
      position: "fixed",
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      backgroundColor: "rgba(37, 99, 235, 0.4)",
      border: "2px solid #2563eb",
      boxShadow: "0 0 14px rgba(37, 99, 235, 0.8)",
      pointerEvents: "none",
      zIndex: "1000000",
      transition: "transform 0.08s ease, width 0.15s ease, height 0.15s ease",
      transform: "translate(-50%, -50%)",
      top: "0px",
      left: "0px",
    });
    document.body.appendChild(cursor);

    window.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    window.addEventListener("mousedown", () => {
      cursor.style.width = "38px";
      cursor.style.height = "38px";
      cursor.style.backgroundColor = "rgba(220, 38, 38, 0.5)";
      cursor.style.borderColor = "#dc2626";
    });

    window.addEventListener("mouseup", () => {
      cursor.style.width = "28px";
      cursor.style.height = "28px";
      cursor.style.backgroundColor = "rgba(37, 99, 235, 0.4)";
      cursor.style.borderColor = "#2563eb";
    });
  });
}

async function runDemo() {
  console.log(`🎬 Launching Chromium at 1920x1080 against ${BASE_URL}...`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1920,1080",
      "--force-device-scale-factor=1",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: RECORDING_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  // Reset storage to show onboarding wizard on initial visit
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  await injectCursor(page);
  await page.waitForTimeout(1200);

  // --- SCENE 1 (0:00 - 0:12): Onboarding Wizard ---
  console.log("▶️ Scene 1: Onboarding Wizard (12s)");
  await setCaption(page, "AirWise India: Live, personalized air-quality guidance for Indian families.");
  await page.waitForTimeout(3000);

  // Step 1: Pick City
  const nextBtn1 = page.locator('button:has-text("Next Step")');
  if (await nextBtn1.isVisible()) {
    await nextBtn1.click();
    await page.waitForTimeout(3000);
  }

  // Step 2: Household Demographics
  const nextBtn2 = page.locator('button:has-text("Next Step")');
  if (await nextBtn2.isVisible()) {
    await nextBtn2.click();
    await page.waitForTimeout(3000);
  }

  // Step 3: Habits & Appliances -> Complete
  const finishBtn = page.locator('button:has-text("Get My Personalized Plan")');
  if (await finishBtn.isVisible()) {
    await finishBtn.click();
    await page.waitForTimeout(3000);
  }

  // --- SCENE 2 (0:12 - 0:28): Delhi Live Sensor Data & CPCB Hero Gauge ---
  console.log("▶️ Scene 2: Delhi Live Sensor Data & Hero Radial Gauge (16s)");
  await setCaption(page, "All numbers come from a live public API. The AI never invents AQI values.");
  
  // Click Delhi quick city pill
  const delhiPill = page.locator('button:has-text("Delhi (NCR)")');
  await delhiPill.first().click();
  await page.waitForTimeout(4000);

  // Smooth scroll to highlight gauge, PM2.5/PM10 tiles, source and IST timestamp
  await smoothScroll(page, 180, 1000);
  await page.waitForTimeout(7000);

  // --- SCENE 3 (0:28 - 0:42): 24-Hour Predictive Forecast & Windows ---
  console.log("▶️ Scene 3: 24-Hour Predictive Forecast & Windows (14s)");
  await setCaption(page, "24h diurnal forecast maps temperature inversions to spotlight optimal outdoor windows.");
  await smoothScroll(page, 540, 1200);
  await page.waitForTimeout(2500);

  // Hover over forecast chart curve
  const chartSection = page.locator('section[aria-label="24-Hour Air Quality Forecast Chart"]');
  if (await chartSection.isVisible()) {
    const box = await chartSection.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.65);
      await page.waitForTimeout(1600);
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
      await page.waitForTimeout(1600);
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.65);
      await page.waitForTimeout(1600);
    }
  }

  // Toggle accessible table view
  const tableToggle = page.locator('button:has-text("Text Table View")');
  if (await tableToggle.isVisible()) {
    await tableToggle.click();
    await page.waitForTimeout(3000);
    await page.locator('button:has-text("Show Visual Chart")').click();
    await page.waitForTimeout(1500);
  }

  // --- SCENE 4 (0:42 - 1:12): Household Personalization & 3 Guidance Pillars ---
  console.log("▶️ Scene 4: Personalization & 3 Guidance Pillars (30s)");
  await setCaption(page, "Personalized across 3 pillars: Daily Routines, Indoor Air, and Sustainable Alternatives.");
  await smoothScroll(page, 860, 1200);
  await page.waitForTimeout(2500);

  // Switch persona to Two-Wheeler Commuter
  const commuterPreset = page.locator('button:has-text("Daily Two-Wheeler Commuter")');
  if (await commuterPreset.isVisible()) {
    await commuterPreset.click();
    await page.waitForTimeout(4000);
  }

  // Switch back to Flagship Vulnerable Family
  const familyPreset = page.locator('button:has-text("Vulnerable Urban Family")');
  if (await familyPreset.isVisible()) {
    await familyPreset.click();
    await page.waitForTimeout(4000);
  }

  // Expand scientific reason & impact
  await setCaption(page, "Every recommendation explains the mechanistic 'Why' and hedged impact.");
  const expandBtn = page.locator('button:has-text("Why This Matters")').first();
  if (await expandBtn.isVisible()) {
    await expandBtn.click();
    await page.waitForTimeout(4500);
  }

  // Check Done checkbox to watch progress ring update
  const doneCheckbox = page.locator('button[aria-label^="Mark task"]').first();
  if (await doneCheckbox.isVisible()) {
    await doneCheckbox.click();
    await page.waitForTimeout(3000);
  }

  // Switch to Indoor Air Tab
  const indoorTab = page.locator('button[role="tab"]:has-text("Indoor Air")');
  if (await indoorTab.isVisible()) {
    await indoorTab.click();
    await page.waitForTimeout(3500);
  }

  // Switch to Sustainable Alternatives Tab
  const sustTab = page.locator('button[role="tab"]:has-text("Sustainable Alternatives")');
  if (await sustTab.isVisible()) {
    await sustTab.click();
    await page.waitForTimeout(3500);
  }

  // --- SCENE 5 (1:12 - 1:24): Multi-City Real Sensor Verification (Mumbai) ---
  console.log("▶️ Scene 5: Multi-City Real Sensor Verification - Mumbai (12s)");
  await setCaption(page, "Live multi-city verification: Mumbai real sensor metrics & dynamic advice.");
  await smoothScroll(page, 60, 1000);
  await page.waitForTimeout(1000);

  const mumbaiPill = page.locator('button:has-text("Mumbai")');
  await mumbaiPill.first().click();
  await page.waitForTimeout(6500);

  // --- SCENE 6 (1:24 - 1:36): Deterministic Interactive Tools ---
  console.log("▶️ Scene 6: Interactive Tools (12s)");
  await setCaption(page, "Deterministic tools: Air purifier CADR/ACH adequacy checker & commute exposure.");
  await smoothScroll(page, 950, 1200);

  const toolsTab = page.locator('button[role="tab"]:has-text("Interactive Tools")');
  if (await toolsTab.isVisible()) {
    await toolsTab.click();
    await page.waitForTimeout(2500);

    // Slide room size and CADR
    const cadrSlider = page.locator('#cadr-slider');
    if (await cadrSlider.isVisible()) {
      await cadrSlider.fill("550");
      await page.waitForTimeout(2000);
    }

    // Click commute mode buttons
    const bikeMode = page.getByRole("button", { name: "bike", exact: true });
    if (await bikeMode.isVisible()) {
      await bikeMode.click();
      await page.waitForTimeout(2000);
    }

    const metroMode = page.getByRole("button", { name: "metro", exact: true });
    if (await metroMode.isVisible()) {
      await metroMode.click();
      await page.waitForTimeout(2000);
    }
  }

  // --- SCENE 7 (1:36 - 1:44): Grounded Follow-up AI Chat & WhatsApp Share ---
  console.log("▶️ Scene 7: Grounded AI Follow-up & Share (8s)");
  await setCaption(page, "Grounded AI assistant for family Q&A and 1-click WhatsApp community updates.");
  await smoothScroll(page, 1400, 1000);
  await page.waitForTimeout(1500);

  // Click suggested chip
  const chipBtn = page.getByRole("button", { name: "Can I jog tomorrow morning?" });
  if (await chipBtn.isVisible()) {
    await chipBtn.click();
    await page.waitForTimeout(5000);
  }

  // --- SCENE 8 (1:44 - 1:52): Command Palette, Hindi Language & Dark Mode ---
  console.log("▶️ Scene 8: Hindi Language, Dark Mode & Closing (8s)");
  await setCaption(page, "Open-Meteo data, Gemini 2.5 Flash, rule fallback, and WCAG 2.2 AA accessibility.");
  await smoothScroll(page, 0, 1200);
  await page.waitForTimeout(1000);

  // Toggle Hindi Language
  const langToggle = page.locator('button[aria-label^="Toggle language"]');
  if (await langToggle.isVisible()) {
    await langToggle.click();
    await page.waitForTimeout(3000);
    await langToggle.click(); // revert to English
    await page.waitForTimeout(1200);
  }

  // Toggle Dark Theme
  const themeToggle = page.locator('button[aria-label^="Switch to"]');
  if (await themeToggle.isVisible()) {
    await themeToggle.click();
    await page.waitForTimeout(3500);
  }

  await page.waitForTimeout(2000);

  console.log("⏹️ Closing page & finalizing WebM recording...");
  await page.close();
  await context.close();
  await browser.close();

  // Find recorded WebM file
  const files = fs.readdirSync(RECORDING_DIR).filter((f) => f.endsWith(".webm"));
  if (files.length === 0) {
    throw new Error("No webm video was recorded by Playwright!");
  }

  const latestWebm = path.join(RECORDING_DIR, files[files.length - 1]);
  console.log(`🎥 Raw recording saved at: ${latestWebm}`);

  // Convert to 1080p 30fps MP4 with libx264
  console.log(`⚙️ Converting to 1080p 30fps MP4 with ffmpeg at ${FFMPEG_PATH}...`);
  const ffmpegCmd = `"${FFMPEG_PATH}" -y -i "${latestWebm}" -c:v libx264 -pix_fmt yuv420p -r 30 -an "${OUTPUT_MP4}"`;
  execSync(ffmpegCmd, { stdio: "inherit" });

  // Measure final duration with ffprobe
  console.log(`📏 Measuring final video duration with ffprobe...`);
  const probeCmd = `"${FFPROBE_PATH}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${OUTPUT_MP4}"`;
  const durationOutput = execSync(probeCmd, { encoding: "utf-8" }).trim();
  const durationSeconds = parseFloat(durationOutput);

  console.log(`\n========================================`);
  console.log(`✅ FINAL DEMO VIDEO READY: ${OUTPUT_MP4}`);
  console.log(`⏱️ EXACT DURATION: ${durationSeconds.toFixed(2)} seconds`);
  console.log(`========================================\n`);

  if (durationSeconds < 95 || durationSeconds > 115) {
    console.warn(
      `⚠️ Warning: Video duration (${durationSeconds.toFixed(1)}s) outside target 95-115s range.`
    );
  } else {
    console.log(`🎯 TARGET ACHIEVED: Exact duration (${durationSeconds.toFixed(1)}s) is within the required 95 to 115 seconds range!`);
  }
}

runDemo().catch((err) => {
  console.error("❌ Video recording failed:", err);
  process.exit(1);
});
