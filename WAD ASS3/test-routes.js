import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
let cookies = '';

// Helper function to make requests
async function makeRequest(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  // Extract cookies
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    cookies = setCookie.split(';')[0];
  }
  
  const data = await response.json();
  return { response, data };
}

// Test all routes
async function testAllRoutes() {
  console.log('🚀 Starting API Route Tests...\n');

  try {
    // 1. Test Registration
    console.log('1. Testing User Registration...');
    const registerResult = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Test Admin',
        email: 'admin@test.com',
        username: 'testadmin',
        password: 'password123',
        role: 'Admin'
      })
    });
    console.log('✅ Registration:', registerResult.data.message);

    // 2. Test Login
    console.log('\n2. Testing Login...');
    const loginResult = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testadmin',
        password: 'password123'
      })
    });
    console.log('✅ Login:', loginResult.data.message);

    // 3. Test Get Categories (Public)
    console.log('\n3. Testing Get Categories (Public)...');
    const categoriesResult = await makeRequest('/api/categories');
    console.log('✅ Categories loaded:', categoriesResult.data.length, 'categories');

    // 4. Test Add Category (Admin)
    console.log('\n4. Testing Add Category (Admin)...');
    const addCategoryResult = await makeRequest('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
      })
    });
    console.log('✅ Category added:', addCategoryResult.data.message);

    // 5. Test Get Products (Public)
    console.log('\n5. Testing Get Products (Public)...');
    const productsResult = await makeRequest('/api/products');
    console.log('✅ Products loaded:', productsResult.data.length, 'products');

    // 6. Test Add Product (Admin)
    console.log('\n6. Testing Add Product (Admin)...');
    const addProductResult = await makeRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Laptop',
        description: 'High-performance laptop for testing',
        price: 999.99,
        stock: 10,
        imageUrl: 'https://example.com/laptop.jpg',
        category: addCategoryResult.data.category._id,
        availability: true
      })
    });
    console.log('✅ Product added:', addProductResult.data.message);

    // 7. Test Get Users (Admin)
    console.log('\n7. Testing Get Users (Admin)...');
    const usersResult = await makeRequest('/api/users');
    console.log('✅ Users loaded:', usersResult.data.length, 'users');

    // 8. Test Product Filters
    console.log('\n8. Testing Product Filters...');
    const filterResult = await makeRequest('/api/products?name=Test&minPrice=500&maxPrice=1500');
    console.log('✅ Filtered products:', filterResult.data.length, 'products');

    // 9. Test Update Product
    console.log('\n9. Testing Update Product...');
    const updateProductResult = await makeRequest(`/api/products/${addProductResult.data.product._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Test Laptop',
        price: 899.99
      })
    });
    console.log('✅ Product updated:', updateProductResult.data.message);

    // 10. Test Update Category
    console.log('\n10. Testing Update Category...');
    const updateCategoryResult = await makeRequest(`/api/categories/${addCategoryResult.data.category._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Electronics',
        description: 'Updated electronic devices'
      })
    });
    console.log('✅ Category updated:', updateCategoryResult.data.message);

    // 11. Test Update Password
    console.log('\n11. Testing Update Password...');
    const updatePasswordResult = await makeRequest('/api/users/update-password', {
      method: 'PUT',
      body: JSON.stringify({
        oldPassword: 'password123',
        newPassword: 'newpassword123'
      })
    });
    console.log('✅ Password updated:', updatePasswordResult.data.message);

    // 12. Test Logout
    console.log('\n12. Testing Logout...');
    const logoutResult = await makeRequest('/api/auth/logout', {
      method: 'POST'
    });
    console.log('✅ Logout:', logoutResult.data.message);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAllRoutes(); 