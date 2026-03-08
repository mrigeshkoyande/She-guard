import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, Send, Sparkles, Heart, X, Smile, Frown, Meh, Zap,
  Moon as MoonIcon, Coffee, Flame, Wind, Timer, Dumbbell, Star, ListChecks,
  Play, Pause, RotateCcw
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wellness-chat`;

type Msg = { role: "user" | "assistant"; content: string };

interface ToolResult {
  name: string;
  result: Record<string, unknown>;
}

interface ChatResponse {
  content: string;
  tool_results: ToolResult[];
  error?: string;
}

const moodEmojis = [
  { emoji: "😊", label: "Happy", icon: Smile },
  { emoji: "😌", label: "Calm", icon: Wind },
  { emoji: "😔", label: "Sad", icon: Frown },
  { emoji: "😰", label: "Anxious", icon: Zap },
  { emoji: "😤", label: "Frustrated", icon: Flame },
  { emoji: "😴", label: "Tired", icon: Coffee },
];

// Generate a persistent session ID
function getSessionId() {
  let id = localStorage.getItem("sheguard_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sheguard_session_id", id);
  }
  return id;
}

// ─── Breathing Exercise Widget ───────────────────────────
function BreathingWidget({ technique, duration_seconds }: { technique: string; duration_seconds: number }) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [elapsed, setElapsed] = useState(0);
  const [count, setCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const techniques: Record<string, { inhale: number; hold: number; exhale: number; rest: number; label: string }> = {
    box_breathing: { inhale: 4, hold: 4, exhale: 4, rest: 4, label: "Box Breathing" },
    "478_breathing": { inhale: 4, hold: 7, exhale: 8, rest: 0, label: "4-7-8 Breathing" },
    deep_belly: { inhale: 5, hold: 2, exhale: 5, rest: 2, label: "Deep Belly Breathing" },
    alternate_nostril: { inhale: 4, hold: 4, exhale: 4, rest: 2, label: "Alternate Nostril" },
  };

  const t = techniques[technique] || techniques.box_breathing;
  const cycleLength = t.inhale + t.hold + t.exhale + t.rest;

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= duration_seconds) {
          setActive(false);
          clearInterval(intervalRef.current);
          return 0;
        }
        const inCycle = next % cycleLength;
        if (inCycle < t.inhale) setPhase("inhale");
        else if (inCycle < t.inhale + t.hold) setPhase("hold");
        else if (inCycle < t.inhale + t.hold + t.exhale) setPhase("exhale");
        else setPhase("rest");
        setCount(Math.floor(next / cycleLength) + 1);
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const phaseColors = {
    inhale: "from-blue-400 to-cyan-400",
    hold: "from-purple-400 to-pink-400",
    exhale: "from-green-400 to-emerald-400",
    rest: "from-amber-400 to-yellow-400",
  };

  const phaseLabels = { inhale: "Breathe In", hold: "Hold", exhale: "Breathe Out", rest: "Rest" };
  const progress = (elapsed / duration_seconds) * 100;

  return (
    <div className="glass rounded-2xl p-5 my-3">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="h-4 w-4 text-primary" />
        <span className="font-display font-bold text-sm text-foreground">{t.label}</span>
        <span className="text-xs text-muted-foreground ml-auto">{Math.ceil((duration_seconds - elapsed) / 60)}m left</span>
      </div>
      
      {active ? (
        <div className="text-center">
          <motion.div
            animate={{ scale: phase === "inhale" ? 1.3 : phase === "exhale" ? 0.8 : 1 }}
            transition={{ duration: phase === "inhale" ? t.inhale : phase === "exhale" ? t.exhale : 1, ease: "easeInOut" }}
            className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${phaseColors[phase]} flex items-center justify-center mb-3 shadow-lg`}
          >
            <span className="text-white font-bold text-lg">{phaseLabels[phase]}</span>
          </motion.div>
          <p className="text-xs text-muted-foreground">Cycle {count}</p>
          <div className="w-full bg-muted rounded-full h-1.5 mt-3">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <button onClick={() => { setActive(false); setElapsed(0); }} className="mt-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto">
            <Pause className="h-3 w-3" /> Stop
          </button>
        </div>
      ) : (
        <button onClick={() => setActive(true)} className="w-full gradient-primary text-primary-foreground rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all">
          <Play className="h-4 w-4" /> Start Breathing Exercise
        </button>
      )}
    </div>
  );
}

// ─── Exercise Card Widget ────────────────────────────────
function ExerciseCard({ data }: { data: { exercise_name: string; category: string; duration_minutes: number; intensity: string; steps: string[] } }) {
  const [expanded, setExpanded] = useState(false);
  const intensityColors = { gentle: "text-green-500", moderate: "text-amber-500", intense: "text-red-500" };

  return (
    <div className="glass rounded-2xl p-5 my-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="gradient-safe w-10 h-10 rounded-xl flex items-center justify-center">
          <Dumbbell className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h4 className="font-display font-bold text-sm text-foreground">{data.exercise_name}</h4>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{data.duration_minutes} min</span>
            <span>•</span>
            <span className={intensityColors[data.intensity as keyof typeof intensityColors] || "text-muted-foreground"}>{data.intensity}</span>
            <span>•</span>
            <span>{data.category}</span>
          </div>
        </div>
      </div>
      
      <button onClick={() => setExpanded(!expanded)} className="text-xs text-primary font-medium hover:underline">
        {expanded ? "Hide steps ▲" : "Show steps ▼"}
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-2 overflow-hidden">
            {data.steps.map((step, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Affirmation Card Widget ─────────────────────────────
function AffirmationCard({ theme, affirmation }: { theme: string; affirmation: string }) {
  const themeGradients: Record<string, string> = {
    self_love: "from-pink-400 to-rose-500",
    courage: "from-amber-400 to-orange-500",
    calm: "from-blue-400 to-cyan-500",
    strength: "from-purple-400 to-indigo-500",
    joy: "from-yellow-400 to-amber-500",
    resilience: "from-emerald-400 to-green-500",
  };

  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`rounded-2xl p-6 my-3 bg-gradient-to-br ${themeGradients[theme] || themeGradients.calm} text-white shadow-lg`}>
      <Star className="h-5 w-5 mb-2 opacity-80" />
      <p className="font-display font-bold text-lg leading-snug">"{affirmation}"</p>
      <p className="text-xs mt-2 opacity-70 capitalize">✨ {theme.replace("_", " ")} affirmation</p>
    </motion.div>
  );
}

// ─── Wellness Plan Widget ────────────────────────────────
function WellnessPlanCard({ data }: { data: { plan_title: string; steps: Array<{ step_number: number; action: string; duration: string; benefit: string }>; time_of_day: string } }) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  return (
    <div className="glass rounded-2xl p-5 my-3">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="h-5 w-5 text-primary" />
        <h4 className="font-display font-bold text-sm text-foreground">{data.plan_title}</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Best for: {data.time_of_day} • {data.steps.length} steps</p>
      <div className="space-y-2">
        {data.steps.map((step) => (
          <div
            key={step.step_number}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer ${checkedSteps.has(step.step_number) ? "bg-primary/10 opacity-70" : "bg-muted/50 hover:bg-muted"}`}
            onClick={() => setCheckedSteps((prev) => {
              const next = new Set(prev);
              next.has(step.step_number) ? next.delete(step.step_number) : next.add(step.step_number);
              return next;
            })}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${checkedSteps.has(step.step_number) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"}`}>
              {checkedSteps.has(step.step_number) && <span className="text-xs">✓</span>}
            </div>
            <div>
              <p className={`text-sm font-medium text-foreground ${checkedSteps.has(step.step_number) ? "line-through" : ""}`}>{step.action}</p>
              <p className="text-xs text-muted-foreground">{step.duration} • {step.benefit}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground text-center">
        {checkedSteps.size}/{data.steps.length} completed
      </div>
    </div>
  );
}

// ─── Tool Result Renderer ────────────────────────────────
function ToolResultWidget({ toolResult }: { toolResult: ToolResult }) {
  const { name, result } = toolResult;
  const data = result as Record<string, any>;

  switch (name) {
    case "start_breathing_exercise":
      return <BreathingWidget technique={data.technique as string} duration_seconds={data.duration_seconds as number} />;
    case "suggest_exercise":
      return <ExerciseCard data={data as any} />;
    case "generate_affirmation":
      return <AffirmationCard theme={data.theme as string} affirmation={data.affirmation as string} />;
    case "create_wellness_plan":
      return <WellnessPlanCard data={data as any} />;
    case "log_mood":
      return (
        <div className="flex items-center gap-2 my-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary" />
          Mood logged: {data.mood} ({data.mood_score}/10)
        </div>
      );
    default:
      return null;
  }
}

// ─── Main Chatbot Component ──────────────────────────────
const WellnessChatbot = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [toolResults, setToolResults] = useState<Map<number, ToolResult[]>>(new Map());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState<Array<{ mood: string; score: number }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, toolResults]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          session_id: sessionId.current,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        const errMsg = errData.error || "Something went wrong. Please try again.";
        setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
        setIsLoading(false);
        return;
      }

      const data: ChatResponse = await resp.json();
      
      // Add assistant message
      const assistantIndex = newMessages.length;
      setMessages((prev) => [...prev, { role: "assistant", content: data.content || "" }]);
      
      // Process tool results
      if (data.tool_results && data.tool_results.length > 0) {
        setToolResults((prev) => {
          const next = new Map(prev);
          next.set(assistantIndex, data.tool_results);
          return next;
        });

        // Update mood history from logged moods
        for (const tr of data.tool_results) {
          if (tr.name === "log_mood") {
            const r = tr.result as { mood: string; mood_score: number };
            setMoodHistory((prev) => [...prev.slice(-9), { mood: r.mood, score: r.mood_score }]);
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again 💕" }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  return (
    <section id="wellness-chat" className="py-24 relative">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">AI Wellness Agent</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Your Agentic <span className="text-gradient">Wellness Companion</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Our AI agent doesn't just talk — it takes action. It logs your mood, guides breathing exercises, creates wellness plans, and remembers your journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            {[
              { icon: Zap, title: "Agentic Actions", desc: "AI autonomously logs mood, starts exercises, and creates plans", color: "gradient-warning" },
              { icon: Heart, title: "Memory & Context", desc: "Remembers your mood patterns and personalizes every interaction", color: "gradient-primary" },
              { icon: Sparkles, title: "Multi-Step Reasoning", desc: "Chains multiple tools together for comprehensive wellness guidance", color: "gradient-safe" },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5 hover:shadow-elevated transition-shadow">
                <div className={`${f.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}

            {/* Mood tracker */}
            {moodHistory.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h4 className="font-display font-bold text-foreground mb-3 text-sm">Your Mood Journey</h4>
                <div className="space-y-2">
                  {moodHistory.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${m.score * 10}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-20 truncate capitalize">{m.mood}</span>
                      <span className="text-xs font-mono text-foreground">{m.score}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Chat interface */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden shadow-elevated max-w-2xl mx-auto">
              {/* Header */}
              <div className="gradient-primary p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary-foreground text-sm">SheGuard Wellness Agent</h3>
                  <p className="text-primary-foreground/70 text-xs">
                    {isLoading ? "🤔 Thinking & taking actions..." : "Online • Agentic AI 🤖💕"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[450px] overflow-y-auto p-4 space-y-4 bg-background/50">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="h-10 w-10 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm mb-2">Hi there! 💕 I'm your AI wellness agent.</p>
                    <p className="text-muted-foreground text-xs mb-6">I can log your mood, guide breathing exercises,<br />create wellness plans, and more — all automatically!</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {moodEmojis.map((m) => (
                        <button key={m.label} onClick={() => sendMessage(`I'm feeling ${m.label.toLowerCase()} right now. Can you help me?`)} className="glass px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:shadow-elevated transition-all flex items-center gap-2">
                          <span className="text-lg">{m.emoji}</span>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "gradient-primary text-primary-foreground rounded-br-sm" : "glass text-foreground rounded-bl-sm"}`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:text-base [&>h2]:text-sm [&>h3]:text-sm [&>p]:text-sm [&>li]:text-sm">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : msg.content}
                      </div>
                    </div>
                    {/* Render tool result widgets after assistant messages */}
                    {msg.role === "assistant" && toolResults.get(i) && (
                      <div className="mt-2 space-y-1">
                        {toolResults.get(i)!.map((tr, j) => (
                          <ToolResultWidget key={j} toolResult={tr} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                        <span className="text-xs text-muted-foreground">Agent is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background/80">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tell me how you're feeling..."
                    className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading || !input.trim()} className="gradient-primary text-primary-foreground p-3 rounded-xl shadow-glow-primary hover:opacity-90 transition-all disabled:opacity-50">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WellnessChatbot;
