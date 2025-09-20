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
  const [sessionId, setSessionId] = useState("");

  const addScore = useMutation(api.gameScores.addScore);
  const addGameResponse = useMutation(api.gameScores.addGameResponse);
  const updateResponsesWithInitials = useMutation(api.gameScores.updateResponsesWithInitials);
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

  const shuffleAnswers = () => {
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
      setSessionId(Date.now().toString() + Math.random().toString(36).substr(2, 9));
    } else {
      alert("Failed to load questions. Please try again.");
      setGameState("start");
    }
  };

  const selectAnswer = async (answer: string) => {
    if (selectedAnswer || showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentQ = questions[currentQuestionIndex];
    const isMatch = answer === currentQ?.correct_answer;
    
    // Save response immediately to database
    try {
      await addGameResponse({
        sessionId,
        initials: undefined, // Will be filled in later if user saves score
        questionIndex: currentQuestionIndex,
        questionText: currentQ?.question || "",
        questionCategory: currentQ?.category || "",
        userAnswer: answer,
        lilyIsaacAnswer: currentQ?.correct_answer || "",
        isMatch
      });
    } catch (error) {
      console.error("Failed to save response:", error);
    }
    
    if (isMatch) {
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
    setSessionId("");
  };

  const saveScore = async () => {
    if (initials.trim()) {
      try {
        // Save final score
        await addScore({ initials: initials.trim(), score });
        
        // Update all responses for this session with initials
        await updateResponsesWithInitials({
          sessionId,
          initials: initials.trim()
        });
        
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
    const text = `I got ${score} questions right on Lily and Isaac's wedding trivia! Try to beat me at lilyandisaac.com/game!`;
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
      setAllAnswers(shuffleAnswers());
    }
  }, [currentQuestionIndex, questions]);

  // No need to decode HTML since we're using plain text questions

  const currentQuestion = questions[currentQuestionIndex];

  if (gameState === "start") {
    return (
      <main className="deco-bg relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-br from-[color:var(--pure-white)] via-[color:var(--light-blue)] to-[color:var(--pure-white)]">
        {/* Classic decorative border */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[color:var(--accent-blue)] to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[color:var(--accent-blue)] to-transparent"></div>
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-[color:var(--accent-blue)] to-transparent"></div>
          <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-[color:var(--accent-blue)] to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <div className="mb-6">
            <Link 
              href="/"
              className="text-sm text-[color:var(--text-gray)] hover:text-[color:var(--button-blue)] transition-all duration-300 inline-flex items-center gap-2 bg-[color:var(--pure-white)]/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              ← Back to Wedding
            </Link>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif leading-tight text-[color:var(--primary-navy)] font-light">
              Wedding Trivia
            </h1>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[color:var(--accent-blue)]"></div>
              <div className="w-2 h-2 bg-[color:var(--primary-blue)] rounded-full"></div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[color:var(--accent-blue)]"></div>
            </div>
            
            <p className="max-w-md mx-auto text-[color:var(--text-gray)] text-lg leading-relaxed">
              How to play: you will have 60 seconds to answer as many questions as you can. Each question will be a choice between Lily and Isaac. The highest number of correct answers wins!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-[color:var(--button-blue)] to-[color:var(--accent-blue)] text-[color:var(--pure-white)] font-semibold rounded-full hover:from-[color:var(--accent-blue)] hover:to-[color:var(--button-blue)] transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:shadow-[color:var(--button-blue)]/25 hover:-translate-y-1"
            >
              Start Game
            </button>
            
            <button
              onClick={() => setGameState("leaderboard")}
              className="px-8 py-4 bg-[color:var(--pure-white)] border border-[color:var(--border-blue)] text-[color:var(--primary-navy)] font-semibold rounded-full hover:bg-[color:var(--light-blue)] hover:border-[color:var(--accent-blue)] hover:text-[color:var(--button-blue)] transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:shadow-[color:var(--accent-blue)]/10 hover:-translate-y-1"
            >
              Leaderboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (gameState === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-[color:var(--light-blue)] border-t-[color:var(--primary-blue)] rounded-full animate-spin"></div>
          <div className="text-xl text-[color:var(--primary-navy)] font-medium">Loading questions...</div>
        </div>
      </main>
    );
  }

  if (gameState === "playing" && currentQuestion) {
    return (
      <main className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 flex items-center justify-between bg-[color:var(--pure-white)] rounded-2xl p-4 shadow-lg border border-[color:var(--border-blue)]">
            <div className="text-lg font-bold text-[color:var(--primary-navy)]">
              Score: {score}
            </div>
            {streak >= 2 && (
              <div className="text-lg font-bold text-[color:var(--accent-blue)] bg-[color:var(--light-blue)] px-3 py-1 rounded-full">
                🔥 {streak} streak!
              </div>
            )}
            <div className="text-lg font-bold text-[color:var(--primary-navy)]">
              Time: {timeLeft}s
            </div>
          </div>

          <div className="deco-card mb-8 p-8 rounded-2xl">
            <div className="mb-6 text-sm uppercase tracking-wide text-[color:var(--accent-blue)] font-medium">
              {currentQuestion.category}
            </div>
            <h2 className="text-2xl font-semibold text-[color:var(--primary-navy)] leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {allAnswers.map((answer, index) => {
              let buttonClass = "p-5 text-left rounded-xl border transition-all duration-300 font-medium ";
              
              if (showResult) {
                if (answer === currentQuestion.correct_answer) {
                  buttonClass += "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-lg";
                } else if (answer === selectedAnswer) {
                  buttonClass += "border-rose-500 bg-rose-50 text-rose-800 shadow-lg";
                } else {
                  buttonClass += "border-[color:var(--border-blue)] bg-[color:var(--soft-gray)] text-[color:var(--text-gray)] opacity-60";
                }
              } else {
                buttonClass += "border-[color:var(--border-blue)] bg-[color:var(--pure-white)] text-[color:var(--primary-navy)] hover:border-[color:var(--accent-blue)] hover:bg-[color:var(--light-blue)] hover:text-[color:var(--primary-blue)] hover:shadow-lg hover:-translate-y-1";
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
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="text-center space-y-8 max-w-md mx-auto">
          <h1 className="text-5xl sm:text-6xl font-serif leading-tight text-[color:var(--primary-navy)] font-light">
            Great Job!
          </h1>
          
          <div className="deco-card p-10 rounded-2xl">
            <div className="text-5xl font-bold text-[color:var(--button-blue)] mb-3">
              {score}
            </div>
            <div className="text-xl text-[color:var(--primary-navy)] font-medium">
              Questions Correct
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[color:var(--text-gray)] text-lg">
              Want to save your score to the leaderboard?
            </p>
            
            <input
              type="text"
              placeholder="Enter your initials"
              value={initials}
              onChange={(e) => setInitials(e.target.value.slice(0, 3))}
              className="px-6 py-4 border border-[color:var(--border-blue)] rounded-xl bg-[color:var(--pure-white)] text-center uppercase tracking-wider text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)] focus:border-[color:var(--primary-blue)] shadow-lg"
              maxLength={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveScore}
              className="px-8 py-4 bg-gradient-to-r from-[color:var(--button-blue)] to-[color:var(--accent-blue)] text-[color:var(--pure-white)] font-semibold rounded-full hover:from-[color:var(--accent-blue)] hover:to-[color:var(--button-blue)] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[color:var(--button-blue)]/25 hover:-translate-y-1"
            >
              Save Score
            </button>
            
            <button
              onClick={skipSave}
              className="px-8 py-4 bg-[color:var(--pure-white)] border border-[color:var(--border-blue)] text-[color:var(--primary-navy)] font-semibold rounded-full hover:bg-[color:var(--light-blue)] hover:border-[color:var(--accent-blue)] hover:text-[color:var(--button-blue)] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[color:var(--accent-blue)]/10 hover:-translate-y-1"
            >
              Skip
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (gameState === "leaderboard") {
    return (
      <main className="min-h-screen flex flex-col items-center px-6 py-16">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <div>
              <Link 
                href="/"
                className="text-sm text-[color:var(--text-gray)] hover:text-[color:var(--button-blue)] transition-all duration-300 inline-flex items-center gap-2 bg-[color:var(--pure-white)]/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                ← Back to Wedding
              </Link>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-serif leading-tight text-[color:var(--primary-navy)] font-light">
              Leaderboard
            </h1>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[color:var(--accent-blue)]"></div>
              <div className="w-2 h-2 bg-[color:var(--primary-blue)] rounded-full"></div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[color:var(--accent-blue)]"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            {topScores && topScores.length > 0 ? (
              topScores.map((scoreEntry, index) => (
                <div key={scoreEntry._id} className="deco-card p-6 rounded-2xl flex justify-between items-center hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center text-[color:var(--pure-white)] ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800' :
                      'bg-gradient-to-r from-[color:var(--button-blue)] to-[color:var(--accent-blue)]'
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="text-2xl font-bold text-[color:var(--primary-navy)] uppercase tracking-wider">
                      {scoreEntry.initials}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[color:var(--button-blue)]">
                    {scoreEntry.score}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12 text-[color:var(--text-gray)] text-lg">
                No scores yet. Be the first to play!
              </div>
            )}
          </div>

          <div className="text-center pt-8">
            <button
              onClick={() => setGameState("start")}
              className="px-8 py-4 bg-gradient-to-r from-[color:var(--button-blue)] to-[color:var(--accent-blue)] text-[color:var(--pure-white)] font-semibold rounded-full hover:from-[color:var(--accent-blue)] hover:to-[color:var(--button-blue)] transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:shadow-[color:var(--button-blue)]/25 hover:-translate-y-1"
            >
              Play Game
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (gameState === "gameover") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="text-center space-y-8 max-w-lg mx-auto">
          <h1 className="text-5xl sm:text-6xl font-serif leading-tight text-[color:var(--primary-navy)] font-light">
            Game Over!
          </h1>
          
          <div className="deco-card p-10 rounded-2xl">
            <div className="text-5xl font-bold text-[color:var(--button-blue)] mb-3">
              {score}
            </div>
            <div className="text-xl text-[color:var(--primary-navy)] font-medium">
              Questions Correct
            </div>
            {initials && (
              <div className="mt-6 text-base text-[color:var(--text-gray)] font-medium">
                Score saved for {initials.toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <button
              onClick={copyScore}
              className="px-8 py-4 bg-[color:var(--light-blue)] text-[color:var(--primary-navy)] font-semibold rounded-full hover:bg-[color:var(--accent-blue)] hover:text-[color:var(--pure-white)] transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl hover:shadow-[color:var(--accent-blue)]/20 hover:-translate-y-1"
            >
              {copied ? "✅ Copied!" : "📋 Share Score"}
            </button>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-[color:var(--button-blue)] to-[color:var(--accent-blue)] text-[color:var(--pure-white)] font-semibold rounded-full hover:from-[color:var(--accent-blue)] hover:to-[color:var(--button-blue)] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[color:var(--button-blue)]/25 hover:-translate-y-1"
              >
                Play Again
              </button>
              
              <button
                onClick={() => setGameState("leaderboard")}
                className="px-8 py-4 bg-[color:var(--pure-white)] border border-[color:var(--border-blue)] text-[color:var(--primary-navy)] font-semibold rounded-full hover:bg-[color:var(--light-blue)] hover:border-[color:var(--accent-blue)] hover:text-[color:var(--button-blue)] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[color:var(--accent-blue)]/10 hover:-translate-y-1"
              >
                Leaderboard
              </button>
              
              <Link 
                href="/"
                className="text-sm text-[color:var(--text-gray)] hover:text-[color:var(--button-blue)] transition-all duration-300 inline-flex items-center gap-2 bg-[color:var(--pure-white)]/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                ← Back to Wedding
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
};

export default GamePage;