**Build a personal quit-vaping web app**

I'm building a personal-use React web app to help me quit vaping using a nicotine patch taper strategy. I don't need community features, social sharing, or generic motivational content. I need something lean, functional, and specific to my actual quit plan. Here are the full requirements — please start by creating a detailed plan before writing any code.

**Tech stack**

* React (Vite)  
* Tailwind CSS  
* Simple password protection on load (hardcoded password, no auth backend needed — this is personal use only)  
* Local state \+ localStorage for persistence  
* No backend required

**My quit plan (hardcode these dates as defaults, but make them editable in settings)**

* Today / app start: March 2, 2026  
* Quit date (throw out vape): March 10, 2026  
* 21mg patch phase: March 10 – April 21, 2026  
* 14mg patch phase: April 21 – May 5, 2026  
* 7mg patch phase: May 5 – May 19, 2026  
* Nicotine free target: May 19, 2026

**Core screens / features**

1. **Dashboard (home screen)**  
   * Current phase displayed prominently (e.g. "Pre-quit: Day 4 of 8" or "21mg Patch: Week 2" or "Nicotine Free: Day 12")  
   * Countdown to next milestone  
   * Craving log button — big, tappable, front and center  
   * Today's stats: cravings logged, cravings that passed  
   * Simple streak display post-quit date  
   * Time last puffed  
2. **Craving flow**  
   * Tap "I'm craving" → starts a 5-minute countdown timer with a progress ring or bar  
   * Timer has a calming visual, maybe a breathing prompt (inhale 4s, hold 4s, exhale 4s)  
   * When timer ends: prompt "Did the craving pass?" → Yes / No / Still going  
   * Log the result silently, no lecturing  
   * Show a small running count: "8 cravings today, 6 passed"  
3. **Medication & patch reminders**  
   * Daily reminder to apply patch (configurable time, default 8am)  
   * Reminder to take any NRT (configurable)  
   * Automatic phase transitions — app knows when to switch patch doses based on the dates above  
   * Visual indicator of current patch dose  
4. **Progress view**  
   * Simple chart: cravings per day over time (should decline visibly)  
   * Days clean post-quit date  
   * Milestones with dates: quit date, each patch step-down, nicotine free — check them off as they pass  
   * No money saved calculator (I don't care about this)  
5. **Settings**  
   * Edit all the key dates  
   * Change password  
   * Reset all data (with confirmation)  
   * Toggle reminders on/off

**Also make this a PWA with the following:**

* `manifest.json` with app name, icons, `display: standalone`, theme color matching the dark UI  
* Service worker for full offline support (cache app shell \+ assets)  
* Web Push API integration for the patch/medication reminders — include the permission request flow  
* "Add to Home Screen" prompt or instructions shown on first load  
* iOS Safari compatibility specifically (not just Chrome Android)  
* Note: push notifications on iOS require the app to be added to the home screen first — handle this gracefully in the UI (detect if running in standalone mode, and if not, show a banner explaining how to add it)

**Design direction**

* Mobile-first (I'll use it on my phone browser)  
* Dark mode by default  
* Clean, minimal — no cartoonish icons or gamification badges  
* Calm color palette — muted blues or greens, nothing aggressive  
* Large touch targets throughout

**Please plan out:**

* Component structure  
* Data model / localStorage schema  
* How phase logic will work (deriving current phase from dates)  
* How the craving timer and logging will work  
* Reminder approach (Web Notifications API or just in-app prompts)  
* Any libraries worth adding (e.g. for the chart, the breathing animation, the countdown ring)  
* File/folder structure
