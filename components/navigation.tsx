"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, BarChart3, Home } from "lucide-react"

interface NavigationProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Navigation({ activeTab = "home", onTabChange }: NavigationProps) {
  const [internalActiveTab, setInternalActiveTab] = useState("home")

  // Use external state if provided, otherwise use internal state
  const currentTab = activeTab || internalActiveTab
  const handleTabChange = (tabId: string) => {
    console.log("Navigation: Switching to tab:", tabId) // Debug log
    if (onTabChange) {
      onTabChange(tabId)
    } else {
      setInternalActiveTab(tabId)
    }
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "chatbot", label: "Chatbot", icon: MessageSquare },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">FloatChat</h1>
            <span className="text-sm text-muted-foreground">ARGO Oceanographic Data Platform</span>
          </div>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentTab === item.id ? "default" : "ghost"}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center space-x-2 transition-all ${
                    currentTab === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
