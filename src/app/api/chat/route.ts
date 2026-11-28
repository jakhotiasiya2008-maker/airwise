import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { applyRateLimit, errorResponse } from "@/lib/api-utils";
import { GoogleGenAI } from "@google/genai";
import { sanitizeUserNotes } from "@/lib/prompt";
import { logger } from "@/lib/logger";

const ChatRequestSchema = z.object({
  question: z.string().min(2).max(300),
  city: z.string().max(100),
  aqi: z.number(),
  pm25: z.number(),
  pm10: z.number(),
  category: z.string(),
  profile: z.record(z.unknown()),
  language: z.enum(["en", "hi"]).default("en"),
});

export async function POST(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const parseResult = ChatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid question parameters" }, { status: 400 });
    }

    const { question, city, aqi, pm25, pm10, category, profile, language } = parseResult.data;
    const sanitizedQuestion = sanitizeUserNotes(question);

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

    // Deterministic rule response generator for offline / no-key fallback
    const generateFallbackAnswer = () => {
      const q = question.toLowerCase();
      const isHindi = language === "hi";

      if (
        q.includes("jog") ||
        q.includes("run") ||
        q.includes("walk") ||
        q.includes("टहल") ||
        q.includes("दौड़")
      ) {
        if (category === "Severe" || category === "Very Poor" || aqi > 300) {
          return isHindi
            ? `वर्तमान में ${city} का एक्यूआई ${aqi} (${category}) है। सुबह 5 से 9 बजे के बीच तीव्र इनवर्जन के कारण बाहरी जॉगिंग सख्त वर्जित है। कृपया घर के अंदर योग या ट्रेडमिल का उपयोग करें।`
            : `Currently, ${city}'s AQI is ${aqi} (${category}) with PM2.5 at ${pm25} µg/m³. Outdoor running or morning walks are strictly unadvisable due to heavy boundary layer inversion trapping diesel exhaust. Switch to indoor cardio or yoga.`;
        }
        return isHindi
          ? `${city} में वर्तमान एक्यूआई ${aqi} (${category}) है। दोपहर 12 से 4 बजे के बीच हल्की गतिविधि की जा सकती है, सुबह के समय से बचें।`
          : `At an AQI of ${aqi} (${category}), moderate outdoor activity is acceptable, but prefer midday (12 PM - 3 PM) when solar vertical dispersion is highest.`;
      }

      if (q.includes("plant") || q.includes("पौधे")) {
        return isHindi
          ? "इनडोर पौधे (जैसे स्नेक प्लांट या अरेका पाम) मानसिक शांति और नमी के लिए अच्छे हैं, लेकिन वे सूक्ष्म कणों (PM2.5) को साफ नहीं कर सकते। इसके लिए ट्रू HEPA एयर प्यूरीफायर आवश्यक है।"
          : "Scientific reality check: Houseplants provide psychological biophilic wellness and humidity, but peer-reviewed building science confirms they cannot scrub microscopic PM2.5 in living spaces. Mechanical HEPA filtration is required.";
      }

      if (q.includes("school") || q.includes("kid") || q.includes("child") || q.includes("बच्चे")) {
        return isHindi
          ? `बच्चों के फेफड़े तेजी से सांस लेते हैं। वर्तमान ${category} स्तर पर बाहरी खेलकूद तुरंत बंद कराएं और स्कूल प्रशासन से इनडोर गतिविधियों का अनुरोध करें।`
          : `Children breathe 50% more air per kg of body weight than adults. At ${aqi} AQI (${category}), outdoor playground sessions should be suspended and held indoors.`;
      }

      return isHindi
        ? `${city} में लाइव सीपीसीबी एक्यूआई ${aqi} (${category}) है। कृपया खिड़कियां बंद रखें, भारी धूप/अगरबत्ती से बचें और उच्च जोखिम होने पर एन95 मास्क का प्रयोग करें।`
        : `Based on live verified data for ${city} (AQI ${aqi}, ${category}, PM2.5 ${pm25} µg/m³), prioritize sealed indoor spaces with HEPA filtration, avoid burning incense or coils, and wear an N95 respirator if stepping outside.`;
    };

    if (!apiKey) {
      return NextResponse.json({
        answer: generateFallbackAnswer(),
        sourceEngine: "rule-based",
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `System: You are AirWise India, an environmental health specialist. Answer the user question concisely (2-4 sentences) strictly based on the provided live numbers.
Live verified data: City: ${city}, CPCB AQI: ${aqi}, Category: ${category}, PM2.5: ${pm25} ug/m3, PM10: ${pm10} ug/m3.
Household profile: ${JSON.stringify(profile)}.
Target language: ${language === "hi" ? "Hindi (हिंदी)" : "English"}.
Hard rule: NEVER guess or fabricate different AQI or PM numbers. Always give scientific reasoning (why).
User Question: "${sanitizedQuestion}"`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const answer = response.text?.trim() || generateFallbackAnswer();
      return NextResponse.json({
        answer,
        sourceEngine: "gemini",
      });
    } catch (err) {
      logger.warn("Gemini chat error, returning fallback rule:", err);
      return NextResponse.json({
        answer: generateFallbackAnswer(),
        sourceEngine: "rule-based",
      });
    }
  } catch (error) {
    logger.error("Chat route error:", error);
    return errorResponse("Unable to process question at this time.", 500);
  }
}
