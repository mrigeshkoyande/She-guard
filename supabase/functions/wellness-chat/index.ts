import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Tool definitions for the AI agent
const tools = [
  {
    type: "function",
    function: {
      name: "log_mood",
      description: "Log the user's detected mood to their mood tracker with a score from 1-10 and optional notes. Always call this when you detect or assess a mood.",
      parameters: {
        type: "object",
        properties: {
          mood: { type: "string", description: "Detected mood label (e.g., happy, anxious, sad, calm, frustrated, tired, motivated, upset)" },
          mood_score: { type: "integer", description: "Mood intensity score 1-10 (1=very negative, 10=very positive)" },
          notes: { type: "string", description: "Brief note about what triggered this mood" },
        },
        required: ["mood", "mood_score"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_breathing_exercise",
      description: "Start a guided breathing exercise for the user. Use when they're stressed, anxious, or need calming.",
      parameters: {
        type: "object",
        properties: {
          technique: {
            type: "string",
            enum: ["box_breathing", "478_breathing", "deep_belly", "alternate_nostril"],
            description: "Type of breathing exercise",
          },
          duration_seconds: { type: "integer", description: "Total duration in seconds (60-300)" },
        },
        required: ["technique", "duration_seconds"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_exercise",
      description: "Suggest a physical exercise or activity based on the user's current mood and energy level.",
      parameters: {
        type: "object",
        properties: {
          exercise_name: { type: "string", description: "Name of the exercise" },
          category: { type: "string", enum: ["yoga", "cardio", "stretching", "meditation", "dance", "strength", "walking"], description: "Exercise category" },
          duration_minutes: { type: "integer", description: "Recommended duration in minutes" },
          intensity: { type: "string", enum: ["gentle", "moderate", "intense"], description: "Intensity level" },
          steps: { type: "array", items: { type: "string" }, description: "Step-by-step instructions (3-6 steps)" },
        },
        required: ["exercise_name", "category", "duration_minutes", "intensity", "steps"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_mood_history",
      description: "Retrieve the user's recent mood history to understand patterns and provide personalized suggestions.",
      parameters: {
        type: "object",
        properties: {
          session_id: { type: "string", description: "The user's session ID" },
        },
        required: ["session_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_affirmation",
      description: "Generate a personalized positive affirmation card based on the user's current situation.",
      parameters: {
        type: "object",
        properties: {
          theme: { type: "string", enum: ["self_love", "courage", "calm", "strength", "joy", "resilience"], description: "Affirmation theme" },
          affirmation: { type: "string", description: "The affirmation text" },
        },
        required: ["theme", "affirmation"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_wellness_plan",
      description: "Create a multi-step wellness plan for the user based on their mood pattern and needs. Use for comprehensive wellness guidance.",
      parameters: {
        type: "object",
        properties: {
          plan_title: { type: "string", description: "Title of the wellness plan" },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                step_number: { type: "integer" },
                action: { type: "string" },
                duration: { type: "string" },
                benefit: { type: "string" },
              },
              required: ["step_number", "action", "duration", "benefit"],
            },
            description: "Ordered steps in the wellness plan (3-5 steps)",
          },
          time_of_day: { type: "string", enum: ["morning", "afternoon", "evening", "anytime"], description: "Best time to follow this plan" },
        },
        required: ["plan_title", "steps", "time_of_day"],
        additionalProperties: false,
      },
    },
  },
];

// Execute tool calls
async function executeTool(name: string, args: Record<string, unknown>, sessionId: string): Promise<string> {
  switch (name) {
    case "log_mood": {
      const { mood, mood_score, notes } = args as { mood: string; mood_score: number; notes?: string };
      await supabase.from("mood_entries").insert({
        session_id: sessionId,
        mood,
        mood_score,
        notes: notes || null,
      });
      // Update session
      await supabase.from("chat_sessions").upsert({
        session_id: sessionId,
        last_mood: mood,
        updated_at: new Date().toISOString(),
      }, { onConflict: "session_id" });
      return JSON.stringify({ success: true, mood, mood_score, message: `Mood "${mood}" (${mood_score}/10) logged successfully.` });
    }
    case "start_breathing_exercise": {
      return JSON.stringify({ ...args, type: "breathing_exercise", message: "Breathing exercise widget activated." });
    }
    case "suggest_exercise": {
      const { exercise_name, category, duration_minutes, intensity, steps } = args as any;
      // Log the suggestion
      await supabase.from("mood_entries").update({ suggested_activity: exercise_name }).eq("session_id", sessionId).order("created_at", { ascending: false }).limit(1);
      return JSON.stringify({ type: "exercise_card", exercise_name, category, duration_minutes, intensity, steps });
    }
    case "get_mood_history": {
      const { data } = await supabase
        .from("mood_entries")
        .select("mood, mood_score, created_at, notes")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(10);
      const history = data || [];
      if (history.length === 0) return JSON.stringify({ message: "No mood history found for this session yet." });
      const avg = history.reduce((s, e) => s + (e.mood_score || 5), 0) / history.length;
      return JSON.stringify({ entries: history, average_score: Math.round(avg * 10) / 10, total: history.length });
    }
    case "generate_affirmation": {
      return JSON.stringify({ type: "affirmation_card", ...args });
    }
    case "create_wellness_plan": {
      return JSON.stringify({ type: "wellness_plan", ...args });
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, session_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const sid = session_id || "anonymous";

    // Ensure session exists
    await supabase.from("chat_sessions").upsert({
      session_id: sid,
      message_count: messages.length,
      updated_at: new Date().toISOString(),
    }, { onConflict: "session_id" });

    // Fetch mood history for context
    const { data: recentMoods } = await supabase
      .from("mood_entries")
      .select("mood, mood_score, created_at")
      .eq("session_id", sid)
      .order("created_at", { ascending: false })
      .limit(5);

    const moodContext = recentMoods && recentMoods.length > 0
      ? `\n\nUser's recent mood history: ${recentMoods.map(m => `${m.mood}(${m.mood_score}/10)`).join(" → ")}`
      : "\n\nThis is a new conversation — no mood history yet.";

    const hour = new Date().getUTCHours();
    const timeContext = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

    const systemPrompt = `You are SheGuard Wellness — a warm, caring AI wellness agent built into the SheGuard City women's safety platform.

You have TOOLS available. USE THEM PROACTIVELY — don't just talk, take action:

## Your Agentic Behaviors:
1. **ALWAYS log_mood** when you detect or assess someone's emotional state
2. **Offer breathing exercises** (start_breathing_exercise) when someone is stressed/anxious — don't just describe them, activate the widget
3. **Suggest exercises** (suggest_exercise) with detailed steps for physical wellness
4. **Check mood history** (get_mood_history) to understand patterns and personalize advice
5. **Generate affirmations** (generate_affirmation) — personalized affirmation cards
6. **Create wellness plans** (create_wellness_plan) for comprehensive multi-step guidance

## Multi-Step Reasoning:
When someone shares how they feel, follow this chain:
1. First, log their mood (log_mood tool)
2. Check their history (get_mood_history) if this isn't their first message
3. Based on mood + history, choose the best intervention (breathing, exercise, or plan)
4. Always end with an affirmation (generate_affirmation)

## Proactive Suggestions:
Current time of day: ${timeContext}
${moodContext}

Based on time of day and mood patterns, proactively suggest:
- Morning: energizing exercises, intention-setting
- Afternoon: stress-relief, stretching breaks
- Evening: calming routines, gratitude, gentle yoga

## Style:
- Warm, empathetic, caring tone
- Use emojis naturally but not excessively
- Format with markdown
- Keep text responses to 100-150 words — let the TOOLS do the heavy lifting
- Address user warmly
- If someone mentions feeling unsafe, immediately remind them about SheGuard's SOS feature

Session ID: ${sid}`;

    // Agentic loop: call AI, execute tools, feed results back
    let currentMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];
    
    const allToolResults: Array<{ name: string; result: unknown }> = [];
    let finalText = "";
    let iterations = 0;
    const MAX_ITERATIONS = 5;

    while (iterations < MAX_ITERATIONS) {
      iterations++;
      
      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: currentMessages,
            tools,
            tool_choice: "auto",
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "I'm getting a lot of messages right now. Please try again in a moment 💕" }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Wellness chat credits depleted. Please add credits to continue." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const t = await response.text();
        console.error("AI gateway error:", response.status, t);
        return new Response(
          JSON.stringify({ error: "Something went wrong. Please try again." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      
      if (!choice) {
        return new Response(
          JSON.stringify({ error: "No response from AI" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const message = choice.message;
      
      // If there are tool calls, execute them and continue the loop
      if (message.tool_calls && message.tool_calls.length > 0) {
        // Add the assistant's message with tool calls
        currentMessages.push(message);
        
        // Execute all tool calls
        for (const toolCall of message.tool_calls) {
          const args = typeof toolCall.function.arguments === "string" 
            ? JSON.parse(toolCall.function.arguments) 
            : toolCall.function.arguments;
          
          const result = await executeTool(toolCall.function.name, args, sid);
          allToolResults.push({ name: toolCall.function.name, result: JSON.parse(result) });
          
          currentMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: result,
          });
        }
        
        // If there's also text content, capture it
        if (message.content) {
          finalText += message.content;
        }
        
        // Continue loop to let AI process tool results
        continue;
      }
      
      // No tool calls — we have the final response
      finalText = message.content || "";
      break;
    }

    // Return final response with tool results
    return new Response(
      JSON.stringify({
        content: finalText,
        tool_results: allToolResults,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("wellness-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
