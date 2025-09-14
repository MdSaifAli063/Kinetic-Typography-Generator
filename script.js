/**
 * Kinetic Typography Generator - script.js
 * - Splits input text into spans
 * - Animates per character using Web Animations API
 * - Supports multiple styles: fadeInUp, flyInLeft, zoomIn, typewriter, decoder
 * - Respects controls: font size, color, duration (per char), stagger
 */

(function () {
  // Element references
  const textInput = document.getElementById("text-input");
  const styleSelect = document.getElementById("animation-style");
  const fontSizeInput = document.getElementById("font-size");
  const colorInput = document.getElementById("text-color");
  const durationInput = document.getElementById("duration");
  const staggerInput = document.getElementById("stagger");
  const animateBtn = document.getElementById("animate-button");
  const canvasContainer = document.getElementById("animation-canvas-container");
  const canvas = document.getElementById("animation-canvas");
  const messageBox = document.getElementById("message-box");

  // Hide the static message box initially
  if (messageBox) messageBox.style.display = "none";

  // Small utility toast
  function toast(message, timeout = 2400) {
    if (!messageBox) return;
    messageBox.textContent = message;
    messageBox.style.display = "block";
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      messageBox.style.display = "none";
    }, timeout);
  }

  // Utility: ensure Web Animations API (most modern browsers support it)
  const supportsWAAPI = !!(Element.prototype.animate);

  // Prepare canvas area
  function resetCanvas() {
    // Cancel any ongoing animations
    Array.from(canvas.getAnimations?.() || []).forEach(a => a.cancel());
    canvas.innerHTML = "";
  }

  // Build spans for each character and append to canvas
  function buildSpansFromText(text, opts) {
    const { color, fontSize } = opts;
    canvas.style.fontSize = `${fontSize}px`;
    canvas.style.color = color;
    canvas.style.whiteSpace = "pre-wrap"; // preserve spaces and newlines
    canvas.style.lineHeight = "1.15";

    const lines = text.split("\n");
    const spans = [];

    lines.forEach((line, li) => {
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        const span = document.createElement("span");
        span.className = "char";
        span.dataset.final = ch;
        // Keep actual space so it wraps nicely, but we keep white-space: pre-wrap on container
        span.textContent = ch === " " ? " " : ch;
        span.style.display = "inline-block";
        span.style.opacity = "0"; // start hidden, reveal via animations
        canvas.appendChild(span);
        spans.push(span);
      }
      if (li < lines.length - 1) {
        // Add a line break between lines
        const br = document.createElement("br");
        canvas.appendChild(br);
      }
    });

    return spans;
  }

  // Animation styles using Web Animations API

  function animateFadeInUp(spans, duration, stagger) {
    const keyframes = [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" }
    ];
    return Promise.all(
      spans.map((span, i) =>
        span.animate(keyframes, {
          duration,
          delay: i * stagger,
          easing: "cubic-bezier(0.2, 0.7, 0.2, 1.0)",
          fill: "both"
        }).finished
      )
    );
  }

  function animateFlyInLeft(spans, duration, stagger) {
    const keyframes = [
      { opacity: 0, transform: "translateX(-30px)" },
      { opacity: 1, transform: "translateX(0)" }
    ];
    return Promise.all(
      spans.map((span, i) =>
        span.animate(keyframes, {
          duration,
          delay: i * stagger,
          easing: "cubic-bezier(0.2, 0.7, 0.2, 1.0)",
          fill: "both"
        }).finished
      )
    );
  }

  function animateZoomIn(spans, duration, stagger) {
    const keyframes = [
      { opacity: 0, transform: "scale(0.6)" },
      { opacity: 1, transform: "scale(1)" }
    ];
    return Promise.all(
      spans.map((span, i) =>
        span.animate(keyframes, {
          duration,
          delay: i * stagger,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "both"
        }).finished
      )
    );
  }

  // Typewriter effect: reveal characters one by one
  function animateTypewriter(spans, duration, stagger) {
    // duration here is per character blink-in time; stagger controls per-char delay
    const promises = spans.map((span, i) => {
      return new Promise(resolve => {
        const delay = i * stagger;
        const timer = setTimeout(() => {
          // Simple pop-in
          if (supportsWAAPI) {
            span.animate(
              [
                { opacity: 0, transform: "translateY(-0.2em)" },
                { opacity: 1, transform: "translateY(0)" }
              ],
              { duration: Math.max(120, Math.min(duration, 600)), fill: "both", easing: "ease-out" }
            ).finished.then(resolve).catch(resolve);
          } else {
            span.style.opacity = "1";
            resolve();
          }
        }, delay);
        // Store timer to clear if needed in future (not used now)
        span._twTimer = timer;
      });
    });
    return Promise.all(promises);
  }

  // Decoder (scramble) effect
  function animateDecoder(spans, duration, stagger) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const scrambleSteps = Math.max(6, Math.min(24, Math.floor(duration / 30))); // responsive to duration
    const promises = spans.map((span, i) => {
      const finalChar = span.dataset.final;
      // Don't scramble spaces; just fade them in
      const isSkippable = finalChar.trim().length === 0;
      return new Promise(resolve => {
        const startDelay = i * stagger;
        const startTime = performance.now() + startDelay;
        let step = 0;
        let rafId;

        function tick(now) {
          if (now < startTime) {
            rafId = requestAnimationFrame(tick);
            return;
          }
          if (isSkippable) {
            span.style.opacity = "1";
            resolve();
            return;
          }
          if (step < scrambleSteps) {
            // Show random char
            const rand = charset[Math.floor(Math.random() * charset.length)];
            span.textContent = rand;
            span.style.opacity = "1";
            step++;
            rafId = requestAnimationFrame(tick);
          } else {
            // Settle on final char with a small pop
            span.textContent = finalChar;
            if (supportsWAAPI) {
              span.animate(
                [
                  { transform: "scale(1.15)", offset: 0 },
                  { transform: "scale(1.0)", offset: 1 }
                ],
                { duration: 120, easing: "ease-out", fill: "both" }
              ).finished.finally(resolve);
            } else {
              resolve();
            }
          }
        }
        rafId = requestAnimationFrame(tick);
        span._decoderRAF = rafId;
      });
    });
    return Promise.all(promises);
  }

  // Main runner
  async function runAnimation() {
    const text = (textInput.value || "").replace(/\r/g, "");
    const style = styleSelect.value;
    const fontSize = clamp(parseInt(fontSizeInput.value, 10) || 48, 8, 250);
    const color = colorInput.value || "#000000";
    const duration = clamp(parseInt(durationInput.value, 10) || 500, 50, 4000);
    const stagger = clamp(parseInt(staggerInput.value, 10) || 60, 0, 1000);

    if (!text.trim()) {
      toast("Please enter some text to animate.");
      return;
    }

    animateBtn.disabled = true;
    animateBtn.style.pointerEvents = "none";
    toast("Animating...");

    resetCanvas();
    const spans = buildSpansFromText(text, { color, fontSize });

    try {
      switch (style) {
        case "fadeInUp":
          await animateFadeInUp(spans, duration, stagger);
          break;
        case "flyInLeft":
          await animateFlyInLeft(spans, duration, stagger);
          break;
        case "zoomIn":
          await animateZoomIn(spans, duration, stagger);
          break;
        case "typewriter":
          await animateTypewriter(spans, duration, stagger);
          break;
        case "decoder":
          await animateDecoder(spans, duration, stagger);
          break;
        default:
          await animateFadeInUp(spans, duration, stagger);
      }
      toast("Done!");
    } catch (e) {
      console.error(e);
      toast("Something went wrong while animating.");
    } finally {
      animateBtn.disabled = false;
      animateBtn.style.pointerEvents = "";
    }
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  // Wire up events
  animateBtn.addEventListener("click", runAnimation);

  // Optional: Enter/Ctrl+Enter to animate inside textarea
  textInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
      runAnimation();
    }
  });

  // Auto-run once on load with default values (if any)
  window.addEventListener("load", () => {
    if (textInput.value.trim().length) {
      runAnimation();
    }
  });
})();