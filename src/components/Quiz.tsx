"use client";

import { useMemo, useState } from "react";
import type { LanguageCopy, QuizOption, QuizQuestion } from "@/data/quizzes";

type QuizProps = {
  copy: LanguageCopy;
};

type AnswerRecord = {
  questionId: string;
  prompt: string;
  selectedOption: QuizOption;
  wasCorrect: boolean;
};

const formatProgress = (
  template: string,
  current: number,
  total: number
): string =>
  template.replace("{{current}}", current.toString()).replace(
    "{{total}}",
    total.toString()
  );

export function Quiz({ copy }: QuizProps) {
  const totalQuestions = copy.questions.length;
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [completed, setCompleted] = useState(false);

  const currentQuestion: QuizQuestion = useMemo(
    () => copy.questions[currentIndex],
    [copy.questions, currentIndex]
  );

  const selectedOption =
    selectedIndex !== null ? currentQuestion.options[selectedIndex] : null;

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleStart = () => {
    setStarted(true);
  };

  const handleSelect = (index: number) => {
    if (isChecked) {
      return;
    }
    setSelectedIndex(index);
  };

  const handleCheck = () => {
    if (selectedOption == null || isChecked) {
      return;
    }
    const wasCorrect = selectedOption.isCorrect;
    if (wasCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswers((prev) => {
      const next = prev.filter((entry) => entry.questionId !== currentQuestion.id);
      next.push({
        questionId: currentQuestion.id,
        prompt: currentQuestion.prompt,
        selectedOption,
        wasCorrect
      });
      return next;
    });
    setIsChecked(true);
  };

  const handleNext = () => {
    if (!isChecked) {
      return;
    }
    if (isLastQuestion) {
      setCompleted(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
    setIsChecked(false);
  };

  const handleRestart = () => {
    setStarted(false);
    setCompleted(false);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsChecked(false);
    setScore(0);
    setAnswers([]);
  };

  if (!started) {
    return (
      <div className="quiz-container">
        <div className="card">
          <h2>{copy.quizTitle}</h2>
          <p>{copy.quizSubtitle}</p>
          <button className="primary-button" onClick={handleStart}>
            {copy.startButton}
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    const sortedAnswers = [...answers].sort(
      (a, b) => copy.questions.findIndex((q) => q.id === a.questionId) -
        copy.questions.findIndex((q) => q.id === b.questionId)
    );
    return (
      <div className="quiz-container">
        <div className="card result-panel">
          <h2>{copy.resultTitle}</h2>
          <p>{copy.resultDescription}</p>
          <div className="result-panel__score">
            {score}/{totalQuestions}
          </div>
          <button className="primary-button" onClick={handleRestart}>
            {copy.retryButton}
          </button>
        </div>
        <div className="card result-panel">
          <h3>{copy.explanationHeading}</h3>
          <div className="result-list">
            {sortedAnswers.map((answer) => (
              <div key={answer.questionId} className="result-item">
                <div className="result-item__question">{answer.prompt}</div>
                <div
                  className={`feedback__status ${
                    answer.wasCorrect
                      ? "feedback__status--correct"
                      : "feedback__status--incorrect"
                  }`}
                >
                  {answer.wasCorrect ? copy.correctLabel : copy.incorrectLabel}
                </div>
                <div className="result-item__explanation">
                  {answer.selectedOption.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>{copy.resourcesHeading}</h3>
          <div className="resources">
            {copy.resources.map((resource) => (
              <a
                key={resource.href}
                className="resource-item"
                href={resource.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="resource-item__title">{resource.title}</span>
                <span className="resource-item__description">
                  {resource.description}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="card quiz-question">
        <div className="quiz-progress">
          {formatProgress(
            copy.questionProgress,
            currentIndex + 1,
            totalQuestions
          )}
        </div>
        <h3>{currentQuestion.prompt}</h3>
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const statusClass =
              isChecked && option.isCorrect
                ? "correct"
                : isChecked && isSelected && !option.isCorrect
                ? "incorrect"
                : "";
            return (
              <button
                key={option.text}
                type="button"
                className={`quiz-option ${statusClass}`}
                aria-pressed={isSelected}
                onClick={() => handleSelect(index)}
                disabled={isChecked}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        {isChecked ? (
          <div className="feedback">
            <div
              className={`feedback__status ${
                selectedOption?.isCorrect
                  ? "feedback__status--correct"
                  : "feedback__status--incorrect"
              }`}
            >
              {selectedOption?.isCorrect
                ? copy.correctLabel
                : copy.incorrectLabel}
            </div>
            <p>
              {selectedOption?.isCorrect
                ? copy.correctMessage
                : copy.incorrectMessage}
            </p>
            <p>{selectedOption?.explanation}</p>
          </div>
        ) : (
          <p>{copy.selectOption}</p>
        )}
        <div className="quiz-actions">
          {!isChecked ? (
            <button
              className="primary-button"
              onClick={handleCheck}
              disabled={selectedIndex === null}
            >
              {copy.checkButton}
            </button>
          ) : (
            <button className="primary-button" onClick={handleNext}>
              {isLastQuestion ? copy.finishButton : copy.nextButton}
            </button>
          )}
          <button className="ghost-button" onClick={handleRestart}>
            {copy.retryButton}
          </button>
        </div>
      </div>
    </div>
  );
}
