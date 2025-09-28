import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    const chartData = [
      { month: "Jan", salinity: 34.5, oxygen: 5.2 },
      { month: "Feb", salinity: 34.7, oxygen: 5.4 },
      { month: "Mar", salinity: 34.3, oxygen: 5.1 },
      { month: "Apr", salinity: 34.8, oxygen: 5.5 },
      { month: "May", salinity: 34.6, oxygen: 5.3 },
      { month: "Jun", salinity: 34.9, oxygen: 5.6 },
      { month: "Jul", salinity: 35.1, oxygen: 5.8 },
      { month: "Aug", salinity: 35.0, oxygen: 5.7 },
      { month: "Sep", salinity: 34.8, oxygen: 5.5 },
      { month: "Oct", salinity: 34.6, oxygen: 5.2 },
      { month: "Nov", salinity: 34.4, oxygen: 5.0 },
      { month: "Dec", salinity: 34.5, oxygen: 5.1 },
    ]

    return NextResponse.json({
      success: true,
      data: chartData,
      chartConfig: {
        title: "Salinity vs Oxygen Levels (2019)",
        xAxis: "month",
        yAxisLeft: "salinity",
        yAxisRight: "oxygen",
      },
    })
  } catch (error) {
    console.error("Chart generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate chart data" }, { status: 500 })
  }
}