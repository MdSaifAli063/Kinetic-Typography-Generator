# Kinetic Typography Generator ✨

Animate any text with beautiful per-character effects directly in the browser.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 🎯 Features

- 🎞️ Per-character animations using the Web Animations API (WAAPI)
- 🧩 Multiple styles: Fade In Up, Fly In Left, Decoder, Typewriter, Zoom In
- 🎛️ Live controls for font size, color, duration and stagger delay
- 🧵 Preserves line breaks and spacing
- 💡 Keyboard shortcut: Cmd/Ctrl + Enter to animate
- 🍬 Clean, modern UI with pastel theme (light blue + light orange)
- 🔔 Toast messages to confirm actions

---

## 🚀 Quick Start

- Option 1: Double-click index.html to open in your browser
- Option 2: Serve locally (recommended for best results):
  - VS Code: use the Live Server extension
  - Node: npx http-server . -p 5173

Then open http://localhost:5173 (or the port you used).

---

## 📂 Project Structure


. ├── index.html # App markup (UI + controls + canvas) ├── style.css # Theme and layout styles ├── script.js # Animation logic and interactivity └── README.md # This file


---

## 🖱️ How to Use

1. Type your text in “Text to Animate”
2. Choose an “Animation Style”
3. Adjust:
   - Font Size (px)
   - Text Color
   - Char Duration (ms)
   - Stagger Delay (ms)
4. Click “Animate Text” or press Cmd/Ctrl + Enter

The animated result appears in the canvas area below the button.

---

## 🧩 Animation Styles

- Fade In Up: characters rise gently with a fade
- Fly In From Left: characters slide in from the left
- Decoder Effect: characters scramble before resolving
- Typewriter: characters pop in sequentially
- Zoom In: characters scale up to full size

---

## 🎛️ Controls Explained

- Font Size (px): sets the base size of the animated text
- Text Color: applies color to the text (you can override per character in JS if desired)
- Char Duration (ms): animation length per character (e.g., 500 ms)
- Stagger Delay (ms): delay between characters to create a cascading effect

Tip: Larger text often looks better with a slightly longer duration and stagger.

---

## ⌨️ Shortcuts

- Cmd/Ctrl + Enter: Run the current animation

---

## 🧰 Customization

### Theme colors

Colors are defined as CSS variables in style.css:
```css
:root {
  --bg-blue: #e7f3ff;
  --bg-orange: #fff2e6;
  --accent-blue: #56b4ff;
  --accent-orange: #ffb36b;
}


Adjust these to match your brand or preference.

Toast position (bottom-center)
If you want the message box pinned to the bottom center, ensure these overrides are at the end of style.css:

#message-box {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  max-width: min(720px, calc(100% - 48px));
  width: fit-content;
}
@media (max-width: 720px) {
  #message-box { left: 16px; right: 16px; transform: none; bottom: 16px; }
}


Add a new animation style
Add a new function in script.js following the existing pattern, then register it in the switch block:

function animateBounce(spans, duration, stagger) {
  const keyframes = [
    { opacity: 0, transform: "translateY(-20px) scale(0.9)" },
    { opacity: 1, transform: "translateY(0) scale(1)" }
  ];
  return Promise.all(
    spans.map((span, i) => span.animate(keyframes, {
      duration, delay: i * stagger, easing: "cubic-bezier(.2,.8,.2,1)", fill: "both"
    }).finished)
  );
}
// In runAnimation() switch: case "bounce": await animateBounce(...); break;


🧪 Browser Support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari)
Uses the Web Animations API; most current browsers support it. If unavailable, effects gracefully degrade.

🐞 Troubleshooting

No animation?
Ensure you entered non-empty text
Try a smaller duration/stagger for more responsive feel
Check browser console for errors
Color not updating?
script.js sets color on the canvas container; per-character overrides require custom JS

🙏 Credits

UI font: Poppins (Google Fonts)
Animations: Web Animations API
Badges: shields.io

📜 License

MIT © Your Name

