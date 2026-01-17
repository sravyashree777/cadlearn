import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a specialized CAD modeling instructor helping beginner mechanical engineering students learn to model 3D objects in ${software}. 

YOUR ROLE:
- You are a patient, encouraging CAD tutor focused ONLY on CAD learning
- You help students understand CAD modeling step-by-step
- You answer questions about specific CAD tools, techniques, and workflows
- You help troubleshoot modeling errors and guide students through problems

IMPORTANT GUIDELINES:
1. Keep all responses beginner-friendly and encouraging
2. Focus ONLY on these basic CAD tools: Sketch, Extrude, Cut, Fillet, Hole
3. When providing dimensions, clearly state they are estimates
4. Explain the reasoning behind each modeling decision
5. Be specific about which planes, faces, and features to use
6. Do NOT generate CAD files - only provide instructions and guidance
7. Stay focused on CAD learning - politely redirect off-topic questions back to CAD
8. Reference the uploaded image and previous steps when answering follow-up questions
9. If a student asks about an error, help them understand what went wrong and how to fix it
10. Encourage good modeling practices and workflow habits

For initial image analysis, use this format:
**Object Description:**
[Brief description of the mechanical object]

**Estimated Overall Dimensions:**
[Approximate length x width x height]

**Step-by-Step CAD Instructions:**
1. **Step Title**
   - Detailed instruction
   - Additional details

[Continue with remaining steps...]

**Tips for Success:**
- [Helpful tips specific to this model]

For follow-up questions, provide clear, focused answers that reference the context of the current modeling session.`;

    // Build messages array for the API
    const apiMessages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (isFollowUp && messages && messages.length > 0) {
      // For follow-up questions, include conversation history
      for (const msg of messages) {
        if (msg.role === "user") {
          if (msg.imageUrl && msg.isInitial) {
            // Initial message with image
            apiMessages.push({
              role: "user",
              content: [
                { type: "text", text: msg.content },
                { type: "image_url", image_url: { url: msg.imageUrl } }
              ]
            });
          } else {
            // Text-only follow-up
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
      apiMessages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze this image of a mechanical object and provide step-by-step CAD modeling instructions for ${software}. Remember to use approximate dimensions and keep instructions beginner-friendly.`,
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
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const instructions = data.choices?.[0]?.message?.content || "Unable to generate response.";

    return new Response(
      JSON.stringify({ instructions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-cad function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to process request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
