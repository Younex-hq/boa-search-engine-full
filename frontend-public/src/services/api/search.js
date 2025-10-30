// fetching search results from the API.

import axios from "axios";

export const fetchSearchResults = async (query) => {
  if (!query.trim()) throw new Error("Query is empty");
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/search/${encodeURIComponent(query)}`,
  );
  return response.data;
};
