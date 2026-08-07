# Design Specifications: HH Goa 2026 Frame Generator
## 1. Core Philosophy
The aesthetic is "Premium Developer Brutalism." It rejects standard web UI tropes (no rounded corners, no soft shadows, no gradients) in favor of stark, high-contrast, terminal-inspired minimalism. The interface should feel less like a consumer website and more like a high-end, beautifully typeset IDE or code editor. 
*   **Vibe:** Raw, technical, hyper-fast, premium.
*   **Rule of Thumb:** If a UI element doesn't serve a direct functional purpose, remove it. 
---
## 2. Color Palette
Strictly monochromatic to force focus onto the user's uploaded image and the generated graphic.
*   **Background:** Pure White (`#FFFFFF`)
*   **Foreground / Primary Text:** Pure Black (`#000000`)
*   **Subdued Text / Borders:** Dark Gray (`#333333`)
*   **Error / Alert (Use Sparingly):** Standard Terminal Red (`#FF0000`)
---
## 3. Typography
The entire application relies on typography as its primary design element. Everything must be monospace to enforce the "coding" vibe.
*   **Primary Font Family:** `JetBrains Mono`, `Fira Code`, or `Geist Mono` (sans-serif fallback).
*   **Scale (Oversized):**
    *   **Headers (H1):** `4rem` to `6rem` (Mobile: `2.5rem`). Font-weight: `800` (Extra Bold).
    *   **Body / Inputs:** `1.25rem` to `1.5rem`. Font-weight: `400` (Regular).
    *   **Labels / Meta:** `0.875rem`. Font-weight: `300` (Light).
*   **Styling Rule:** Text should not wrap awkwardly. Keep line lengths controlled.
---
## 4. UI Copy & "Code Vibe" Semantics
Replace traditional UI labels with code syntax. The interface should read like a script execution.
*   **Page Title:** `<App id="hh-goa-26" mode="production" />`
*   **Image Upload Zone:**
    *   *Default:* `// Drop payload here or click to init()`
    *   *Active:* `import { image } from './local-system';`
*   **Input Fields:**
    *   *Name Label:* `const builderName = `
    *   *Role Label:* `let stackRole = `
*   **Format Toggle:**
    *   `format === 'PFP_FRAME' ? render(A) : render(B)`
*   **Buttons:**
    *   *Generate:* `execute.buildCard()`
    *   *Download:* `fs.writeFileSync('badge.png')`
    *   *Share:* `export default toX();`
---
## 5. Component Styling
No shadows. No soft edges. 
*   **Borders:** `1px solid #000000` on all interactive containers.
*   **Corners:** `0px` radius (perfectly sharp right angles).
*   **Input Fields:** No background. Only a thick `2px` black bottom border. When focused, a blinking black cursor block `█` should appear.
*   **Buttons:** 
    *   *Default:* Solid black background (`#000000`), white text (`#FFFFFF`).
    *   *Hover:* Invert colors (White background, black text, `1px solid black` border). Instant transition, no easing animations.
*   **Image Previews:** The canvas area should be framed within a box that looks like an IDE terminal window, complete with top-bar ASCII window controls (e.g., `[ - ] [ + ] [ x ]`).
---
## 6. Layout & Whitespace
*   **Negative Space:** Massive padding. Elements should breathe heavily. Use a minimum of `4rem` gaps between major sections.
*   **Grid:** A strict 12-column CSS grid. The input form occupies the left half (6 cols), and the live preview rendering canvas occupies the right half (6 cols) on desktop. Stack vertically on mobile.
*   **Alignment:** Left-aligned text across the board to mimic how code is written.
---
## 7. Micro-interactions
*   **Typing Effect:** When the page loads, the main H1 header should "type" itself out like a console booting up.
*   **Hover States:** Add a `>` character before list items or toggle options when hovered, mimicking command-line navigation.
*   **Success State:** When an image is successfully downloaded, flash the screen momentarily or display a quick console log output: `> [SUCCESS] Output generated in 42ms.`