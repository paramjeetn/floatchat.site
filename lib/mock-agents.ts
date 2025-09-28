export interface AgentThought {
  agentName: string
  content: string
  codeSnippet?: string
  isExpanded: boolean
}

export const AGENT_TEMPLATES = {
  queryUnderstanding: (params: {
    queryType: string
    parameter?: string
    region?: string
    timeRange?: string
    visualizationRequirement: string
  }): AgentThought => ({
    agentName: "Query Understanding Agent (RAG)",
    content: `Parsing natural language query using LLM embedding model. Extracting key entities: ${
      params.parameter ? `PARAMETER='${params.parameter}', ` : ""
    }${params.region ? `REGION='${params.region}', ` : ""}${
      params.timeRange ? `TIME='${params.timeRange}'. ` : ""
    }Performing semantic search in FAISS vector database using query embedding to retrieve relevant profile metadata summaries. Confidence score: 0.94. Query intent classified as '${
      params.queryType
    }' requiring ${params.visualizationRequirement}.`,
    codeSnippet: `{
  "query_type": "${params.queryType}",
  "entities_extracted": {
    ${params.parameter ? `"parameter": "${params.parameter}",` : ""}
    ${params.region ? `"region": "${params.region}",` : ""}
    ${params.timeRange ? `"temporal_constraint": "${params.timeRange}",` : ""}
  },
  "vector_db_retrieval": {
    "embedding_model": "all-MiniLM-L6-v2",
    "similarity_threshold": 0.75,
    "retrieved_documents": 2847
  },
  "visualization_requirement": "${params.visualizationRequirement}"
}`,
    isExpanded: false,
  }),

  sqlGenerator: (sqlQuery: string): AgentThought => ({
    agentName: "SQL Query Generator (MCP)",
    content:
      "Using Model Context Protocol (MCP) to translate natural language into database query. Generating SQL targeting profiles and measurements tables with spatiotemporal filters. Applying QC filters to ensure data quality. Using adjusted parameters where available for higher accuracy.",
    codeSnippet: sqlQuery,
    isExpanded: false,
  }),

  dataProcessing: (stats: {
    profiles: number
    measurements?: number
    qcPassRate: number
    processingDetails: string
  }): AgentThought => ({
    agentName: "Data Processing & QC Agent",
    content: `Executing SQL query against PostgreSQL database. Retrieved ${stats.profiles} profiles${
      stats.measurements ? ` with ${stats.measurements} measurements` : ""
    }. Performing automated quality control: removing outliers beyond 3-sigma, validating pressure monotonicity, checking climatological bounds. ${
      stats.processingDetails
    }`,
    codeSnippet: `{
  "query_execution": {
    "database": "postgresql://argo-india-db",
    "profiles_matched": ${stats.profiles},
    ${stats.measurements ? `"measurements": ${stats.measurements},` : ""}
    "qc_pass_rate": ${stats.qcPassRate}
  },
  "qc_processing": {
    "outlier_detection": {"flagged": 78, "retained_pct": 99.98},
    "data_quality_score": ${stats.qcPassRate}
  }
}`,
    isExpanded: false,
  }),

  visualization: (chartType: string, description: string): AgentThought => ({
    agentName: "Visualization & Response Generator",
    content: `Generating ${chartType} visualization. ${description} Formatting response using RAG context from vector database. Creating follow-up suggestions based on semantic similarity to current query context.`,
    codeSnippet: `{
  "chart_config": {
    "type": "${chartType}",
    "responsive": true,
    "export_formats": ["PNG", "SVG", "CSV"]
  },
  "rag_response_generation": {
    "llm_model": "qwen-2.5-14b",
    "context_documents": 5,
    "generation_temperature": 0.7
  }
}`,
    isExpanded: false,
  }),
}