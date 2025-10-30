import api from "./axios";

export interface Document {
  type: string;
  id: number;
  attributes: {
    title: string;
    docType: string;
    docCreationDate: string;
    docStatut: number;
    isActive: number;
    createdAt: string;
    updatedAt: string;
  };
  relationships: {
    author: {
      data: {
        type: string;
        id: number;
        email: string;
      };
      links: {
        self: string;
      };
    };
    relatedDocument: {
      data: {
        id: number;
        type: string;
        title: string;
        docType: string;
        docStatut: number;
      };
      links: {
        self: string;
      };
    };
    direction: {
      data: {
        type: string;
        name: string;
      };
      links: {
        self: string;
      };
    };
  };
  links: {
    self: string;
  };
}

export interface DocsResponse {
  data: Document[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: unknown;
}

export interface UpdateDocPayload {
  data: {
    attributes: {
      title?: string;
      docType?: number;
      docCreationDate?: string;
      docStatut?: number;
    };
    relationships?: {
      relatedDocument?: {
        data: {
          id: number;
        };
      };
    };
  };
}

export interface AddDocPayload {
  title: string;
  file: File;
  docType: number;
  docCreationDate: string;
  docStatut: string;
  relatedDocument?: number;
}

export interface SingleDocResponse {
  data: Document;
}

export interface MessageResponse {
  message: string;
}

export interface GetDocsParams {
  userIds?: (string | number)[];
  isActive?: 0 | 1;
}

export const getDocsByDate = async (date: string): Promise<DocsResponse> => {
  const response = await api.get(`/docs?filter[docCreationDate]=${date}`);
  return response.data;
};

export const getDocs = async (
  params?: GetDocsParams,
): Promise<DocsResponse> => {
  let url = "/docs";
  const queryParams: string[] = [];

  if (params?.userIds && params.userIds.length > 0) {
    queryParams.push(`filter[user]=${params.userIds.join(",")}`);
  }
  if (params?.isActive !== undefined) {
    queryParams.push(`filter[isActive]=${params.isActive}`);
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getDoc = async (id: number): Promise<SingleDocResponse> => {
  const response = await api.get(`/docs/${id}`);
  return response.data;
};

export const updateDoc = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateDocPayload;
}): Promise<SingleDocResponse> => {
  const response = await api.patch(`/docs/${id}`, payload);
  return response.data;
};

export const deleteDoc = async (id: number): Promise<MessageResponse> => {
  const response = await api.delete(`/docs/${id}`);
  return response.data;
};

export const restoreDoc = async (id: number): Promise<SingleDocResponse> => {
  const response = await api.patch(`/docs/${id}/restore`);
  return response.data;
};

export const addDoc = async (
  payload: AddDocPayload,
  signal?: AbortSignal,
): Promise<SingleDocResponse> => {
  const formData = new FormData();

  formData.append("data[attributes][title]", payload.title);
  formData.append("data[attributes][type]", "pdf");
  formData.append("data[attributes][docType]", String(payload.docType));
  formData.append("data[attributes][docCreationDate]", payload.docCreationDate);
  formData.append("data[attributes][docStatut]", payload.docStatut);
  // formData.append("data[attributes][docStatut]", String(payload.docStatut)); // if the backedn expects a string
  if (payload.relatedDocument) {
    formData.append(
      "data[relationships][relatedDocument][data][id]",
      String(payload.relatedDocument),
    );
  }
  formData.append("data[attributes][file]", payload.file);

  // Log FormData entries for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`FormData entry: ${key}`, value);
  }

  const response = await api.post("/docs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal,
  });
  return response.data;
};
