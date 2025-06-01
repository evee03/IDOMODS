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
// Smooth scrolling navigation
//-----------------------------------------------------------------------------------
function initSmoothScrolling() {
  // Handle desktop navigation links
  const desktopLinks = document.querySelectorAll('.navbar-link[href^="#"]');
  desktopLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
  });

  // Handle mobile navigation links
  const mobileLinks = document.querySelectorAll('.mobile-menu-items a[href^="#"]');
  mobileLinks.forEach(link => {
    link.addEventListener('click', handleSmoothScroll);
  });
}

function handleSmoothScroll(e) {
  e.preventDefault();
  
  const targetId = this.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  if (targetElement) {
    // Close mobile menu if it's open
    if (this.closest('.mobile-menu-items')) {
      closeMobileMenu();
    }
    
    // Calculate offset to account for fixed navbar
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetElement.offsetTop - navbarHeight - 20; // Extra 20px padding
    
    // Small delay for mobile menu close animation
    const delay = this.closest('.mobile-menu-items') ? 300 : 0;
    
    setTimeout(() => {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }, delay);
  }
}

// Initialize smooth scrolling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initSmoothScrolling();
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
                            <img src="./assets/FAV ICON=Default.svg" alt="Favorite" class="favorite-default" width="24" height="24" loading="lazy">
                            <img src="./assets/FAV ICON=Fill.svg" alt="Favorite" class="favorite-hover" width="24" height="24" loading="lazy">
                        </button>
                    </div> 

                    <div class="product-image">
                        <img src="${image}" alt="${name}" width="300" height="300" loading="lazy">
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

//-----------------------------------------------------------------------------------
// class manages the product display section of the webpage, it handles fetching products from an external API, 
// displaying them in a responsive grid layout, and implements infinite scrolling functionality to load more products as the user scrolls down.
// additionally, it manages a promotional banner placed between products, handles the product per page dropdown selector, 
// and provides popup functionality for viewing product details when clicked.
//-----------------------------------------------------------------------------------
class ProductsSection {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 14;
        this.allProducts = [];
        this.bannerShown = false;
        this.hasMoreProducts = true;
        
        this.init();
    }
      init() {
        this.bindEvents();
        this.updateDropdownOptions(); 
        this.loadProducts();
    }
    
    bindEvents() {
        const pageSelect = document.getElementById('pageSize');
        const customDropdown = document.getElementById('customDropdown');
        const dropdownSelected = document.getElementById('dropdownSelected');
        const dropdownOptions = document.getElementById('dropdownOptions');
        
        dropdownSelected.addEventListener('click', () => {
            this.updateDropdownOptions();
            const isOpen = dropdownOptions.classList.contains('show');
            
            if (isOpen) {
                dropdownOptions.classList.remove('show');
                customDropdown.classList.remove('active');
            } else {
                dropdownOptions.classList.add('show');
                customDropdown.classList.add('active');
            }
        });
        
        dropdownOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('custom-dropdown-option')) {
                const value = e.target.getAttribute('data-value');
                const text = e.target.textContent;
                
                dropdownSelected.textContent = text;
                
                pageSelect.value = value;
                
                dropdownOptions.querySelectorAll('.custom-dropdown-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                e.target.classList.add('selected');
                
                dropdownOptions.classList.remove('show');
                customDropdown.classList.remove('active');
                
                this.pageSize = parseInt(value);                
                this.resetAndLoad();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!customDropdown.contains(e.target)) {
                dropdownOptions.classList.remove('show');
                customDropdown.classList.remove('active');
            }
        });

        window.addEventListener('scroll', () => {
            if (this.shouldLoadMore()) {
                this.loadProducts();
            }
        });

        window.addEventListener('resize', () => {
            if (this.bannerShown) {
                this.repositionBanner();
            }
        });

        document.getElementById('popupClose').addEventListener('click', () => {
            this.closePopup();
        });

        document.getElementById('popup').addEventListener('click', (e) => {
            if (e.target.id === 'popup') {
                this.closePopup();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePopup();
            }
        });
    }    updateDropdownOptions() {
        const dropdownOptions = document.getElementById('dropdownOptions');
        const currentValue = this.pageSize;
        
        const allOptions = [14, 24, 36];
        
        const availableOptions = allOptions.filter(option => option !== currentValue);
        
        dropdownOptions.innerHTML = '';
        
        availableOptions.forEach((value, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'custom-dropdown-option';
            optionElement.setAttribute('data-value', value);
            optionElement.textContent = value;
            
            if (index === 0 && availableOptions.length > 1) {
                optionElement.classList.add('first-option');
            }
            
            if (index === 1) {
                optionElement.classList.add('second-option');
            }
            
            dropdownOptions.appendChild(optionElement);
        });
    }
    
    async loadProducts() {
        if (this.hasMoreProducts) {
            const response = await fetch(`https://brandstestowy.smallhost.pl/api/random?pageNumber=${this.currentPage}&pageSize=${this.pageSize}`);
            const result = await response.json();
            
            if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
                this.allProducts.push(...result.data);
                this.renderProducts(result.data);
                this.currentPage++;
                
                if (!this.bannerShown && this.allProducts.length >= 8) {
                    this.showBanner();
                }
                
                if (result.totalCount && this.allProducts.length >= result.totalCount) {
                    this.hasMoreProducts = false;
                }
            } else {
                this.hasMoreProducts = false;
            }
        }
    }renderProducts(products) {
        const grid = document.getElementById('productsGrid');
        
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
        
        this.ensureBannerVisibility();
    }
      ensureBannerVisibility() {
        if (!this.bannerShown) return;
        
        const banner = document.getElementById('banner');
        const grid = document.getElementById('productsGrid');
        
        if (!banner || !grid) return;
        
        if (!grid.contains(banner)) {
            this.repositionBanner();
        } else if (banner.style.display === 'none') {
            banner.style.display = 'flex';
        }
    }
    
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';        card.innerHTML = `
            <div class="product-id-overlay">ID: ${product.id}</div>
            <img src="${product.image}" alt="Product ${product.id}" class="product-image" width="341" height="341" loading="lazy">
        `;

        card.addEventListener('click', () => {
            this.openPopup(product);
        });

        return card;
    }openPopup(product) {
        document.getElementById('popupId').textContent = `ID: ${product.id}`;
        document.getElementById('popupImage').src = product.image;
        if (product.text) {
            document.getElementById('popupImage').alt = product.text;
        }
        document.getElementById('popup').style.display = 'flex';
    }
    
    closePopup() {
        document.getElementById('popup').style.display = 'none';
    }    showBanner() {
        if (this.bannerShown) return;
        
        const banner = document.getElementById('banner');
        const grid = document.getElementById('productsGrid');
        
        if (!banner || !grid) return;
        
        let columns = 4;
        if (window.innerWidth <= 970) {
            columns = 2;
        }
        
        const productCards = Array.from(grid.children).filter(card => !card.classList.contains('banner'));
        let insertAfterIndex;
        
        if (columns === 2) {
            insertAfterIndex = 3; 
        } else {
            insertAfterIndex = columns; 
        }
        
        if (productCards.length > insertAfterIndex && productCards[insertAfterIndex]) {
            productCards[insertAfterIndex].insertAdjacentElement('afterend', banner);
        } else {
            grid.appendChild(banner);
        }
        
        banner.style.display = 'flex';
        this.bannerShown = true;
    }    resetAndLoad() {
        this.currentPage = 1;
        this.allProducts = [];
        this.bannerShown = false;
        this.hasMoreProducts = true;
        
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.innerHTML = '';
        }
        
        const banner = document.getElementById('banner');
        const container = document.querySelector('.container');
        
        if (banner && container) {
            banner.style.display = 'none';
            if (!container.contains(banner)) {
                container.appendChild(banner);
            }
        }
        
        this.loadProducts();
    }    shouldLoadMore() {
        if (!this.hasMoreProducts) return false;
        
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        return scrollTop + windowHeight >= documentHeight - 1000;
    }

    repositionBanner() {
        if (!this.bannerShown) return;
        
        const banner = document.getElementById('banner');
        const grid = document.getElementById('productsGrid');
        
        if (!banner || !grid) return;
        
        if (banner.parentNode === grid) {
            banner.remove();
        }
        
        let columns = 4;
        if (window.innerWidth <= 970) {
            columns = 2;
        }
        
        const productCards = Array.from(grid.children).filter(card => !card.classList.contains('banner'));
        let insertAfterIndex;
        
        if (columns === 2) {
            insertAfterIndex = 3; 
        } else {
            insertAfterIndex = columns; 
        }
        
        if (productCards.length > insertAfterIndex && productCards[insertAfterIndex]) {
            productCards[insertAfterIndex].insertAdjacentElement('afterend', banner);
        } else {
            grid.appendChild(banner);
        }
        
        banner.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductSlider();
    new ProductsSection(); 
});

//----------------------------------------------------------------------------------