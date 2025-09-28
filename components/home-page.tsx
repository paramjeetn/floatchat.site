"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArgoMap } from "./argo-map"
import { Waves } from "lucide-react"

interface HomePageProps {
  onNavigate?: (tab: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mb-4">
          ARGO Oceanographic Data Platform
        </Badge>
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to FloatChat
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore massive oceanographic datasets from the Indian Ocean through our interactive
          dashboard and intelligent chat assistant. Discover insights from autonomous ARGO floats
          collecting real-time ocean data.
        </p>
      </div>

      {/* Map Section */}
      <div className="w-full px-4">
        <div className="flex items-center gap-2 mb-3">
          <Waves className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Indian Ocean Coverage</span>
        </div>
        <ArgoMap
          className="w-full h-[400px]"
        />
      </div>



      {/* Quick Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>About ARGO Data</CardTitle>
          <CardDescription>
            Understanding the global ocean observation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">What is ARGO?</h4>
              <p className="text-sm text-muted-foreground">
                A global array of autonomous profiling floats that measure temperature,
                salinity, and pressure in the world's oceans, providing critical data
                for climate research and ocean forecasting.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Data Collection</h4>
              <p className="text-sm text-muted-foreground">
                Floats dive to 2000 meters depth, then rise to the surface while collecting
                measurements. Data is transmitted via satellite and made freely available
                to researchers worldwide.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Indian Ocean Focus</h4>
              <p className="text-sm text-muted-foreground">
                Our platform specializes in Indian Ocean data, covering a region critical
                for understanding monsoon systems, climate patterns, and marine ecosystems
                in this vital oceanic region.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}