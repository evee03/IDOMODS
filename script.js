//----------------------------------------------------------------------------------
// Toggle mobile menu visibility
//-----------------------------------------------------------------------------------
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  
  if (mobileMenu.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  
  mobileMenu.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', function(event) {
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenu.classList.contains('active') && 
      !mobileMenu.contains(event.target) && 
      !hamburger.contains(event.target)) {
    closeMobileMenu();
  }
});

window.addEventListener('resize', function() {
  if (window.innerWidth > 970) {
    closeMobileMenu();
  }
});
//-----------------------------------------------------------------------------------