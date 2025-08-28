"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

interface TriviaQuestion {
  category: string;
  question: string;
  correct_answer: string;
}

type GameState = "start" | "playing" | "gameover" | "loading" | "leaderboard" | "save-score";

const GAME_DURATION = 60;

const CUSTOM_QUESTIONS: TriviaQuestion[] = [
  // Everyday Life & Quirks (1-25)
  { category: "Everyday Life & Quirks", question: "Who is more likely to lose their phone?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who takes longer showers?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who drinks more coffee?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to talk to themselves while doing chores?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to sing along to the radio?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to binge-watch a TV show?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to forget to charge their phone?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to have a secret snack stash?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to lock themselves out of the house?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to say \"let's go out to eat\"?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to rearrange furniture randomly?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who spends more time scrolling social media?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to clean when stressed?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who tells longer stories?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to leave cabinets open after getting something?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who always knows where everything is at home?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to text back faster?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who gets hangry more often?", correct_answer: "Lily" },
  { category: "Everyday Life & Quirks", question: "Who is on their phone more?", correct_answer: "Isaac" },
  { category: "Everyday Life & Quirks", question: "Who is more likely to fall asleep during a movie?", correct_answer: "Lily" },
  
  // Personality & Habits (26-50)
  { category: "Personality & Habits", question: "Who laughs at their own jokes more?", correct_answer: "Isaac" },
  { category: "Personality & Habits", question: "Who is more likely to check if the door is locked three times?", correct_answer: "Lily" },
  { category: "Personality & Habits", question: "Who is more likely to plan things weeks in advance?", correct_answer: "Lily" },
  { category: "Personality & Habits", question: "Who is more likely to wing it?", correct_answer: "Isaac" },
  { category: "Personality & Habits", question: "Who is better at remembering people's names?", correct_answer: "Lily" },
  { category: "Personality & Habits", question: "Who is more likely to cry at commercials?", correct_answer: "Lily" },
  { category: "Personality & Habits", question: "Who is more patient?", correct_answer: "Isaac" },
  { category: "Personality & Habits", question: "Who is more talkative?", correct_answer: "Lily" },
  { category: "Personality & Habits", question: "Who is more likely to start a group chat?", correct_answer: "Isaac" },
  { category: "Personality & Habits", question: "Who is more likely to lose their wallet?", correct_answer: "Isaac" },
  { category: "Personality & Habits", question: "Who is more competitive at games?", correct_answer: "Isaac" },
  { category: "Personality & Habits", question: "Who is more stubborn?", correct_answer: "Lily" },
  { category: "Personality & Habits", question: "Who is more likely to snack late at night?", correct_answer: "Lily" },
  { category: "Personality & Habits", question: "Who is more likely to befriend strangers at a party?", correct_answer: "Lily" },
  
  // Adventures & Travel (51-75)
  { category: "Adventures & Travel", question: "Who packs more for trips?", correct_answer: "Lily" },
  { category: "Adventures & Travel", question: "Who is more likely to forget their toothbrush?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to get motion sick?", correct_answer: "Lily" },
  { category: "Adventures & Travel", question: "Who is more likely to sleep on the plane?", correct_answer: "Lily" },
  { category: "Adventures & Travel", question: "Who is more likely to take pictures of everything?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to book the Airbnb?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to get excited about local food?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to want to try bungee jumping?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to get sunburned on day one?", correct_answer: "Lily" },
  { category: "Adventures & Travel", question: "Who is more likely to forget sunscreen?", correct_answer: "Lily" },
  { category: "Adventures & Travel", question: "Who is more likely to make a travel spreadsheet?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to want to sleep in on vacation?", correct_answer: "Lily" },
  { category: "Adventures & Travel", question: "Who is more likely to want to extend the trip?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to find the \"hidden gem\" restaurant?", correct_answer: "Isaac" },
  { category: "Adventures & Travel", question: "Who is more likely to get lost even with GPS?", correct_answer: "Lily" },
  { category: "Adventures & Travel", question: "Who is more likely to fall asleep in the passenger seat within 10 minutes?", correct_answer: "Lily" },
  
  // Love & Relationship (76-100)
  { category: "Love & Relationship", question: "Who was more nervous on the first date?", correct_answer: "Isaac" },
  { category: "Love & Relationship", question: "Who said \"I love you\" first?", correct_answer: "Lily" },
  { category: "Love & Relationship", question: "Who is more likely to plan a surprise date?", correct_answer: "Isaac" },
  { category: "Love & Relationship", question: "Who remembers anniversaries better?", correct_answer: "Lily" },
  { category: "Love & Relationship", question: "Who is more affectionate in public?", correct_answer: "Lily" },
  { category: "Love & Relationship", question: "Who is more likely to win an argument with pure stubbornness?", correct_answer: "Lily" },
  { category: "Love & Relationship", question: "Who gives in first after a fight?", correct_answer: "Isaac" },
  { category: "Love & Relationship", question: "Who is the better gift giver?", correct_answer: "Isaac" },
  { category: "Love & Relationship", question: "Who is more likely to apologize even when they're right?", correct_answer: "Isaac" },
  { category: "Love & Relationship", question: "Who hogs the blankets?", correct_answer: "Lily" },
  { category: "Love & Relationship", question: "Who eats more candy?", correct_answer: "Isaac" },
  { category: "Love & Relationship", question: "Who is more likely to laugh during serious moments?", correct_answer: "Isaac" },
  { category: "Love & Relationship", question: "Who is more likely to sing along at a concert?", correct_answer: "Lily" },
  { category: "Love & Relationship", question: "Who is more likely to be on the dance floor all night?", correct_answer: "Lily" },
  { category: "Love & Relationship", question: "Who is more likely to sneak cake before the reception?", correct_answer: "Isaac" },
];

const GamePage = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [initials, setInitials] = useState("");
  const [allAnswers, setAllAnswers] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [copied, setCopied] = useState(false);

  const addScore = useMutation(api.gameScores.addScore);
  const topScores = useQuery(api.gameScores.getTopScores, { limit: 10 });

  const fetchQuestions = async () => {
    try {
      // Shuffle the custom questions and take a random subset
      const shuffledQuestions = [...CUSTOM_QUESTIONS].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      return true;
    } catch (error) {
      console.error("Failed to load questions:", error);
      return false;
    }
  };

  const shuffleAnswers = (question: TriviaQuestion) => {
    const answers = ["Lily", "Isaac"];
    return answers; // Always keep Lily on top, Isaac on bottom
  };

  const startGame = async () => {
    setGameState("loading");
    const success = await fetchQuestions();
    if (success) {
      setGameState("playing");
      setScore(0);
      setCurrentQuestionIndex(0);
      setTimeLeft(GAME_DURATION);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      alert("Failed to load questions. Please try again.");
      setGameState("start");
    }
  };

  const selectAnswer = (answer: string) => {
    if (selectedAnswer || showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestionIndex]?.correct_answer) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 400);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      endGame();
    }
  };

  const endGame = useCallback(async () => {
    setGameState("save-score");
  }, []);

  const resetGame = () => {
    setGameState("start");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setSelectedAnswer(null);
    setShowResult(false);
    setInitials("");
    setStreak(0);
    setCopied(false);
  };

  const saveScore = async () => {
    if (initials.trim()) {
      try {
        await addScore({ initials: initials.trim(), score });
        setGameState("gameover");
      } catch (error) {
        console.error("Failed to save score:", error);
        setGameState("gameover");
      }
    } else {
      setGameState("gameover");
    }
  };

  const skipSave = () => {
    setGameState("gameover");
  };

  const copyScore = async () => {
    const text = `I got ${score} questions right on Lily and Isaac's trivia, try it at lilyandisaac.com`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === "playing" && timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, endGame]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      setAllAnswers(shuffleAnswers(questions[currentQuestionIndex]));
    }
  }, [currentQuestionIndex, questions]);

  // No need to decode HTML since we're using plain text questions

  const currentQuestion = questions[currentQuestionIndex];

  if (gameState === "start") {
    return (
      <main className="grid min-h-screen grid-cols-1 content-center justify-items-center gap-8 px-6 py-16 text-center">
        <div className="mb-4">
          <Link 
            href="/"
            className="text-sm text-[color:rgba(15,17,19,0.6)] hover:text-[color:var(--deco-gold)] transition-colors"
          >
            ← Back to Wedding
          </Link>
        </div>
        
        <h1 className="text-4xl font-serif leading-tight text-[color:var(--deco-ink)] sm:text-5xl md:text-6xl">
          Wedding Trivia
        </h1>
        
        <p className="max-w-md text-[color:rgba(15,17,19,0.7)]">
          How many questions can you answer correctly in 60 seconds?
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={startGame}
            className="px-8 py-4 bg-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.9)] transition-colors text-lg"
          >
            Start Game
          </button>
          
          <button
            onClick={() => setGameState("leaderboard")}
            className="px-8 py-4 border border-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.1)] transition-colors text-lg"
          >
            Leaderboard
          </button>
        </div>
      </main>
    );
  }

  if (gameState === "loading") {
    return (
      <main className="grid min-h-screen grid-cols-1 content-center justify-items-center gap-6 px-6 py-16 text-center">
        <div className="text-2xl text-[color:var(--deco-ink)]">Loading questions...</div>
      </main>
    );
  }

  if (gameState === "playing" && currentQuestion) {
    return (
      <main className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-lg font-semibold text-[color:var(--deco-ink)]">
              Score: {score}
            </div>
            {streak >= 2 && (
              <div className="text-lg font-semibold text-[color:var(--deco-gold)]">
                🔥 {streak} streak!
              </div>
            )}
            <div className="text-lg font-semibold text-[color:var(--deco-ink)]">
              Time: {timeLeft}s
            </div>
          </div>

          <div className="deco-card mb-8 p-6 rounded-2xl">
            <div className="mb-4 text-sm uppercase tracking-wide text-[color:rgba(15,17,19,0.6)]">
              {currentQuestion.category}
            </div>
            <h2 className="text-xl font-medium text-[color:var(--deco-ink)] leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {allAnswers.map((answer, index) => {
              let buttonClass = "p-4 text-left rounded-xl border transition-colors ";
              
              if (showResult) {
                if (answer === currentQuestion.correct_answer) {
                  buttonClass += "border-green-500 bg-green-100 text-green-800";
                } else if (answer === selectedAnswer) {
                  buttonClass += "border-red-500 bg-red-100 text-red-800";
                } else {
                  buttonClass += "border-[color:rgba(212,175,55,0.3)] bg-[color:rgba(212,175,55,0.05)] text-[color:rgba(15,17,19,0.5)]";
                }
              } else {
                buttonClass += "border-[color:rgba(212,175,55,0.3)] bg-[color:rgba(212,175,55,0.05)] text-[color:var(--deco-ink)] hover:border-[color:var(--deco-gold)] hover:bg-[color:rgba(212,175,55,0.1)]";
              }

              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(answer)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  {answer}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  if (gameState === "save-score") {
    return (
      <main className="grid min-h-screen grid-cols-1 content-center justify-items-center gap-8 px-6 py-16 text-center">
        <h1 className="text-4xl font-serif leading-tight text-[color:var(--deco-ink)] sm:text-5xl">
          Great Job!
        </h1>
        
        <div className="deco-card p-8 rounded-2xl">
          <div className="text-3xl font-semibold text-[color:var(--deco-gold)] mb-2">
            {score}
          </div>
          <div className="text-lg text-[color:var(--deco-ink)]">
            Questions Correct
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[color:rgba(15,17,19,0.7)]">
            Want to save your score to the leaderboard?
          </p>
          
          <input
            type="text"
            placeholder="Enter your initials"
            value={initials}
            onChange={(e) => setInitials(e.target.value.slice(0, 3))}
            className="px-4 py-2 border border-[color:var(--deco-gold)] rounded-xl bg-[color:rgba(212,175,55,0.05)] text-center uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--deco-gold)]"
            maxLength={3}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={saveScore}
            className="px-6 py-3 bg-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.9)] transition-colors"
          >
            Save Score
          </button>
          
          <button
            onClick={skipSave}
            className="px-6 py-3 border border-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.1)] transition-colors"
          >
            Skip
          </button>
        </div>
      </main>
    );
  }

  if (gameState === "leaderboard") {
    return (
      <main className="grid min-h-screen grid-cols-1 content-start justify-items-center gap-8 px-6 py-16 text-center">
        <div className="mb-4">
          <button 
            onClick={() => setGameState("start")}
            className="text-sm text-[color:rgba(15,17,19,0.6)] hover:text-[color:var(--deco-gold)] transition-colors"
          >
            ← Back
          </button>
        </div>
        
        <h1 className="text-4xl font-serif leading-tight text-[color:var(--deco-ink)] sm:text-5xl">
          Leaderboard
        </h1>
        
        <div className="w-full max-w-md space-y-3">
          {topScores && topScores.length > 0 ? (
            topScores.map((scoreEntry, index) => (
              <div key={scoreEntry._id} className="deco-card p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold text-[color:var(--deco-gold)] w-8">
                    #{index + 1}
                  </div>
                  <div className="text-lg font-semibold text-[color:var(--deco-ink)]">
                    {scoreEntry.initials}
                  </div>
                </div>
                <div className="text-lg font-semibold text-[color:var(--deco-ink)]">
                  {scoreEntry.score}
                </div>
              </div>
            ))
          ) : (
            <div className="text-[color:rgba(15,17,19,0.6)]">
              No scores yet. Be the first to play!
            </div>
          )}
        </div>

        <button
          onClick={() => setGameState("start")}
          className="px-8 py-4 bg-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.9)] transition-colors text-lg"
        >
          Play Game
        </button>
      </main>
    );
  }

  if (gameState === "gameover") {
    return (
      <main className="grid min-h-screen grid-cols-1 content-center justify-items-center gap-8 px-6 py-16 text-center">
        <h1 className="text-4xl font-serif leading-tight text-[color:var(--deco-ink)] sm:text-5xl">
          Game Over!
        </h1>
        
        <div className="deco-card p-8 rounded-2xl">
          <div className="text-3xl font-semibold text-[color:var(--deco-gold)] mb-2">
            {score}
          </div>
          <div className="text-lg text-[color:var(--deco-ink)]">
            Questions Correct
          </div>
          {initials && (
            <div className="mt-4 text-sm text-[color:rgba(15,17,19,0.6)]">
              Score saved for {initials.toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={copyScore}
            className="px-6 py-3 bg-[color:rgba(212,175,55,0.15)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.25)] transition-colors flex items-center gap-2 mx-auto"
          >
            {copied ? "✅ Copied!" : "📋 Share Score"}
          </button>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.9)] transition-colors"
            >
              Play Again
            </button>
            
            <button
              onClick={() => setGameState("leaderboard")}
              className="px-6 py-3 border border-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.1)] transition-colors"
            >
              Leaderboard
            </button>
            
            <Link 
              href="/"
              className="px-6 py-3 border border-[color:var(--deco-gold)] text-[color:var(--deco-ink)] font-semibold rounded-xl hover:bg-[color:rgba(212,175,55,0.1)] transition-colors inline-block"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
};

export default GamePage;