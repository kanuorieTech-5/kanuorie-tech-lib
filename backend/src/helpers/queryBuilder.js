function buildQuery(query = {}) {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { name: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured === "true";
  }

  if (query.active !== undefined) {
    filter.active = query.active === "true";
  }

  return filter;
}

module.exports = buildQuery;