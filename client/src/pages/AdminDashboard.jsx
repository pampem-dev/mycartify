import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Users, Package, TrendingUp, DollarSign, Search, X, Save, Upload, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("adminTab") || "overview");

  useEffect(() => {
    localStorage.setItem("adminTab", activeTab);
  }, [activeTab]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - replace with your API calls
  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 240000 },
    { month: 'Feb', sales: 3000, revenue: 180000 },
    { month: 'Mar', sales: 5000, revenue: 300000 },
    { month: 'Apr', sales: 4500, revenue: 270000 },
    { month: 'May', sales: 6000, revenue: 360000 },
    { month: 'Jun', sales: 5500, revenue: 330000 },
  ];

  const categoryData = [
    { name: 'Smartphones', value: 45, color: '#007aff' },
    { name: 'Laptops', value: 25, color: '#34c759' },
    { name: 'Accessories', value: 20, color: '#ff9500' },
    { name: 'Tablets', value: 10, color: '#ff3b30' },
  ];

  const dashboardStats = [
    { title: 'Total Revenue', value: '₱1,680,000', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Total Orders', value: '28,000', change: '+8.2%', icon: TrendingUp, color: 'text-blue-600' },
    { title: 'Total Products', value: products.length.toString(), change: '+5.4%', icon: Package, color: 'text-purple-600' },
    { title: 'Active Users', value: '12,890', change: '+15.3%', icon: Users, color: 'text-orange-600' },
  ];

  // Get unique brands from products
  const uniqueBrands = [...new Set(products.map(product => product.brand).filter(Boolean))].sort();

  // Initialize sample data
  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []); 

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Create new product
  const createProduct = async (productData) => {
    try {
      console.log('Creating product:', productData);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, productData);
      setProducts([...products, res.data]);
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to create product:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      return { success: false, error: error.response?.data?.message || `Failed to create product (${error.response?.status})` };
    }
  };

  // Update product
  const updateProduct = async (productId, productData) => {
    try {
      console.log('Updating product:', productId, productData);
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, productData);
      setProducts(products.map(p => p._id === productId ? res.data : p));
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to update product:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      return { success: false, error: error.response?.data?.message || `Failed to update product (${error.response?.status})` };
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      console.log('Deleting product:', productId);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      setError(`Failed to delete product (${error.response?.status}): ${error.response?.data?.message || error.message}`);
      return { success: false, error: error.response?.data?.message || "Failed to delete product" };
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteType === 'product') {
      await deleteProduct(deleteItem._id);
    } else if (deleteType === 'user') {
      await deleteUser(deleteItem._id);
    }
    setShowDeleteModal(false);
    setDeleteItem(null);
    setDeleteType('');
  };

  // Show delete modal
  const showDeleteConfirmation = (item, type) => {
    setDeleteItem(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  const DeleteModal = () => {
    const itemName = deleteType === 'product' ? deleteItem?.title : deleteItem?.name;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold">Confirm Delete</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

const ProductModal = () => {
  const [formData, setFormData] = useState({
    title: editingProduct?.title || '',
    brand: editingProduct?.brand || '',
    price: editingProduct?.price || '',
    stock: editingProduct?.stock || '',
    category: editingProduct?.category || '',
    description: editingProduct?.description || '',
    image: editingProduct?.image || '',
    rating: editingProduct?.rating || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.image);
  const [uploadError, setUploadError] = useState('');

  // Image compression function
  const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');

    // Check file size (5MB limit before compression)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    try {
      // Compress the image
      const compressedFile = await compressImage(file);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        
        // Check compressed size (aim for under 1MB as base64)
        if (base64String.length > 1.5 * 1024 * 1024) { // ~1MB base64
          setUploadError('Image is too large even after compression. Please choose a smaller image.');
          return;
        }
        
        setImageFile(compressedFile);
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      
      reader.onerror = () => {
        setUploadError('Error reading image file');
      };
      
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      setUploadError('Error processing image');
      console.error('Image compression error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.brand || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null); // Clear any previous errors
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      rating: parseFloat(formData.rating) || 0
    };

    // Log the data size for debugging
    const dataSize = JSON.stringify(productData).length;
    console.log(`Sending data size: ${(dataSize / 1024).toFixed(2)} KB`);

    let result;
    try {
      if (editingProduct) {
        result = await updateProduct(editingProduct._id, productData);
      } else {
        result = await createProduct(productData);
      }

      if (result.success) {
        setShowProductModal(false);
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview('');
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('Network error. Please check your connection and try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={() => { setShowProductModal(false); setEditingProduct(null); }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Product Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Brand *</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
              <option value="other">Other (Add New)</option>
            </select>
            
            {formData.brand === 'other' && (
              <input
                type="text"
                placeholder="Enter new brand name *"
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Price *"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Category *</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Accessory">Accessory</option>
              <option value="Tablet">Tablet</option>
            </select>
            
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Rating (0-5)"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
            
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg h-24 resize-none"
            />
          </div>
          
          {/* Right Column - Image Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                        setImageFile(null);
                        setUploadError('');
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm text-gray-600">Upload product image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      <p className="text-xs text-gray-500">Images will be automatically compressed</p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </label>
              </div>
            </div>
            
            {/* Upload Error Display */}
            {uploadError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                {uploadError}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 pt-6 mt-6 border-t">
          <button
            type="button"
            onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || uploadError}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}
          </button>
        </div>
      </div>
    </div>
  );
};

const fetchUsers = async () => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.data.users) {
      setUsers(res.data.users);
    } else {
      setUsers(res.data);
    }
  } catch (error) {
    console.error("❌ Failed to fetch users:", error);
    if (error.response?.status === 401) {
      setError("Authentication required. Please login as admin.");
    } else if (error.response?.status === 403) {
      setError("Access denied. Admin privileges required.");
    } else {
      setError("Failed to fetch users. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

const deleteUser = async (userId) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(users.filter((user) => user._id !== userId));
    return { success: true };
  } catch (error) {
    console.error('❌ deleteUser error:', error);
    alert(error.response?.data?.message || 'Failed to delete user');
    return { success: false, error: error.response?.data?.message || "Failed to delete user" };
  }
};

const handleDeleteConfirmUnified = async () => {
  if (deleteType === 'product') {
    await deleteProduct(deleteItem._id);
  } else if (deleteType === 'user') {
    await deleteUser(deleteItem._id);
  }
  setShowDeleteModal(false);
  setDeleteItem(null);
  setDeleteType('');
};

const UserModal = () => {
  const [formData, setFormData] = useState({
    name: editingUser?.name || '',
    email: editingUser?.email || '',
    password: editingUser?.password || '',
    role: editingUser?.role || 'customer',
    status: editingUser?.status || 'active'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    setFormError("");
    
    if (!formData.name || !formData.email) {
      setFormError("Name and Email are required.");
      return;
    }

    if (!editingUser && formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingUser) {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/users/${editingUser._id}`,
          formData,
          config
        );
        const updatedUser = res.data.user || res.data;
        setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      } else {
        const payload = { ...formData };
        if (!payload.password) payload.password = 'default123';

        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/users`,
          payload,
          config
        );
        const newUser = res.data.user || res.data;
        setUsers([...users, newUser]);
      }
    } catch (err) {
      console.error('❌ handleSubmit error:', err);
      if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError("Something went wrong");
      }
      return;
    } finally {
      if (!formError) {
        setShowUserModal(false);
        setEditingUser(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{editingUser ? 'Edit User' : 'Add User'}</h3>
          <button onClick={() => { setShowUserModal(false); setEditingUser(null); }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="text-sm text-gray-500">Password must be at least 6 characters</p>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setShowUserModal(false); setEditingUser(null); }}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingUser ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};




  const filteredProducts = products.filter(product =>
    (product.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (product.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-8 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'users', label: 'Users', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-100`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#007aff" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Revenue by Month</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#34c759" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm text-gray-500">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="float-right text-red-700 hover:text-red-900"
                >
                  ×
                </button>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
              <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    autoComplete="off"
                    id="search-users"
                    inputMode="search"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg w-64"
                  />
                </div>
              </form>
                <button
                  onClick={fetchProducts}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                            No products found
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" style={{ display: product.image ? 'none' : 'flex' }}>
                                  No Image
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{product.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.brand}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₱{product.price?.toLocaleString() || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.stock || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{product.category || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1">{product.rating?.toFixed(1) || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => showDeleteConfirmation(product, 'product')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
              <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    autoComplete="off"
                    id="search-users"
                    inputMode="search"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg w-64"
                  />
                </div>
              </form>
              </div>
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.lastLogin ? user.lastLogin.split('T')[0] : 'Never'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingUser(user); setShowUserModal(true); }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => showDeleteConfirmation(user, 'user')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showProductModal && <ProductModal />}
      {showUserModal && <UserModal />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default AdminDashboard;