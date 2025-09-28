export interface MockAgentThought {
  agentName: string
  content: string
  codeSnippet?: string
  isExpanded: boolean
}

export interface MockChartData {
  [key: string]: any  // Flexible structure for different chart types
}

export interface MockResponse {
  response: string
  suggestions: string[]
  agentThoughts: MockAgentThought[]
  chartData?: MockChartData[]
  chartConfig?: {
    title: string
    type: 'time-series' | 'depth-profile' | 'scatter' | 'bar' | 'none'
    xAxis: string
    yAxis: string[]
    xLabel?: string
    yLabel?: string
  }
}

export const MOCK_RESPONSES: Record<string, MockResponse> = {
  "Show me salinity profiles near the equator in March 2023": {
    response: `**Equatorial Salinity Profiles - March 2023**

Retrieved **2,847 profiles** from ARGO floats operating near the equator (5°S - 5°N) during March 2023. Analysis reveals interesting salinity structure:

📊 **Key Findings:**
• **Surface Salinity:** 34.2-35.1 PSU (relatively fresh due to equatorial precipitation)
• **Salinity Maximum:** 35.4-35.6 PSU at ~120-150m depth (subtropical subsurface water intrusion)
• **Deep Salinity:** Stabilizes at ~34.7 PSU below 500m
• **Quality Control:** 94.3% of profiles passed QC flags ('1' or '2')

🌊 **Data Sources:**
• **Active Floats:** 23 floats contributed data (WMO platforms: 2902746, 2902812, 2902845, etc.)
• **Profile Types:** Primarily ascending profiles (direction='A') in delayed-mode (data_mode='D')
• **Institutions:** INCOIS (India), CSIRO (Australia), NOAA (USA)

🔍 **Oceanographic Context:**
The equatorial Indian Ocean shows characteristic fresh surface layer from ITCZ rainfall and river discharge from Indonesian throughflow. The subsurface salinity maximum represents high-salinity subtropical water advecting equatorward.`,
    suggestions: [
      "Compare BGC parameters in the Arabian Sea for the last 6 months",
      "What are the nearest ARGO floats to this location?",
      "Show temperature-depth profiles from WMO platform 2902746",
      "Analyze data quality statistics for March 2023"
    ],
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Parsing natural language query using LLM embedding model. Extracting key entities: PARAMETER='salinity', LOCATION='near equator' (interpreted as ±5° latitude band), TIME='March 2023'. Performing semantic search in FAISS vector database using query embedding to retrieve relevant profile metadata summaries. Retrieved 2,847 profile_ids with matching spatiotemporal criteria. Confidence score: 0.94. Query intent classified as 'vertical_profile_retrieval' requiring depth-stratified visualization.",
        codeSnippet: `{
  "query_type": "vertical_profile_retrieval",
  "entities_extracted": {
    "parameter": "salinity",
    "spatial_constraint": {
      "latitude_range": [-5.0, 5.0],
      "region": "equatorial_indian_ocean"
    },
    "temporal_constraint": {
      "year": 2023,
      "month": 3
    }
  },
  "vector_db_retrieval": {
    "embedding_model": "all-MiniLM-L6-v2",
    "retrieved_documents": 2847,
    "top_k_floats": ["2902746", "2902812", "2902845"]
  },
  "visualization_requirement": "depth_profile_chart"
}`,
        isExpanded: false,
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Using Model Context Protocol (MCP) to translate natural language into database query. Generating SQL targeting profiles and measurements tables with spatiotemporal filters. Joining on profile_id to retrieve pressure-salinity pairs. Applying QC filters (psal_qc IN ('1','2')) to ensure data quality. Using adjusted salinity (psal_adjusted) where available for higher accuracy. Implementing depth binning for vertical profile visualization.",
        codeSnippet: `WITH equatorial_profiles AS (
  SELECT p.profile_id, p.platform_number, p.latitude, p.longitude
  FROM profiles p
  INNER JOIN file_metadata fm ON p.file_id = fm.file_id
  WHERE p.latitude BETWEEN -5.0 AND 5.0
    AND EXTRACT(YEAR FROM p.date_creation) = 2023
    AND EXTRACT(MONTH FROM p.date_creation) = 3
    AND p.position_qc IN ('1', '2')
)
SELECT
  ROUND(m.pres_adjusted / 50) * 50 as depth_bin,
  AVG(COALESCE(m.psal_adjusted, m.psal)) as mean_salinity,
  STDDEV(COALESCE(m.psal_adjusted, m.psal)) as std_salinity
FROM equatorial_profiles ep
INNER JOIN measurements m ON ep.profile_id = m.profile_id
WHERE m.psal_adjusted_qc IN ('1', '2')
  AND m.pres_adjusted BETWEEN 0 AND 2000
GROUP BY depth_bin
ORDER BY depth_bin;`,
        isExpanded: false,
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Executing SQL query against PostgreSQL database. Retrieved 2,847 profiles with 312,574 individual salinity measurements. Performing automated quality control: removing outliers beyond 3-sigma (78 measurements flagged), validating pressure monotonicity (12 profiles excluded), checking climatological bounds (PSS-78 range 0-42 PSU). Computing vertical binning (50m intervals) for depth profile visualization. Calculating error-weighted means for each depth bin.",
        codeSnippet: `{
  "query_execution": {
    "database": "postgresql://argo-india-db",
    "execution_time_ms": 8742,
    "profiles_matched": 2847
  },
  "qc_processing": {
    "outlier_detection": {"flagged": 78, "retained_pct": 99.98},
    "pressure_monotonicity": {"excluded_profiles": 12}
  },
  "vertical_binning": {
    "bin_size_meters": 50,
    "depth_range": [0, 2000],
    "aggregation": "error_weighted_mean"
  },
  "data_quality_score": 0.943
}`,
        isExpanded: false,
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Generating depth-profile visualization. Creating inverted Y-axis chart (depth increases downward) showing mean salinity at each depth level. Using color gradient to represent salinity values. Adding error bars for standard deviation. Formatting response using RAG context from vector database. Generating natural language summary highlighting surface freshening, subsurface maximum, and deep stability. Creating follow-up suggestions based on semantic similarity.",
        codeSnippet: `{
  "chart_config": {
    "type": "depth_profile",
    "x_axis": "salinity_psu",
    "y_axis": "depth_meters_inverted",
    "color_scale": "viridis",
    "error_bars": true
  },
  "profile_statistics": {
    "surface_mean_0_50m": 34.68,
    "subsurface_max_depth": 135,
    "subsurface_max_value": 35.52,
    "deep_mean_500_2000m": 34.71
  },
  "rag_response_generation": {
    "llm_model": "qwen-2.5-14b",
    "context_documents": 5,
    "generation_temperature": 0.7
  }
}`,
        isExpanded: false,
      }
    ],
    chartData: [
      { depth: 0, salinity: 34.6 },
      { depth: 50, salinity: 34.8 },
      { depth: 100, salinity: 35.2 },
      { depth: 150, salinity: 35.5 },
      { depth: 200, salinity: 35.4 },
      { depth: 300, salinity: 35.2 },
      { depth: 400, salinity: 35.0 },
      { depth: 500, salinity: 34.8 },
      { depth: 700, salinity: 34.7 },
      { depth: 1000, salinity: 34.7 },
      { depth: 1500, salinity: 34.7 },
      { depth: 2000, salinity: 34.7 }
    ],
    chartConfig: {
      title: "Equatorial Salinity Depth Profile - March 2023",
      type: "depth-profile",
      xAxis: "salinity",
      yAxis: ["depth"],
      xLabel: "Salinity (PSU)",
      yLabel: "Depth (m)"
    }
  },

  "Compare BGC parameters in the Arabian Sea for the last 6 months": {
    response: `**BGC-Argo Analysis - Arabian Sea (Last 6 Months)**

Analyzed **1,247 Bio-Geo-Chemical profiles** from BGC-Argo floats in the Arabian Sea (55°E-75°E, 10°N-25°N) covering October 2024 - March 2025:

📊 **BGC Parameters Analyzed:**
• **Dissolved Oxygen (DOXY):** Mean 4.2 mL/L at surface, <0.5 mL/L in OMZ core (200-400m)
• **Chlorophyll-a (CHLA):** Surface mean 0.38 mg/m³, winter bloom reached 1.2 mg/m³
• **Nitrate (NITRATE):** <1 μmol/kg at surface, 20-35 μmol/kg in subsurface

🌊 **Seasonal Patterns:**
Winter monsoon (Dec-Feb) shows enhanced biological productivity with deep mixing bringing nutrients to surface. Oxygen minimum zone remains persistent at intermediate depths. Data from 12 BGC floats (WMO: 2903282, 2903311, 2903355, etc.).

🔬 **Data Quality:**
Real-time and delayed-mode data processed by INCOIS. QC flags indicate 89% good data for core parameters. BGC sensor calibration applied using shipboard CTD comparisons.`,
    suggestions: [
      "Show me salinity profiles near the equator in March 2023",
      "Plot chlorophyll-a vertical distribution for winter months",
      "Analyze oxygen minimum zone extent",
      "Export BGC data to NetCDF format"
    ],
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Identifying comparative temporal analysis query for Bio-Geo-Chemical parameters. Extracting entities: DATA_TYPE='BGC_FLOAT', REGION='Arabian Sea', TIMESPAN='last 6 months' (Oct 2024 - Mar 2025). Recognizing multi-parameter request requiring BGC sensor data. Performing vector similarity search. Retrieved 1,247 BGC profile summaries. Intent: temporal_trend_comparison requiring time-series visualization.",
        codeSnippet: `{
  "query_type": "temporal_comparative_bgc_analysis",
  "parameters_requested": [
    "dissolved_oxygen", "chlorophyll_a", "nitrate"
  ],
  "temporal_constraint": {
    "relative": "last_6_months",
    "months": ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
  },
  "visualization_requirement": "multi_parameter_time_series"
}`,
        isExpanded: false,
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Constructing multi-table join for BGC-Argo data retrieval. Querying profiles with data_type='BGC_FLOAT' filter. Joining measurements table for DOXY, CHLA, NITRATE parameters. Implementing 6-month rolling window with monthly aggregation. Applying QC thresholds for each BGC sensor type.",
        codeSnippet: `WITH bgc_profiles AS (
  SELECT p.profile_id, p.platform_number,
    DATE_TRUNC('month', p.date_creation) as month
  FROM profiles p
  INNER JOIN file_metadata fm ON p.file_id = fm.file_id
  WHERE p.latitude BETWEEN 10 AND 25
    AND p.longitude BETWEEN 55 AND 75
    AND p.date_creation >= CURRENT_DATE - INTERVAL '6 months'
    AND fm.data_type = 'BGC_FLOAT'
)
SELECT
  TO_CHAR(month, 'Mon') as month_name,
  AVG(CASE WHEN m.pres_adjusted < 10 THEN m.doxy END) as surface_oxygen,
  AVG(CASE WHEN m.pres_adjusted < 10 THEN m.chla END) as surface_chlorophyll
FROM bgc_profiles bp
INNER JOIN measurements m ON bp.profile_id = m.profile_id
GROUP BY month
ORDER BY month;`,
        isExpanded: false,
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing 1,247 BGC profiles with 187,321 multi-parameter measurements. Applying sensor-specific QC: OPTODE oxygen drift correction, MCOMS fluorescence dark count subtraction, SUNA nitrate temperature compensation. Computing monthly averages with seasonal decomposition. Identifying winter productivity peak from chlorophyll spike in Dec-Feb period.",
        codeSnippet: `{
  "bgc_data_processing": {
    "total_profiles": 1247,
    "unique_bgc_floats": 12,
    "wmo_platforms": ["2903282", "2903311", "2903355"]
  },
  "seasonal_statistics": {
    "post_monsoon_oct_nov": {
      "mean_surface_chla": 0.28,
      "mean_surface_oxygen": 4.5
    },
    "winter_dec_feb": {
      "mean_surface_chla": 0.62,
      "max_bloom_chla": 1.18
    }
  }
}`,
        isExpanded: false,
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Creating multi-parameter time-series visualization. Generating dual Y-axis chart with oxygen (blue line) and chlorophyll (green line) plotted monthly. Highlighting winter productivity peak in Dec-Feb. Using RAG context to enrich response with monsoon-driven productivity explanation. Generating relevant follow-up suggestions.",
        codeSnippet: `{
  "chart_config": {
    "type": "dual_line_timeseries",
    "x_axis": "month",
    "y_axis_left": "oxygen_ml_per_l",
    "y_axis_right": "chlorophyll_mg_per_m3",
    "highlight_period": ["Dec", "Jan", "Feb"]
  },
  "rag_enrichment": {
    "context": "winter_monsoon_productivity_patterns",
    "llm_model": "gpt-4-turbo"
  }
}`,
        isExpanded: false,
      }
    ],
    chartData: [
      { month: "Oct", oxygen: 4.5, chlorophyll: 0.28 },
      { month: "Nov", oxygen: 4.6, chlorophyll: 0.32 },
      { month: "Dec", oxygen: 4.8, chlorophyll: 0.58 },
      { month: "Jan", oxygen: 4.9, chlorophyll: 1.12 },
      { month: "Feb", oxygen: 4.7, chlorophyll: 0.89 },
      { month: "Mar", oxygen: 4.3, chlorophyll: 0.35 }
    ],
    chartConfig: {
      title: "Arabian Sea BGC Parameters - 6 Month Trend",
      type: "time-series",
      xAxis: "month",
      yAxis: ["oxygen", "chlorophyll"],
      xLabel: "Month (2024-2025)",
      yLabel: "Oxygen (mL/L) | Chlorophyll (mg/m³)"
    }
  },

  "What are the nearest ARGO floats to this location?": {
    response: `**Nearest ARGO Floats - Central Equatorial Indian Ocean**

Performing geospatial proximity search near the equator. Found **8 active floats** within 300 km radius:

📍 **Closest Floats:**
1. **WMO 2902746** - Distance: 87 km | Last profile: 2 days ago
   - Position: 0.78°N, 80.23°E | Cycle: 234 | Mode: Delayed | INCOIS

2. **WMO 2902812** - Distance: 134 km | Last profile: 5 days ago
   - Position: 0.15°S, 79.67°E | Cycle: 189 | Mode: Real-time | CSIRO

3. **WMO 2902891** - Distance: 198 km | Last profile: 3 days ago
   - Position: 1.45°N, 81.12°E | Cycle: 156 | Mode: Delayed | NOAA

🔄 **Float Network Details:**
• **Coverage density:** 0.8 floats per 100,000 km²
• **Positioning system:** GPS (all 8 floats)
• **Profile frequency:** 10-day cycles
• **Total profiles available:** 1,847 profiles

📡 **Data Availability:**
All floats actively transmitting via IRIDIUM satellite. Real-time data available on GTS within 12 hours.`,
    suggestions: [
      "Show temperature-depth profiles from WMO platform 2902746",
      "Track float trajectory for WMO 2902812 over last 3 months",
      "Compare salinity measurements from multiple floats",
      "Show me salinity profiles near the equator in March 2023"
    ],
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Detecting geospatial proximity query. Extracting coordinates from previous context or user location. Query intent: find_nearest_active_floats using spatial distance calculation. No temporal constraint specified, defaulting to currently active floats (last 30 days). Preparing PostGIS spatial query with ST_Distance function. This query does NOT require visualization - simple listing is appropriate.",
        codeSnippet: `{
  "query_type": "geospatial_proximity_search",
  "search_parameters": {
    "radius_km": 300,
    "max_results": 8,
    "active_only": true
  },
  "spatial_calculation": "great_circle_distance",
  "visualization_requirement": "none"
}`,
        isExpanded: false,
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Generating PostGIS-enabled spatial query. Using ST_MakePoint and ST_Distance_Sphere for accurate Earth-surface distance calculations. Filtering for most recent profile per float using window function. Including comprehensive float metadata: WMO platform number, positioning system, data processing mode.",
        codeSnippet: `WITH latest_profiles AS (
  SELECT p.*,
    ROW_NUMBER() OVER (
      PARTITION BY platform_number
      ORDER BY juld DESC
    ) as rn
  FROM profiles p
  WHERE DATE(date_creation) >= CURRENT_DATE - 30
)
SELECT
  platform_number as wmo_id,
  ROUND(ST_Distance_Sphere(
    ST_MakePoint(longitude, latitude),
    ST_MakePoint(80.0, 0.0)
  ) / 1000, 1) as distance_km,
  latitude, longitude, cycle_number, data_mode
FROM latest_profiles
WHERE rn = 1
HAVING distance_km <= 300
ORDER BY distance_km
LIMIT 8;`,
        isExpanded: false,
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Executing PostGIS spatial query. Retrieved 8 floats within 300km radius. Computing precise distances using Haversine formula. Validating float activity status from transmission timestamps (all 8 floats transmitted within 7 days). Checking position QC flags: all have QC='1' or '2'. Aggregating profile counts per float. 5 floats in delayed-mode, 3 in real-time.",
        codeSnippet: `{
  "spatial_query_execution": {
    "query_time_ms": 342,
    "floats_found": 8,
    "distances_km": [87, 134, 198, 218, 246, 267, 284, 299]
  },
  "float_activity": {
    "active_floats": 8,
    "last_transmission_days": [2, 5, 3, 4, 7, 6, 3, 5],
    "all_operational": true
  },
  "data_availability": {
    "delayed_mode": 5,
    "real_time": 3,
    "total_profiles": 1847
  }
}`,
        isExpanded: false,
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Formatting response as structured list of floats sorted by distance. No chart visualization needed for this query type - users are asking for nearest float identification, not trend analysis. Including comprehensive metadata for each float. Using RAG context to add operational context about data modes and transmission systems. Generating follow-up suggestions for profile visualization and trajectory tracking.",
        codeSnippet: `{
  "response_format": "structured_list",
  "chart_required": false,
  "metadata_included": [
    "wmo_id", "distance", "position",
    "cycle", "data_mode", "institution"
  ],
  "follow_up_suggestions": {
    "profile_viz": true,
    "trajectory_tracking": true,
    "multi_float_comparison": true
  }
}`,
        isExpanded: false,
      }
    ],
    chartData: undefined,  // No chart for this query
    chartConfig: {
      title: "",
      type: "none",
      xAxis: "",
      yAxis: []
    }
  },

  "Show temperature-depth profiles from WMO platform 2902746": {
    response: `**Temperature Depth Profile - WMO Float 2902746**

Retrieved **234 profiles** from ARGO float 2902746 deployed by INCOIS in the equatorial Indian Ocean:

📊 **Profile Characteristics:**
• **Latest Profile:** Cycle 234, collected 2 days ago at 0.78°N, 80.23°E
• **Profile Depth:** 0-1987 meters (full water column sampling)
• **Temperature Range:** 28.9°C (surface) to 2.1°C (2000m)
• **Data Mode:** Delayed-mode with full QC (highest quality)

🌡️ **Vertical Structure:**
• **Mixed Layer:** 0-45m, temperature ~28.5-28.9°C
• **Thermocline:** Sharp gradient 50-200m, temperature drops from 28°C to 15°C
• **Deep Ocean:** Below 500m, cold stable water mass ~4-8°C
• **Abyssal:** Below 1500m, near-uniform at 2-3°C

🔍 **Float Details:**
• **WMO Platform:** 2902746 | **Serial:** APEX-12345
• **Deployment Date:** January 2018 | **Age:** 7.2 years
• **Total Cycles:** 234 | **Success Rate:** 98.3%
• **Positioning:** GPS (±5km accuracy)`,
    suggestions: [
      "Compare with nearby float WMO 2902812 temperatures",
      "Show salinity profile for the same platform",
      "Track this float's drift trajectory over time",
      "Analyze thermocline depth variations"
    ],
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Identifying single-platform vertical profile query. Extracting WMO platform number: 2902746. Parameter: temperature. Query type: depth_profile_single_platform. User wants vertical structure visualization showing temperature variation with depth. Retrieving float metadata and most recent profile data. Confidence: 0.96.",
        codeSnippet: `{
  "query_type": "single_platform_depth_profile",
  "platform_id": "2902746",
  "parameter": "temperature",
  "profile_selection": "most_recent_or_average",
  "visualization_requirement": "temperature_depth_profile"
}`,
        isExpanded: false,
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Constructing query for single platform temperature profile. Filtering profiles table for platform_number='2902746'. Selecting most recent cycle or computing climatological average. Joining measurements for temperature-pressure pairs. Applying temp_qc filters. Ordering by pressure for vertical plotting.",
        codeSnippet: `WITH float_2902746_latest AS (
  SELECT profile_id
  FROM profiles
  WHERE platform_number = '2902746'
  ORDER BY juld DESC
  LIMIT 1
)
SELECT
  m.pres_adjusted as depth,
  COALESCE(m.temp_adjusted, m.temp) as temperature,
  m.temp_adjusted_qc as qc_flag
FROM float_2902746_latest f
INNER JOIN measurements m ON f.profile_id = m.profile_id
WHERE m.temp_adjusted_qc IN ('1', '2')
  AND m.pres_adjusted BETWEEN 0 AND 2000
ORDER BY m.pres_adjusted;`,
        isExpanded: false,
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Retrieved latest profile (Cycle 234) from float 2902746. 146 temperature measurements spanning 0-1987m depth. All measurements passed QC (flags '1'). Computing mixed layer depth from temperature gradient criterion (ΔT > 0.2°C). Identified thermocline boundaries at 50m (top) and 200m (base). Calculating stratification index.",
        codeSnippet: `{
  "profile_data": {
    "platform": "2902746",
    "cycle": 234,
    "measurements": 146,
    "depth_range_m": [0, 1987]
  },
  "temperature_statistics": {
    "surface_0_10m": 28.87,
    "mixed_layer_depth_m": 45,
    "thermocline_top_m": 50,
    "thermocline_base_m": 200,
    "deep_1000m": 4.12,
    "abyssal_2000m": 2.08
  },
  "qc_summary": {"all_good": true, "flag_1_count": 146}
}`,
        isExpanded: false,
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Creating inverted depth profile chart with temperature on X-axis and depth on Y-axis (increasing downward). Plotting smooth curve through measurement points. Color-coding by water mass: warm surface layer (red-orange), thermocline (yellow-green), deep water (blue). Adding annotations for mixed layer base and thermocline boundaries.",
        codeSnippet: `{
  "chart_config": {
    "type": "depth_profile_inverted",
    "x_axis": "temperature_celsius",
    "y_axis": "depth_meters",
    "y_inverted": true,
    "color_gradient": "temperature_scale",
    "annotations": [
      {"depth": 45, "label": "Mixed Layer Base"},
      {"depth": 200, "label": "Thermocline Base"}
    ]
  }
}`,
        isExpanded: false,
      }
    ],
    chartData: [
      { depth: 0, temperature: 28.9 },
      { depth: 10, temperature: 28.8 },
      { depth: 30, temperature: 28.7 },
      { depth: 50, temperature: 27.8 },
      { depth: 75, temperature: 24.2 },
      { depth: 100, temperature: 20.1 },
      { depth: 150, temperature: 15.3 },
      { depth: 200, temperature: 12.8 },
      { depth: 300, temperature: 10.2 },
      { depth: 500, temperature: 7.8 },
      { depth: 750, temperature: 5.4 },
      { depth: 1000, temperature: 4.1 },
      { depth: 1500, temperature: 2.8 },
      { depth: 2000, temperature: 2.1 }
    ],
    chartConfig: {
      title: "Temperature Profile - WMO 2902746 (Latest Cycle)",
      type: "depth-profile",
      xAxis: "temperature",
      yAxis: ["depth"],
      xLabel: "Temperature (°C)",
      yLabel: "Depth (m)"
    }
  },

  "Analyze data quality statistics for March 2023": {
    response: `**Data Quality Assessment - March 2023**

Comprehensive quality control analysis of ARGO data collected during March 2023:

📊 **Profile Quality Summary:**
• **Total Profiles:** 8,934 profiles from 412 active floats
• **QC Pass Rate:** 96.8% (8,651 profiles passed all QC checks)
• **Failed QC:** 283 profiles (3.2%) flagged for quality issues

✅ **QC Flag Distribution:**
• **Flag '1' (Good):** 8,234 profiles (92.2%)
• **Flag '2' (Probably Good):** 417 profiles (4.7%)
• **Flag '3' (Probably Bad):** 156 profiles (1.7%)
• **Flag '4' (Bad):** 127 profiles (1.4%)

🔍 **Common Quality Issues:**
1. **Position QC Failures:** 89 profiles (GPS/ARGOS positioning errors)
2. **Pressure Reversals:** 67 profiles (sensor malfunction or data transmission errors)
3. **Salinity Spikes:** 58 profiles (conductivity sensor biofouling or calibration drift)
4. **Temperature Anomalies:** 42 profiles (outside climatological bounds)
5. **Delayed Transmission:** 27 profiles (satellite communication issues)

📈 **Data Mode Statistics:**
• **Real-time (R):** 2,847 profiles (31.9%) - immediate GTS dissemination
• **Delayed-mode (D):** 5,804 profiles (65.0%) - full QC applied
• **Adjusted (A):** 283 profiles (3.2%) - post-deployment corrections

🏢 **Data Centre Performance:**
• **INCOIS:** 3,421 profiles (38.3%) - 97.2% QC pass rate
• **CSIRO:** 2,156 profiles (24.1%) - 96.8% QC pass rate
• **AOML:** 1,847 profiles (20.7%) - 96.1% QC pass rate
• **Coriolis:** 1,510 profiles (16.9%) - 97.5% QC pass rate`,
    suggestions: [
      "Show me salinity profiles near the equator in March 2023",
      "List floats with quality issues needing attention",
      "Compare QC performance across data centres",
      "Export QC statistics report to CSV"
    ],
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Identifying quality control analysis query. Temporal scope: March 2023. Query type: qc_statistics_summary. User wants comprehensive quality metrics, NOT visualization. Intent: assess data reliability, identify problematic floats/sensors, evaluate data centre performance. No chart required - tabular statistics are appropriate.",
        codeSnippet: `{
  "query_type": "qc_statistics_analysis",
  "temporal_scope": {"month": 3, "year": 2023},
  "analysis_components": [
    "qc_flag_distribution",
    "failure_modes",
    "data_centre_performance"
  ],
  "visualization_requirement": "none"
}`,
        isExpanded: false,
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Constructing QC aggregation query across profiles table. Grouping by QC flags (position_qc, profile_temp_qc, profile_psal_qc). Counting occurrences of each flag value. Calculating pass rates. Joining with data_centre field for institutional performance metrics. Filtering for March 2023 temporal window.",
        codeSnippet: `WITH qc_summary AS (
  SELECT
    position_qc,
    profile_temp_qc,
    profile_psal_qc,
    data_mode,
    data_centre,
    CASE
      WHEN position_qc IN ('1','2')
        AND profile_temp_qc IN ('1','2')
        AND profile_psal_qc IN ('1','2')
      THEN 'pass' ELSE 'fail'
    END as overall_qc
  FROM profiles
  WHERE EXTRACT(YEAR FROM date_creation) = 2023
    AND EXTRACT(MONTH FROM date_creation) = 3
)
SELECT
  overall_qc,
  COUNT(*) as profile_count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 1) as percentage
FROM qc_summary
GROUP BY overall_qc;`,
        isExpanded: false,
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Analyzing QC statistics for 8,934 profiles from March 2023. Computing QC flag distributions, failure modes, and institutional performance. Identifying common issues: position errors (89 profiles), pressure reversals (67), salinity spikes (58). Calculating overall QC pass rate: 96.8%. Ranking data centres by QC performance: Coriolis (97.5%), INCOIS (97.2%), CSIRO (96.8%).",
        codeSnippet: `{
  "qc_analysis": {
    "total_profiles": 8934,
    "qc_pass_count": 8651,
    "qc_pass_rate": 0.968
  },
  "failure_breakdown": {
    "position_errors": 89,
    "pressure_reversals": 67,
    "salinity_spikes": 58,
    "temperature_anomalies": 42,
    "transmission_delays": 27
  },
  "data_centre_ranking": [
    {"centre": "Coriolis", "pass_rate": 0.975},
    {"centre": "INCOIS", "pass_rate": 0.972},
    {"centre": "CSIRO", "pass_rate": 0.968}
  ]
}`,
        isExpanded: false,
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Formatting response as detailed statistical summary with NO chart visualization. QC statistics are best presented as structured text with percentages, counts, and categorical breakdowns. Using RAG context to explain ARGO QC flag meanings. Generating actionable follow-up suggestions for investigating quality issues.",
        codeSnippet: `{
  "response_format": "structured_statistics",
  "chart_required": false,
  "sections": [
    "profile_summary",
    "qc_flag_distribution",
    "failure_analysis",
    "data_mode_breakdown",
    "institutional_performance"
  ]
}`,
        isExpanded: false,
      }
    ],
    chartData: undefined,  // No chart - statistics only
    chartConfig: {
      title: "",
      type: "none",
      xAxis: "",
      yAxis: []
    }
  },

  "Track float trajectory for WMO 2902812 over last 3 months": {
    response: `**Float Trajectory Analysis - WMO 2902812 (Last 3 Months)**

Tracking autonomous drift pattern for ARGO float 2902812 from January 2025 - March 2025:

🗺️ **Trajectory Summary:**
• **Start Position (Jan 1):** 0.15°S, 79.67°E (Central Indian Ocean)
• **End Position (Mar 31):** 2.34°N, 82.89°E (Northeast drift)
• **Total Drift Distance:** 487 km over 90 days
• **Mean Drift Speed:** 5.4 km/day (0.062 m/s)

🌊 **Drift Pattern:**
• **Direction:** Predominantly northeast (bearing: 42°)
• **Driving Current:** Equatorial Counter Current (seasonally strong Jan-Mar)
• **Cycle Frequency:** 10-day profiling cycles (9 profiles collected)
• **Position Accuracy:** GPS positioning, ±3.2 km average error

📍 **Profile Locations:**
1. Jan 1: 0.15°S, 79.67°E | Cycle 180
2. Jan 11: 0.28°S, 80.12°E | Cycle 181
3. Jan 21: 0.45°N, 80.67°E | Cycle 182
4. Feb 1: 0.78°N, 81.23°E | Cycle 183
5. Feb 11: 1.12°N, 81.78°E | Cycle 184
6. Feb 21: 1.45°N, 82.01°E | Cycle 185
7. Mar 3: 1.78°N, 82.34°E | Cycle 186
8. Mar 13: 2.01°N, 82.56°E | Cycle 187
9. Mar 23: 2.34°N, 82.89°E | Cycle 188

🔍 **Oceanographic Context:**
Float drifted with Equatorial Counter Current, a permanent eastward-flowing current between 2°S-10°N. Drift speed increased in February due to monsoon wind forcing. No major eddies encountered during this period.`,
    suggestions: [
      "Show temperature evolution along this float's path",
      "Compare drift with float WMO 2902746 in same period",
      "Analyze salinity changes during drift",
      "Predict future float position based on currents"
    ],
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Identifying trajectory tracking query. Platform: 2902812. Timespan: last 3 months (Jan-Mar 2025). Query type: float_trajectory_analysis. User wants spatial tracking visualization showing drift path over time. Requires time-ordered position data. Visualization: line plot with positions connected chronologically, or map with trajectory overlay.",
        codeSnippet: `{
  "query_type": "float_trajectory_tracking",
  "platform_id": "2902812",
  "time_window": {"months": 3, "start": "2025-01", "end": "2025-03"},
  "visualization_requirement": "trajectory_timeseries_or_map"
}`,
        isExpanded: false,
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Constructing temporal position query for single float. Filtering profiles for platform_number='2902812'. Selecting date_creation, latitude, longitude, cycle_number. Applying temporal window: last 3 months. Ordering chronologically by cycle number. Including position_qc filter for quality assurance.",
        codeSnippet: `SELECT
  profile_id,
  cycle_number,
  DATE(date_creation) as profile_date,
  latitude,
  longitude,
  position_qc,
  LEAD(latitude) OVER (ORDER BY cycle_number) as next_lat,
  LEAD(longitude) OVER (ORDER BY cycle_number) as next_lon
FROM profiles
WHERE platform_number = '2902812'
  AND date_creation >= CURRENT_DATE - INTERVAL '3 months'
  AND position_qc IN ('1', '2')
ORDER BY cycle_number;`,
        isExpanded: false,
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Retrieved 9 profiles from float 2902812 spanning 3-month period. Computing drift distances between consecutive profiles using Haversine formula. Calculating drift speeds and bearings. Mean drift: 5.4 km/day in northeast direction (42° bearing). Total displacement: 487 km from start to end position. All position QC flags are '1' (good).",
        codeSnippet: `{
  "trajectory_data": {
    "float": "2902812",
    "profiles_retrieved": 9,
    "time_span_days": 90,
    "start_position": [-0.15, 79.67],
    "end_position": [2.34, 82.89],
    "total_displacement_km": 487
  },
  "drift_statistics": {
    "mean_speed_km_per_day": 5.4,
    "mean_bearing_degrees": 42,
    "dominant_current": "Equatorial Counter Current"
  }
}`,
        isExpanded: false,
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Creating trajectory time-series chart. Plotting latitude and longitude separately over time (dual line chart) OR creating lat-lon scatter plot with connected points showing drift path. Color-coding by month for temporal context. Annotating start/end positions and cycle numbers. Including drift arrows showing direction between profiles.",
        codeSnippet: `{
  "chart_config": {
    "type": "trajectory_timeseries",
    "primary_plot": "lat_lon_over_time",
    "x_axis": "date",
    "y_axis_left": "latitude",
    "y_axis_right": "longitude",
    "annotations": [
      {"point": "start", "label": "Cycle 180"},
      {"point": "end", "label": "Cycle 188"}
    ]
  }
}`,
        isExpanded: false,
      }
    ],
    chartData: [
      { date: "Jan 1", latitude: -0.15, longitude: 79.67 },
      { date: "Jan 11", latitude: -0.28, longitude: 80.12 },
      { date: "Jan 21", latitude: 0.45, longitude: 80.67 },
      { date: "Feb 1", latitude: 0.78, longitude: 81.23 },
      { date: "Feb 11", latitude: 1.12, longitude: 81.78 },
      { date: "Feb 21", latitude: 1.45, longitude: 82.01 },
      { date: "Mar 3", latitude: 1.78, longitude: 82.34 },
      { date: "Mar 13", latitude: 2.01, longitude: 82.56 },
      { date: "Mar 23", latitude: 2.34, longitude: 82.89 }
    ],
    chartConfig: {
      title: "Float 2902812 Drift Trajectory (Jan-Mar 2025)",
      type: "time-series",
      xAxis: "date",
      yAxis: ["latitude", "longitude"],
      xLabel: "Date",
      yLabel: "Latitude (°N) | Longitude (°E)"
    }
  },

  "Plot chlorophyll-a vertical distribution for winter months": {
    response: `**Chlorophyll-a Vertical Profile - Winter Season (Dec-Feb)**

Analyzed **523 BGC-Argo profiles** from Arabian Sea during winter monsoon period (December 2024 - February 2025):

📊 **Chlorophyll Distribution:**
• **Surface Maximum:** 1.18 mg/m³ at 5-15m depth (winter bloom peak)
• **Euphotic Zone:** 0.62 mg/m³ average in upper 100m
• **Deep Chlorophyll Maximum (DCM):** 0.45 mg/m³ at 45-65m depth
• **Below Euphotic:** <0.05 mg/m³ below 150m (light limitation)

🌊 **Winter Bloom Characteristics:**
• **Trigger:** Northeast monsoon deep convection brings nutrients to surface
• **Duration:** December-February (3-month peak period)
• **Magnitude:** 4x increase compared to summer minimum (0.28 mg/m³)
• **Spatial Extent:** Widespread across northern Arabian Sea

🔬 **BGC-Argo Data Sources:**
• **BGC Floats:** 12 floats with MCOMS fluorescence sensors
• **Quality Control:** Dark count subtraction, NPQ correction applied
• **Validation:** Cross-checked with MODIS satellite chlorophyll

📈 **Ecological Significance:**
Winter bloom supports fisheries productivity, increases carbon export flux, and indicates healthy monsoon-driven nutrient replenishment.`,
    suggestions: [
      "Compare with summer chlorophyll levels",
      "Show nitrate vertical distribution during bloom",
      "Analyze dissolved oxygen response to bloom",
      "Export chlorophyll data to NetCDF"
    ],
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Identifying BGC vertical profile query. Parameter: chlorophyll-a. Season: winter months (Dec-Feb). Query type: seasonal_depth_profile_bgc. User wants vertical distribution showing chlorophyll concentration variation with depth during winter bloom period. Requires depth-profile visualization.",
        codeSnippet: `{
  "query_type": "seasonal_bgc_depth_profile",
  "parameter": "chlorophyll_a",
  "season": "winter",
  "months": ["Dec", "Jan", "Feb"],
  "visualization_requirement": "depth_profile_chart"
}`,
        isExpanded: false,
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Constructing BGC depth profile query. Filtering for winter months (12, 1, 2). Joining measurements table for chlorophyll (CHLA) parameter. Computing depth-binned averages. Applying BGC QC filters specific to fluorescence sensors. Including NPQ (non-photochemical quenching) corrected values.",
        codeSnippet: `WITH winter_bgc AS (
  SELECT p.profile_id
  FROM profiles p
  INNER JOIN file_metadata fm ON p.file_id = fm.file_id
  WHERE EXTRACT(MONTH FROM p.date_creation) IN (12, 1, 2)
    AND fm.data_type = 'BGC_FLOAT'
    AND p.latitude BETWEEN 10 AND 25
    AND p.longitude BETWEEN 55 AND 75
)
SELECT
  ROUND(m.pres_adjusted / 10) * 10 as depth_bin,
  AVG(m.chla) as mean_chlorophyll,
  STDDEV(m.chla) as std_chlorophyll
FROM winter_bgc wb
INNER JOIN measurements m ON wb.profile_id = m.profile_id
WHERE m.chla_qc IN ('1', '2')
  AND m.pres_adjusted <= 200
GROUP BY depth_bin
ORDER BY depth_bin;`,
        isExpanded: false,
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing 523 BGC profiles from winter period. MCOMS fluorescence sensor data with dark count correction and NPQ adjustment applied. Identified surface maximum at 5-15m (bloom layer) and subsurface maximum at 50m (deep chlorophyll maximum). Euphotic zone depth ~120m. Quality control: 98.1% data retention after QC.",
        codeSnippet: `{
  "bgc_processing": {
    "profiles": 523,
    "parameter": "chlorophyll_a",
    "season": "winter_dec_feb"
  },
  "chlorophyll_features": {
    "surface_max_depth_m": 10,
    "surface_max_value": 1.18,
    "dcm_depth_m": 55,
    "dcm_value": 0.45,
    "euphotic_zone_depth_m": 120
  }
}`,
        isExpanded: false,
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Creating inverted depth profile for chlorophyll-a. Plotting chlorophyll concentration (mg/m³) on X-axis, depth on Y-axis (inverted, surface at top). Using green color gradient for chlorophyll. Annotating surface bloom layer and deep chlorophyll maximum. Including shaded region for euphotic zone.",
        codeSnippet: `{
  "chart_config": {
    "type": "depth_profile_inverted",
    "x_axis": "chlorophyll_mg_m3",
    "y_axis": "depth_meters",
    "color": "green_gradient",
    "annotations": [
      {"depth": 10, "label": "Surface Bloom"},
      {"depth": 55, "label": "DCM"},
      {"depth": 120, "label": "Euphotic Zone Base"}
    ]
  }
}`,
        isExpanded: false,
      }
    ],
    chartData: [
      { depth: 0, chlorophyll: 0.98 },
      { depth: 10, chlorophyll: 1.18 },
      { depth: 20, chlorophyll: 1.05 },
      { depth: 30, chlorophyll: 0.82 },
      { depth: 40, chlorophyll: 0.58 },
      { depth: 50, chlorophyll: 0.45 },
      { depth: 60, chlorophyll: 0.38 },
      { depth: 80, chlorophyll: 0.22 },
      { depth: 100, chlorophyll: 0.12 },
      { depth: 120, chlorophyll: 0.06 },
      { depth: 150, chlorophyll: 0.03 },
      { depth: 200, chlorophyll: 0.01 }
    ],
    chartConfig: {
      title: "Chlorophyll-a Vertical Distribution - Winter Bloom (Dec-Feb)",
      type: "depth-profile",
      xAxis: "chlorophyll",
      yAxis: ["depth"],
      xLabel: "Chlorophyll-a (mg/m³)",
      yLabel: "Depth (m)"
    }
  },
}

export function getMockResponse(query: string): MockResponse | null {
  const normalizedQuery = query.trim()

  if (MOCK_RESPONSES[normalizedQuery]) {
    return MOCK_RESPONSES[normalizedQuery]
  }

  return null
}