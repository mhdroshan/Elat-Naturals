/**
 * Global application state
 */
window.productsData = window.productsData || null;

document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * Main application entry point
 */
async function initializeApp() {
    try {
        // 1. Try to fetch products data for "Automatic Sync" (requires local server)
        const response = await fetch('./products.json');
        if (response.ok) {
            window.productsData = await response.json();
            console.log('Successfully fetched live data from products.json');
        }
    } catch (error) {
        console.warn('Fetch blocked by CORS (common on file:// protocol). Falling back to static data.');
    } finally {
        // 2. Regardless of fetch success, check if we have data (either from fetch or products.js fallback)
        if (!window.productsData) {
            const errorMsg = 'No product data found. Please run a local server (e.g. Live Server) for automatic JSON updates, or ensure js/products.js is loaded.';
            console.error(errorMsg);
            // Optionally: show a non-intrusive UI warning for the user
        }

        // 3. Initialize UI components
        initHeader();
        initShopFilters();
        initAccordions();
        initPDPGallery();
        initPDPQuantity();
        initModalQuantity();
        initMobileMenu();

        if (window.setModalRenderer) {
            window.setModalRenderer(openProductModal);
        }

        // 4. Page-specific content rendering
        initPageContent();

        // Close Modal Events
        document.querySelector('.modal-close')?.addEventListener('click', closeProductModal);
        document.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) closeProductModal();
        });
    }
}

/**
 * Content initialization based on current page
 */
function initPageContent() {
    if (!window.productsData) return;

    // Initialize Homepage if present
    const homeBestsellers = document.getElementById('ref-bestsellers-grid');
    if (homeBestsellers) {
        const bestsellers = window.productsData.products.slice(0, 5);
        if (window.renderReferenceProductGrid) {
            window.renderReferenceProductGrid(homeBestsellers, bestsellers, window.productsData.currency);
        }
    }

    // Initialize Homepage Collection if present
    const collectionGrid = document.getElementById('homepage-collection');
    if (collectionGrid) {
        const homepageProducts = window.productsData.products.slice(0, 4);
        if (window.renderProductGrid) {
            window.renderProductGrid(collectionGrid, homepageProducts);
        }
    }

    // Initialize Shop page if present
    const shopGrid = document.getElementById('shop-grid');
    if (shopGrid && window.renderProductGrid) {
        window.renderProductGrid(shopGrid, window.productsData.products);
    }
}

/**
 * Initialize sticky header background
 */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

function initShopFilters() {
    const filterInputs = document.querySelectorAll('.shop-sidebar input[name="type"]');
    const sortSelect = document.getElementById('sort-by');
    const shopGrid = document.getElementById('shop-grid');

    if (!shopGrid) return;

    const applyShopLogic = () => {
        const activeType = document.querySelector('input[name="type"]:checked')?.value || 'all';
        const activeSort = sortSelect?.value || 'featured';
        
        let processedProducts = window.productsData ? [...window.productsData.products] : [];

        // 1. Filter
        if (activeType !== 'all') {
            processedProducts = processedProducts.filter(p => p.type === activeType);
        }

        // 2. Sort
        if (activeSort === 'price-low') {
            processedProducts.sort((a, b) => a.price - b.price);
        } else if (activeSort === 'price-high') {
            processedProducts.sort((a, b) => b.price - a.price);
        }
        // 'featured' keeps original array order

        if (window.renderProductGrid) {
            window.renderProductGrid(shopGrid, processedProducts);
        }
    };

    // Listen for filter changes
    filterInputs.forEach(input => {
        input.addEventListener('change', applyShopLogic);
    });

    // Listen for sort changes
    sortSelect?.addEventListener('change', applyShopLogic);
}

/**
 * Initialize Accordions (Modal usage, etc)
 */
function initAccordions() {
    // We use event delegation for dynamic accordions
    document.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (!header) return;

        header.classList.toggle('active');
        const content = header.nextElementSibling;

        if (header.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = null;
        }
    });
}

/**
 * Opens product modal with details
 * @param {Object} product 
 */
function openProductModal(product) {
    const overlay = document.querySelector('.modal-overlay');
    if (!overlay) return;

    // Determine images array
    let mainImgSrc = product.image || product.product_image || './assets/images/bottle_placeholder.png';
    let images = [mainImgSrc];
    
    // Add alternate images if they exist
    if (product.alternate_images && Array.isArray(product.alternate_images) && product.alternate_images.length > 0) {
        images = [...images, ...product.alternate_images];
    } else if (product.images && Array.isArray(product.images)) {
        // Fallback for any existing images array
        images = product.images;
    }

    // Populate details
    const mainImgEl = overlay.querySelector('#modal-main-img') || overlay.querySelector('.modal-gallery img');
    if (mainImgEl) {
        mainImgEl.src = images[0];
        mainImgEl.alt = product.name || product.product_name;
    }

    const thumbContainer = overlay.querySelector('#modal-thumbnails');
    if (thumbContainer) {
        thumbContainer.innerHTML = '';
        images.forEach((imgSrc, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'modal-thumb' + (idx === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${idx+1}">`;
            thumb.addEventListener('click', () => {
                if (mainImgEl) {
                    mainImgEl.style.opacity = '0.5';
                    setTimeout(() => {
                        mainImgEl.src = imgSrc;
                        mainImgEl.style.opacity = '1';
                    }, 150);
                }
                thumbContainer.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            thumbContainer.appendChild(thumb);
        });
    }

    overlay.querySelector('.modal-category').textContent = product.category || product.size;
    overlay.querySelector('.modal-title').textContent = product.name || product.product_name;
    overlay.querySelector('.modal-price').textContent = `₹${product.price}`;
    overlay.querySelector('.modal-description').textContent = product.short_desc || product.short_description;

    // Reset Quantity
    const qtyInput = overlay.querySelector('.modal-qty-input');
    if (qtyInput) qtyInput.value = 1;

    // Fill accordions
    const accDesc = overlay.querySelector('#modal-acc-desc');
    const accIng = overlay.querySelector('#modal-acc-ingredients');
    const accHow = overlay.querySelector('#modal-acc-how');

    if (accDesc) accDesc.textContent = product.short_desc || product.short_description;
    if (accIng) accIng.textContent = Array.isArray(product.key_ingredients) ? product.key_ingredients.join(', ') : (product.ingredients || '');
    if (accHow) accHow.textContent = product.how_to_use || 'Apply as directed.';

    // Reset accordions state
    const headers = overlay.querySelectorAll('.accordion-header');
    headers.forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.style.maxHeight = null;
    });

    // Setup Buy trigger
    const buyBtn = overlay.querySelector('.btn-buy-whatsapp');
    if (buyBtn) {
        // Remove old listeners by cloning
        const newBuyBtn = buyBtn.cloneNode(true);
        buyBtn.parentNode.replaceChild(newBuyBtn, buyBtn);

        newBuyBtn.addEventListener('click', (e) => {
            if (window.handleBuyNowClick) {
                const qtyInput = overlay.querySelector('.modal-qty-input');
                const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
                window.handleBuyNowClick(e, { ...product, selectedQuantity: qty });
            }
        });
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
}

/**
 * Initialize PDP Gallery (Thumbnails)
 */
function initPDPGallery() {
    const mainImg = document.getElementById('main-product-image');
    const thumbs = document.querySelectorAll('.pdp-thumb');

    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class
            thumbs.forEach(t => t.classList.remove('active'));
            // Add active class
            thumb.classList.add('active');

            // Swap image
            const img = thumb.querySelector('img');
            if (img) {
                mainImg.src = img.src;
            }
        });
    });
}

/**
 * Initialize PDP Quantity Selector
 */
function initPDPQuantity() {
    const qtyInput = document.querySelector('.pdp-qty-input');
    const decrementBtn = document.querySelector('.pdp-qty-btn[aria-label="Decrease quantity"]');
    const incrementBtn = document.querySelector('.pdp-qty-btn[aria-label="Increase quantity"]');

    if (!qtyInput || !decrementBtn || !incrementBtn) return;

    decrementBtn.addEventListener('click', () => {
        let currentVal = parseInt(qtyInput.value) || 1;
        if (currentVal > 1) {
            qtyInput.value = currentVal - 1;
        }
    });

    incrementBtn.addEventListener('click', () => {
        let currentVal = parseInt(qtyInput.value) || 1;
        qtyInput.value = currentVal + 1;
    });

    // Variant Selection Logic
    const variantBtns = document.querySelectorAll('.pdp-variant-btn');
    variantBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            variantBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/**
 * Initialize Modal Quantity Selector
 */
function initModalQuantity() {
    const qtyInput = document.querySelector('.modal-qty-input');
    const decrementBtn = document.querySelector('.modal-qty-btn.decrease');
    const incrementBtn = document.querySelector('.modal-qty-btn.increase');

    if (!qtyInput || !decrementBtn || !incrementBtn) return;

    decrementBtn.addEventListener('click', () => {
        let currentVal = parseInt(qtyInput.value) || 1;
        if (currentVal > 1) {
            qtyInput.value = currentVal - 1;
        }
    });

    incrementBtn.addEventListener('click', () => {
        let currentVal = parseInt(qtyInput.value) || 1;
        qtyInput.value = currentVal + 1;
    });

    // Ensure manual input stays within boundaries
    qtyInput.addEventListener('change', () => {
        let val = parseInt(qtyInput.value);
        if (isNaN(val) || val < 1) qtyInput.value = 1;
    });
}

/**
 * Initialize Mobile Menu
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const navLinks = document.getElementById('mobile-nav');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (!menuBtn || !navLinks || !overlay) return;

    const toggleMenu = (show) => {
        navLinks.classList.toggle('active', show);
        overlay.classList.toggle('active', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(true);
    });

    closeBtn?.addEventListener('click', () => toggleMenu(false));
    overlay.addEventListener('click', () => toggleMenu(false));

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });
}
