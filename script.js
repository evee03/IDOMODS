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
  
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  mobileMenu.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  document.body.style.paddingRight = scrollbarWidth + 'px';
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  
  document.body.style.paddingRight = '';
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
// class productSlider - manages the featured products carousel
// handles product display, Swiper configuration, and custom pagination
//-----------------------------------------------------------------------------------
class ProductSlider {

    constructor() {
      this.mockProducts = [
          {
              id: 1,
              name: 'Orange helmet for alpine TOUNDRA',
              price: 300.00,
              image: './assets/product_photo_01.png',
              badge: 'LIMITED EDITION',
              badgeType: 'limited'
          },
          {
              id: 2,
              name: 'Grey alpine climbing jacket',
              price: 300.00,
              image: './assets/product_photo_02.png'
          },
          {
              id: 3,
              name: 'Grey alpine climbing jacket',
              price: 300.00,
              image: './assets/product_photo_03.png',
              badge: 'BESTSELLER',
              badgeType: 'bestseller'
          },
          {
              id: 4,
              name: 'Professional Climbing Harness',
              price: 300.00,
              image: './assets/product_photo_01.png',
              badge: 'BESTSELLER',
              badgeType: 'bestseller'
          },
          {
              id: 5,
              name: 'Mountain Safety Equipment',
              price: 300.00,
              image: './assets/product_photo_02.png',
              badge: 'LIMITED EDITION',
              badgeType: 'limited'
          },
          {
              id: 6,
              name: 'Alpine Pro Jacket Premium',
              price: 300.00,
              image: './assets/product_photo_03.png'
          }
      ];
      this.init();
    }

    init() {
      this.renderProducts();
      this.initSwiper();
      this.initPagination();
    }

    renderProducts() {
      const container = document.getElementById('products-container');
      if (!container) return;

      const productsHTML = this.mockProducts.map(product => this.createProductCard(product)).join('');
      container.innerHTML = productsHTML;
    }

    createProductCard(product) {
      const { id, name, price, image, badge, badgeType } = product;
      const formattedPrice = `€${price.toFixed(2)} EUR`;
      const badgeClass = badgeType === 'limited' ? 'badge-limited' : 'badge-bestseller';
      
      return `
          <div class="swiper-slide">
              <div class="product-card">
                  <div class="product-header">
                      ${badge ? `<div class="product-badge ${badgeClass}">${badge}</div>` : '<div></div>'}
                      <button class="favorite-btn">
                          <img src="./assets/FAV ICON=Default.svg" alt="Favorite" class="favorite-default">
                          <img src="./assets/FAV ICON=Fill.svg" alt="Favorite" class="favorite-hover">
                      </button>
                  </div>
                  <div class="product-image">
                      <img src="${image}" alt="${name}">
                  </div>
                  <div class="product-info">
                      <h3 class="product-title">${name}</h3>
                      <div class="product-price">${formattedPrice}</div>
                  </div>
              </div>
          </div>
      `;
    }    
    
  initSwiper() {
    this.swiper = new Swiper('.products-swiper', {
      slidesPerView: 1,
      spaceBetween: 8,
      allowTouchMove: true,
      grabCursor: true,
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
      on: {
          slideChange: () => this.updatePagination()
      },
      breakpoints: {
          240: { slidesPerView: 1, spaceBetween: 8 },
          320: { slidesPerView: 1, spaceBetween: 12 },
          400: { slidesPerView: 1.2, spaceBetween: 16 },
          481: { slidesPerView: 1.5, spaceBetween: 20 },
          768: { slidesPerView: 2.5, spaceBetween: 24 },
          1024: { slidesPerView: 3.5, spaceBetween: 24 },
          1200: { slidesPerView: 4, spaceBetween: 24 }
      }
    });
  }

  initPagination() {
    const pagination = document.querySelector('.custom-pagination');
    const handle = document.querySelector('.custom-pagination-handle');
    
    if (!pagination || !handle) return;

    pagination.addEventListener('click', (e) => {
        if (e.target === handle) return;
        
        const rect = pagination.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progress = clickX / pagination.offsetWidth;
        const slideIndex = Math.round(progress * (this.swiper.slides.length - 1));
        
        this.swiper.slideTo(slideIndex);
    });
  }    

  updatePagination() {
    const handle = document.querySelector('.custom-pagination-handle');
    const pagination = document.querySelector('.custom-pagination');
    
    if (!handle || !pagination || !this.swiper) return;
    
    const isAtEnd = this.swiper.isEnd;
    const progress = isAtEnd ? 1 : this.swiper.progress;
    
    const maxPosition = pagination.offsetWidth - handle.offsetWidth;
    handle.style.left = (progress * maxPosition) + 'px';
  }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductSlider();
});

//----------------------------------------------------------------------------------