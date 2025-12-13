import axios from "axios";


export default {
  async getCategories() {
    const r = await axios.get("http://localhost:3000/categories");
    return r.data;
  },

  async getProducts() {
    const r = await axios.get("http://localhost:3000/products");
    return r.data;
  },

  filtre(produits, filters) {
    return produits.filter(p => {
      const catMatch = filters.category ? p.category_id == filters.category : true;
      const priceMatch = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      return catMatch && priceMatch;
    });
  }
};
  