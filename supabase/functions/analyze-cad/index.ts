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
    const { imageBase64, software } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a CAD modeling instructor helping beginner mechanical engineering students learn to model 3D objects in ${software}. 

Your task is to analyze the uploaded image of a simple mechanical object (like a bracket, plate, holder, or basic part) and provide clear, step-by-step CAD modeling instructions.

IMPORTANT GUIDELINES:
1. Keep instructions beginner-friendly and encouraging
2. Use ONLY these basic CAD tools: Sketch, Extrude, Cut, Fillet, Hole
3. Provide approximate dimensions (clearly state they are estimates)
4. Explain the modeling order and intent behind each step
5. Be specific about which plane to start on and which faces to use
6. Do NOT generate CAD files - only provide instructions
7. Do NOT promise exact dimensions - emphasize these are approximations

OUTPUT FORMAT:
Start with a brief description of the object (1-2 sentences).
Then provide numbered steps like:

**Object Description:**
[Brief description of the mechanical object]

**Estimated Overall Dimensions:**
[Approximate length x width x height]

**Step-by-Step CAD Instructions:**

1. **Start with Base Sketch**
   - Open ${software} and create a new design
   - Select the [appropriate] plane
   - Create a rectangle approximately [X]mm x [Y]mm
   - [Any additional sketch details]

2. **Extrude the Base**
   - Select the sketch profile
   - Extrude approximately [Z]mm
   - [Direction and type details]

[Continue with remaining steps...]

**Tips for Success:**
- [1-2 helpful tips specific to this model]

Remember: Keep it simple, clear, and encouraging for beginners!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this image of a mechanical object and provide step-by-step CAD modeling instructions for ${software}. Remember to use approximate dimensions and keep instructions beginner-friendly.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
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
    const instructions = data.choices?.[0]?.message?.content || "Unable to generate instructions.";

    return new Response(
      JSON.stringify({ instructions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-cad function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
