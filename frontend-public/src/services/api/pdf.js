// fetching PDF blobs from the API.

import axios from "axios";

export const fetchPdfBlob = async (docId) => {
  if (!docId) throw new Error("Document ID is required");
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/docs/${encodeURIComponent(docId)}/pdf`,
    { responseType: "blob" },
  );
  return response.data;
};
