"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function LangSwitcher({
  lang,
  onSwitch,
}: {
  lang: "ar" | "en";
  onSwitch: (newLang: "ar" | "en") => void;
}) {
  const router = useRouter();

  function handleSwitch() {
    const newLang = lang === "ar" ? "en" : "ar";
    onSwitch(newLang); // reset the form
    router.push(`/${newLang}`); // navigate
  }

  return (
    <button
      onClick={handleSwitch}
            className={clsx(
        "px-3 py-1 rounded-xl font-semibold shadow-md transition hover:cursor-pointer hover:bg-black bg-emerald-600 text-white",
      )}
    >
      {lang === "ar" ? "English" : "العربية"}
    </button>
  );
}
