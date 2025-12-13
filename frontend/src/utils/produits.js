export function filtrerProduits(produits, filters) {
  return produits.filter(p => {

    const catMatch = filters.category
      ? p.category_id == filters.category
      : true;

    const priceMatch =
      p.price >= filters.minPrice &&
      p.price <= filters.maxPrice;

    return catMatch && priceMatch;
  });
}
