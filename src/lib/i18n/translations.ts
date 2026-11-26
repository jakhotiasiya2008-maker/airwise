export type SupportedLanguage = "en" | "hi";

export interface TranslationDict {
  appName: string;
  tagline: string;
  skipLink: string;
  cpcbAqi: string;
  pm25: string;
  pm10: string;
  source: string;
  measured: string;
  modelledNote: string;
  lastUpdated: string;
  refresh: string;
  searchPlaceholder: string;
  useMyLocation: string;
  locating: string;
  quickCities: string;
  tabs: {
    all: string;
    routines: string;
    indoor: string;
    sustainable: string;
    tools: string;
  };
  tools: {
    title: string;
    subtitle: string;
    purifierCheckTitle: string;
    purifierCheckDesc: string;
    roomSizeLabel: string;
    cadrLabel: string;
    achLabel: string;
    verdictAdequate: string;
    verdictInadequate: string;
    whatIfTitle: string;
    whatIfDesc: string;
    exposureTimelineTitle: string;
    exposureTimelineDesc: string;
    pickCommute: string;
  };
  cards: {
    whyThisMatters: string;
    expectedImpact: string;
    done: string;
    completedCount: string;
  };
  urgency: {
    now: string;
    today: string;
    thisWeek: string;
    preventive: string;
  };
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    askButton: string;
    suggestedChips: string[];
    disclaimer: string;
  };
  share: {
    shareTitle: string;
    copySummary: string;
    copied: string;
    shareWhatsApp: string;
  };
  onboarding: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    next: string;
    back: string;
    finish: string;
    skip: string;
  };
  forecast: {
    title: string;
    subtitle: string;
    bestWindow: string;
    avoidWindow: string;
    tableFallback: string;
  };
  categories: {
    Good: string;
    Satisfactory: string;
    Moderate: string;
    Poor: string;
    VeryPoor: string;
    Severe: string;
  };
  disclaimer: string;
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en: {
    appName: "AirWise India",
    tagline: "GenAI Urban Air Quality & Smog Safety Assistant",
    skipLink: "Skip to main content",
    cpcbAqi: "CPCB AQI",
    pm25: "PM 2.5",
    pm10: "PM 10",
    source: "Source",
    measured: "Measured",
    modelledNote: "Data may be atmospheric model-estimated for this coordinate",
    lastUpdated: "Updated just now",
    refresh: "Refresh Data",
    searchPlaceholder: "Search Indian city (e.g. Noida, Delhi, Mumbai, Patna)...",
    useMyLocation: "Use My Location",
    locating: "Locating...",
    quickCities: "Quick cities:",
    tabs: {
      all: "All Guidance",
      routines: "Daily Routines",
      indoor: "Indoor Air Quality",
      sustainable: "Sustainable Alternatives",
      tools: "Interactive Tools",
    },
    tools: {
      title: "Interactive Smog & Health Tools",
      subtitle: "Instant deterministic calculators for air purifier adequacy and commute exposure.",
      purifierCheckTitle: "Air Purifier CADR & Room Size Check",
      purifierCheckDesc: "Verify if your air purifier delivers sufficient Air Changes per Hour (ACH >= 4.0).",
      roomSizeLabel: "Room Area (sq ft)",
      cadrLabel: "Purifier CADR (m³/hr)",
      achLabel: "Estimated Air Changes per Hour (ACH)",
      verdictAdequate: "✅ Adequate: Filters room air at least 4-5 times per hour.",
      verdictInadequate: "⚠️ Undersized: Air changes are below recommended 4.0 ACH for severe smog.",
      whatIfTitle: "What-If Commute Exposure Calculator",
      whatIfDesc: "Compare direct particulate exposure and tailpipe emissions across travel modes.",
      exposureTimelineTitle: "Safe Outdoor Exposure Window",
      exposureTimelineDesc: "Recommended maximum outdoor exertion based on current AQI and household vulnerability.",
      pickCommute: "Select Commute Mode",
    },
    cards: {
      whyThisMatters: "🔬 Why This Matters",
      expectedImpact: "✨ Expected Impact",
      done: "Mark Done",
      completedCount: "tasks completed today",
    },
    urgency: {
      now: "Act Now",
      today: "Today",
      thisWeek: "This Week",
      preventive: "Preventive",
    },
    chat: {
      title: "Ask AirWise Follow-Up",
      subtitle: "Ask specific questions grounded in your live city readings and household profile.",
      placeholder: "e.g., Can I take my 3-year-old to the park this afternoon?",
      askButton: "Ask AI",
      suggestedChips: [
        "Can I jog tomorrow morning?",
        "Should I send my toddler to school?",
        "Best time to open windows today?",
        "Do snake plants clean PM2.5?",
      ],
      disclaimer: "AI responses are grounded on live measurements. Not medical advice.",
    },
    share: {
      shareTitle: "Share Air Quality Update",
      copySummary: "Copy Summary",
      copied: "Copied to Clipboard!",
      shareWhatsApp: "Share to WhatsApp Family Group",
    },
    onboarding: {
      step1Title: "Select Your City",
      step1Desc: "Pick your primary Indian city or metro to track live smog conditions.",
      step2Title: "Your Household Context",
      step2Desc: "Tell us who lives with you so we can tailor medical and lifestyle cautions.",
      step3Title: "Appliances & Commute",
      step3Desc: "Specify if you own an air purifier and your usual daily transit mode.",
      next: "Next Step",
      back: "Back",
      finish: "Get My Personalized Plan",
      skip: "Skip Setup",
    },
    forecast: {
      title: "24-Hour Air Quality Forecast",
      subtitle: "Predictive hourly diurnal curve showing temperature inversion peaks and solar dispersion windows.",
      bestWindow: "Optimal Outdoor Window",
      avoidWindow: "High Exposure Window",
      tableFallback: "View hourly forecast as accessible text table",
    },
    categories: {
      Good: "Good",
      Satisfactory: "Satisfactory",
      Moderate: "Moderate",
      Poor: "Poor",
      VeryPoor: "Very Poor",
      Severe: "Severe",
    },
    disclaimer: "Informational guidance only. Not medical advice. Consult a healthcare professional for clinical decisions.",
  },
  hi: {
    appName: "एयरवाइज़ इंडिया",
    tagline: "स्मार्ट शहरी वायु गुणवत्ता और धुंध सुरक्षा सहायक",
    skipLink: "मुख्य सामग्री पर जाएं",
    cpcbAqi: "सीपीसीबी एक्यूआई",
    pm25: "पीएम 2.5",
    pm10: "पीएम 10",
    source: "स्रोत",
    measured: "मापा गया",
    modelledNote: "यह डेटा इस निर्देशांक के लिए वायुमंडलीय मॉडल अनुमानित हो सकता है",
    lastUpdated: "अभी अपडेट किया गया",
    refresh: "डेटा ताज़ा करें",
    searchPlaceholder: "भारतीय शहर खोजें (उदा. नोएडा, दिल्ली, मुंबई, पटना)...",
    useMyLocation: "मेरे स्थान का उपयोग करें",
    locating: "स्थान खोज रहे हैं...",
    quickCities: "प्रमुख शहर:",
    tabs: {
      all: "सभी सुझाव",
      routines: "दैनिक दिनचर्या",
      indoor: "घर के अंदर की हवा",
      sustainable: "पर्यावरण-अनुकूल विकल्प",
      tools: "इंटरैक्टिव टूल्स",
    },
    tools: {
      title: "इंटरैक्टिव धुंध और स्वास्थ्य टूल्स",
      subtitle: "एयर प्यूरीफायर क्षमता और यात्रा जोखिम के लिए तुरंत कैलकुलेटर।",
      purifierCheckTitle: "एयर प्यूरीफायर सीएडीआर व कमरा आकार जांच",
      purifierCheckDesc: "जांचें कि क्या आपका प्यूरीफायर प्रति घंटे कम से कम 4 बार हवा बदलता है (ACH >= 4.0)।",
      roomSizeLabel: "कमरे का क्षेत्रफल (वर्ग फुट)",
      cadrLabel: "प्यूरीफायर सीएडीआर (m³/घंटा)",
      achLabel: "प्रति घंटा वायु चक्र (ACH)",
      verdictAdequate: "✅ पर्याप्त: कमरे की हवा को प्रति घंटे 4-5 बार पूरी तरह साफ करता है।",
      verdictInadequate: "⚠️ कम क्षमता: गंभीर प्रदूषण के लिए अनुशंसित 4.0 ACH से कम है।",
      whatIfTitle: "यात्रा जोखिम कैलकुलेटर",
      whatIfDesc: "अलग-अलग साधनों (बाइक, कार, मेट्रो) में प्रदूषण जोखिम की तुलना करें।",
      exposureTimelineTitle: "सुरक्षित बाहर रहने का समय",
      exposureTimelineDesc: "वर्तमान एक्यूआई और परिवार की संवेदनशीलता के आधार पर सुरक्षित समय।",
      pickCommute: "यात्रा का साधन चुनें",
    },
    cards: {
      whyThisMatters: "🔬 यह क्यों जरूरी है (वैज्ञानिक कारण)",
      expectedImpact: "✨ अपेक्षित प्रभाव",
      done: "पूर्ण चिह्नित करें",
      completedCount: "कार्य आज पूरे किए गए",
    },
    urgency: {
      now: "तुरंत करें",
      today: "आज",
      thisWeek: "इस हफ्ते",
      preventive: "निवारक",
    },
    chat: {
      title: "एयरवाइज़ से सवाल पूछें",
      subtitle: "अपने शहर के लाइव प्रदूषण और परिवार की स्थिति के आधार पर सवाल पूछें।",
      placeholder: "उदा. क्या मैं कल सुबह जॉगिंग पर जा सकता हूँ?",
      askButton: "पूछें",
      suggestedChips: [
        "क्या कल सुबह टहलना सुरक्षित है?",
        "क्या छोटे बच्चों को स्कूल भेजना चाहिए?",
        "खिड़कियां खोलने का सबसे सही समय?",
        "क्या इनडोर पौधे पीएम 2.5 को साफ करते हैं?",
      ],
      disclaimer: "उत्तर वास्तविक डेटा पर आधारित हैं। यह चिकित्सीय सलाह नहीं है।",
    },
    share: {
      shareTitle: "वायु गुणवत्ता अपडेट साझा करें",
      copySummary: "सारांश कॉपी करें",
      copied: "कॉपी हो गया!",
      shareWhatsApp: "व्हाट्सएप फैमिली ग्रुप पर भेजें",
    },
    onboarding: {
      step1Title: "अपना शहर चुनें",
      step1Desc: "प्रदूषण का स्तर ट्रैक करने के लिए अपना भारतीय शहर चुनें।",
      step2Title: "पारिवारिक स्थिति",
      step2Desc: "बताएं कि घर में छोटे बच्चे, बुजुर्ग या सांस के रोगी हैं या नहीं।",
      step3Title: "उपकरण और आवागमन",
      step3Desc: "बताएं कि क्या आपके पास एयर प्यूरीफायर है और आप कैसे यात्रा करते हैं।",
      next: "आगे बढ़ें",
      back: "पीछे",
      finish: "मेरी व्यक्तिगत योजना दिखाएं",
      skip: "छोड़ें",
    },
    forecast: {
      title: "24 घंटे का वायु गुणवत्ता पूर्वानुमान",
      subtitle: "तापमान व्युत्क्रम (इनवर्जन) और दोपहर के स्वच्छ समय का प्रति घंटा ग्राफ।",
      bestWindow: "बाहर जाने का सबसे अच्छा समय",
      avoidWindow: "अधिकतम प्रदूषण का समय",
      tableFallback: "पूर्वानुमान को टेक्स्ट तालिका के रूप में देखें",
    },
    categories: {
      Good: "अच्छा (Good)",
      Satisfactory: "संतोषजनक (Satisfactory)",
      Moderate: "मध्यम (Moderate)",
      Poor: "खराब (Poor)",
      VeryPoor: "बहुत खराब (Very Poor)",
      Severe: "गंभीर (Severe)",
    },
    disclaimer: "यह केवल सूचनात्मक मार्गदर्शन है, कोई चिकित्सीय सलाह नहीं। किसी भी स्वास्थ्य समस्या के लिए चिकित्सक से परामर्श लें।",
  },
};
