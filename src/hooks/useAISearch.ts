import { useState, useCallback } from "react";
import { fetchAISearchResults, fetchWithPossibleError, type AIResponse } from "../lib/mockAI";

export type SearchStatus = "idle" | "loading" | "success" | "error";

export function useAISearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AIResponse | null>(null);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setStatus("idle");
      return;
    }

    setQuery(searchQuery);
    setStatus("loading");
    setError(null);

    try {
      const response = await fetchWithPossibleError(
        () => fetchAISearchResults(searchQuery),
        0.05 // 5% error rate for demo
      );
      setResults(response);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setStatus("error");
      setResults(null);
    }
  }, []);

  const retry = useCallback(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const clear = useCallback(() => {
    setQuery("");
    setResults(null);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    query,
    results,
    status,
    error,
    search,
    retry,
    clear,
  };
}
