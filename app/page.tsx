"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Dashboard } from "@/components/dashboard"
import { Chatbot } from "@/components/chatbot"
import { HomePage } from "@/components/home-page"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")

  const handleTabChange = (tab: string) => {
    console.log("App: Changing tab to:", tab) // Debug log
    setActiveTab(tab)
  }

  const renderContent = () => {
    console.log("App: Rendering content for tab:", activeTab) // Debug log
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "chatbot":
        return <Chatbot />
      case "home":
      default:
        return <HomePage onNavigate={handleTabChange} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="container mx-auto px-4 py-6">{renderContent()}</main>
    </div>
  )
}