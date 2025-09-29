"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Bot, TrendingUp, MapPin, Download, HelpCircle, ChevronDown, ChevronRight, Brain, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import mockData, { type AgentThought } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface ChartData {
  month?: string
  date?: string
  depth?: number
  salinity?: number
  oxygen?: number
  temperature?: number
  chlorophyll?: number
  latitude?: number
  longitude?: number
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isTyping?: boolean
  suggestedQuestions?: string[]
  agentThoughts?: AgentThought[]
  currentThinkingAgent?: number
  isThinking?: boolean
  chartData?: ChartData[]
  showChart?: boolean
}

interface QuickAction {
  label: string
  icon: React.ElementType
  query: string
  color: string
}

export function Chatbot(): ReactElement {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "🌊 Hello! I'm **FloatChat AI**, your intelligent ARGO oceanographic assistant! \n\nI can help you explore our comprehensive dataset:\n• **179,728** ARGO profiles\n• **117+ million** measurements\n• **786** active floats in the Indian Ocean\n\nWhat oceanographic insights are you looking for today?",
      sender: "bot",
      timestamp: new Date(),
      suggestedQuestions: Object.keys(mockData).slice(0, 4),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const prevMsgCountRef = useRef<number>(messages.length)
  const prevIsTypingRef = useRef<boolean>(false)
  const { toast } = useToast()

  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  const [currentResponseId, setCurrentResponseId] = useState<string | null>(null)
  const programmaticScrollRef = useRef(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
    const msgCount = messages.length
    const addedMessage = msgCount > prevMsgCountRef.current
    const startedTyping = isTyping && !prevIsTypingRef.current

    if (autoScrollEnabled && (addedMessage || startedTyping || isTyping)) {
      programmaticScrollRef.current = true

      const root = scrollAreaRef.current
      if (root) {
        const viewport = root.querySelector<HTMLDivElement>("[data-radix-scroll-area-viewport]")
        if (viewport) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth"
          })
        }
      }

      setTimeout(() => {
        programmaticScrollRef.current = false
      }, 500)
    }

    prevMsgCountRef.current = msgCount
    prevIsTypingRef.current = isTyping
  }, [messages, isTyping, autoScrollEnabled])

  useEffect(() => {
    const root = scrollAreaRef.current
    if (!root) return
    const viewport = root.querySelector<HTMLDivElement>("[data-radix-scroll-area-viewport]")
    if (!viewport) return

    const onScroll = () => {
      if (programmaticScrollRef.current) return
      const atBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 24

      if (!atBottom && isTyping && currentResponseId) {
        setAutoScrollEnabled(false) // user scrolled up during response → pause for this response
      } else if (atBottom && isTyping && currentResponseId) {
        setAutoScrollEnabled(true) // user went back to bottom during response → resume
      }
    }

    viewport.addEventListener("scroll", onScroll, { passive: true })
    return () => viewport.removeEventListener("scroll", onScroll)
  }, [isTyping, currentResponseId])

  // Auto-resize textarea when inputValue changes externally (e.g., from suggestions)
  useEffect(() => {
    autoResizeTextarea()
  }, [inputValue])

  const extractCodeMeta = (snippet: string | undefined): { language: string; content: string } => {
    if (!snippet) return { language: "Code", content: "" }
    const fence = snippet.match(/```(\w+)?\n([\s\S]*?)```/m)
    if (fence) {
      const langRaw = (fence[1] || "").toLowerCase()
      const map: Record<string, string> = {
        ts: "TypeScript",
        tsx: "TypeScript",
        js: "JavaScript",
        jsx: "JavaScript",
        json: "JSON",
        sql: "SQL",
        sh: "Shell",
        bash: "Shell",
        py: "Python",
      }
      return { language: map[langRaw] || (langRaw ? langRaw.toUpperCase() : "Code"), content: fence[2].trim() }
    }
    // heuristics when no fences
    const t = snippet.trim()
    if (/^\s*[{[]/.test(t)) return { language: "JSON", content: snippet }
    if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|WITH|FROM|WHERE)\b/i.test(snippet))
      return { language: "SQL", content: snippet }
    if (/\b(import|export|type|interface|const|let|=>|function)\b/.test(snippet))
      return { language: "TypeScript", content: snippet }
    if (/\b(console\.log|var )\b/.test(snippet)) return { language: "JavaScript", content: snippet }
    return { language: "Code", content: snippet }
  }

  const formatMessageContent = (content: string): ReactElement => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g)

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const text = part.slice(2, -2)
            return <span key={index} className="font-bold text-primary">{text}</span>
          }
          return <span key={index}>{part}</span>
        })}
      </>
    )
  }

  const highlightCode = (code: string, language: string): ReactElement => {
    if (language === "JSON") {
      const highlighted = code
        .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:')
        .replace(/:\s*"([^"]*)"/g, ': <span class="text-green-400">"$1"</span>')
        .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-orange-400">$1</span>')
        .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>')
      return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
    }

    if (language === "SQL") {
      let highlighted = code

      highlighted = highlighted.replace(/'([^']*)'/g, '<STRING>$1</STRING>')
      highlighted = highlighted.replace(/`([^`]+)`/g, '<IDENT>$1</IDENT>')
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<NUM>$1</NUM>')

      highlighted = highlighted.replace(
        /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|ON|AND|OR|IN|AS|GROUP|ORDER|BY|LIMIT|INSERT|UPDATE|DELETE|CREATE|TABLE|WITH|EXTRACT|YEAR|MONTH|BETWEEN|IS|NOT|NULL|DISTINCT|COUNT|AVG|SUM|MAX|MIN|HAVING)\b/gi,
        '<KW>$1</KW>',
      )

      highlighted = highlighted.replace(/<KW>/g, '<span class="text-pink-400 font-semibold">')
      highlighted = highlighted.replace(/<\/KW>/g, '</span>')
      highlighted = highlighted.replace(/<IDENT>/g, '<span class="text-cyan-400">`')
      highlighted = highlighted.replace(/<\/IDENT>/g, '`</span>')
      highlighted = highlighted.replace(/<STRING>/g, '<span class="text-green-400">\'')
      highlighted = highlighted.replace(/<\/STRING>/g, '\'</span>')
      highlighted = highlighted.replace(/<NUM>/g, '<span class="text-orange-400">')
      highlighted = highlighted.replace(/<\/NUM>/g, '</span>')

      return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
    }

    if (language === "TypeScript" || language === "JavaScript") {
      const highlighted = code
        .replace(
          /\b(const|let|var|function|return|if|else|for|while|import|export|from|type|interface|class|extends|implements)\b/g,
          '<span class="text-purple-400 font-semibold">$1</span>',
        )
        .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
        .replace(/'([^']*)'/g, '<span class="text-green-400">\'$1\'</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
        .replace(/\/\/(.*)/g, '<span class="text-gray-500">//$1</span>')
      return <span dangerouslySetInnerHTML={{ __html: highlighted }} />
    }

    return <span>{code}</span>
  }

  const simulateAgentThinking = async (content: string, botMessageId: string, agentThoughts: AgentThought[]) => {
    for (let i = 0; i < agentThoughts.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

      setMessages((prev) => prev.map((msg) => (msg.id === botMessageId ? { ...msg, currentThinkingAgent: i } : msg)))
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === botMessageId ? { ...msg, isThinking: false, currentThinkingAgent: undefined } : msg,
      ),
    )

    const { response, suggestions, chartData } = await generateBotResponse(content)

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === botMessageId
          ? {
              ...msg,
              content: response,
              suggestedQuestions: suggestions,
              showChart: Array.isArray(chartData) && chartData.length > 0,
              chartData,
            }
          : msg,
      ),
    )

    setIsTyping(false)
    setAutoScrollEnabled(true)
    setCurrentResponseId(null)
  }

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

    const typingDelay = 800 + Math.random() * 500

    setTimeout(async () => {
      const mockResponse = mockData[content]
      const agents = mockResponse ? mockResponse.agentThoughts : generateAgentThoughts(content)

      // create bot placeholder message
      const botMessageId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          sender: "bot",
          content: "",
          timestamp: new Date(),
          agentThoughts: agents,
          currentThinkingAgent: -1,
          isThinking: true,
        },
      ])

      setCurrentResponseId(botMessageId)
      setAutoScrollEnabled(true)

      simulateAgentThinking(content, botMessageId, agents)
    }, typingDelay)
  }


  const generateAgentThoughts = (userInput: string): AgentThought[] => {
    const input = userInput.toLowerCase()

    const agents: AgentThought[] = [
      {
        agentName: "Query Analyzer",
        content:
          "Analyzing user intent and extracting key oceanographic parameters from the natural language query. Identifying primary data dimensions (temporal, spatial, depth-based) and categorizing the request type. Performing semantic analysis to understand whether this is a data retrieval, trend analysis, or comparative study request. Cross-referencing with available ARGO float metadata to ensure feasibility.",
        codeSnippet: `{
  "query_type": "${input.includes("temperature") ? "temperature_analysis" : input.includes("salinity") ? "salinity_analysis" : "data_exploration"}",
  "extracted_entities": [
    "${input.split(" ").slice(0, 3).join('",\n    "')}"
  ],
  "temporal_scope": "2019-full-year",
  "parameters_detected": ["salinity", "oxygen", "depth"],
  "confidence_score": ${(0.85 + Math.random() * 0.1).toFixed(3)},
  "complexity_level": "medium",
  "estimated_data_volume": "~150k records"
}`,
        isExpanded: false,
      },
      {
        agentName: "Database Query Engine",
        content:
          "Constructing optimized SQL queries with proper indexing strategies to efficiently retrieve data from the 985M+ measurement database. Applying spatial filters for the Indian Ocean region (20°E-150°E, 30°N-60°S), temporal constraints for the 2019 calendar year, and quality control flags (QC=1,2). Utilizing BigQuery partitioning by date and clustering by geographic zones to minimize scan costs. Implementing JOIN operations across profiles, measurements, and float metadata tables.",
        codeSnippet: `SELECT \n  p.profile_id,\n  p.cycle_number,\n  p.latitude,\n  p.longitude,\n  p.date_time,\n  m.pres AS pressure,\n  m.temp AS temperature,\n  m.psal AS salinity,\n  m.doxy AS oxygen,\n  f.float_serial_no\nFROM \n  \`argo.profiles\` p\nINNER JOIN \n  \`argo.measurements\` m ON p.profile_id = m.profile_id\nINNER JOIN\n  \`argo.floats\` f ON p.float_id = f.float_id\nWHERE \n  EXTRACT(YEAR FROM p.date_time) = 2019\n  AND p.latitude BETWEEN -60 AND 30\n  AND p.longitude BETWEEN 20 AND 150\n  AND m.psal IS NOT NULL\n  AND m.doxy IS NOT NULL\n  AND m.pres < 2000\n  AND p.qc_flag IN (1, 2)\nORDER BY p.date_time, m.pres\nLIMIT 250000;`,
        isExpanded: false,
      },
      {
        agentName: "Data Analysis Agent",
        content:
          "Processing ${Math.floor(50000 + Math.random() * 100000)} records retrieved from the database. Performing statistical aggregation by month, calculating mean, median, standard deviation, and quartiles for both salinity and oxygen measurements. Applying outlier detection using IQR method and removing anomalous readings beyond 3 sigma. Normalizing depth-integrated values and weighting by measurement density. Computing correlation coefficients between salinity and oxygen (r=-0.67 expected due to inverse relationship). Identifying seasonal patterns and monsoon-driven variations in the Indian Ocean basin.",
        codeSnippet: `{
  "total_records_processed": ${Math.floor(50000 + Math.random() * 100000)},"valid_measurements": ${Math.floor(45000 + Math.random() * 90000)},"outliers_removed": ${Math.floor(500 + Math.random() * 2000)},"monthly_aggregation": {
    "mean_salinity_psu": ${(34.5 + Math.random() * 0.5).toFixed(3)},"mean_oxygen_mg_l": ${(5.2 + Math.random() * 0.8).toFixed(3)},"std_dev_salinity": ${(0.3 + Math.random() * 0.2).toFixed(3)},"std_dev_oxygen": ${(0.5 + Math.random() * 0.3).toFixed(3)}
  },"correlation_coefficient": ${(-0.65 - Math.random() * 0.1).toFixed(3)},"spatial_coverage": {
    "unique_floats": ${Math.floor(250 + Math.random() * 150)},"profiles_analyzed": ${Math.floor(8000 + Math.random() * 4000)}
  },"trend_detection": "${Math.random() > 0.5 ? "increasing_salinity" : "stable_conditions"}","seasonal_variability": "high_monsoon_impact"
}`,
        isExpanded: false,
      },
    ]

    agents.push({
      agentName: "Visualization Planner",
      content:
        "Designing dual-axis line chart to effectively display the inverse relationship between salinity and dissolved oxygen. Selecting color palette: blue (#3b82f6) for salinity to represent density/concentration, teal (#14b8a6) for oxygen to represent life/biological activity, green (#22c55e) for chlorophyll, and red (#ef4444) for temperature. Configuring X-axis with monthly temporal granularity, left Y-axis scaled 33.5-36.0 PSU for salinity, right Y-axis scaled 4.5-6.5 mg/L for oxygen. Adding grid lines for readability and interactive tooltips for data exploration. Ensuring responsive design for mobile and desktop viewports.",
      codeSnippet: `{
  "chart_configuration": {
    "type": "dual_axis_line_chart",
    "library": "recharts",
    "dimensions": {
      "width": "100%",
      "height": 300,
      "responsive": true
    }
  },
  "axes": {
    "x_axis": {
      "data_key": "month",
      "type": "categorical",
      "label": "Month (2019)"
    },
    "y_axis_left": {
      "data_key": "salinity",
      "unit": "PSU",
      "range": [33.5, 36.0],
      "color": "#3b82f6"
    },
    "y_axis_right": {
      "data_key": "oxygen",
      "unit": "mg/L",
      "range": [4.5, 6.5],
      "color": "#14b8a6"
    }
  },
  "styling": {
    "line_width": 2,
    "grid": "dashed_3_3",
    "legend_position": "bottom",
    "tooltip": "interactive"
  },
  "accessibility": {
    "aria_labels": true,
    "color_blind_safe": true
  }
}`,
      isExpanded: false,
    })

    return agents
  }

  const generateBotResponse = async (
    userInput: string,
  ): Promise<{ response: string; suggestions?: string[]; chartData?: ChartData[] }> => {
    const mockResponse = mockData[userInput]

    if (mockResponse) {
      return {
        response: mockResponse.response,
        suggestions: mockResponse.suggestions,
        chartData: mockResponse.chartType !== "none" ? mockResponse.chartData as ChartData[] : undefined,
      }
    }

    try {
      const chartResponse = await fetch("/api/generate-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      })

      if (chartResponse.ok) {
        const { data } = await chartResponse.json()
        return {
          response: `Based on your query "${userInput}", I've analyzed the ARGO oceanographic data and generated insights from multiple specialized agents. Below is the Salinity vs Oxygen chart for 2019.`,
          suggestions: ["Show more details", "Analyze trends", "Think carefully", "Visualize results"],
          chartData: data,
        }
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error)
    }

    return {
      response: `Based on your query "${userInput}", I've analyzed the ARGO oceanographic data and generated insights from multiple specialized agents.`,
      suggestions: ["Show more details", "Analyze trends", "Export data", "Visualize results"],
    }
  }

  const toggleAgentExpansion = (messageId: string, agentIndex: number) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.agentThoughts
          ? {
              ...msg,
              agentThoughts: msg.agentThoughts.map((agent, idx) =>
                idx === agentIndex ? { ...agent, isExpanded: !agent.isExpanded } : agent,
              ),
            }
          : msg,
      ),
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isTyping && inputValue.trim().length > 0) {
        handleSendMessage()
      }
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: "Copied code", description: "Snippet copied to your clipboard." })
    } catch {
      toast({ title: "Copy failed", description: "Select and copy the text manually.", variant: "destructive" })
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSendMessage(suggestion)
  }

  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the scroll height
    textarea.style.height = 'auto'

    // Calculate line height (approximately 1.5rem or 24px)
    const lineHeight = 24
    const maxLines = 5
    const maxHeight = lineHeight * maxLines

    // Set height based on scroll height, but max 5 lines
    const newHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${newHeight}px`

    // Enable/disable scrolling based on content
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto'
    } else {
      textarea.style.overflowY = 'hidden'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-resize on next frame to ensure DOM is updated
    setTimeout(autoResizeTextarea, 0)
  }

  const handleQuickAction = (action: QuickAction) => {
    setInputValue(action.query)
    handleSendMessage(action.query)
    // Auto-resize after setting value
    setTimeout(autoResizeTextarea, 0)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-[var(--nav-h,64px)] bg-background overflow-hidden z-10">
      <div className="h-full grid grid-rows-[1fr,auto]">
        <ScrollArea ref={scrollAreaRef} className="h-full min-h-0">
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

                    <div className="max-w-[80%] md:max-w-[70%] space-y-3">
                      {message.agentThoughts && (
                        <div className="space-y-3">
                          {message.agentThoughts.map((agent, agentIdx) => {
                            const isCurrentAgent = message.isThinking && message.currentThinkingAgent === agentIdx
                            const isPastAgent =
                              message.currentThinkingAgent !== undefined && agentIdx < message.currentThinkingAgent
                            const shouldShow = isCurrentAgent || isPastAgent || !message.isThinking
                            if (!shouldShow) return null

                            return (
                              <div
                                key={agentIdx}
                                className={`rounded-xl overflow-hidden border ${isCurrentAgent ? "border-l-2 border-l-primary ring-1 ring-primary/10 bg-card" : "border-l border-l-muted-foreground/20 bg-card"} border-border`}
                              >
                                <button
                                  onClick={() => toggleAgentExpansion(message.id, agentIdx)}
                                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/40 transition-colors"
                                >
                                  {isCurrentAgent && (
                                    <Image
                                      src="/animation.gif"
                                      alt="Thinking"
                                      width={24}
                                      height={24}
                                      className="flex-shrink-0"
                                      unoptimized
                                    />
                                  )}
                                  {!isCurrentAgent &&
                                    (agent.isExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-primary flex-shrink-0" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                                    ))}
                                  <Brain className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="font-semibold text-foreground text-sm">{agent.agentName}</span>
                                  {isCurrentAgent && (
                                    <span className="ml-auto text-xs text-primary animate-pulse">thinking...</span>
                                  )}
                                </button>

                                {(isCurrentAgent || agent.isExpanded) && (
                                  <div className="px-4 pb-3 space-y-2">
                                    <p className="text-sm text-muted-foreground">{agent.content}</p>
                                    {agent.codeSnippet && (
                                      <div className="rounded-lg border border-border bg-muted/60">
                                        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                                          {(() => {
                                            const meta = extractCodeMeta(agent.codeSnippet!)
                                            return (
                                              <>
                                                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                                  {meta.language}
                                                </span>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 px-2 text-xs"
                                                  onClick={() => handleCopy(meta.content)}
                                                  aria-label="Copy code snippet"
                                                >
                                                  Copy
                                                </Button>
                                              </>
                                            )
                                          })()}
                                        </div>
                                        {(() => {
                                          const meta = extractCodeMeta(agent.codeSnippet!)
                                          return (
                                            <pre className="font-mono text-[13px] leading-6 p-3 overflow-x-auto">
                                              <code>{highlightCode(meta.content, meta.language)}</code>
                                            </pre>
                                          )
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}

                          {message.isThinking && message.currentThinkingAgent === message.agentThoughts.length && (
                            <div className="rounded-xl border border-border bg-card px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Image
                                  src="/animation.gif"
                                  alt="Generating"
                                  width={24}
                                  height={24}
                                  className="flex-shrink-0"
                                  unoptimized
                                />
                                <span className="font-semibold text-foreground text-sm">Generating Final Response</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.content && (
                        <div className="space-y-4">
                          <div
                            className={`rounded-2xl px-4 md:px-6 py-3.5 md:py-4 shadow-md text-base leading-relaxed whitespace-pre-wrap break-words ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-card text-card-foreground border border-border rounded-bl-sm"
                            }`}
                          >
                            {formatMessageContent(message.content)}
                          </div>

                          {message.showChart &&
                            message.chartData &&
                            Array.isArray(message.chartData) &&
                            message.chartData.length > 0 &&
                            message.sender === "bot" && (
                              <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-md">
                                <h3 className="text-lg font-semibold mb-4 text-card-foreground">Data Visualization</h3>
                                {/* Depth Profile Chart (Inverted Y-axis) */}
                                {message.chartData[0]?.depth !== undefined && (
                                  <ResponsiveContainer width="100%" height={350}>
                                    <RechartsLineChart data={message.chartData}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                      <XAxis
                                        dataKey={
                                          message.chartData[0]?.salinity !== undefined
                                            ? "salinity"
                                            : message.chartData[0]?.temperature !== undefined
                                              ? "temperature"
                                              : "chlorophyll"
                                        }
                                        label={{
                                          value:
                                            message.chartData[0]?.salinity !== undefined
                                              ? "Salinity (PSU)"
                                              : message.chartData[0]?.temperature !== undefined
                                                ? "Temperature (°C)"
                                                : "Chlorophyll-a (mg/m³)",
                                          position: "insideBottom",
                                          offset: -5,
                                        }}
                                      />
                                      <YAxis
                                        reversed
                                        dataKey="depth"
                                        label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                                      />
                                      <Tooltip
                                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                                        labelStyle={{ color: "#f9fafb" }}
                                      />
                                      <Line
                                        type="monotone"
                                        dataKey={
                                          message.chartData[0]?.salinity !== undefined
                                            ? "salinity"
                                            : message.chartData[0]?.temperature !== undefined
                                              ? "temperature"
                                              : "chlorophyll"
                                        }
                                        stroke={
                                          message.chartData[0]?.temperature !== undefined
                                            ? "#ef4444" // temp red
                                            : message.chartData[0]?.chlorophyll !== undefined
                                              ? "#22c55e" // chl green
                                              : message.chartData[0]?.salinity !== undefined
                                                ? "#3b82f6" // salinity blue
                                                : "#14b8a6" // oxygen teal
                                        }
                                        strokeWidth={3}
                                        dot={{
                                          fill:
                                            message.chartData[0]?.temperature !== undefined
                                              ? "#ef4444"
                                              : message.chartData[0]?.chlorophyll !== undefined
                                                ? "#22c55e"
                                                : message.chartData[0]?.salinity !== undefined
                                                  ? "#3b82f6"
                                                  : "#14b8a6",
                                          r: 4,
                                        }}
                                      />
                                    </RechartsLineChart>
                                  </ResponsiveContainer>
                                )}

                                {/* Time Series Chart */}
                                {message.chartData[0]?.month && message.chartData[0]?.depth === undefined && (
                                  <ResponsiveContainer width="100%" height={350}>
                                    <RechartsLineChart data={message.chartData}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                      <XAxis
                                        dataKey="month"
                                        label={{ value: "Month", position: "insideBottom", offset: -5 }}
                                      />
                                      <YAxis
                                        yAxisId="left"
                                        label={{
                                          value: message.chartData[0]?.oxygen !== undefined ? "Oxygen (mL/L)" : "Value",
                                          angle: -90,
                                          position: "insideLeft",
                                        }}
                                      />
                                      {message.chartData[0]?.chlorophyll !== undefined && (
                                        <YAxis
                                          yAxisId="right"
                                          orientation="right"
                                          label={{ value: "Chlorophyll (mg/m³)", angle: 90, position: "insideRight" }}
                                        />
                                      )}
                                      <Tooltip
                                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                                        labelStyle={{ color: "#f9fafb" }}
                                      />
                                      <Legend />
                                      {message.chartData[0]?.salinity !== undefined && (
                                        <Line
                                          yAxisId="left"
                                          type="monotone"
                                          dataKey="salinity"
                                          stroke="#3b82f6"
                                          strokeWidth={2}
                                          name="Salinity (PSU)"
                                        />
                                      )}
                                      {message.chartData[0]?.oxygen !== undefined && (
                                        <Line
                                          yAxisId="left"
                                          type="monotone"
                                          dataKey="oxygen"
                                          stroke="#14b8a6"
                                          strokeWidth={2}
                                          name="Oxygen (mL/L)"
                                        />
                                      )}
                                      {message.chartData[0]?.chlorophyll !== undefined && (
                                        <Line
                                          yAxisId={message.chartData[0]?.oxygen !== undefined ? "right" : "left"}
                                          type="monotone"
                                          dataKey="chlorophyll"
                                          stroke="#22c55e"
                                          strokeWidth={2}
                                          name="Chlorophyll (mg/m³)"
                                        />
                                      )}
                                      {message.chartData[0]?.temperature !== undefined && (
                                        <Line
                                          yAxisId={message.chartData[0]?.oxygen !== undefined ? "right" : "left"}
                                          type="monotone"
                                          dataKey="temperature"
                                          stroke="#ef4444"
                                          strokeWidth={2}
                                          name="Temperature (°C)"
                                        />
                                      )}
                                    </RechartsLineChart>
                                  </ResponsiveContainer>
                                )}

                                {/* Trajectory/Position Time Series */}
                                {message.chartData[0]?.date && message.chartData[0]?.latitude !== undefined && (
                                  <ResponsiveContainer width="100%" height={350}>
                                    <RechartsLineChart data={message.chartData}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                      <XAxis
                                        dataKey="date"
                                        label={{ value: "Date", position: "insideBottom", offset: -5 }}
                                      />
                                      <YAxis
                                        yAxisId="left"
                                        label={{ value: "Latitude (°N)", angle: -90, position: "insideLeft" }}
                                        domain={["dataMin - 0.5", "dataMax + 0.5"]}
                                      />
                                      <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        label={{ value: "Longitude (°E)", angle: 90, position: "insideRight" }}
                                        domain={["dataMin - 0.5", "dataMax + 0.5"]}
                                      />
                                      <Tooltip
                                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                                        labelStyle={{ color: "#f9fafb" }}
                                      />
                                      <Legend />
                                    </RechartsLineChart>
                                  </ResponsiveContainer>
                                )}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  {message.suggestedQuestions && (
                    <div className="flex flex-wrap gap-2.5 md:gap-3 pl-14 md:pl-20">
                      {message.suggestedQuestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-sm px-4 md:px-5 py-2 bg-muted/40 border-transparent text-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => handleSuggestionClick(suggestion)}
                          title={suggestion.length > 50 ? suggestion : undefined}
                        >
                          {truncateText(suggestion)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 md:p-6 bg-transparent">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm p-3 md:p-4">
            <div className="flex items-end gap-3">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[40px] max-h-[120px]"
                onKeyPress={handleKeyPress}
                rows={1}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isTyping || inputValue.trim().length === 0}
                className="rounded-xl shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
