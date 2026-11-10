"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ar";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
    lang: "en",
    setLang: () => { },
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>("en");

    useEffect(() => {
        try {
            const saved = localStorage.getItem("carepath-lang");
            if (saved === "ar" || saved === "en") setLangState(saved);
        } catch { }
    }, []);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, [lang]);

    function setLang(l: Lang) {
        setLangState(l);
        try {
            localStorage.setItem("carepath-lang", l);
        } catch { }
    }

    return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);