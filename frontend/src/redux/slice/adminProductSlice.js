import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
  
//Fetch admin products
export const fetchAdminProduct = createAsyncThunk(
  "admin/fetchAdminProducts",
  async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
  }
);

//async function to create new product
export const createProduct = createAsyncThunk(
  "admin/createProducts",
  async (productData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`, productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

//Function to update asn existing products
export const updateProduct = createAsyncThunk(
  "admin/updateProducts",
  async ({id, productData}) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

//function to delete a product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return id;
  }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchAdminProduct.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetchAdminProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
          })
          .addCase(fetchAdminProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
          .addCase(createProduct.fulfilled, (state, action) => {
            state.products.push(action.payload);
          })
          .addCase(updateProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex(
              (product) => product._id === action.payload._id
            );
            if (index !== -1) {
              state.products[index] = action.payload;
            }
          })
          .addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.products.filter(
              (product) => product._id !== action.payload
            );
          });
    },            
});

export default adminProductSlice.reducer;