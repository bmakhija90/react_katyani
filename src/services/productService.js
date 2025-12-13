import api from './api';

export const productService = {
  getAllProducts: async (category = null, page = 1, limit = 20) => {
    try {
      const params = { page, limit };
      if (category) params.category = category;
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images' && productData[key]) {
          productData[key].forEach((file, index) => {
            formData.append('images', file);
          });
        } else if (key === 'sizes' && Array.isArray(productData[key])) {
          formData.append('sizes', productData[key].join(','));
        } else if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProduct: async (id, productData) => {
  try {
    // Check if we have image files to upload
    const hasImageFiles = productData.images && 
                         Array.isArray(productData.images) && 
                         productData.images.some(img => img instanceof File || img instanceof Blob);
    
    if (hasImageFiles) {
      // Use FormData for updates with new images
      const formData = new FormData();
      
      // Add images
      productData.images.forEach((file, index) => {
        if (file instanceof File || file instanceof Blob) {
          formData.append('images', file);
        }
      });
      
      // Add other product data
      Object.keys(productData).forEach(key => {
        if (key === 'sizes' && Array.isArray(productData[key])) {
          formData.append('sizes', productData[key].join(','));
        } else if (key === 'images') {
          // Already handled above
        } else if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      // Add flag to append images (not replace)
      formData.append('replace_images', 'false');
      
      const response = await api.put(`/products/${id}`, formData,{
         headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      // No new images, send as JSON
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    }
  } catch (error) {
    console.error('Update product error:', error);
    throw error.response?.data || error.message;
  }
},

  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Add these methods to productService
deleteProduct: async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
},

deleteCategory: async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

  
};