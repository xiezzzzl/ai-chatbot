"use client";

import { ExternalLink, BookOpen } from "lucide-react";

type AcademicPaper = {
  title: string;
  authors: string;
  year: string;
  venue: string;
  citations: number;
  url: string;
  abstract: string;
};

type AcademicSearchResult = {
  results?: AcademicPaper[];
  message?: string;
  error?: string;
};

export function AcademicSearch({
  searchResult,
}: {
  searchResult: AcademicSearchResult;
}) {
  if (searchResult.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Error: {searchResult.error}
      </div>
    );
  }

  if (searchResult.message && !searchResult.results?.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        {searchResult.message}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-gray-700 text-sm">
          Academic Papers
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {searchResult.results?.map((paper, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-800 text-sm hover:text-blue-600 hover:underline"
            >
              {paper.title}
            </a>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>{paper.authors}</span>
              <span>•</span>
              <span>{paper.year}</span>
              <span>•</span>
              <span>{paper.venue}</span>
              <span>•</span>
              <span>{paper.citations} citations</span>
            </div>

            {paper.abstract && (
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                {paper.abstract}
              </p>
            )}

            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              View Paper <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
