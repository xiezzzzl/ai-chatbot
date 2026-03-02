import { tool } from "ai";
import { z } from "zod";

async function searchPapers(query: string, limit: number = 5) {
  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=title,abstract,authors,year,venue,citationCount,url`
    );

    if (!response.ok) {
      return { error: `Search failed: ${response.statusText}` };
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return { results: [], message: "No papers found for this query." };
    }

    return {
      results: data.data.map((paper: any) => ({
        title: paper.title,
        authors: paper.authors?.slice(0, 5).map((a: any) => a.name).join(", ") || "Unknown",
        year: paper.year || "N/A",
        venue: paper.venue || "Unknown",
        citations: paper.citationCount || 0,
        url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
        abstract: paper.abstract?.slice(0, 300) + (paper.abstract?.length > 300 ? "..." : "") || "No abstract available",
      })),
    };
  } catch (error) {
    return { error: `Search error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export const searchAcademicPapers = tool({
  description: "Search for academic papers and research articles from Semantic Scholar database. Use this when users ask about academic literature, research papers, or want to find relevant studies.",
  inputSchema: z.object({
    query: z.string().describe("Search query (e.g., 'machine learning transformers', 'quantum computing entanglement')"),
    limit: z.number().optional().describe("Number of results to return, default is 5"),
  }),
  needsApproval: false,
  execute: async (input) => {
    const result = await searchPapers(input.query, input.limit || 5);
    return result;
  },
});
