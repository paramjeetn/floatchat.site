"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Dashboard } from "@/components/dashboard"
import { Chatbot } from "@/components/chatbot"
import { HomePage } from "@/components/home-page"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "chatbot":
        return (
          <div className="h-full min-h-0">
            <Chatbot />
          </div>
        )
      case "home":
      default:
        return <HomePage onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-dvh grid grid-rows-[64px,1fr]">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="min-h-0 overflow-hidden">
        <div className={`container mx-auto px-4 ${activeTab === "chatbot" ? "pt-6 pb-0" : "py-6"} h-full min-h-0`}>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
