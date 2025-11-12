"use client";

import { useState } from "react";
import { QUIZ_CONTENT, type LanguageCode } from "@/data/quizzes";
import { Quiz } from "@/components/Quiz";

export function QuizExperience() {
  const [language, setLanguage] = useState<LanguageCode>("ru");
  const copy = QUIZ_CONTENT[language];

  return (
    <div className="app-shell">
      <header className="card hero">
        <span className="hero__badge">{copy.heroBadge}</span>
        <h1 className="hero__title">{copy.heroTitle}</h1>
        <p className="hero__subtitle">{copy.heroSubtitle}</p>
        <div className="language-switcher" role="group">
          <button
            type="button"
            aria-pressed={language === "ru"}
            onClick={() => setLanguage("ru")}
          >
            {copy.languageRu}
          </button>
          <button
            type="button"
            aria-pressed={language === "uk"}
            onClick={() => setLanguage("uk")}
          >
            {copy.languageUk}
          </button>
        </div>
      </header>
      <Quiz key={language} copy={copy} />
    </div>
  );
}
