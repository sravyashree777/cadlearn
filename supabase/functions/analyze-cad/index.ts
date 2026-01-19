import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a professional CAD instructor.
Analyze the given mechanical/CAD image.
Identify the main geometry, features, and dimensions.
Provide clear, beginner-friendly, step-by-step instructions
to recreate the model in Autodesk Fusion 360 or AutoCAD.
Assume the user has no prior CAD knowledge.
Use numbered steps.
After giving steps, ask the user if they are stuck at any step.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, software, messages, isFollowUp } = await req.json();
    
    if (!isFollowUp && !imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build messages array for the API
    const apiMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT }
    ];

    if (isFollowUp && messages && messages.length > 0) {
      // For follow-up questions, include conversation history
      for (const msg of messages) {
        if (msg.role === "user") {
          if (msg.imageUrl) {
            // Message with image
            apiMessages.push({
              role: "user",
              content: [
                { type: "text", text: msg.content },
                { type: "image_url", image_url: { url: msg.imageUrl } }
              ]
            });
          } else {
            // Text-only message
            apiMessages.push({
              role: "user",
              content: msg.content
            });
          }
        } else if (msg.role === "assistant") {
          apiMessages.push({
            role: "assistant",
            content: msg.content
          });
        }
      }
    } else {
      // Initial image analysis
      const softwareName = software || "Fusion 360 or AutoCAD";
      apiMessages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this CAD model and explain step-by-step how to create it in ${softwareName}.`,
          },
          {
            type: "image_url",
            image_url: { url: imageBase64 },
          },
        ],
      });
    }

    console.log("Sending request to AI gateway with", apiMessages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Unable to process request. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const instructions = data.choices?.[0]?.message?.content;
    
    if (!instructions) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "AI did not return a response. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ instructions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-cad function:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process request. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
