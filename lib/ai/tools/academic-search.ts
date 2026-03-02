import 'server-only';

export interface AcademicPaper {
  paperId: string;
  title: string;
  abstract: string | null;
  authors: { name: string }[];
  year: number | null;
  venue: string | null;
  citationCount: number;
  url: string;
}

export async function searchAcademicPapers(query: string, limit: number = 5): Promise<AcademicPaper[]> {
  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=title,abstract,authors,year,venue,citationCount,url`,
      {
        headers: {
          'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return (data.data || []).map((paper: any) => ({
      paperId: paper.paperId,
      title: paper.title,
      abstract: paper.abstract,
      authors: paper.authors || [],
      year: paper.year,
      venue: paper.venue,
      citationCount: paper.citationCount || 0,
      url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
    }));
  } catch (error) {
    console.error('Academic search error:', error);
    return [];
  }
}

export async function getPaperDetails(paperId: string): Promise<AcademicPaper | null> {
  try {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=title,abstract,authors,year,venue,citationCount,url`,
      {
        headers: {
          'x-api-key': process.env.SEMANTIC_SCHOLAR_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const paper = await response.json();
    
    return {
      paperId: paper.paperId,
      title: paper.title,
      abstract: paper.abstract,
      authors: paper.authors || [],
      year: paper.year,
      venue: paper.venue,
      citationCount: paper.citationCount || 0,
      url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
    };
  } catch (error) {
    console.error('Get paper details error:', error);
    return null;
  }
}
