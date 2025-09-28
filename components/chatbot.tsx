"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, TrendingUp, MapPin, Download, HelpCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      content:
        "🌊 Hello! I'm **FloatChat AI**, your intelligent ARGO oceanographic assistant! \n\nI can help you explore our comprehensive dataset:\n• **179,728** ARGO profiles\n• **985+ million** measurements\n• **901** active floats in the Indian Ocean\n\nWhat oceanographic insights are you looking for today?",
      sender: "bot",
      timestamp: new Date(),
      suggestedQuestions: [
        "Show me temperature trends",
        "Where are the active floats?",
        "Latest salinity data",
        "How to export data?",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const quickActions: QuickAction[] = [
    {
      label: "Ocean Trends",
      icon: TrendingUp,
      query: "Show me recent ocean temperature and salinity trends",
      color: "",
    },
    { label: "Float Locations", icon: MapPin, query: "Where are the ARGO floats located currently?", color: "" },
    { label: "Data Export", icon: Download, query: "How can I export and download the oceanographic data?", color: "" },
    { label: "Help Guide", icon: HelpCircle, query: "What can you help me with regarding ARGO data?", color: "" },
  ]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, isTyping])

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim()
    if (!content) return

    setShowSuggestions(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    const typingDelay = 800 + Math.random() * 1500

    setTimeout(async () => {
      const { response, suggestions } = await generateBotResponse(content)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
        suggestedQuestions: suggestions,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, typingDelay)
  }

  const handleQuickAction = (action: QuickAction) => handleSendMessage(action.query)
  const handleSuggestionClick = (s: string) => handleSendMessage(s)

  const generateBotResponse = async (userInput: string): Promise<{ response: string; suggestions?: string[] }> => {
    const input = userInput.toLowerCase()

    if (
      input.includes("temperature") ||
      input.includes("temp") ||
      input.includes("thermal") ||
      input.includes("warming")
    ) {
      return {
        response:
          "🌡️ **Ocean Temperature Insights:**\n\nOur dataset shows fascinating thermal patterns in the Indian Ocean:\n• **Average temperature:** 7.1°C across all depths\n• **Surface temps:** Range from 24-30°C in tropical regions\n• **Thermocline depth:** Typically 200-300m depth\n• **Seasonal variations:** Up to 3°C difference\n\n📊 The data reveals clear warming trends in upper ocean layers, particularly near the equator. Would you like me to show you specific depth ranges or regional variations?",
        suggestions: [
          "Show temperature at 100m depth",
          "Temperature trends by region",
          "Seasonal temperature changes",
          "Surface vs deep temperatures",
        ],
      }
    }

    if (input.includes("salinity") || input.includes("salt") || input.includes("psu") || input.includes("water mass")) {
      return {
        response:
          "🧂 **Salinity Analysis:**\n\nSalinity tells us about ocean circulation and mixing:\n• **Average salinity:** 34.5 PSU (Practical Salinity Units)\n• **Surface salinity:** 33.0-36.5 PSU range\n• **Deep water:** More stable at ~34.7 PSU\n• **Freshwater influence:** Monsoon and river inputs\n\n💧 Higher salinity indicates evaporation-dominated regions, while lower values show precipitation or freshwater input. This helps us track water masses and ocean currents!",
        suggestions: [
          "Salinity vs depth profiles",
          "High salinity regions",
          "Freshwater influence patterns",
          "Salinity seasonal cycles",
        ],
      }
    }

    if (input.includes("float") || input.includes("sensor") || input.includes("buoy") || input.includes("instrument")) {
      return {
        response:
          "🛰️ **ARGO Float Network:**\n\nOur autonomous ocean sentinels are amazing:\n• **901 active floats** currently operating\n• **10-day cycles:** Dive to 2000m, surface, transmit data\n• **Battery life:** 4-7 years of continuous operation\n• **Global coverage:** Part of international ARGO program\n\n🔄 Each float is like a robotic oceanographer, collecting data 24/7 and transmitting via satellite. They're programmed to drift with currents, giving us a dynamic view of ocean changes.",
        suggestions: [
          "Float deployment locations",
          "How floats collect data",
          "Float battery and lifespan",
          "Recent float deployments",
        ],
      }
    }

    if (
      input.includes("location") ||
      input.includes("where") ||
      input.includes("region") ||
      input.includes("area") ||
      input.includes("indian ocean") ||
      input.includes("geographic")
    ) {
      return {
        response:
          "🗺️ **Indian Ocean Coverage:**\n\nOur data spans the entire Indian Ocean basin:\n• **Longitude:** 20°E to 150°E (from Africa to Australia)\n• **Latitude:** 30°N to 60°S (Arabia to Antarctic)\n• **Key regions:** Arabian Sea, Bay of Bengal, Southern Ocean\n• **Hotspots:** Monsoon regions, upwelling zones, current systems\n\n🌍 This covers critical areas like the Agulhas Current, Indonesian Throughflow, and monsoon-driven circulation patterns.",
        suggestions: [
          "Arabian Sea data",
          "Southern Ocean profiles",
          "Bay of Bengal measurements",
          "Current system tracking",
        ],
      }
    }

    if (
      input.includes("profile") ||
      input.includes("data structure") ||
      input.includes("measurement") ||
      input.includes("179") ||
      input.includes("985")
    ) {
      return {
        response:
          "📊 **Dataset Overview:**\n\nMassive oceanographic dataset at your fingertips:\n• **179,728 profiles** - Complete depth measurements\n• **985+ million data points** - Individual measurements\n• **Parameters:** Temperature, Salinity, Pressure, Depth\n• **Time span:** Multi-year continuous coverage\n\n🔍 Each profile represents one complete dive cycle, with measurements every few meters from surface to 2000m depth. It's like having millions of ocean thermometers!",
        suggestions: [
          "Recent profiles analysis",
          "Data quality metrics",
          "Profile depth distribution",
          "Measurement frequency",
        ],
      }
    }

    if (
      input.includes("trend") ||
      input.includes("analysis") ||
      input.includes("pattern") ||
      input.includes("change") ||
      input.includes("evolution")
    ) {
      return {
        response:
          "📈 **Ocean Trend Analysis:**\n\nFascinating patterns emerging from our data:\n• **Warming trend:** +0.12°C/decade in upper 100m\n• **Salinity changes:** Increasing in evaporation zones\n• **Seasonal cycles:** Strong monsoon influence\n• **Depth variations:** Different patterns at various levels\n\n🌊 The Indian Ocean is showing clear climate signals, with warming most pronounced in the western regions and significant seasonal variability due to monsoon patterns.",
        suggestions: [
          "Decadal warming trends",
          "Monsoon impact analysis",
          "Regional variation patterns",
          "Climate change indicators",
        ],
      }
    }

    if (
      input.includes("export") ||
      input.includes("download") ||
      input.includes("csv") ||
      input.includes("data access")
    ) {
      return {
        response:
          "💾 **Data Export Options:**\n\nGet your data for analysis:\n• **Dashboard filters:** Select specific criteria first\n• **Export formats:** CSV, NetCDF for research use\n• **Custom queries:** Filter by region, depth, time period\n• **API access:** Programmatic data retrieval available\n\n⚡ Pro tip: Use our advanced filters to narrow down to exactly what you need before exporting - it saves time and gives you cleaner datasets!",
        suggestions: ["How to filter data", "Available export formats", "API documentation", "Large dataset handling"],
      }
    }

    if (input.includes("help") || input.includes("how") || input.includes("guide") || input.includes("tutorial")) {
      return {
        response:
          "🎯 **FloatChat AI Capabilities:**\n\nI'm your oceanographic data expert! I can help with:\n\n**📊 Data Analysis:**\n• Temperature & salinity trends\n• Regional ocean patterns\n• Seasonal variations\n\n**🔍 Data Exploration:**\n• Profile explanations\n• Float network insights\n• Geographic coverage\n\n**⚙️ Technical Support:**\n• Data export guidance\n• Filter usage tips\n• API access help\n\n**💡 Scientific Insights:**\n• Oceanographic interpretations\n• Climate pattern analysis\n• Research suggestions",
        suggestions: [
          "Dashboard tutorial",
          "Data interpretation help",
          "Research methodology",
          "Technical documentation",
        ],
      }
    }

    if (input.includes("hello") || input.includes("hi") || input.includes("hey") || input.includes("good")) {
      return {
        response:
          "🌊 Hello there, ocean explorer! \n\nI'm thrilled to help you dive into our ARGO oceanographic data! Whether you're a researcher, student, or just curious about our oceans, I can guide you through:\n\n• **Temperature & salinity patterns**\n• **Float network insights**  \n• **Regional ocean analysis**\n• **Data export techniques**\n\nWhat aspect of oceanography interests you most today?",
        suggestions: [
          "What's new in the data?",
          "Show me ocean patterns",
          "How do ARGO floats work?",
          "Climate change signals",
        ],
      }
    }

    const contextualResponses = [
      {
        response:
          "🤔 **Interesting question!** \n\nI'd love to help you explore our ARGO dataset further. Our Indian Ocean data is rich with insights about:\n\n• Ocean temperature patterns\n• Salinity distributions  \n• Float network coverage\n• Seasonal variations\n\nCould you tell me more specifically what you're looking for? I can provide detailed analysis and visualizations!",
        suggestions: ["Temperature analysis", "Salinity patterns", "Float locations", "Data trends"],
      },
      {
        response:
          "🌊 **Great to chat with you!** \n\nI'm equipped with comprehensive knowledge of our 179K+ ARGO profiles. Whether you need:\n\n• **Scientific insights** about ocean conditions\n• **Technical help** with data access\n• **Analysis guidance** for research\n• **Trend explanations** for patterns\n\nI'm here to make oceanographic data accessible and meaningful. What would you like to explore?",
        suggestions: ["Recent ocean changes", "Data quality insights", "Research applications", "Export data guide"],
      },
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
    <div className="fixed inset-x-0 bottom-0 top-[var(--nav-h,64px)] bg-background overflow-hidden z-10">
      <div className="h-full grid grid-rows-[1fr,auto]">
        <ScrollArea className="h-full min-h-0">
          <div className="w-full px-4 md:px-8 py-8 md:py-10 pb-32 md:pb-36" role="log" aria-live="polite">
            <div className="space-y-10 md:space-y-16">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4 md:space-y-8">
                  <div className={`flex gap-4 md:gap-8 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {message.sender === "bot" && (
                      <div className="flex-shrink-0 mt-1.5 md:mt-2">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-3xl bg-primary flex items-center justify-center shadow-md">
                          <Bot className="h-5 w-5 md:h-7 md:w-7 text-primary-foreground" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 md:px-6 py-3.5 md:py-4 shadow-md text-base leading-relaxed whitespace-pre-wrap ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card text-card-foreground border border-border rounded-bl-sm"
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.sender === "user" && (
                      <div className="flex-shrink-0 mt-1.5 md:mt-2">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-3xl bg-foreground/80 flex items-center justify-center shadow-md">
                          <User className="h-5 w-5 md:h-7 md:w-7 text-background" />
                        </div>
                      </div>
                    )}
                  </div>

                  {message.suggestedQuestions && (
                    <div className="flex flex-wrap gap-2.5 md:gap-3 pl-14 md:pl-20">
                      {message.suggestedQuestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-sm px-4 md:px-5 py-2 border-border text-foreground hover:bg-secondary bg-transparent"
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
                <div className="flex gap-4 md:gap-6 justify-start" aria-live="polite">
                  <div className="flex-shrink-0 mt-1.5 md:mt-2">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-3xl bg-primary flex items-center justify-center shadow-md">
                      <Bot className="h-5 w-5 md:h-7 md:w-7 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="bg-card text-card-foreground border border-border rounded-2xl px-4 md:px-6 py-3.5 md:py-4 shadow-md max-w-[80%] md:max-w-[70%]">
                    <div className="flex gap-2 items-center">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} aria-hidden="true" />
            </div>
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 left-0 z-20 border-t border-border bg-background/95 backdrop-blur px-4 md:px-8 py-5 md:py-6">
          {showSuggestions && (
            <div className="flex flex-wrap gap-2.5 md:gap-3 mb-3.5 md:mb-4">
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-sm px-4 md:px-5 py-2 flex items-center gap-2 border border-border hover:bg-secondary"
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className="h-4 w-4 text-accent" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          <div className="flex gap-3 md:gap-4">
            <label htmlFor="chat-input" className="sr-only">
              Ask about ARGO ocean data
            </label>
            <Input
              id="chat-input"
              placeholder="Ask about ARGO data, ocean trends, floats..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-xl border-border bg-muted text-foreground text-base px-4 md:px-5 py-3.5 md:py-4"
              aria-label="Chat input"
            />
            <Button
              onClick={() => handleSendMessage()}
              className="rounded-xl px-5 md:px-6 py-3.5 md:py-4 bg-primary hover:opacity-90 text-primary-foreground shadow-md"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
