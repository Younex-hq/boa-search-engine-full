import api from "./axios";

export interface Direction {
  type: "direction";
  id: number;
  attributes: {
    name: string;
    isActive: number | null;
    location: string | null;
    createdAt: string;
    updatedAt: string;
  };
  relationships: {
    parent: {
      data: {
        type: "direction";
        name: string;
      };
      links: {
        self: string;
      };
    } | null;
    location: {
      data: {
        type: "location";
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

export interface DirectionsResponse {
  data: Direction[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface AddDirectionPayload {
  data: {
    attributes: {
      name: string;
    };
    relationships?: {
      parent?: {
        data: {
          name: number | null;
        };
      };
    };
  };
}

export interface UpdateDirectionPayload {
  data: {
    attributes: {
      name?: string;
      isActive?: number;
    };
    relationships?: {
      parent?: {
        data: {
          name: number | null;
        };
      };
    };
  };
}

export const getDirections = async (): Promise<DirectionsResponse> => {
  const response = await api.get("/directions");
  return response.data;
};

export const getDirection = async (
  id: number,
): Promise<{ data: Direction }> => {
  const response = await api.get(`/directions/${id}`);
  return response.data;
};

export const addDirection = async (
  payload: AddDirectionPayload,
): Promise<{ data: Direction }> => {
  const response = await api.post("/directions", payload);
  return response.data;
};

export const updateDirection = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateDirectionPayload;
}): Promise<{ data: Direction }> => {
  const response = await api.patch(`/directions/${id}`, payload);
  return response.data;
};

export const deleteDirection = async (
  id: number,
): Promise<{ data: []; message: string; status: number }> => {
  const response = await api.delete(`/directions/${id}`);
  return response.data;
};

export const restoreDirection = async (
  id: number,
): Promise<{ data: Direction }> => {
  const response = await api.patch(`/directions/${id}/restore`); // this is the route for restoring direction
  return response.data;
};
