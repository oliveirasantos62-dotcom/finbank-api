function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
}

function paginationMeta(count, page, limit) {
  return { totalItems: count, totalPages: Math.ceil(count / limit), currentPage: page, itemsPerPage: limit };
}

module.exports = { getPagination, paginationMeta };
