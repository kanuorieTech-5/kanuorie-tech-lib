import API from "./axiosApi";

export const getAdminOpportunities = async (params = {}) => {
  const { data } = await API.get("/admin/opportunities", { params });
  return data;
};

export const createAdminOpportunity = async (payload) => {
  const { data } = await API.post("/admin/opportunities", payload);
  return data;
};

export const updateAdminOpportunity = async (id, payload) => {
  const { data } = await API.put(`/admin/opportunities/${id}`, payload);
  return data;
};

export const deleteAdminOpportunity = async (id) => {
  const { data } = await API.delete(`/admin/opportunities/${id}`);
  return data;
};

export const getPublicOpportunities = async (params = {}) => {
  const { data } = await API.get("/opportunities", { params });
  return data;
};

export const getAllPublicOpportunities = async () => {
  const unwrapPage = (response) => {
    const result = response?.data ?? response;
    const payload = result?.data ?? result;

    return {
      items: Array.isArray(payload?.items) ? payload.items : [],
      pages: Math.max(1, Number(payload?.pagination?.pages) || 1),
    };
  };

  const firstPage = await getPublicOpportunities({ page: 1, limit: 100 });
  const { items, pages } = unwrapPage(firstPage);

  if (pages === 1) return items;

  const remainingPages = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) =>
      getPublicOpportunities({ page: index + 2, limit: 100 }),
    ),
  );

  return [
    ...items,
    ...remainingPages.flatMap((response) => unwrapPage(response).items),
  ];
};

export const getPublicOpportunity = async (idOrSlug) => {
  const { data } = await API.get(
    `/opportunities/${encodeURIComponent(idOrSlug)}`
  );
  return data;
};
