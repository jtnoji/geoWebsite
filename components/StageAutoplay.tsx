"use client";

import { useEffect } from "react";

/**
 * Autoplay for the /how-it-works console. Presentation-only, like ScrollReveal:
 * it renders nothing and owns no copy. StageTabs stays a server component that
 * works with JavaScript off, as four radio inputs and :has().
 *
 * On a loaded page the checked stage's bar fills (the `stage-fill` animation in
 * globals.css, which owns the timing), and when it ends this checks the next
 * stage, looping back to the first. It only ever sets `checked`, so the radio
 * group always says which stage is on show.
 *
 * The reader's first click or arrow key on a stage stops autoplay for good, so
 * the console never moves under someone who chose where to look. Setting
 * `checked` from script fires no click or change event, which is how the two
 * are told apart. Keyboard focus inside the console pauses it (CSS), and so do
 * the console leaving the screen and a hidden browser tab. Reduced motion never
 * starts it.
 */
export default function StageAutoplay({ consoleId }: { consoleId: string }) {
  useEffect(() => {
    const found = document.getElementById(consoleId);
    if (!found || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const root: HTMLElement = found;

    const inputs = Array.from(root.querySelectorAll<HTMLInputElement>(".stage-input"));
    if (inputs.length < 2) return;

    const controller = new AbortController();
    const { signal } = controller;
    let onScreen = true;

    const syncPause = () => {
      if (onScreen && document.visibilityState === "visible") {
        delete root.dataset.paused;
      } else {
        root.dataset.paused = "";
      }
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            onScreen = entries[entries.length - 1].isIntersecting;
            syncPause();
          })
        : null;

    const stop = () => {
      controller.abort();
      observer?.disconnect();
      delete root.dataset.autoplay;
      delete root.dataset.paused;
    };

    root.addEventListener(
      "animationend",
      (event) => {
        if (event.animationName !== "stage-fill") return;
        const current = inputs.findIndex((input) => input.checked);
        inputs[(current + 1) % inputs.length].checked = true;
      },
      { signal }
    );

    // A click on a tab's label reaches its input too, and arrow keys fire change.
    const onReader = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.classList.contains("stage-input")) {
        stop();
      }
    };
    root.addEventListener("click", onReader, { signal });
    root.addEventListener("change", onReader, { signal });
    document.addEventListener("visibilitychange", syncPause, { signal });

    observer?.observe(root);
    root.dataset.autoplay = "";
    syncPause();

    return stop;
  }, [consoleId]);

  return null;
}
