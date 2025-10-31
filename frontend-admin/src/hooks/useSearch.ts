import { useQuery } from "@tanstack/react-query";
import { searchDocs } from "@/api/search.api";

export const useSearchDocs = (query: string, enabled: boolean) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => searchDocs(query),
    enabled: enabled && !!query, // Only run query if enabled and query is not empty
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
