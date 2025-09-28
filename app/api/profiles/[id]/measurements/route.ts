import { type NextRequest, NextResponse } from "next/server"
import { bigQueryService } from "@/lib/bigquery-client"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = params.id
    const searchParams = request.nextUrl.searchParams

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500) // Max 500 per page
    const offset = (page - 1) * limit

    console.log(`Fetching measurements for profile ${profileId}, page ${page}, limit ${limit}`)

    // Build filter conditions
    const conditions: string[] = ["profile_id = ?"]
    const params_list: any[] = [parseInt(profileId)]

    // Depth (pressure) filter
    const minDepth = searchParams.get("min_depth")
    const maxDepth = searchParams.get("max_depth")
    if (minDepth) {
      conditions.push("pres_adjusted >= ?")
      params_list.push(parseFloat(minDepth))
    }
    if (maxDepth) {
      conditions.push("pres_adjusted <= ?")
      params_list.push(parseFloat(maxDepth))
    }

    // Quality control filter
    const goodOnly = searchParams.get("good_only") === "true"
    if (goodOnly) {
      conditions.push("temp_qc = '1' AND psal_qc = '1' AND pres_qc = '1'")
    }

    const whereClause = conditions.join(' AND ')

    // Main query for measurements with pagination
    const measurementsQuery = `
      SELECT
        profile_id,
        level_index,
        pres_adjusted,
        temp_adjusted,
        psal_adjusted,
        temp_qc,
        psal_qc,
        pres_qc,
        temp_adjusted_error,
        psal_adjusted_error,
        pres_adjusted_error
      FROM \`argo-472010.argo_full.measurements\`
      WHERE ${whereClause}
      ORDER BY level_index ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // Count query for total results
    const countQuery = `
      SELECT COUNT(*) as total_count
      FROM \`argo-472010.argo_full.measurements\`
      WHERE ${whereClause}
    `

    // Get profile info query
    const profileQuery = `
      SELECT
        profile_id,
        platform_number,
        cycle_number,
        latitude,
        longitude,
        date_creation,
        data_centre as data_center
      FROM \`argo-472010.argo_full.profiles\`
      WHERE profile_id = ?
      LIMIT 1
    `

    console.log('Executing measurements query:', measurementsQuery.substring(0, 200) + '...')

    // Execute all queries in parallel
    const [measurementsResult, countResult, profileResult] = await Promise.all([
      bigQueryService.executeQuery(measurementsQuery, params_list),
      bigQueryService.executeQuery(countQuery, params_list),
      bigQueryService.executeQuery(profileQuery, [parseInt(profileId)])
    ])

    const totalCount = countResult[0]?.total_count || 0
    const totalPages = Math.ceil(totalCount / limit)
    const profile = profileResult[0] || null

    console.log(`Found ${measurementsResult.length} measurements, total: ${totalCount}`)

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      profile,
      measurements: measurementsResult,
      pagination: {
        page,
        limit,
        offset,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error("Measurements API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch measurements",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}