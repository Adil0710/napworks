import { create } from "zustand";
import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: string;
  category?: string;
}

export interface ProductFilters {
  searchQuery: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  minPrice: string;
  maxPrice: string;
  selectedCategories: string[];
  sortOrder: "newest" | "oldest" | "price-low-high" | "price-high-low";
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  filters: ProductFilters;

  pagination: Pagination;

  fetchProducts: () => Promise<void>;
  addProduct: (
    formData: FormData
  ) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (id: string) => Promise<boolean>;

  setSearchQuery: (query: string) => void;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setMinPrice: (price: string) => void;
  setMaxPrice: (price: string) => void;
  toggleCategory: (categoryId: string) => void;
  setSortOrder: (
    order: "newest" | "oldest" | "price-low-high" | "price-high-low"
  ) => void;
  resetFilters: () => void;

  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;

  getFilteredProducts: () => Product[];
  getCurrentPageProducts: () => Product[];
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: true,
  error: null,

  filters: {
    searchQuery: "",
    startDate: undefined,
    endDate: undefined,
    minPrice: "",
    maxPrice: "",
    selectedCategories: [],
    sortOrder: "newest",
  },

  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get("/api/products");
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch products");
      }

      set({
        products: data.products,
        pagination: {
          ...get().pagination,
          totalItems: data.products.length,
          totalPages: Math.ceil(
            data.products.length / get().pagination.itemsPerPage
          ),
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  addProduct: async (formData: FormData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post("/api/products/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      await get().fetchProducts();

      set({ isLoading: false });
      return { success: true, message: "Product added successfully" };
    } catch (error) {
      console.error("Error adding product:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
        isLoading: false,
      });
      return {
        success: false,
        message: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Failed to add product",
      };
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.delete(`/api/products/delete-product/${id}`);
      const data = response.data;

      set({
        products: get().products.filter((product) => product._id !== id),
        isLoading: false,
      });

      const totalItems = get().products.length;
      set({
        pagination: {
          ...get().pagination,
          totalItems,
          totalPages: Math.ceil(totalItems / get().pagination.itemsPerPage),
          currentPage:
            get().pagination.currentPage >
            Math.ceil(totalItems / get().pagination.itemsPerPage)
              ? Math.max(
                  1,
                  Math.ceil(totalItems / get().pagination.itemsPerPage)
                )
              : get().pagination.currentPage,
        },
      });

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
        isLoading: false,
      });
      return false;
    }
  },

  setSearchQuery: (query: string) =>
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setStartDate: (date: Date | undefined) =>
    set((state) => ({
      filters: { ...state.filters, startDate: date },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setEndDate: (date: Date | undefined) =>
    set((state) => ({
      filters: { ...state.filters, endDate: date },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setMinPrice: (price: string) =>
    set((state) => ({
      filters: { ...state.filters, minPrice: price },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setMaxPrice: (price: string) =>
    set((state) => ({
      filters: { ...state.filters, maxPrice: price },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  toggleCategory: (categoryId: string) =>
    set((state) => {
      const selectedCategories = state.filters.selectedCategories.includes(
        categoryId
      )
        ? state.filters.selectedCategories.filter((id) => id !== categoryId)
        : [...state.filters.selectedCategories, categoryId];

      return {
        filters: { ...state.filters, selectedCategories },
        pagination: { ...state.pagination, currentPage: 1 },
      };
    }),

  setSortOrder: (
    order: "newest" | "oldest" | "price-low-high" | "price-high-low"
  ) =>
    set((state) => ({
      filters: { ...state.filters, sortOrder: order },
    })),

  resetFilters: () =>
    set((state) => ({
      filters: {
        searchQuery: "",
        startDate: undefined,
        endDate: undefined,
        minPrice: "",
        maxPrice: "",
        selectedCategories: [],
        sortOrder: "newest",
      },
      pagination: { ...state.pagination, currentPage: 1 },
    })),

  setCurrentPage: (page: number) =>
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    })),

  setItemsPerPage: (items: number) =>
    set((state) => {
      const totalPages = Math.ceil(state.pagination.totalItems / items);
      return {
        pagination: {
          ...state.pagination,
          itemsPerPage: items,
          totalPages,
          currentPage: Math.min(state.pagination.currentPage, totalPages || 1),
        },
      };
    }),

  getFilteredProducts: () => {
    const { products, filters } = get();

    return products
      .filter((product) => {
        if (
          filters.searchQuery &&
          !product.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
        ) {
          return false;
        }

        if (
          filters.selectedCategories.length > 0 &&
          product.category &&
          !filters.selectedCategories.includes(product.category)
        ) {
          return false;
        }

        if (filters.startDate) {
          const productDate = new Date(product.createdAt);
          const startOfDay = new Date(filters.startDate);
          startOfDay.setHours(0, 0, 0, 0);

          if (productDate < startOfDay) {
            return false;
          }
        }

        if (filters.endDate) {
          const productDate = new Date(product.createdAt);
          const endOfDay = new Date(filters.endDate);
          endOfDay.setHours(23, 59, 59, 999);

          if (productDate > endOfDay) {
            return false;
          }
        }

        if (filters.minPrice && !isNaN(Number.parseFloat(filters.minPrice))) {
          if (product.price < Number.parseFloat(filters.minPrice)) {
            return false;
          }
        }

        if (filters.maxPrice && !isNaN(Number.parseFloat(filters.maxPrice))) {
          if (product.price > Number.parseFloat(filters.maxPrice)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortOrder === "price-low-high") {
          return a.price - b.price;
        } else if (filters.sortOrder === "price-high-low") {
          return b.price - a.price;
        } else if (filters.sortOrder === "oldest") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      });
  },

  getCurrentPageProducts: () => {
    const { pagination } = get();
    const filteredProducts = get().getFilteredProducts();

    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

    if (
      totalItems !== pagination.totalItems ||
      totalPages !== pagination.totalPages
    ) {
      set({
        pagination: {
          ...pagination,
          totalItems,
          totalPages,
          currentPage: Math.min(pagination.currentPage, totalPages || 1),
        },
      });
    }

    const indexOfFirstItem =
      (pagination.currentPage - 1) * pagination.itemsPerPage;
    const indexOfLastItem = indexOfFirstItem + pagination.itemsPerPage;

    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  },
}));

export default useProductStore;
