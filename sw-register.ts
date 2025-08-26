// app/sw-register.ts
"use client";

import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ Service worker registered"))
        .catch(err => console.error("SW registration failed:", err));
    }
  }, []);

  return null;
}
