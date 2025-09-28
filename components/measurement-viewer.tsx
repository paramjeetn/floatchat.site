"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { ArrowUpDown, ArrowUp, ArrowDown, Thermometer, Droplets, Gauge, Download, XIcon } from "lucide-react"
import { exportMeasurements } from "@/lib/data-export"

interface MeasurementData {
  measurement_id: number
  level_index: number
  pres_adjusted: number
  temp_adjusted: number
  psal_adjusted: number
  temp_qc: string
  psal_qc: string
  pres_qc: string
  temp_adjusted_error?: number
  psal_adjusted_error?: number
  pres_adjusted_error?: number
}

interface ProfileData {
  profile_id: number
  platform_number: string
  cycle_number: number
  date_creation: string
  latitude: number
  longitude: number
}

interface MeasurementViewerProps {
  profile: ProfileData | null
  isOpen: boolean
  onClose: () => void
}

type SortField = "level_index" | "pres_adjusted" | "temp_adjusted" | "psal_adjusted"
type SortDirection = "asc" | "desc"

export function MeasurementViewer({ profile, isOpen, onClose }: MeasurementViewerProps) {
  const [measurements, setMeasurements] = useState<MeasurementData[]>([])
  const [loading, setLoading] = useState(false)
  const [sortField, setSortField] = useState<SortField>("level_index")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [qualityFilter, setQualityFilter] = useState<string>("all")
  const [depthFilter, setDepthFilter] = useState<string>("")
  const [tempFilter, setTempFilter] = useState<string>("")
  const [salFilter, setSalFilter] = useState<string>("")

  // Mock data generation for measurements
  useEffect(() => {
    if (!profile || !isOpen) {
      setMeasurements([])
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const qcFlags = ["1", "2", "3", "4", "8", "9"]
      const numMeasurements = Math.floor(Math.random() * 150) + 50 // 50-200 measurements per profile

      const mockMeasurements: MeasurementData[] = Array.from({ length: numMeasurements }, (_, i) => {
        const depth = i * (2000 / numMeasurements) // Spread over 2000m depth
        const temp = 25 - depth / 100 + Math.random() * 2 - 1 // Temperature decreases with depth
        const salinity = 34 + Math.random() * 2 - 1 // Realistic salinity range

        return {
          measurement_id: i + 1,
          level_index: i,
          pres_adjusted: depth,
          temp_adjusted: Math.max(-2, Math.min(35, temp)),
          psal_adjusted: Math.max(30, Math.min(40, salinity)),
          temp_qc: qcFlags[Math.floor(Math.random() * qcFlags.length)],
          psal_qc: qcFlags[Math.floor(Math.random() * qcFlags.length)],
          pres_qc: qcFlags[Math.floor(Math.random() * qcFlags.length)],
          temp_adjusted_error: Math.random() * 0.01,
          psal_adjusted_error: Math.random() * 0.002,
          pres_adjusted_error: Math.random() * 2.4,
        }
      })

      setMeasurements(mockMeasurements)
      setLoading(false)
    }, 500)
  }, [profile, isOpen])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />
  }

  const getQualityColor = (qc: string) => {
    switch (qc) {
      case "1":
        return "bg-green-100 text-green-800 border-green-300"
      case "2":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "3":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "4":
        return "bg-red-100 text-red-800 border-red-300"
      case "8":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "9":
        return "bg-gray-100 text-gray-800 border-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getQualityLabel = (qc: string) => {
    switch (qc) {
      case "1":
        return "Good"
      case "2":
        return "Probably good"
      case "3":
        return "Probably bad"
      case "4":
        return "Bad"
      case "8":
        return "Estimated"
      case "9":
        return "Missing"
      default:
        return "Unknown"
    }
  }

  // Filter and sort measurements
  const filteredAndSortedMeasurements = measurements
    .filter((m) => {
      if (qualityFilter !== "all") {
        const hasGoodQuality = m.temp_qc === "1" && m.psal_qc === "1" && m.pres_qc === "1"
        if (qualityFilter === "good" && !hasGoodQuality) return false
        if (qualityFilter === "bad" && hasGoodQuality) return false
      }

      if (depthFilter && !m.pres_adjusted.toString().includes(depthFilter)) return false
      if (tempFilter && !m.temp_adjusted.toString().includes(tempFilter)) return false
      if (salFilter && !m.psal_adjusted.toString().includes(salFilter)) return false

      return true
    })
    .sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const multiplier = sortDirection === "asc" ? 1 : -1

      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * multiplier
      }
      return String(aVal).localeCompare(String(bVal)) * multiplier
    })

  const goodQualityCount = measurements.filter(
    (m) => m.temp_qc === "1" && m.psal_qc === "1" && m.pres_qc === "1",
  ).length
  const qualityPercentage = measurements.length > 0 ? ((goodQualityCount / measurements.length) * 100).toFixed(1) : 0

  if (!profile) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Disable built-in close to avoid duplicate X; we’ll render our own in the header */}
      <DialogContent className="w-[90vw] max-w-7xl h-[90vh] p-0 flex flex-col overflow-hidden" showCloseButton={false}>
        <DialogHeader className="p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl">Profile Measurements - Platform {profile.platform_number}</DialogTitle>
              <div className="text-sm text-muted-foreground">
                Cycle {profile.cycle_number} • {profile.date_creation} •{profile.latitude.toFixed(3)}°,{" "}
                {profile.longitude.toFixed(3)}°
              </div>
            </div>
            {/* Single, accessible close button in header */}
            <DialogClose asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <XIcon className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Stats and Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {filteredAndSortedMeasurements.length} measurements
              </Badge>
              <Badge className="bg-green-100 text-green-800 text-sm">{qualityPercentage}% good quality</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (profile) {
                  exportMeasurements(
                    filteredAndSortedMeasurements,
                    {
                      platform_number: profile.platform_number,
                      cycle_number: profile.cycle_number,
                    },
                    "csv",
                  )
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-4 items-end">
                <div className="space-y-2 col-span-1 min-w-0">
                  <label className="text-xs font-medium text-muted-foreground">Quality Filter</label>
                  <Select value={qualityFilter} onValueChange={setQualityFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quality</SelectItem>
                      <SelectItem value="good">Good Quality Only</SelectItem>
                      <SelectItem value="bad">Problematic Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1 min-w-0">
                  <label className="text-xs font-medium text-muted-foreground">Depth Filter</label>
                  <Input
                    placeholder="Filter depth..."
                    value={depthFilter}
                    onChange={(e) => setDepthFilter(e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-1 min-w-0">
                  <label className="text-xs font-medium text-muted-foreground">Temp Filter</label>
                  <Input
                    placeholder="Filter temp..."
                    value={tempFilter}
                    onChange={(e) => setTempFilter(e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-1 min-w-0">
                  <label className="text-xs font-medium text-muted-foreground">Sal Filter</label>
                  <Input
                    placeholder="Filter salinity..."
                    value={salFilter}
                    onChange={(e) => setSalFilter(e.target.value)}
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 md:col-span-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto bg-transparent"
                    onClick={() => {
                      setQualityFilter("all")
                      setDepthFilter("")
                      setTempFilter("")
                      setSalFilter("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurements Table */}
          <div className="flex-1 min-h-0 overflow-auto overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-16">Level</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("pres_adjusted")}
                      className="flex items-center"
                    >
                      <Gauge className="h-4 w-4 mr-1" />
                      Pressure (dbar)
                      {getSortIcon("pres_adjusted")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("temp_adjusted")}
                      className="flex items-center"
                    >
                      <Thermometer className="h-4 w-4 mr-1" />
                      Temperature (°C)
                      {getSortIcon("temp_adjusted")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("psal_adjusted")}
                      className="flex items-center"
                    >
                      <Droplets className="h-4 w-4 mr-1" />
                      Salinity (PSU)
                      {getSortIcon("psal_adjusted")}
                    </Button>
                  </TableHead>
                  <TableHead>Quality Flags</TableHead>
                  <TableHead>Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 20 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 bg-muted animate-pulse rounded" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : filteredAndSortedMeasurements.map((measurement) => (
                      <TableRow key={measurement.measurement_id}>
                        <TableCell className="font-mono text-sm">{measurement.level_index}</TableCell>
                        <TableCell className="font-mono">{measurement.pres_adjusted.toFixed(1)}</TableCell>
                        <TableCell className="font-mono">{measurement.temp_adjusted.toFixed(3)}</TableCell>
                        <TableCell className="font-mono">{measurement.psal_adjusted.toFixed(3)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Badge
                              className={`text-xs border ${getQualityColor(measurement.temp_qc)}`}
                              title={`Temperature QC: ${getQualityLabel(measurement.temp_qc)}`}
                            >
                              T:{measurement.temp_qc}
                            </Badge>
                            <Badge
                              className={`text-xs border ${getQualityColor(measurement.psal_qc)}`}
                              title={`Salinity QC: ${getQualityLabel(measurement.psal_qc)}`}
                            >
                              S:{measurement.psal_qc}
                            </Badge>
                            <Badge
                              className={`text-xs border ${getQualityColor(measurement.pres_qc)}`}
                              title={`Pressure QC: ${getQualityLabel(measurement.pres_qc)}`}
                            >
                              P:{measurement.pres_qc}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="space-y-1">
                            {measurement.temp_adjusted_error && (
                              <div>T: ±{measurement.temp_adjusted_error.toFixed(3)}</div>
                            )}
                            {measurement.psal_adjusted_error && (
                              <div>S: ±{measurement.psal_adjusted_error.toFixed(4)}</div>
                            )}
                            {measurement.pres_adjusted_error && (
                              <div>P: ±{measurement.pres_adjusted_error.toFixed(1)}</div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedMeasurements.length} of {measurements.length} measurements
            {measurements.length > 0 && (
              <>
                {" • "}
                Depth range: {Math.min(...measurements.map((m) => m.pres_adjusted)).toFixed(0)} -{" "}
                {Math.max(...measurements.map((m) => m.pres_adjusted)).toFixed(0)} dbar
                {" • "}
                Temp range: {Math.min(...measurements.map((m) => m.temp_adjusted)).toFixed(2)} -{" "}
                {Math.max(...measurements.map((m) => m.temp_adjusted)).toFixed(2)}°C
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
