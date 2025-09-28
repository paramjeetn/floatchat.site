"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, MessageSquare, Waves, TrendingUp, MapPin, Download, HelpCircle, Sparkles, Activity } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isTyping?: boolean
  suggestedQuestions?: string[]
}

interface QuickAction {
  label: string
  icon: React.ElementType
  query: string
  color: string
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "🌊 Hello! I'm **FloatChat AI**, your intelligent ARGO oceanographic assistant! \n\nI can help you explore our comprehensive dataset:\n• **179,728** ARGO profiles\n• **985+ million** measurements\n• **901** active floats in the Indian Ocean\n\nWhat oceanographic insights are you looking for today?",
      sender: "bot",
      timestamp: new Date(),
      suggestedQuestions: [
        "Show me temperature trends",
        "Where are the active floats?",
        "Latest salinity data",
        "How to export data?"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions: QuickAction[] = [
    { label: "Ocean Trends", icon: TrendingUp, query: "Show me recent ocean temperature and salinity trends", color: "bg-blue-500" },
    { label: "Float Locations", icon: MapPin, query: "Where are the ARGO floats located currently?", color: "bg-green-500" },
    { label: "Data Export", icon: Download, query: "How can I export and download the oceanographic data?", color: "bg-purple-500" },
    { label: "Help Guide", icon: HelpCircle, query: "What can you help me with regarding ARGO data?", color: "bg-orange-500" }
  ]

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim()
    if (!content) return

    setShowSuggestions(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate realistic typing delay
    const typingDelay = 800 + Math.random() * 1500 // 0.8-2.3 seconds

    setTimeout(async () => {
      const { response, suggestions } = await generateBotResponse(content)

      // Simulate gradual typing effect
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
        suggestedQuestions: suggestions
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, typingDelay)
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.query)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const generateBotResponse = async (userInput: string): Promise<{ response: string, suggestions?: string[] }> => {
    const input = userInput.toLowerCase()

    // Temperature and thermal analysis
    if (input.includes("temperature") || input.includes("temp") || input.includes("thermal") || input.includes("warming")) {
      return {
        response: "🌡️ **Ocean Temperature Insights:**\n\nOur dataset shows fascinating thermal patterns in the Indian Ocean:\n• **Average temperature:** 7.1°C across all depths\n• **Surface temps:** Range from 24-30°C in tropical regions\n• **Thermocline depth:** Typically 200-300m depth\n• **Seasonal variations:** Up to 3°C difference\n\n📊 The data reveals clear warming trends in upper ocean layers, particularly near the equator. Would you like me to show you specific depth ranges or regional variations?",
        suggestions: ["Show temperature at 100m depth", "Temperature trends by region", "Seasonal temperature changes", "Surface vs deep temperatures"]
      }
    }

    // Salinity and water mass analysis
    if (input.includes("salinity") || input.includes("salt") || input.includes("psu") || input.includes("water mass")) {
      return {
        response: "🧂 **Salinity Analysis:**\n\nSalinity tells us about ocean circulation and mixing:\n• **Average salinity:** 34.5 PSU (Practical Salinity Units)\n• **Surface salinity:** 33.0-36.5 PSU range\n• **Deep water:** More stable at ~34.7 PSU\n• **Freshwater influence:** Monsoon and river inputs\n\n💧 Higher salinity indicates evaporation-dominated regions, while lower values show precipitation or freshwater input. This helps us track water masses and ocean currents!",
        suggestions: ["Salinity vs depth profiles", "High salinity regions", "Freshwater influence patterns", "Salinity seasonal cycles"]
      }
    }

    // ARGO float information
    if (input.includes("float") || input.includes("sensor") || input.includes("buoy") || input.includes("instrument")) {
      return {
        response: "🛰️ **ARGO Float Network:**\n\nOur autonomous ocean sentinels are amazing:\n• **901 active floats** currently operating\n• **10-day cycles:** Dive to 2000m, surface, transmit data\n• **Battery life:** 4-7 years of continuous operation\n• **Global coverage:** Part of international ARGO program\n\n🔄 Each float is like a robotic oceanographer, collecting data 24/7 and transmitting via satellite. They're programmed to drift with currents, giving us a dynamic view of ocean changes.",
        suggestions: ["Float deployment locations", "How floats collect data", "Float battery and lifespan", "Recent float deployments"]
      }
    }

    // Location and geographic queries
    if (input.includes("location") || input.includes("where") || input.includes("region") || input.includes("area") || input.includes("indian ocean") || input.includes("geographic")) {
      return {
        response: "🗺️ **Indian Ocean Coverage:**\n\nOur data spans the entire Indian Ocean basin:\n• **Longitude:** 20°E to 150°E (from Africa to Australia)\n• **Latitude:** 30°N to 60°S (Arabia to Antarctic)\n• **Key regions:** Arabian Sea, Bay of Bengal, Southern Ocean\n• **Hotspots:** Monsoon regions, upwelling zones, current systems\n\n🌍 This covers critical areas like the Agulhas Current, Indonesian Throughflow, and monsoon-driven circulation patterns.",
        suggestions: ["Arabian Sea data", "Southern Ocean profiles", "Bay of Bengal measurements", "Current system tracking"]
      }
    }

    // Data profiles and structure
    if (input.includes("profile") || input.includes("data structure") || input.includes("measurement") || input.includes("179") || input.includes("985")) {
      return {
        response: "📊 **Dataset Overview:**\n\nMassive oceanographic dataset at your fingertips:\n• **179,728 profiles** - Complete depth measurements\n• **985+ million data points** - Individual measurements\n• **Parameters:** Temperature, Salinity, Pressure, Depth\n• **Time span:** Multi-year continuous coverage\n\n🔍 Each profile represents one complete dive cycle, with measurements every few meters from surface to 2000m depth. It's like having millions of ocean thermometers!",
        suggestions: ["Recent profiles analysis", "Data quality metrics", "Profile depth distribution", "Measurement frequency"]
      }
    }

    // Trends and analysis
    if (input.includes("trend") || input.includes("analysis") || input.includes("pattern") || input.includes("change") || input.includes("evolution")) {
      return {
        response: "📈 **Ocean Trend Analysis:**\n\nFascinating patterns emerging from our data:\n• **Warming trend:** +0.12°C/decade in upper 100m\n• **Salinity changes:** Increasing in evaporation zones\n• **Seasonal cycles:** Strong monsoon influence\n• **Depth variations:** Different patterns at various levels\n\n🌊 The Indian Ocean is showing clear climate signals, with warming most pronounced in the western regions and significant seasonal variability due to monsoon patterns.",
        suggestions: ["Decadal warming trends", "Monsoon impact analysis", "Regional variation patterns", "Climate change indicators"]
      }
    }

    // Export and download
    if (input.includes("export") || input.includes("download") || input.includes("csv") || input.includes("data access")) {
      return {
        response: "💾 **Data Export Options:**\n\nGet your data for analysis:\n• **Dashboard filters:** Select specific criteria first\n• **Export formats:** CSV, NetCDF for research use\n• **Custom queries:** Filter by region, depth, time period\n• **API access:** Programmatic data retrieval available\n\n⚡ Pro tip: Use our advanced filters to narrow down to exactly what you need before exporting - it saves time and gives you cleaner datasets!",
        suggestions: ["How to filter data", "Available export formats", "API documentation", "Large dataset handling"]
      }
    }

    // Help and guidance
    if (input.includes("help") || input.includes("how") || input.includes("guide") || input.includes("tutorial")) {
      return {
        response: "🎯 **FloatChat AI Capabilities:**\n\nI'm your oceanographic data expert! I can help with:\n\n**📊 Data Analysis:**\n• Temperature & salinity trends\n• Regional ocean patterns\n• Seasonal variations\n\n**🔍 Data Exploration:**\n• Profile explanations\n• Float network insights\n• Geographic coverage\n\n**⚙️ Technical Support:**\n• Data export guidance\n• Filter usage tips\n• API access help\n\n**💡 Scientific Insights:**\n• Oceanographic interpretations\n• Climate pattern analysis\n• Research suggestions",
        suggestions: ["Dashboard tutorial", "Data interpretation help", "Research methodology", "Technical documentation"]
      }
    }

    // Greetings
    if (input.includes("hello") || input.includes("hi") || input.includes("hey") || input.includes("good")) {
      return {
        response: "🌊 Hello there, ocean explorer! \n\nI'm thrilled to help you dive into our ARGO oceanographic data! Whether you're a researcher, student, or just curious about our oceans, I can guide you through:\n\n• **Temperature & salinity patterns**\n• **Float network insights**  \n• **Regional ocean analysis**\n• **Data export techniques**\n\nWhat aspect of oceanography interests you most today?",
        suggestions: ["What's new in the data?", "Show me ocean patterns", "How do ARGO floats work?", "Climate change signals"]
      }
    }

    // Default intelligent responses
    const contextualResponses = [
      {
        response: "🤔 **Interesting question!** \n\nI'd love to help you explore our ARGO dataset further. Our Indian Ocean data is rich with insights about:\n\n• Ocean temperature patterns\n• Salinity distributions  \n• Float network coverage\n• Seasonal variations\n\nCould you tell me more specifically what you're looking for? I can provide detailed analysis and visualizations!",
        suggestions: ["Temperature analysis", "Salinity patterns", "Float locations", "Data trends"]
      },
      {
        response: "🌊 **Great to chat with you!** \n\nI'm equipped with comprehensive knowledge of our 179K+ ARGO profiles. Whether you need:\n\n• **Scientific insights** about ocean conditions\n• **Technical help** with data access\n• **Analysis guidance** for research\n• **Trend explanations** for patterns\n\nI'm here to make oceanographic data accessible and meaningful. What would you like to explore?",
        suggestions: ["Recent ocean changes", "Data quality insights", "Research applications", "Export data guide"]
      }
    ]

    const randomResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)]
    return randomResponse
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-cyan-950/30 overflow-hidden">
      {/* Professional Full-Width Header */}
      <div className="flex-shrink-0 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm">
        <div className="w-full px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-xl ring-2 ring-blue-100 dark:ring-blue-900">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white dark:border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    FloatChat AI
                  </h1>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 px-4 py-1.5">
                      <Activity className="h-4 w-4 mr-2 animate-pulse" />
                      Online & Ready
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-1.5">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI-Powered
                    </Badge>
                  </div>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
                  Advanced ARGO Oceanographic Research Assistant • Real-time Data Analysis & Insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">179,728 Profiles</span>
                </div>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600" />
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">985M+ Measurements</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-5 py-2.5">
                <Waves className="h-4 w-4 mr-2" />
                Indian Ocean Dataset
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Messages Area */}
        <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
          <div className="w-full px-8 py-10">
            <div className="space-y-16">
              {messages.map((message) => (
                <div key={message.id} className="space-y-8">
                  <div
                    className={`flex gap-8 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "bot" && (
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center                         justify-center shadow-md">
                          <Bot className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] rounded-2xl px-6 py-4 shadow-md text-base leading-relaxed whitespace-pre-wrap ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-sm"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm"
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.sender === "user" && (
                      <div className="flex-shrink-0 mt-2">
                        <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-md">
                          <User className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested follow-up questions */}
                  {message.suggestedQuestions && (
                    <div className="flex flex-wrap gap-3 pl-20">
                      {message.suggestedQuestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-sm px-5 py-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-6 justify-start">
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
                      <Bot className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 shadow-md max-w-[70%]">
                    <div className="flex gap-2 items-center">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Chat Input + Suggestions */}
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-8 py-6">
          {/* Small suggestions row (instead of big Quick Start Guide) */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-3 mb-4">
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className={`rounded-full text-sm px-5 py-2 flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800`}
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className={`h-4 w-4 ${action.color.replace("bg-", "text-")}`} />
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <Input
              placeholder="Ask about ARGO data, ocean trends, floats..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-xl border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-base px-5 py-4"
            />
            <Button
              onClick={() => handleSendMessage()}
              className="rounded-xl px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

