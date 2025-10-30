import api from "./axios";

export interface DocType {
  type: "docType";
  id: number;
  attributes: {
    name: string;
    isActive: number;
    createdAt: string;
    updatedAt: string;
  };
  links?: {
    self: string;
  };
}

export interface DocTypesResponse {
  data: DocType[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: unknown;
}

export interface AddDocTypePayload {
  data: {
    attributes: {
      name: string;
    };
  };
}

export interface UpdateDocTypePayload {
  data: {
    attributes: {
      name: string;
    };
  };
}

export const getDocTypes = async (): Promise<DocTypesResponse> => {
  const response = await api.get("/docTypes");
  return response.data;
};

export const addDocType = async (
  payload: AddDocTypePayload,
): Promise<{ data: DocType }> => {
  const response = await api.post("/docTypes", payload);
  return response.data;
};

export const updateDocType = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateDocTypePayload;
}): Promise<{ data: DocType }> => {
  const response = await api.patch(`/docTypes/${id}`, payload);
  return response.data;
};

export const deleteDocType = async (id: number): Promise<{ data: DocType }> => {
  const response = await api.delete(`/docTypes/${id}`);
  return response.data;
};

export const restoreDocType = async (
  id: number,
): Promise<{ data: DocType }> => {
  const payload = {
    data: {
      attributes: {
        isActive: 1,
      },
    },
  };
  const response = await api.patch(`/docTypes/${id}`, payload);
  return response.data;
};
