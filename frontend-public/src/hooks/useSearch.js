import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "../services/api/search";
import { useLocation } from "react-router";

export const useSearch = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query && query.trim() !== "",
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
