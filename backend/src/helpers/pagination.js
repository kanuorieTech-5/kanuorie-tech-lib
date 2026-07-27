function paginate(page = 1, limit = 10) {
  page = Math.max(parseInt(page) || 1, 1);
  limit = Math.max(parseInt(limit) || 10, 1);

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

module.exports = paginate;