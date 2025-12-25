// Mock AI API responses with realistic delays and streaming simulation

export interface AIResponse {
  content: string;
  suggestions?: string[];
  filters?: { label: string; value: string }[];
  actions?: { label: string; icon: string }[];
}

export interface StreamChunk {
  content: string;
  isComplete: boolean;
}

// Simulated AI responses for different query types
const searchResponses: Record<string, AIResponse> = {
  default: {
    content: "I found several results matching your query. Here are some AI-suggested refinements.",
    suggestions: ["Recent items", "Most popular", "By category"],
    filters: [
      { label: "Last 7 days", value: "7d" },
      { label: "Active only", value: "active" },
      { label: "High priority", value: "high" },
    ],
    actions: [
      { label: "Export results", icon: "download" },
      { label: "Create report", icon: "file-text" },
      { label: "Set alert", icon: "bell" },
    ],
  },
  analytics: {
    content: "Based on your analytics query, I've identified key trends and patterns.",
    suggestions: ["Compare periods", "Segment by source", "View anomalies"],
    filters: [
      { label: "Traffic sources", value: "sources" },
      { label: "Conversion rate", value: "conversion" },
      { label: "User behavior", value: "behavior" },
    ],
    actions: [
      { label: "Generate insights", icon: "sparkles" },
      { label: "Schedule report", icon: "calendar" },
    ],
  },
  users: {
    content: "I've analyzed your user data and found actionable insights.",
    suggestions: ["Active users", "Churn risk", "Top performers"],
    filters: [
      { label: "New users", value: "new" },
      { label: "Premium tier", value: "premium" },
      { label: "Inactive", value: "inactive" },
    ],
    actions: [
      { label: "Send campaign", icon: "mail" },
      { label: "Export segment", icon: "users" },
    ],
  },
};

const chatResponses = [
  "Based on your current dashboard data, I can see that user engagement has increased by 23% this week. Would you like me to analyze the contributing factors?",
  "I've analyzed the patterns in your data. The peak activity times are between 2-4 PM UTC. Consider scheduling your campaigns during these windows for maximum impact.",
  "Looking at your metrics, I notice an opportunity to improve conversion rates. The checkout flow shows a 15% drop-off at step 3. Would you like suggestions for optimization?",
  "Your API performance looks healthy with 99.7% uptime this month. I detected a brief latency spike on Tuesday that was automatically resolved.",
  "I've prepared a summary of your weekly KPIs: Revenue is up 12%, new signups increased by 8%, and customer satisfaction remains at 4.7/5 stars.",
];

const formSuggestions = {
  email: ["user@company.com", "admin@example.org", "contact@business.io"],
  name: ["John Smith", "Sarah Johnson", "Alex Chen"],
  company: ["Acme Corp", "TechStart Inc", "Digital Solutions LLC"],
  role: ["Product Manager", "Software Engineer", "Marketing Lead"],
};

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Random delay between min and max ms
const randomDelay = (min: number, max: number) =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);

// Simulate AI search response
export async function fetchAISearchResults(query: string): Promise<AIResponse> {
  await randomDelay(800, 1500);
  
  const queryLower = query.toLowerCase();
  if (queryLower.includes("analytics") || queryLower.includes("data")) {
    return searchResponses.analytics;
  }
  if (queryLower.includes("user") || queryLower.includes("customer")) {
    return searchResponses.users;
  }
  return searchResponses.default;
}

// Simulate streaming AI response
export async function* streamAIResponse(
  message: string
): AsyncGenerator<StreamChunk> {
  await randomDelay(300, 600);
  
  // Pick a random response or generate contextual one
  let response = chatResponses[Math.floor(Math.random() * chatResponses.length)];
  
  if (message.toLowerCase().includes("help")) {
    response = "I'm here to help! I can assist you with analyzing dashboard metrics, generating reports, identifying trends, and providing actionable insights. What would you like to explore?";
  } else if (message.toLowerCase().includes("report")) {
    response = "I can generate several types of reports for you: Weekly Performance Summary, User Engagement Analysis, Revenue Breakdown, or a Custom Report. Which would you prefer?";
  }
  
  const words = response.split(" ");
  let accumulated = "";
  
  for (let i = 0; i < words.length; i++) {
    await randomDelay(30, 80); // Simulate typing speed
    accumulated += (i === 0 ? "" : " ") + words[i];
    yield {
      content: accumulated,
      isComplete: i === words.length - 1,
    };
  }
}

// Simulate form field suggestions
export async function fetchFormSuggestions(
  field: string,
  value: string
): Promise<string[]> {
  await randomDelay(200, 400);
  
  const fieldSuggestions = formSuggestions[field as keyof typeof formSuggestions] || [];
  
  if (!value) return fieldSuggestions.slice(0, 3);
  
  return fieldSuggestions
    .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 3);
}

// Simulate form validation with AI
export async function validateFormWithAI(
  formData: Record<string, string>
): Promise<{ isValid: boolean; warnings: string[]; tips: string[] }> {
  await randomDelay(500, 1000);
  
  const warnings: string[] = [];
  const tips: string[] = [];
  
  if (formData.email && !formData.email.includes("@")) {
    warnings.push("Email format appears invalid");
  }
  
  if (formData.name && formData.name.length < 3) {
    warnings.push("Name seems too short");
  }
  
  if (formData.company) {
    tips.push("Pro tip: Adding company details helps personalize your experience");
  }
  
  if (!formData.role) {
    tips.push("Consider adding your role for better AI recommendations");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    tips,
  };
}

// Simulate random failures for error handling demo
export async function fetchWithPossibleError<T>(
  fetcher: () => Promise<T>,
  errorRate = 0.1
): Promise<T> {
  if (Math.random() < errorRate) {
    await randomDelay(500, 1000);
    throw new Error("Network request failed. Please try again.");
  }
  return fetcher();
}
