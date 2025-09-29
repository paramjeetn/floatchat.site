const real_faked_data = {"Among the shallow layers of the ocean, not beyond the hundred-decibar veil, show me which depths reveal themselves most often with both salt and heat recorded, and tell me their average character.": {
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
  }}