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
      const { filters, pagination } = get();

      const response = await axios.post("/api/products", {
        ...filters,
        page: pagination.currentPage,
        itemsPerPage: pagination.itemsPerPage,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch products");
      }

      set({
        products: data.products,
        pagination: data.pagination,
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

      await get().fetchProducts();

      set({ isLoading: false });
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
    set((state) => ({
      pagination: {
        ...state.pagination,
        itemsPerPage: items,
        currentPage: 1,
      },
    })),
}));

export default useProductStore;
