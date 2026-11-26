# AirWise India — Verified Codebase Features & UI Selectors

> **Inspection Date:** 2026-11-27  
> **Source Inspection:** Verified directly against `src/` codebase, components, API endpoints, and live running instance on port 3001.

---

## 1. Verified Core Features Matrix

| Feature | Verified in Code | Exact UI Label / Text | Selector / Test ID / Role |
| :--- | :--- | :--- | :--- |
| **Onboarding Wizard** | ✅ YES (`OnboardingWizard.tsx`) | `"Select Your City"`, `"Your Household Context"`, `"Appliances & Commute"` | `div[role="dialog"][aria-labelledby="onboarding-title"]`, Buttons: `"Next Step"`, `"Back"`, `"Get My Personalized Plan"`, `"Skip Setup"` |
| **City Search & Autocomplete** | ✅ YES (`LocationSearch.tsx`) | Placeholder: `"Search Indian city (e.g. Noida, Delhi, Mumbai, Patna)..."` | Input: `#city-search-input`, Combobox dropdown: `#city-search-list` |
| **Popular City Chips** | ✅ YES (`LocationSearch.tsx`) | `"Delhi (NCR)"`, `"Noida"`, `"Gurugram"`, `"Mumbai"`, `"Kolkata"`, `"Bengaluru"` | `section[aria-label="City and Location Selector"] button` |
| **Use My Location** | ✅ YES (`LocationSearch.tsx`) | `"Use My Location"`, loading: `"Locating..."` | `button:has-text("Use My Location")` |
| **Hero AQI Radial Gauge** | ✅ YES (`AirQualityRadialGauge.tsx`) | Meter role with numeric AQI, `"CPCB AQI"`, category emoji | `div[role="meter"]`, SVG arc track |
| **PM2.5 / PM10 Tiles** | ✅ YES (`AirQualityHero.tsx`) | `"PM 2.5"`, `"PM 10"`, `"US AQI"` | `span:has-text("PM 2.5") + div > span.text-2xl` |
| **Data Source & IST Timestamp** | ✅ YES (`AirQualityHero.tsx`) | `"Source: Open-Meteo CAMS Atmospheric Composition Model"`, `"Measured: [date] IST"` | `div:has-text("Source:")`, `div:has-text("Measured:")` |
| **24-Hour Forecast Chart** | ✅ YES (`ForecastChart.tsx`) | `"24-Hour Air Quality Forecast"`, `"Optimal Outdoor Window"`, `"High Exposure Window"` | `section[aria-label="24-Hour Air Quality Forecast Chart"]`, Recharts container |
| **Text Table View Toggle** | ✅ YES (`ForecastChart.tsx`) | `"Text Table View"` / `"Show Visual Chart"` | `button:has-text("Text Table View")`, `table` |
| **Health Advisory Banner** | ✅ YES (`HealthAdvisoryBanner.tsx`) | Severity alert badge, headline, summary, disclaimer: `"⚠️ Informational guidance only. Not medical advice."` | `section[aria-label="Health Advisory Summary"]` |
| **Household Persona Presets** | ✅ YES (`PersonaSelector.tsx`) | `"Vulnerable Urban Family (Children & Elderly)"` (Flagship), `"Daily Two-Wheeler Commuter"`, `"Asthma & Respiratory Patient"`, `"Student & Hostel Resident"` | `section[aria-label="Target Household Persona Selector"] button` |
| **Profile Attribute Modal** | ✅ YES (`ProfileModal.tsx`) | `"Household Vulnerability Profile"`, Checkboxes: Young children, Seniors, Respiratory sensitivity, Students | `div[role="dialog"][aria-labelledby="profile-modal-title"]` |
| **Commute Mode Selector** | ✅ YES (`ProfileModal.tsx`) | Metro, Bike, Bus, Car, Walk, Auto-Rickshaw, WFH | `select#commute-mode-select` |
| **3 Guidance Pillars** | ✅ YES (`GuidanceSectionView.tsx`) | Tabs: `"All Guidance"`, `"Daily Routines"`, `"Indoor Air Quality"`, `"Sustainable Alternatives"`, `"Interactive Tools"` | `button[role="tab"]` |
| **Why This Matters / Impact** | ✅ YES (`GuidanceCardItem.tsx`) | Toggle: `"🔬 Why This Matters & ✨ Expected Impact"` | `button:has-text("Why This Matters")` |
| **Done Checkbox & Progress Ring** | ✅ YES (`GuidanceCardItem.tsx` & `GuidanceSectionView.tsx`) | Checkbox button: `"Mark Done"` / `"Done"`, Ring: `"X of Y tasks completed today"` | `button[aria-label^="Mark task"]`, Progress ring circle |
| **Purifier CADR / ACH Check** | ✅ YES (`InteractiveTools.tsx`) | `"Air Purifier CADR & Room Size Check"`, sliders: Room sq ft, CADR | `#room-size-slider`, `#cadr-slider`, text: `"ACH"` |
| **What-If Commute Simulator** | ✅ YES (`InteractiveTools.tsx`) | `"What-If Commute Exposure Calculator"` | Buttons: `"metro"`, `"car"`, `"bike"`, `"bus"`, `"walk"` |
| **Safe Exposure Window** | ✅ YES (`InteractiveTools.tsx`) | `"Safe Outdoor Exposure Window"` | `div:has-text("Safe Outdoor Duration:")` |
| **Compare Cities Mini-View** | ✅ YES (`CompareCitiesView.tsx`) | `"Compare Metros"` / `"Hide Comparison"` | `button:has-text("Compare Metros")`, cards for Delhi, Mumbai, Bengaluru, Kolkata |
| **Ask Follow-Up Chat** | ✅ YES (`AskFollowUpChat.tsx`) | `"Ask AirWise Follow-Up"`, Input: `#followup-chat-input`, Button: `"Ask AI"` | `#followup-chat-input`, `button:has-text("Ask AI")`, suggested chips |
| **Share Summary Modal** | ✅ YES (`ShareSummaryModal.tsx`) | Header button: `"Share"`, Modal buttons: `"Copy Summary"`, `"Share to WhatsApp Family Group"` | `button:has-text("Share")`, `div[role="dialog"][aria-labelledby="share-modal-title"]` |
| **Hindi Language Toggle** | ✅ YES (`Header.tsx` & `translations.ts`) | Toggle button: `"हिं"` $\leftrightarrow$ `"EN"` | `button[aria-label^="Toggle language"]` |
| **Dark Mode Toggle** | ✅ YES (`Header.tsx`) | Sun / Moon icon button | `button[aria-label^="Switch to"]` |
| **Command Palette** | ✅ YES (`CommandPalette.tsx`) | Quick switcher modal (Ctrl+K or Header icon) | `div[role="dialog"][aria-labelledby="command-palette-title"]` |
| **Engine Status Indicator** | ✅ YES (`Header.tsx`) | Badge displaying `"Gemini AI"` or `"Rule Engine"` | `div:has-text("Gemini AI")`, `div:has-text("Rule Engine")` |

---

## 2. Live API Availability Check
- **Delhi (28.6139°N, 77.209°E)**: ✅ Responded 200 OK — AQI 313 (Very Poor), PM2.5: 136.9 µg/m³, Source: Open-Meteo CAMS Model.
- **Mumbai (19.076°N, 72.8777°E)**: ✅ Responded 200 OK — AQI 107 (Moderate), PM2.5: 64.8 µg/m³, Source: Open-Meteo CAMS Model.
