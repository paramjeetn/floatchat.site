export interface ChartDataPoint {
  depth?: number;
  salinity?: number;
  temperature?: number;
  oxygen?: number;
  chlorophyll?: number;
  month?: string;
  date?: string;
  latitude?: number;
  longitude?: number;
}

export interface ArgoFloat {
  profile_id: number;
  platform_number: number;
  cycle_number: number;
  latitude: number;
  longitude: number;
  date_creation: string;
  data_center: string;
  data_mode: string;
  distance?: number;
}

export interface ProfileData {
  profile_id: number;
  platform_number: number;
  cycle_number: number;
  latitude: number;
  longitude: number;
  date_creation: string;
  data_centre: string;
  data_center: string;
  data_mode: string;
  distance?: number;
}

export interface TimeSeriesData {
  date: string;
  temperature?: number;
  salinity?: number;
  oxygen?: number;
  depth?: number;
  latitude?: number;
  longitude?: number;
}

export interface ProcessingStats {
  profiles: number;
  measurements?: number;
  qcPassRate: number;
  processingDetails: string;
}

export interface AgentParams {
  queryType: string;
  parameter: string;
  region: string;
  timeRange?: string;
  visualizationRequirement: string;
}

export interface AgentThought {
  agentName: string;
  content: string;
  codeSnippet?: string;
  isExpanded?: boolean;
}

export interface MockQuery {
  response: string;
  suggestions: string[];
  chartType: string;
  chartData: ChartDataPoint[] | null;
  agentParams: AgentParams;
  sqlQuery: string;
  processingStats: ProcessingStats;
  agentThoughts: AgentThought[];
}

export interface MockDataStructure {
  [key: string]: MockQuery;
}

const mockData: MockDataStructure = {
  "Among the shallow layers of the ocean, not beyond the hundred-decibar veil, show me which depths reveal themselves most often with both salt and heat recorded, and tell me their average character.": {
    response: "Analyzed 250 distinct depth levels within the upper 100 decibars of the ocean, revealing observation frequency patterns and characteristic temperature-salinity properties at each level. The shallowest layers (5-10 dbar) show the highest sampling density with over 200 observations each, while deeper levels (70-100 dbar) maintain moderate coverage. Surface waters are warmer and fresher, transitioning to cooler, saltier conditions with depth, consistent with typical subtropical upper ocean stratification.",
    suggestions: [
      "Show seasonal variations in shallow layer properties",
      "Compare Bay of Bengal vs Arabian Sea shallow profiles",
      "Analyze mixed layer depth variations across the Indian Ocean"
    ],
    chartType: "depth-profile",
    chartData: [
      { depth: 1.0, salinity: 34.252, temperature: 23.736 },
      { depth: 2.0, salinity: 34.196, temperature: 20.628 },
      { depth: 3.0, salinity: 34.110, temperature: 21.473 },
      { depth: 4.0, salinity: 34.438, temperature: 21.221 },
      { depth: 5.0, salinity: 34.112, temperature: 19.587 },
      { depth: 6.0, salinity: 34.277, temperature: 17.993 },
      { depth: 7.0, salinity: 34.259, temperature: 19.568 },
      { depth: 8.0, salinity: 34.597, temperature: 18.258 },
      { depth: 9.0, salinity: 34.191, temperature: 19.194 },
      { depth: 10.0, salinity: 34.139, temperature: 19.687 },
      { depth: 12.0, salinity: 34.427, temperature: 18.406 },
      { depth: 14.0, salinity: 34.622, temperature: 18.257 },
      { depth: 16.0, salinity: 34.450, temperature: 17.989 },
      { depth: 18.0, salinity: 34.720, temperature: 17.789 },
      { depth: 20.0, salinity: 34.495, temperature: 18.479 },
      { depth: 26.0, salinity: 34.454, temperature: 17.666 },
      { depth: 28.0, salinity: 34.133, temperature: 16.983 },
      { depth: 30.0, salinity: 34.342, temperature: 16.944 },
      { depth: 32.0, salinity: 34.658, temperature: 17.362 },
      { depth: 34.0, salinity: 34.548, temperature: 17.013 },
      { depth: 36.0, salinity: 34.156, temperature: 18.296 },
      { depth: 38.0, salinity: 34.055, temperature: 16.491 },
      { depth: 42.0, salinity: 34.010, temperature: 16.711 },
      { depth: 44.0, salinity: 34.284, temperature: 16.791 },
      { depth: 46.0, salinity: 34.458, temperature: 16.707 },
      { depth: 48.0, salinity: 34.300, temperature: 16.897 },
      { depth: 50.0, salinity: 34.870, temperature: 16.732 },
      { depth: 52.0, salinity: 34.784, temperature: 16.954 },
      { depth: 54.0, salinity: 34.670, temperature: 16.577 },
      { depth: 56.0, salinity: 34.283, temperature: 18.072 },
      { depth: 58.0, salinity: 34.402, temperature: 16.031 },
      { depth: 60.0, salinity: 34.374, temperature: 16.936 },
      { depth: 62.0, salinity: 34.753, temperature: 16.105 },
      { depth: 64.0, salinity: 34.419, temperature: 17.411 },
      { depth: 66.0, salinity: 34.654, temperature: 16.974 },
      { depth: 68.0, salinity: 34.448, temperature: 15.141 },
      { depth: 70.0, salinity: 34.756, temperature: 15.972 },
      { depth: 72.0, salinity: 34.354, temperature: 16.912 },
      { depth: 74.0, salinity: 34.473, temperature: 16.302 },
      { depth: 76.0, salinity: 34.739, temperature: 16.202 },
      { depth: 78.0, salinity: 34.719, temperature: 15.034 },
      { depth: 80.0, salinity: 34.615, temperature: 15.674 },
      { depth: 82.0, salinity: 34.768, temperature: 16.287 },
      { depth: 84.0, salinity: 34.741, temperature: 15.488 },
      { depth: 88.0, salinity: 34.356, temperature: 14.153 },
      { depth: 90.0, salinity: 34.275, temperature: 15.302 },
      { depth: 92.0, salinity: 34.445, temperature: 15.066 },
      { depth: 94.0, salinity: 34.408, temperature: 15.762 },
      { depth: 96.0, salinity: 34.578, temperature: 15.326 },
      { depth: 98.0, salinity: 34.744, temperature: 13.759 }
    ],
    agentParams: {
      queryType: "depth_frequency_analysis",
      parameter: "salinity_temperature_observation_density",
      region: "unrestricted_indian_ocean",
      timeRange: "all_available",
      visualizationRequirement: "depth_profile_with_observation_metadata"
    },
    sqlQuery: `SELECT
  ROUND(m.pres_adjusted, 0) AS pres_adjusted,
  COUNT(*) AS n_obs,
  AVG(m.psal_adjusted) AS avg_salinity,
  AVG(m.temp_adjusted) AS avg_temperature
FROM argo_full.measurements m
JOIN argo_full.profiles p ON m.profile_id = p.profile_id
WHERE m.pres_adjusted IS NOT NULL
  AND m.pres_adjusted <= 100
  AND m.psal_adjusted IS NOT NULL
  AND m.temp_adjusted IS NOT NULL
  AND m.psal_qc IN ('1', '2', '5', '8')
  AND m.temp_qc IN ('1', '2', '5', '8')
GROUP BY ROUND(m.pres_adjusted, 0)
ORDER BY n_obs DESC`,
    processingStats: {
      profiles: 2847,
      measurements: 15432,
      qcPassRate: 92.8,
      processingDetails: "Aggregated measurements across 250 depth levels in the upper 100 decibars, filtering for valid temperature and salinity with QC flags 1,2,5,8. Highest observation density at 5-10 dbar depth range."
    },
    agentThoughts: [
      {
        agentName: "Intent Parser Agent",
        content: "Parsing poetic natural language query to extract structured oceanographic parameters. Interpreting 'hundred-decibar veil' as depth constraint (≤100 dbar), 'reveal themselves most often' as frequency analysis requiring observation counts by depth level, 'both salt and heat recorded' as requirement for non-NULL salinity AND temperature measurements, and 'average character' as statistical aggregation (mean values). No explicit spatial or temporal constraints detected, defaulting to全database coverage for comprehensive analysis. Query classified as depth-frequency profiling with dual-parameter characterization.",
        codeSnippet: `{
  "extracted_entities": {
    "depth_constraint": "≤100 dbar",
    "parameters": ["salinity", "temperature"],
    "analysis_type": "frequency_and_average_by_depth",
    "spatial_scope": "unrestricted",
    "temporal_scope": "all_available"
  },
  "query_interpretation": {
    "hundred_decibar_veil": "depth_limit_100_dbar",
    "reveal_most_often": "count_observations_by_depth",
    "salt_and_heat": "require_non_null_psal_and_temp",
    "average_character": "compute_mean_values"
  },
  "output_requirements": {
    "primary": "depth_levels_ranked_by_obs_count",
    "secondary": "mean_salinity_temperature_per_depth"
  },
  "confidence_score": 0.91
}`,
        isExpanded: false
      },
      {
        agentName: "SQL Generator Agent",
        content: "Constructing optimized BigQuery query for shallow-layer frequency analysis. Using ROUND(pres_adjusted, 0) to bin measurements into integer depth levels for discrete aggregation. Implementing dual NULL filters for psal_adjusted and temp_adjusted to ensure complete paired observations. Applying ARGO standard QC flag filtering (1=Good, 2=Probably good, 5=Changed, 8=Interpolated) for both parameters to maintain data quality. GROUP BY rounded pressure creates one row per depth level, COUNT(*) provides observation frequency, AVG() functions compute characteristic values. ORDER BY n_obs DESC ranks depths by sampling density, directly answering 'most often' requirement.",
        codeSnippet: `SELECT
  ROUND(m.pres_adjusted, 0) AS pres_adjusted,
  COUNT(*) AS n_obs,
  AVG(m.psal_adjusted) AS avg_salinity,
  AVG(m.temp_adjusted) AS avg_temperature
FROM argo_full.measurements m
JOIN argo_full.profiles p ON m.profile_id = p.profile_id
WHERE m.pres_adjusted IS NOT NULL
  AND m.pres_adjusted <= 100
  AND m.psal_adjusted IS NOT NULL
  AND m.temp_adjusted IS NOT NULL
  AND m.psal_qc IN ('1', '2', '5', '8')
  AND m.temp_qc IN ('1', '2', '5', '8')
GROUP BY ROUND(m.pres_adjusted, 0)
ORDER BY n_obs DESC`,
        isExpanded: false
      },
      {
        agentName: "QC Validator Agent",
        content: "Validating query execution results against oceanographic reality checks and data quality standards. Confirmed 250 unique depth levels returned within specified ≤100 dbar constraint (range: 0.1-98 dbar). Observation counts range from 217 (peak at 6 dbar) to 51 observations per depth level, providing statistically robust averages. Salinity range 33.1-35.3 PSU falls within realistic Indian Ocean surface/subsurface bounds. Temperature range 7.7-25.0°C consistent with tropical/subtropical upper ocean thermal structure. QC filtering successfully excluded poor-quality measurements, achieving 92.8% retention rate. Depth distribution shows expected sampling bias toward near-surface layers where ARGO float surfacing occurs. No extreme outliers or anomalous depth-property relationships detected.",
        codeSnippet: `{
  "validation_summary": {
    "total_depth_levels": 250,
    "depth_range_compliance": "0.1-98 dbar (within ≤100 constraint)",
    "observation_count_range": "51-217 per depth level",
    "qc_filtering_applied": true,
    "qc_pass_rate": 92.8
  },
  "oceanographic_realism_checks": {
    "salinity_range": "33.1-35.3 PSU (realistic)",
    "temperature_range": "7.7-25.0°C (realistic)",
    "vertical_stratification": "consistent_warm_fresh_surface",
    "anomaly_detection": "none_flagged"
  },
  "data_quality_metrics": {
    "highest_density_depth": "6 dbar (217 obs)",
    "average_obs_per_depth": 62,
    "statistical_robustness": "sufficient_for_averaging"
  },
  "validation_status": "PASS"
}`,
        isExpanded: false
      },
      {
        agentName: "Chart Planner Agent",
        content: "Designing depth profile visualization following oceanographic conventions with inverted Y-axis (depth increases downward). Selected dual-line chart format to simultaneously display salinity (X-axis, primary) and temperature profiles versus depth. Color encoding: blue (#3b82f6) for temperature representing thermal gradient, teal (#14b8a6) for salinity representing density/haline properties. Chart will display top 50 most-sampled depth levels to balance detail with readability. Implementing smooth monotone curve interpolation between data points to represent continuous vertical structure. Interactive tooltips will display exact depth, observation count, salinity (PSU), and temperature (°C) values. Depth axis spans 0-100 dbar, salinity axis 33-36 PSU, temperature axis 5-26°C based on data ranges.",
        codeSnippet: `{
  "chart_specification": {
    "type": "dual_parameter_depth_profile",
    "library": "recharts",
    "orientation": "inverted_y_axis",
    "data_points": "top_50_by_observation_count"
  },
  "axes_configuration": {
    "y_axis": {
      "parameter": "depth_dbar",
      "direction": "inverted",
      "range": [0, 100]
    },
    "x_axis_primary": {
      "parameter": "salinity_psu",
      "range": [33, 36]
    },
    "x_axis_secondary": {
      "parameter": "temperature_celsius",
      "range": [5, 26]
    }
  },
  "visual_encoding": {
    "temperature_line": {
      "color": "#3b82f6",
      "width": 2,
      "curve": "monotone"
    },
    "salinity_line": {
      "color": "#14b8a6",
      "width": 2,
      "curve": "monotone"
    }
  },
  "interactivity": {
    "tooltip_fields": ["depth", "n_obs", "salinity", "temperature"],
    "hover_effects": true
  }
}`,
        isExpanded: false
      },
      {
        agentName: "Narrator Agent",
        content: "Synthesizing findings from shallow-layer observation frequency analysis across 250 depth levels in the upper 100 decibars. Most frequently sampled depths cluster in the near-surface zone: 6 dbar leads with 217 observations, followed by 5 dbar (203 obs) and 8 dbar (189 obs). This sampling pattern reflects ARGO float operational behavior, which profiles primarily during ascent through surface layers. Vertical structure reveals classic subtropical stratification: warm (19-24°C), relatively fresh (34.1-34.4 PSU) surface mixed layer (0-10 dbar) transitions through thermocline (30-60 dbar) where temperatures cool to 16-17°C and salinity increases to 34.7-34.9 PSU, reaching cooler (13-16°C), saltier (34.7-35.3 PSU) subsurface waters at 70-100 dbar. Localized salinity maxima around 50-85 dbar depth suggest intrusion of high-salinity subtropical underwater, characteristic of Indian Ocean circulation patterns. Dataset provides robust statistical foundation with 15,432 quality-controlled measurements across 2,847 profiles, enabling confident characterization of upper ocean vertical structure.",
        codeSnippet: null,
        isExpanded: false
      }
    ]
  },

  "salinity and temperature depth profile near arabian sea": {
    response: "I found comprehensive depth profile data for salinity and temperature measurements near Bermuda. The analysis shows typical Atlantic Ocean stratification with a strong thermocline between 100-300m depth. Salinity exhibits characteristic subtropical surface waters (36.2-36.5 PSU) with underlying water masses showing gradual changes. Temperature drops from 24°C at surface to 8°C at 1000m depth.",
    suggestions: [
      "Show seasonal variations in thermocline depth",
      "Compare with historical temperature trends",
      "Analyze salinity anomalies in this region"
    ],
    chartType: "depth-profile",
    chartData: [
      { depth: 0, salinity: 36.4, temperature: 24.2 },
      { depth: 50, salinity: 36.5, temperature: 23.8 },
      { depth: 100, salinity: 36.3, temperature: 20.1 },
      { depth: 200, salinity: 36.1, temperature: 16.5 },
      { depth: 300, salinity: 35.9, temperature: 13.2 },
      { depth: 500, salinity: 35.7, temperature: 10.8 },
      { depth: 750, salinity: 35.5, temperature: 9.1 },
      { depth: 1000, salinity: 35.3, temperature: 8.0 }
    ],
    agentParams: {
      queryType: "depth_profile_analysis",
      parameter: "salinity_temperature",
      region: "bermuda",
      timeRange: "recent",
      visualizationRequirement: "dual_parameter_depth_profile"
    },
    sqlQuery: `
    SELECT
      m.pres_adjusted as depth,
      AVG(m.temp_adjusted) as temperature,
      AVG(m.psal_adjusted) as salinity
    FROM argo_full.measurements m
    JOIN argo_full.profiles p ON m.profile_id = p.profile_id
    WHERE p.latitude BETWEEN 30.0 AND 34.0
      AND p.longitude BETWEEN -67.0 AND -63.0
      AND m.temp_qc IN ('1', '2', '5', '8')
      AND m.psal_qc IN ('1', '2', '5', '8')
      AND m.pres_adjusted IS NOT NULL
    GROUP BY ROUND(m.pres_adjusted / 50) * 50
    ORDER BY depth
    `,
    processingStats: {
      profiles: 89,
      measurements: 12456,
      qcPassRate: 94.2,
      processingDetails: "Quality controlled data from 89 Argo profiles, filtering based on position flags and measurement QC codes"
    },
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Parsing natural language query using LLM embedding model. Extracting key entities: PARAMETER='salinity_temperature', REGION='bermuda', QUERY_TYPE='depth_profile_analysis'. Mapping 'near Bermuda' to coordinate bounds (30.0-34.0°N, 67.0-63.0°W) using oceanographic region database. Detecting request for dual-parameter vertical profiling with depth as primary axis.",
        codeSnippet: `{
  "extracted_entities": {
    "parameters": ["salinity", "temperature"],
    "location": "bermuda",
    "analysis_type": "depth_profile",
    "coordinate_bounds": {
      "lat_min": 30.0, "lat_max": 34.0,
      "lon_min": -67.0, "lon_max": -63.0
    }
  },
  "query_classification": "oceanographic_profile_analysis",
  "confidence_score": 0.94
}`,
        isExpanded: false
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Generating optimized BigQuery SQL for ARGO oceanographic database. Implementing spatial filtering for Bermuda region with coordinate bounds. Adding quality control filters for temperature (temp_qc) and salinity (psal_qc) measurements. Using pressure-adjusted values and grouping by 50-meter depth bins for statistical aggregation. Joining measurements and profiles tables on profile_id.",
        codeSnippet: `SELECT
  m.pres_adjusted as depth,
  AVG(m.temp_adjusted) as temperature,
  AVG(m.psal_adjusted) as salinity
FROM argo_full.measurements m
JOIN argo_full.profiles p ON m.profile_id = p.profile_id
WHERE p.latitude BETWEEN 30.0 AND 34.0
  AND p.longitude BETWEEN -67.0 AND -63.0
  AND m.temp_qc IN ('1', '2', '5', '8')
  AND m.psal_qc IN ('1', '2', '5', '8')
  AND m.pres_adjusted IS NOT NULL
GROUP BY ROUND(m.pres_adjusted / 50) * 50
ORDER BY depth`,
        isExpanded: false
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing 89 Argo profiles with 12,456 measurements from Bermuda region. Applying ARGO QC standards: accepting flags 1 (good), 2 (probably good), 5 (changed), 8 (estimated). Filtering out missing pressure values and invalid coordinates. Computing depth-binned averages with 50m resolution. Quality control pass rate: 94.2%. Identifying typical North Atlantic subtropical water mass characteristics.",
        codeSnippet: `{
  "total_records_processed": 12456,
  "valid_measurements": 11728,
  "outliers_removed": 728,
  "depth_bins": {
    "surface_layer": "0-100m: 36.4±0.1 PSU, 23.1±1.2°C",
    "thermocline": "100-300m: 36.1±0.2 PSU, 16.9±3.1°C",
    "intermediate": "300-1000m: 35.5±0.2 PSU, 9.4±1.8°C"
  },
  "water_mass_identification": "subtropical_surface_water",
  "qc_statistics": {
    "good_data_percentage": 94.2,
    "flagged_anomalies": 47,
    "spatial_coverage": "dense"
  }
}`,
        isExpanded: false
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Designing dual-axis depth profile chart with inverted Y-axis following oceanographic convention (depth increasing downward). Color coding: blue (#3b82f6) for temperature gradient, teal (#14b8a6) for salinity. Implementing smooth curve interpolation between measurement points. Adding depth markers at standard oceanographic levels (0, 100, 200, 500, 1000m). Configuring responsive design with tooltips showing exact values and water mass identification.",
        codeSnippet: `{
  "chart_configuration": {
    "type": "dual_axis_depth_profile",
    "library": "recharts",
    "orientation": "inverted_y_axis",
    "dimensions": {"width": "100%", "height": 400}
  },
  "styling": {
    "temperature_color": "#3b82f6",
    "salinity_color": "#14b8a6",
    "line_width": 2,
    "grid_lines": "major_depths_only",
    "curve_type": "monotone"
  },
  "interactivity": {
    "tooltip": "parameter_values_and_depth",
    "hover_effects": true,
    "zoom_capability": false
  }
}`,
        isExpanded: false
      }
    ]
  },

  "oxygen levels in the southern ocean in 2019": {
    response: "Analysis of Southern Ocean dissolved oxygen levels for 2019 reveals significant seasonal variability and distinct regional patterns. Surface waters show high oxygen saturation (300-320 μmol/kg) due to intense air-sea gas exchange and cold temperatures. The oxygen minimum zone occurs at intermediate depths (800-1200m) with concentrations dropping to 180-200 μmol/kg. Antarctic Circumpolar Current regions show enhanced oxygen levels due to deep water ventilation.",
    suggestions: [
      "Compare with pre-2019 oxygen trends",
      "Analyze relationship with temperature changes",
      "Show regional variations across Southern Ocean sectors"
    ],
    chartType: "time-series",
    chartData: [
      { month: "Jan", oxygen: 285 },
      { month: "Feb", oxygen: 292 },
      { month: "Mar", oxygen: 298 },
      { month: "Apr", oxygen: 305 },
      { month: "May", oxygen: 312 },
      { month: "Jun", oxygen: 318 },
      { month: "Jul", oxygen: 320 },
      { month: "Aug", oxygen: 315 },
      { month: "Sep", oxygen: 308 },
      { month: "Oct", oxygen: 301 },
      { month: "Nov", oxygen: 294 },
      { month: "Dec", oxygen: 288 }
    ],
    agentParams: {
      queryType: "temporal_analysis",
      parameter: "oxygen",
      region: "southern_ocean",
      timeRange: "2019",
      visualizationRequirement: "monthly_time_series"
    },
    sqlQuery: `
    SELECT
      EXTRACT(MONTH FROM p.date_creation) as month,
      AVG(m.doxy_adjusted) as oxygen_mean,
      STDDEV(m.doxy_adjusted) as oxygen_std
    FROM argo_full.measurements m
    JOIN argo_full.profiles p ON m.profile_id = p.profile_id
    WHERE p.latitude < -50.0
      AND EXTRACT(YEAR FROM p.date_creation) = 2019
      AND m.doxy_qc IN ('1', '2', '5', '8')
      AND m.doxy_adjusted IS NOT NULL
    GROUP BY EXTRACT(MONTH FROM p.date_creation)
    ORDER BY month
    `,
    processingStats: {
      profiles: 156,
      measurements: 28934,
      qcPassRate: 91.7,
      processingDetails: "Dissolved oxygen measurements from 156 profiles across Southern Ocean, filtered for 2019 data with valid QC flags"
    },
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Processing temporal analysis query for Southern Ocean oxygen levels. Extracting: PARAMETER='dissolved_oxygen', REGION='southern_ocean', TEMPORAL_SCOPE='2019_annual'. Mapping Southern Ocean to latitudes <-50°S following oceanographic conventions. Identifying requirement for monthly aggregation and seasonal trend analysis.",
        codeSnippet: `{
  "query_analysis": {
    "temporal_scope": "annual_2019",
    "parameter": "dissolved_oxygen",
    "region": "southern_ocean",
    "spatial_bounds": {"latitude": "< -50.0"},
    "aggregation_type": "monthly_means"
  },
  "data_requirements": {
    "quality_flags": ["1", "2", "5", "8"],
    "measurement_parameter": "doxy_adjusted",
    "time_grouping": "month"
  }
}`,
        isExpanded: false
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Constructing temporal analysis query for Southern Ocean oxygen data. Using EXTRACT(MONTH) for monthly grouping and EXTRACT(YEAR) for 2019 filtering. Implementing spatial constraint with latitude < -50.0 for Southern Ocean definition. Adding dissolved oxygen QC filtering (doxy_qc) and computing statistical aggregates (AVG, STDDEV) for robust seasonal analysis.",
        codeSnippet: `SELECT
  EXTRACT(MONTH FROM p.date_creation) as month,
  AVG(m.doxy_adjusted) as oxygen_mean,
  STDDEV(m.doxy_adjusted) as oxygen_std
FROM argo_full.measurements m
JOIN argo_full.profiles p ON m.profile_id = p.profile_id
WHERE p.latitude < -50.0
  AND EXTRACT(YEAR FROM p.date_creation) = 2019
  AND m.doxy_qc IN ('1', '2', '5', '8')
  AND m.doxy_adjusted IS NOT NULL
GROUP BY EXTRACT(MONTH FROM p.date_creation)
ORDER BY month`,
        isExpanded: false
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing 156 Southern Ocean profiles with 28,934 dissolved oxygen measurements from 2019. Applying standard ARGO oxygen QC protocols with 91.7% data retention rate. Identifying strong seasonal signal with winter maxima (Jun-Aug: 315-320 μmol/kg) and summer minima (Dec-Feb: 285-295 μmol/kg). Computing monthly statistics with outlier detection for Antarctic seasonal variations.",
        codeSnippet: `{
  "processing_summary": {
    "total_profiles": 156,
    "measurements_processed": 28934,
    "qc_pass_rate": 91.7,
    "seasonal_analysis": {
      "winter_peak": "318 μmol/kg (July)",
      "summer_minimum": "285 μmol/kg (January)",
      "seasonal_amplitude": "33 μmol/kg"
    }
  },
  "regional_coverage": {
    "antarctic_circumpolar_current": "78%",
    "ross_sea_sector": "12%",
    "weddell_sea_sector": "10%"
  }
}`,
        isExpanded: false
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Creating monthly time series visualization for Southern Ocean oxygen levels. Implementing line chart with seasonal trend highlighting and uncertainty bands. Color scheme: ocean blue (#1e40af) for oxygen concentration with confidence intervals. Adding seasonal markers and Antarctic winter/summer period annotations. Responsive design with interactive tooltips showing monthly statistics.",
        codeSnippet: `{
  "chart_configuration": {
    "type": "seasonal_time_series",
    "library": "recharts",
    "x_axis": "month_names",
    "y_axis": "oxygen_concentration_μmol_kg"
  },
  "styling": {
    "primary_color": "#1e40af",
    "line_width": 3,
    "marker_size": 6,
    "confidence_band": "rgba(30,64,175,0.2)"
  },
  "annotations": {
    "seasonal_markers": true,
    "trend_line": "fitted_polynomial",
    "data_quality_indicator": "corner_badge"
  }
}`,
        isExpanded: false
      }
    ]
  },

  "show me argo float trajectories in the pacific": {
    response: "I've retrieved trajectory data for ARGO floats operating in the Pacific Ocean. The visualization shows 24 float tracks with diverse circulation patterns reflecting major Pacific currents. Notable features include the Kuroshio Extension in the North Pacific, equatorial current systems, and the Antarctic Circumpolar Current in the south. Float #2902097 shows the longest trajectory spanning 847 days across the subtropical gyre.",
    suggestions: [
      "Filter by specific Pacific regions",
      "Show trajectory depths over time",
      "Analyze float lifetime statistics"
    ],
    chartType: "trajectory",
    chartData: [
      { latitude: 35.2, longitude: -155.8, date: "2019-01-15" },
      { latitude: 34.8, longitude: -153.2, date: "2019-02-15" },
      { latitude: 33.9, longitude: -150.1, date: "2019-03-15" },
      { latitude: 32.4, longitude: -147.8, date: "2019-04-15" },
      { latitude: 30.8, longitude: -145.2, date: "2019-05-15" },
      { latitude: 29.1, longitude: -142.9, date: "2019-06-15" }
    ],
    agentParams: {
      queryType: "trajectory_visualization",
      parameter: "float_positions",
      region: "pacific",
      visualizationRequirement: "geographic_trajectories"
    },
    sqlQuery: `
    SELECT
      p.platform_number,
      p.cycle_number,
      p.latitude,
      p.longitude,
      p.date_creation
    FROM argo_full.profiles p
    WHERE p.longitude BETWEEN -180.0 AND -120.0
      AND p.latitude BETWEEN -60.0 AND 60.0
      AND p.latitude IS NOT NULL
      AND p.longitude IS NOT NULL
    ORDER BY p.platform_number, p.cycle_number
    `,
    processingStats: {
      profiles: 234,
      qcPassRate: 98.1,
      processingDetails: "Pacific Ocean trajectories from 24 active floats, covering major current systems and circulation patterns"
    },
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Parsing trajectory visualization request for Pacific Ocean ARGO floats. Extracting: QUERY_TYPE='trajectory_analysis', REGION='pacific_ocean', VISUALIZATION='geographic_paths'. Mapping Pacific Ocean bounds to longitude range -180° to -120°W and latitude range -60° to 60°N/S. Identifying requirement for sequential position plotting with temporal progression.",
        codeSnippet: `{
  "query_classification": "trajectory_visualization",
  "spatial_parameters": {
    "region": "pacific_ocean",
    "longitude_bounds": [-180.0, -120.0],
    "latitude_bounds": [-60.0, 60.0]
  },
  "visualization_requirements": {
    "plot_type": "geographic_trajectories",
    "temporal_sequence": true,
    "platform_tracking": true
  }
}`,
        isExpanded: false
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Building trajectory query for Pacific ARGO float positions. Selecting platform_number for float identification, cycle_number for temporal sequencing, and geographic coordinates. Implementing Pacific Ocean spatial filtering with longitude (-180° to -120°) and latitude (-60° to 60°) bounds. Adding coordinate validation and ordering by platform and cycle for trajectory reconstruction.",
        codeSnippet: `SELECT
  p.platform_number,
  p.cycle_number,
  p.latitude,
  p.longitude,
  p.date_creation
FROM argo_full.profiles p
WHERE p.longitude BETWEEN -180.0 AND -120.0
  AND p.latitude BETWEEN -60.0 AND 60.0
  AND p.latitude IS NOT NULL
  AND p.longitude IS NOT NULL
ORDER BY p.platform_number, p.cycle_number`,
        isExpanded: false
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing trajectory data from 24 Pacific ARGO floats with 234 position reports. Implementing coordinate validation and temporal sequencing. Identified major circulation patterns including North Pacific Subtropical Gyre, California Current, and Equatorial Counter Current. Quality control rate: 98.1% with robust position filtering. Computing trajectory statistics and drift velocities for oceanographic analysis.",
        codeSnippet: `{
  "trajectory_statistics": {
    "active_floats": 24,
    "total_positions": 234,
    "longest_trajectory": "Float 2902097: 847 days",
    "average_drift_speed": "15.3 cm/s",
    "regional_coverage": {
      "north_pacific_gyre": 8,
      "equatorial_pacific": 6,
      "southern_pacific": 10
    }
  },
  "quality_metrics": {
    "valid_coordinates": 98.1,
    "temporal_continuity": 96.8,
    "position_accuracy": "GPS_validated"
  }
}`,
        isExpanded: false
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Designing interactive Pacific Ocean trajectory map with multi-float tracking capability. Using sequential color gradients to show temporal progression from launch (blue) to current position (red). Implementing hover tooltips with float ID, date, and position data. Adding Pacific Ocean bathymetry overlay and major current indicators for oceanographic context.",
        codeSnippet: `{
  "map_configuration": {
    "projection": "pacific_centered",
    "basemap": "ocean_bathymetry",
    "zoom_level": "pacific_basin"
  },
  "trajectory_styling": {
    "color_scheme": "temporal_gradient",
    "line_width": 2,
    "start_color": "#3b82f6",
    "end_color": "#ef4444",
    "trajectory_points": "sequential_markers"
  },
  "interactive_features": {
    "float_selection": "clickable_trajectories",
    "temporal_slider": "date_range_filter",
    "current_overlays": "optional_display"
  }
}`,
        isExpanded: false
      }
    ]
  },

  "compare salinity between atlantic and pacific": {
    response: "Comparative analysis reveals distinct salinity patterns between Atlantic and Pacific Oceans. The Atlantic exhibits higher overall salinity (35.8±0.4 PSU) compared to the Pacific (34.9±0.3 PSU), reflecting different evaporation-precipitation balances and thermohaline circulation patterns. Atlantic surface waters show pronounced north-south gradients, while Pacific waters display more uniform distribution with notable freshening in the tropical regions.",
    suggestions: [
      "Show depth-stratified comparison",
      "Analyze seasonal differences",
      "Include Indian Ocean for three-basin comparison"
    ],
    chartType: "time-series",
    chartData: [
      { month: "Jan", atlantic: 35.7, pacific: 34.8 },
      { month: "Feb", atlantic: 35.8, pacific: 34.9 },
      { month: "Mar", atlantic: 35.9, pacific: 35.0 },
      { month: "Apr", atlantic: 36.0, pacific: 35.1 },
      { month: "May", atlantic: 36.1, pacific: 35.0 },
      { month: "Jun", atlantic: 36.0, pacific: 34.9 },
      { month: "Jul", atlantic: 35.9, pacific: 34.8 },
      { month: "Aug", atlantic: 35.8, pacific: 34.7 },
      { month: "Sep", atlantic: 35.7, pacific: 34.8 },
      { month: "Oct", atlantic: 35.8, pacific: 34.9 },
      { month: "Nov", atlantic: 35.9, pacific: 35.0 },
      { month: "Dec", atlantic: 35.8, pacific: 34.9 }
    ],
    agentParams: {
      queryType: "basin_comparison",
      parameter: "salinity",
      region: "atlantic_pacific",
      visualizationRequirement: "comparative_time_series"
    },
    sqlQuery: `
    WITH atlantic_data AS (
      SELECT
        EXTRACT(MONTH FROM p.date_creation) as month,
        AVG(m.psal_adjusted) as salinity_mean
      FROM argo_full.measurements m
      JOIN argo_full.profiles p ON m.profile_id = p.profile_id
      WHERE p.longitude BETWEEN -80.0 AND 20.0
        AND m.psal_qc IN ('1', '2', '5', '8')
        AND m.pres_adjusted <= 200
      GROUP BY month
    ),
    pacific_data AS (
      SELECT
        EXTRACT(MONTH FROM p.date_creation) as month,
        AVG(m.psal_adjusted) as salinity_mean
      FROM argo_full.measurements m
      JOIN argo_full.profiles p ON m.profile_id = p.profile_id
      WHERE p.longitude BETWEEN -180.0 AND -70.0
        AND m.psal_qc IN ('1', '2', '5', '8')
        AND m.pres_adjusted <= 200
      GROUP BY month
    )
    SELECT
      a.month,
      a.salinity_mean as atlantic_salinity,
      p.salinity_mean as pacific_salinity
    FROM atlantic_data a
    JOIN pacific_data p ON a.month = p.month
    ORDER BY month
    `,
    processingStats: {
      profiles: 445,
      measurements: 67234,
      qcPassRate: 93.4,
      processingDetails: "Multi-basin comparison using 445 profiles from Atlantic and Pacific surface layers (0-200m depth)"
    },
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Processing inter-basin comparison query for Atlantic vs Pacific salinity patterns. Extracting: QUERY_TYPE='basin_comparison', PARAMETER='salinity', REGIONS=['atlantic', 'pacific']. Mapping ocean basin boundaries: Atlantic (-80°W to 20°E), Pacific (-180°W to -70°W). Identifying requirement for comparative statistical analysis with temporal resolution.",
        codeSnippet: `{
  "comparison_analysis": {
    "parameter": "salinity",
    "regions": ["atlantic", "pacific"],
    "basin_boundaries": {
      "atlantic": {"longitude": [-80.0, 20.0]},
      "pacific": {"longitude": [-180.0, -70.0]}
    },
    "analysis_type": "temporal_comparison"
  },
  "statistical_requirements": {
    "aggregation": "monthly_means",
    "depth_constraint": "surface_layer_0_200m",
    "quality_filtering": true
  }
}`,
        isExpanded: false
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Implementing dual CTE structure for basin-specific salinity extraction. Creating separate atlantic_data and pacific_data CTEs with geographic filtering. Using longitude bounds for ocean basin definition and depth constraint (pres_adjusted <= 200m) for surface layer focus. Joining CTEs on month for direct comparison and computing statistical aggregates for each basin.",
        codeSnippet: `WITH atlantic_data AS (
  SELECT
    EXTRACT(MONTH FROM p.date_creation) as month,
    AVG(m.psal_adjusted) as salinity_mean
  FROM argo_full.measurements m
  JOIN argo_full.profiles p ON m.profile_id = p.profile_id
  WHERE p.longitude BETWEEN -80.0 AND 20.0
    AND m.psal_qc IN ('1', '2', '5', '8')
    AND m.pres_adjusted <= 200
  GROUP BY month
),
pacific_data AS (
  SELECT
    EXTRACT(MONTH FROM p.date_creation) as month,
    AVG(m.psal_adjusted) as salinity_mean
  FROM argo_full.measurements m
  JOIN argo_full.profiles p ON m.profile_id = p.profile_id
  WHERE p.longitude BETWEEN -180.0 AND -70.0
    AND m.psal_qc IN ('1', '2', '5', '8')
    AND m.pres_adjusted <= 200
  GROUP BY month
)
SELECT
  a.month,
  a.salinity_mean as atlantic_salinity,
  p.salinity_mean as pacific_salinity
FROM atlantic_data a
JOIN pacific_data p ON a.month = p.month
ORDER BY month`,
        isExpanded: false
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing 445 profiles with 67,234 salinity measurements from Atlantic and Pacific basins. Computing monthly averages for surface layer (0-200m) with 93.4% QC pass rate. Identified significant inter-basin differences: Atlantic mean 35.9±0.4 PSU, Pacific mean 34.9±0.3 PSU. Seasonal analysis shows Atlantic peak in spring (April-May) and Pacific minimum in summer (July-August).",
        codeSnippet: `{
  "basin_statistics": {
    "atlantic": {
      "mean_salinity": 35.9,
      "std_deviation": 0.4,
      "seasonal_range": [35.7, 36.1],
      "profiles_count": 267
    },
    "pacific": {
      "mean_salinity": 34.9,
      "std_deviation": 0.3,
      "seasonal_range": [34.7, 35.1],
      "profiles_count": 178
    }
  },
  "comparison_metrics": {
    "basin_difference": 1.0,
    "correlation_coefficient": 0.23,
    "statistical_significance": "p < 0.001"
  }
}`,
        isExpanded: false
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Creating dual-line comparison chart for Atlantic vs Pacific salinity trends. Color coding: Atlantic in deep blue (#1e40af) representing higher salinity, Pacific in teal (#14b8a6) for contrast. Implementing seasonal trend lines with confidence intervals and statistical difference markers. Adding basin comparison summary panel with key statistics and oceanographic context.",
        codeSnippet: `{
  "chart_configuration": {
    "type": "dual_line_comparison",
    "library": "recharts",
    "comparison_mode": "temporal_overlay"
  },
  "color_scheme": {
    "atlantic": "#1e40af",
    "pacific": "#14b8a6",
    "difference_highlight": "#f59e0b"
  },
  "statistical_overlays": {
    "confidence_bands": true,
    "difference_markers": "significant_months",
    "trend_lines": "fitted_seasonal"
  },
  "summary_panel": {
    "basin_means": "displayed",
    "seasonal_extremes": "annotated",
    "oceanographic_context": "tooltip"
  }
}`,
        isExpanded: false
      }
    ]
  },

  "temperature trends in the arctic ocean": {
    response: "Arctic Ocean temperature analysis reveals accelerating warming trends with surface temperatures increasing by 0.8°C per decade since 2000. The data shows pronounced seasonal amplitude with summer surface temperatures reaching 2-4°C above historical averages. Deep water masses remain cold but show gradual warming at intermediate depths (200-500m). The analysis indicates strong correlation with sea ice retreat and Atlantic water intrusion.",
    suggestions: [
      "Compare with global ocean temperature trends",
      "Show relationship with sea ice extent",
      "Analyze by Arctic Ocean sub-regions"
    ],
    chartType: "time-series",
    chartData: [
      { month: "Jan", temperature: -1.6 },
      { month: "Feb", temperature: -1.7 },
      { month: "Mar", temperature: -1.5 },
      { month: "Apr", temperature: -1.0 },
      { month: "May", temperature: -0.2 },
      { month: "Jun", temperature: 1.2 },
      { month: "Jul", temperature: 2.8 },
      { month: "Aug", temperature: 3.1 },
      { month: "Sep", temperature: 1.9 },
      { month: "Oct", temperature: 0.4 },
      { month: "Nov", temperature: -0.8 },
      { month: "Dec", temperature: -1.4 }
    ],
    agentParams: {
      queryType: "climate_trend_analysis",
      parameter: "temperature",
      region: "arctic_ocean",
      timeRange: "recent_trends",
      visualizationRequirement: "seasonal_temperature_cycle"
    },
    sqlQuery: `
    SELECT
      EXTRACT(MONTH FROM p.date_creation) as month,
      AVG(m.temp_adjusted) as temperature_mean,
      STDDEV(m.temp_adjusted) as temperature_std,
      COUNT(*) as measurement_count
    FROM argo_full.measurements m
    JOIN argo_full.profiles p ON m.profile_id = p.profile_id
    WHERE p.latitude > 70.0
      AND m.temp_qc IN ('1', '2', '5', '8')
      AND m.pres_adjusted <= 50
      AND EXTRACT(YEAR FROM p.date_creation) >= 2015
    GROUP BY EXTRACT(MONTH FROM p.date_creation)
    ORDER BY month
    `,
    processingStats: {
      profiles: 78,
      measurements: 8934,
      qcPassRate: 89.3,
      processingDetails: "Arctic Ocean surface temperature analysis from 78 profiles north of 70°N, focusing on recent climate trends"
    },
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Processing Arctic climate analysis query for temperature trends. Extracting: PARAMETER='temperature', REGION='arctic_ocean', ANALYSIS_TYPE='climate_trends'. Mapping Arctic Ocean to latitudes >70°N following polar oceanographic definitions. Identifying requirement for temporal trend analysis with emphasis on climate change signals and seasonal variability.",
        codeSnippet: `{
  "climate_analysis": {
    "region": "arctic_ocean",
    "spatial_bounds": {"latitude": "> 70.0"},
    "parameter": "temperature",
    "focus": "climate_trends",
    "temporal_scope": "recent_years_2015_onwards"
  },
  "analysis_requirements": {
    "depth_layer": "surface_mixed_layer",
    "seasonal_resolution": "monthly",
    "trend_detection": "warming_signals"
  }
}`,
        isExpanded: false
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Constructing Arctic temperature trend query with polar region filtering (latitude > 70°N). Implementing shallow depth constraint (pres_adjusted <= 50m) for surface mixed layer analysis. Adding temporal filtering for recent climate period (2015 onwards) and monthly aggregation. Computing statistical measures (mean, standard deviation, count) for robust trend analysis.",
        codeSnippet: `SELECT
  EXTRACT(MONTH FROM p.date_creation) as month,
  AVG(m.temp_adjusted) as temperature_mean,
  STDDEV(m.temp_adjusted) as temperature_std,
  COUNT(*) as measurement_count
FROM argo_full.measurements m
JOIN argo_full.profiles p ON m.profile_id = p.profile_id
WHERE p.latitude > 70.0
  AND m.temp_qc IN ('1', '2', '5', '8')
  AND m.pres_adjusted <= 50
  AND EXTRACT(YEAR FROM p.date_creation) >= 2015
GROUP BY EXTRACT(MONTH FROM p.date_creation)
ORDER BY month`,
        isExpanded: false
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing 78 Arctic profiles with 8,934 temperature measurements from surface mixed layer. Quality control rate: 89.3% with strict polar data validation. Identified strong seasonal temperature cycle with August maximum (3.1°C) and February minimum (-1.7°C). Detected warming trend of +0.8°C/decade in summer months, consistent with Arctic amplification patterns.",
        codeSnippet: `{
  "arctic_temperature_analysis": {
    "seasonal_cycle": {
      "winter_minimum": "-1.7°C (February)",
      "summer_maximum": "3.1°C (August)",
      "annual_amplitude": "4.8°C"
    },
    "climate_trends": {
      "warming_rate": "+0.8°C per decade",
      "strongest_warming": "summer_months",
      "arctic_amplification": "confirmed"
    },
    "data_quality": {
      "profiles_processed": 78,
      "valid_measurements": 89.3,
      "polar_coverage": "beaufort_chukchi_seas"
    }
  }
}`,
        isExpanded: false
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Designing Arctic temperature visualization with climate context. Using temperature gradient colors: cold blue (#1e3a8a) for winter, warm red (#dc2626) for summer peaks. Implementing trend overlay with warming signal highlighting and confidence intervals. Adding Arctic-specific annotations including sea ice season markers and polar night/day periods.",
        codeSnippet: `{
  "arctic_visualization": {
    "type": "climate_trend_series",
    "color_mapping": "temperature_gradient",
    "cold_color": "#1e3a8a",
    "warm_color": "#dc2626"
  },
  "climate_overlays": {
    "warming_trend": "highlighted_regression",
    "confidence_intervals": "seasonal_uncertainty",
    "arctic_context": "sea_ice_season_markers"
  },
  "polar_annotations": {
    "polar_night": "December-February",
    "midnight_sun": "June-August",
    "ice_formation": "October-April"
  }
}`,
        isExpanded: false
      }
    ]
  },

  "geospatial proximity search near hawaii": {
    response: "Proximity analysis near Hawaii reveals 47 ARGO profiles within 500km radius of the Hawaiian Islands. The search encompasses the North Pacific Subtropical Gyre region with profiles spanning from 18°N to 25°N latitude and 165°W to 150°W longitude. Data shows typical tropical Pacific characteristics with warm surface temperatures (24-26°C) and moderate salinity (34.8-35.2 PSU). Closest profile is 45km northeast of Maui.",
    suggestions: [
      "Adjust search radius to include more profiles",
      "Show seasonal variations in this region",
      "Compare with other Pacific islands"
    ],
    chartType: "trajectory",
    chartData: [
      { latitude: 21.5, longitude: -158.2, date: "2019-03-15" },
      { latitude: 22.1, longitude: -157.8, date: "2019-04-15" },
      { latitude: 23.2, longitude: -156.9, date: "2019-05-15" },
      { latitude: 24.0, longitude: -155.7, date: "2019-06-15" },
      { latitude: 23.8, longitude: -154.3, date: "2019-07-15" },
      { latitude: 22.9, longitude: -153.1, date: "2019-08-15" }
    ],
    agentParams: {
      queryType: "geospatial_proximity_search",
      parameter: "proximity",
      region: "hawaii",
      visualizationRequirement: "proximity_mapping"
    },
    sqlQuery: `
    SELECT
      p.profile_id,
      p.platform_number,
      p.latitude,
      p.longitude,
      p.date_creation,
      ST_DISTANCE(
        ST_GEOGPOINT(p.longitude, p.latitude),
        ST_GEOGPOINT(-157.8, 21.3)
      ) / 1000 as distance_km
    FROM argo_full.profiles p
    WHERE ST_DISTANCE(
        ST_GEOGPOINT(p.longitude, p.latitude),
        ST_GEOGPOINT(-157.8, 21.3)
      ) <= 500000
      AND p.latitude IS NOT NULL
      AND p.longitude IS NOT NULL
    ORDER BY distance_km
    LIMIT 50
    `,
    processingStats: {
      profiles: 47,
      qcPassRate: 96.8,
      processingDetails: "Geospatial proximity search within 500km of Hawaii center point (21.3°N, 157.8°W) with distance calculations"
    },
    agentThoughts: [
      {
        agentName: "Query Understanding Agent (RAG)",
        content: "Processing geospatial proximity query for Hawaiian region. Extracting: QUERY_TYPE='proximity_search', REGION='hawaii', SPATIAL_OPERATION='distance_based_filtering'. Mapping Hawaii center point to coordinates (21.3°N, 157.8°W). Identifying requirement for radial distance calculation and profile ranking by proximity.",
        codeSnippet: `{
  "geospatial_query": {
    "center_point": {
      "latitude": 21.3,
      "longitude": -157.8,
      "reference": "hawaii_islands_center"
    },
    "search_parameters": {
      "radius_km": 500,
      "max_results": 50,
      "distance_calculation": "great_circle"
    }
  },
  "spatial_operations": {
    "distance_function": "ST_DISTANCE",
    "coordinate_system": "geographic_WGS84",
    "proximity_ranking": true
  }
}`,
        isExpanded: false
      },
      {
        agentName: "SQL Query Generator (MCP)",
        content: "Implementing geospatial proximity search using BigQuery GIS functions. Using ST_DISTANCE with ST_GEOGPOINT for accurate great-circle distance calculation. Setting Hawaii center point (-157.8°, 21.3°) as reference and 500km radius constraint. Computing distance in kilometers and ordering results by proximity for optimal spatial analysis.",
        codeSnippet: `SELECT
  p.profile_id,
  p.platform_number,
  p.latitude,
  p.longitude,
  p.date_creation,
  ST_DISTANCE(
    ST_GEOGPOINT(p.longitude, p.latitude),
    ST_GEOGPOINT(-157.8, 21.3)
  ) / 1000 as distance_km
FROM argo_full.profiles p
WHERE ST_DISTANCE(
    ST_GEOGPOINT(p.longitude, p.latitude),
    ST_GEOGPOINT(-157.8, 21.3)
  ) <= 500000
  AND p.latitude IS NOT NULL
  AND p.longitude IS NOT NULL
ORDER BY distance_km
LIMIT 50`,
        isExpanded: false
      },
      {
        agentName: "Data Processing & QC Agent",
        content: "Processing geospatial proximity results with 47 profiles within 500km of Hawaii. Computing accurate distances using spherical Earth model with 96.8% coordinate validation rate. Closest profile at 45km northeast of Maui, furthest at 487km northwest. Spatial distribution shows concentration in lee of main islands with typical subtropical gyre characteristics.",
        codeSnippet: `{
  "proximity_results": {
    "total_profiles": 47,
    "closest_distance": "45.2 km (NE of Maui)",
    "furthest_distance": "486.8 km (NW of Oahu)",
    "spatial_distribution": {
      "northeast_quadrant": 18,
      "northwest_quadrant": 15,
      "southeast_quadrant": 8,
      "southwest_quadrant": 6
    }
  },
  "oceanographic_context": {
    "current_system": "north_pacific_subtropical_gyre",
    "typical_conditions": "warm_oligotrophic_waters",
    "seasonal_variability": "moderate"
  }
}`,
        isExpanded: false
      },
      {
        agentName: "Visualization & Response Generator",
        content: "Creating proximity map visualization centered on Hawaiian Islands with distance-based color coding. Using circular markers sized by proximity: larger for closer profiles, smaller for distant ones. Color gradient from green (closest) to red (furthest) with 500km search radius overlay. Adding Hawaiian island outlines and bathymetry for geographic context.",
        codeSnippet: `{
  "proximity_map": {
    "center_coordinates": [-157.8, 21.3],
    "zoom_level": "regional_scale",
    "basemap": "ocean_bathymetry_hawaii"
  },
  "marker_styling": {
    "size_mapping": "inverse_distance",
    "color_gradient": {
      "closest": "#22c55e",
      "medium": "#f59e0b",
      "furthest": "#ef4444"
    }
  },
  "spatial_overlays": {
    "search_radius": "500km_circle",
    "island_outlines": "hawaiian_chain",
    "distance_rings": "100km_intervals"
  }
}`,
        isExpanded: false
      }
    ]
  }
};

export default mockData;