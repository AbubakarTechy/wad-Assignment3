// Navbar Functionality
document.addEventListener('DOMContentLoaded', function() {
  const navbarMenu = document.getElementById('navbar-menu');
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarUser = document.getElementById('navbar-user');
  const navbarUserName = document.getElementById('navbar-user-name');
  const navbarUserRole = document.getElementById('navbar-user-role');
  const usersNav = document.getElementById('users-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile menu toggle
  if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
    });
  });

  // Update navbar based on user role
  window.updateNavbar = function() {
    if (window.currentUser) {
      navbarUser.style.display = 'flex';
      navbarUserName.textContent = window.currentUser.username;
      navbarUserRole.textContent = window.currentUser.role;
      
      // Show/hide admin nav items
      if (window.currentUser.role === 'Admin') {
        usersNav.style.display = 'block';
      } else {
        usersNav.style.display = 'none';
      }
    } else {
      navbarUser.style.display = 'none';
      usersNav.style.display = 'none';
    }
  };
}); 