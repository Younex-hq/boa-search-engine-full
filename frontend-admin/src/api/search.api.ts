import api from "./axios";

export interface SearchResult {
  type: string;
  id: number;
  attributes: {
    title: string;
    docStatut: string;
  };
  links: {
    download: string;
  };
  relationships: {
    relatedDocument: {
      data: {
        type: string;
        id: number;
        attributes: {
          title: string;
          docStatut: string;
        };
        links: {
          download: string;
        };
      } | null;
    };
  };
}

export interface SearchResponse {
  data: SearchResult[];
  meta: {
    total_results: number;
    query: string;
    normalized_query: string;
    ai_response?: string;
  };
}

export const searchDocs = async (query: string): Promise<SearchResponse> => {
  const encodedQuery = encodeURIComponent(query);
  const response = await api.get(`/search/${encodedQuery}`);
  return response.data;
};
