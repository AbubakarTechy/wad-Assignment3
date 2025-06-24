// Helper: fetch with credentials
const fetchWithCreds = (url, options = {}) => {
  return fetch(url, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
};

// DOM Elements
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const adminSection = document.getElementById('admin-section');
const usersTable = document.getElementById('users-table');
const addCategoryForm = document.getElementById('add-category-form');
const categoriesTable = document.getElementById('categories-table');
const addProductForm = document.getElementById('add-product-form');
const productsTable = document.getElementById('products-table');
const productCategorySelect = document.getElementById('product-category');
const filterCategorySelect = document.getElementById('filter-category');
const filterBtn = document.getElementById('filter-btn');
const roleBadge = document.getElementById('role-badge');
const categoryRoleInfo = document.getElementById('category-role-info');
const productRoleInfo = document.getElementById('product-role-info');
const categoryBanner = document.getElementById('category-banner');
const productBanner = document.getElementById('product-banner');

// Navbar Elements
const navbarMenu = document.getElementById('navbar-menu');
const navbarToggle = document.getElementById('navbar-toggle');
const navbarUser = document.getElementById('navbar-user');
const navbarUserName = document.getElementById('navbar-user-name');
const navbarUserRole = document.getElementById('navbar-user-role');
const usersNav = document.getElementById('users-nav');
const navLinks = document.querySelectorAll('.nav-link');

let currentUser = null;
let categories = [];

// Make currentUser global for navbar access
window.currentUser = currentUser;

// Auth
const showAuth = () => {
  authSection.style.display = '';
  mainSection.style.display = 'none';
};
const showMain = () => {
  authSection.style.display = 'none';
  mainSection.style.display = '';
};

// Register
const registerForm = document.getElementById('register-form');
registerForm.onsubmit = async (e) => {
  e.preventDefault();
  try {
    const body = {
      fullName: document.getElementById('register-fullname').value,
      email: document.getElementById('register-email').value,
      username: document.getElementById('register-username').value,
      password: document.getElementById('register-password').value,
      role: document.getElementById('register-role').value
    };
    const res = await fetchWithCreds('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! Please login.');
      registerForm.reset();
    } else {
      alert('Registration failed: ' + data.message);
    }
  } catch (error) {
    alert('Registration error: ' + error.message);
  }
};

// Login
const loginForm = document.getElementById('login-form');
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  try {
    const body = {
      username: document.getElementById('login-username').value,
      password: document.getElementById('login-password').value
    };
    const res = await fetchWithCreds('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      currentUser = data.user;
      window.currentUser = currentUser; // Set global for navbar
      await loadApp();
      if (window.updateNavbar) window.updateNavbar(); // Update navbar
      alert('Login successful!');
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    alert('Login error: ' + error.message);
  }
};

// Logout
logoutBtn.onclick = async () => {
  try {
    await fetchWithCreds('/api/auth/logout', { method: 'POST' });
    currentUser = null;
    window.currentUser = null; // Clear global for navbar
    showAuth();
    if (window.updateNavbar) window.updateNavbar(); // Update navbar
    alert('Logged out successfully!');
  } catch (error) {
    alert('Logout error: ' + error.message);
  }
};

// Password Update
const updatePasswordForm = document.getElementById('update-password-form');
updatePasswordForm.onsubmit = async (e) => {
  e.preventDefault();
  try {
    const body = {
      oldPassword: document.getElementById('old-password').value,
      newPassword: document.getElementById('new-password').value
    };
    const res = await fetchWithCreds('/api/users/update-password', { method: 'PUT', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      alert('Password updated successfully!');
      updatePasswordForm.reset();
    } else {
      alert('Password update failed: ' + data.message);
    }
  } catch (error) {
    alert('Password update error: ' + error.message);
  }
};

// Load App (after login)
async function loadApp() {
  showMain();
  userInfo.textContent = `Logged in as: ${currentUser.username}`;
  
  // Update navbar
  updateNavbar();
  
  // Role badge
  if (currentUser.role === 'Admin') {
    roleBadge.textContent = 'Admin';
    roleBadge.className = 'role-badge role-admin';
  } else if (currentUser.role === 'Seller') {
    roleBadge.textContent = 'Seller';
    roleBadge.className = 'role-badge role-seller';
  } else {
    roleBadge.textContent = 'Customer';
    roleBadge.className = 'role-badge role-customer';
  }

  // Section info banners and role info
  if (currentUser.role === 'Admin') {
    categoryRoleInfo.textContent = '(Admin: Full CRUD)';
    productRoleInfo.textContent = '(Admin: Full CRUD)';
    categoryBanner.style.display = '';
    categoryBanner.textContent = 'Admins can add, update, and delete categories.';
    productBanner.style.display = '';
    productBanner.textContent = 'Admins can add, update, and delete any product.';
  } else if (currentUser.role === 'Seller') {
    categoryRoleInfo.textContent = '(Seller: View Only)';
    productRoleInfo.textContent = '(Seller: Full CRUD)';
    categoryBanner.style.display = '';
    categoryBanner.textContent = 'Sellers can only view categories.';
    productBanner.style.display = '';
    productBanner.textContent = 'Sellers can add, update, and delete their own products.';
  } else {
    categoryRoleInfo.textContent = '(Customer: View Only)';
    productRoleInfo.textContent = '(Customer: View Only)';
    categoryBanner.style.display = '';
    categoryBanner.textContent = 'Customers can only view categories.';
    productBanner.style.display = '';
    productBanner.textContent = 'Customers can only view products.';
  }

  // Role-based UI
  adminSection.style.display = currentUser.role === 'Admin' ? '' : 'none';
  addCategoryForm.style.display = currentUser.role === 'Admin' ? '' : 'none';
  addProductForm.style.display = (currentUser.role === 'Admin' || currentUser.role === 'Seller') ? '' : 'none';
  
  // Load data
  try {
    // Users (admin only)
    if (currentUser.role === 'Admin') {
      await loadUsers();
    }
    // Categories (public)
    await loadCategories();
    // Products (public)
    await loadProducts();
  } catch (error) {
    console.error('Error loading app data:', error);
    alert('Error loading data: ' + error.message);
  }
}

// Users (Admin)
async function loadUsers() {
  try {
    const res = await fetchWithCreds('/api/users');
    if (!res.ok) throw new Error('Failed to load users');
    const users = await res.json();
    usersTable.innerHTML = '<tr><th>Full Name</th><th>Email</th><th>Username</th><th>Role</th><th>Delete</th></tr>' +
      users.map(u => `<tr><td>${u.fullName}</td><td>${u.email}</td><td>${u.username}</td><td>${u.role}</td><td><button onclick="deleteUser('${u._id}')">Delete</button></td></tr>`).join('');
  } catch (error) {
    console.error('Error loading users:', error);
    usersTable.innerHTML = '<tr><td colspan="5">Error loading users</td></tr>';
  }
}

async function deleteUser(id) {
  if (!confirm('Delete user?')) return;
  try {
    const res = await fetchWithCreds(`/api/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      alert('User deleted successfully!');
      await loadUsers();
    } else {
      alert('Delete failed: ' + data.message);
    }
  } catch (error) {
    alert('Delete error: ' + error.message);
  }
}

// Categories
addCategoryForm.onsubmit = async (e) => {
  e.preventDefault();
  try {
    const body = {
      name: document.getElementById('category-name').value,
      description: document.getElementById('category-description').value
    };
    const res = await fetchWithCreds('/api/categories', { method: 'POST', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      alert('Category added successfully!');
      addCategoryForm.reset();
      await loadCategories();
    } else {
      alert('Add category failed: ' + data.message);
    }
  } catch (error) {
    alert('Add category error: ' + error.message);
  }
};

async function loadCategories() {
  try {
    const res = await fetchWithCreds('/api/categories');
    if (!res.ok) throw new Error('Failed to load categories');
    categories = await res.json();
    
    // Table
    categoriesTable.innerHTML = '<tr><th>Name</th><th>Description</th>' + (currentUser && currentUser.role === 'Admin' ? '<th>Update</th><th>Delete</th>' : '') + '</tr>' +
      categories.map(c => `<tr><td>${c.name}</td><td>${c.description || ''}</td>` +
        (currentUser && currentUser.role === 'Admin' ? `<td><button onclick="showUpdateCategory('${c._id}')">Update</button></td><td><button onclick="deleteCategory('${c._id}')">Delete</button></td>` : '') + '</tr>').join('');
    
    // Selects
    productCategorySelect.innerHTML = categories.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
    filterCategorySelect.innerHTML = '<option value="">All</option>' + categories.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
  } catch (error) {
    console.error('Error loading categories:', error);
    categoriesTable.innerHTML = '<tr><td colspan="4">Error loading categories</td></tr>';
  }
}

async function deleteCategory(id) {
  if (!confirm('Delete category?')) return;
  try {
    const res = await fetchWithCreds(`/api/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      alert('Category deleted successfully!');
      await loadCategories();
      await loadProducts();
    } else {
      alert('Delete failed: ' + data.message);
    }
  } catch (error) {
    alert('Delete error: ' + error.message);
  }
}

function showUpdateCategory(id) {
  const cat = categories.find(c => c._id === id);
  if (!cat) return;
  
  const name = prompt('Update category name:', cat.name);
  const description = prompt('Update description:', cat.description || '');
  if (name) {
    updateCategory(id, name, description);
  }
}

async function updateCategory(id, name, description) {
  try {
    const res = await fetchWithCreds(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name, description }) });
    const data = await res.json();
    if (res.ok) {
      alert('Category updated successfully!');
      await loadCategories();
    } else {
      alert('Update failed: ' + data.message);
    }
  } catch (error) {
    alert('Update error: ' + error.message);
  }
}

// Products
addProductForm.onsubmit = async (e) => {
  e.preventDefault();
  try {
    const body = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: parseFloat(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value),
      imageUrl: document.getElementById('product-image').value,
      category: document.getElementById('product-category').value,
      availability: document.getElementById('product-availability').value === 'true'
    };
    const res = await fetchWithCreds('/api/products', { method: 'POST', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      alert('Product added successfully!');
      addProductForm.reset();
      await loadProducts();
    } else {
      alert('Add product failed: ' + data.message);
    }
  } catch (error) {
    alert('Add product error: ' + error.message);
  }
};

async function loadProducts() {
  try {
    // Filters
    const name = document.getElementById('filter-name').value;
    const category = document.getElementById('filter-category').value;
    const minPrice = document.getElementById('filter-min-price').value;
    const maxPrice = document.getElementById('filter-max-price').value;
    const availability = document.getElementById('filter-availability').value;
    
    let url = '/api/products?';
    if (name) url += `name=${encodeURIComponent(name)}&`;
    if (category) url += `category=${category}&`;
    if (minPrice) url += `minPrice=${minPrice}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;
    if (availability) url += `availability=${availability}&`;
    
    const res = await fetchWithCreds(url);
    if (!res.ok) throw new Error('Failed to load products');
    const products = await res.json();
    
    // Table
    productsTable.innerHTML = '<tr><th>Name</th><th>Description</th><th>Price</th><th>Stock</th><th>Image</th><th>Availability</th><th>Category</th>' + ((currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Seller')) ? '<th>Update</th><th>Delete</th>' : '') + '</tr>' +
      products.map(p => `<tr><td>${p.name}</td><td>${p.description || ''}</td><td>$${p.price}</td><td>${p.stock}</td><td>${p.imageUrl ? `<img src="${p.imageUrl}" alt="img" width="40">` : ''}</td><td>${p.availability ? 'Yes' : 'No'}</td><td>${p.category ? p.category.name : ''}</td>` +
        ((currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Seller')) ? `<td><button onclick="showUpdateProduct('${p._id}')">Update</button></td><td><button onclick="deleteProduct('${p._id}')">Delete</button></td>` : '') + '</tr>').join('');
  } catch (error) {
    console.error('Error loading products:', error);
    productsTable.innerHTML = '<tr><td colspan="9">Error loading products</td></tr>';
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete product?')) return;
  try {
    const res = await fetchWithCreds(`/api/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      alert('Product deleted successfully!');
      await loadProducts();
    } else {
      alert('Delete failed: ' + data.message);
    }
  } catch (error) {
    alert('Delete error: ' + error.message);
  }
}

function showUpdateProduct(id) {
  // Get current products to find the one to update
  fetchWithCreds('/api/products').then(res => res.json()).then(products => {
    const prod = products.find(p => p._id === id);
    if (!prod) return;
    
    const name = prompt('Update product name:', prod.name);
    const description = prompt('Update description:', prod.description || '');
    const price = prompt('Update price:', prod.price);
    const stock = prompt('Update stock:', prod.stock);
    const imageUrl = prompt('Update image URL:', prod.imageUrl || '');
    const availability = confirm('Is product available? (OK = Yes, Cancel = No)');
    const category = prompt('Update category ID:', prod.category && prod.category._id ? prod.category._id : '');
    
    if (name && price && stock && category) {
      updateProduct(id, { name, description, price: parseFloat(price), stock: parseInt(stock), imageUrl, availability, category });
    }
  }).catch(error => {
    alert('Error loading product details: ' + error.message);
  });
}

async function updateProduct(id, body) {
  try {
    const res = await fetchWithCreds(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      alert('Product updated successfully!');
      await loadProducts();
    } else {
      alert('Update failed: ' + data.message);
    }
  } catch (error) {
    alert('Update error: ' + error.message);
  }
}

// Product filters
filterBtn.onclick = async (e) => {
  e.preventDefault();
  await loadProducts();
};

// Navbar Functionality
navbarToggle.addEventListener('click', () => {
  navbarMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navbarMenu.classList.remove('active');
  });
});

// Update navbar based on user role
function updateNavbar() {
  if (currentUser) {
    navbarUser.style.display = 'flex';
    navbarUserName.textContent = currentUser.username;
    navbarUserRole.textContent = currentUser.role;
    
    // Show/hide admin nav items
    if (currentUser.role === 'Admin') {
      usersNav.style.display = 'block';
    } else {
      usersNav.style.display = 'none';
    }
  } else {
    navbarUser.style.display = 'none';
    usersNav.style.display = 'none';
  }
}

// Initialize app - show auth section by default
showAuth(); 