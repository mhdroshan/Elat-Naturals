/**
 * Shop Mock Data and Logic (Global Functions)
 */

// Mock DB (Original hardcoded data for fallback)
window.products = [
    {
        id: 1,
        sku: 'EN-001',
        name: 'Ayurvedic Herb Shampoo',
        price: 850,
        category: 'hair',
        concern: 'anti-hairfall',
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop',
        featured: true,
        short_desc: 'Strengthens roots and reduces hair fall with pure Bhringraj and Amla.',
        ingredients: 'Bhringraj extract, Amla, Shikakai, Neem, Coconut base.',
        how_to_use: 'Apply to wet hair, massage into scalp, and rinse thoroughly.'
    },
    {
        id: 2,
        sku: 'EN-002',
        name: 'Rosemary Hair Growth Serum',
        price: 1200,
        category: 'hair',
        concern: 'anti-hairfall',
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop',
        featured: true,
        short_desc: 'Clinically proven rosemary formulation to stimulate new hair growth.',
        ingredients: 'Rosemary essential oil, Jojoba oil, Argan oil, Vitamin E.',
        how_to_use: 'Apply 3-4 drops directly to scalp and massage daily at night.'
    },
    {
        id: 3,
        sku: 'EN-003',
        name: 'Face Glow Essence Oil',
        price: 1500,
        category: 'face',
        concern: 'glow',
        image: 'https://images.unsplash.com/photo-1615397323758-1e414c8dcd93?q=80&w=600&auto=format&fit=crop',
        featured: true,
        short_desc: 'Kumkumadi tailored oil for deep hydration and radiant glow.',
        ingredients: 'Saffron (Kumkuma), Sandalwood, Manjistha, Sesame oil.',
        how_to_use: 'Massage 2-3 drops on clean, damp face in upward motions.'
    },
    {
        id: 4,
        sku: 'EN-004',
        name: 'Beetroot Lip Balm',
        price: 350,
        category: 'lips',
        concern: 'dryness',
        image: 'https://images.unsplash.com/photo-1596755389378-c11dde12061b?q=80&w=600&auto=format&fit=crop',
        featured: false,
        short_desc: 'Deep nourishing care for dry, chapped lips with a natural tint.',
        ingredients: 'Beetroot extract, Shea butter, Beeswax, Almond oil.',
        how_to_use: 'Apply liberally to lips as often as needed.'
    },
    {
        id: 5,
        sku: 'EN-005',
        name: 'Rose & Saffron Lip Tint',
        price: 450,
        category: 'lips',
        concern: 'glow',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
        featured: false,
        short_desc: 'A flush of color while naturally moisturizing the lips.',
        ingredients: 'Rose petal extract, Saffron strands, Cocoa butter, Castor oil.',
        how_to_use: 'Dab lightly on lips and cheeks and blend.'
    },
    {
        id: 6,
        sku: 'EN-006',
        name: 'Aloe Vera Face Toner',
        price: 600,
        category: 'face',
        concern: 'dryness',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop',
        featured: false,
        short_desc: 'Refreshing and pore-tightening mist for daily hydration.',
        ingredients: 'Pure Aloe Vera hydrosol, Rose water, Witch Hazel.',
        how_to_use: 'Spritz onto face after cleansing or throughout the day.'
    },
    {
        id: 7,
        sku: 'EN-007',
        name: 'Rose Glowing Serum',
        price: 1350,
        category: 'face',
        concern: 'glow',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop',
        featured: true,
        short_desc: 'Lightweight overnight serum designed to restore youthful buoyancy.',
        ingredients: 'Damask Rose extract, Hyaluronic Acid, Vitamin C plant derivative.',
        how_to_use: 'Apply evenly over face and neck before moisturizer at bedtime.'
    },
    {
        id: 8,
        sku: 'EN-008',
        name: 'Neem Clarifying Mask',
        price: 890,
        category: 'face',
        concern: 'acne',
        image: 'https://images.unsplash.com/photo-1552533036-7c913501a3dd?q=80&w=600&auto=format&fit=crop',
        featured: false,
        short_desc: 'Deep cleanses and purifies to reduce breakouts.',
        ingredients: 'Neem leaf powder, Multani Mitti, Turmeric, Tea Tree oil.',
        how_to_use: 'Mix with water/rosewater. Apply, leave for 15 mins, wash off.'
    }
];

window.globalModalRenderer = null;

// Sets the global modal reference to connect components
window.setModalRenderer = function (fn) {
    window.globalModalRenderer = fn;
}

/**
 * Render a single product card
 * @param {Object} product 
 * @returns {HTMLElement}
 */
window.createProductCard = function (product) {
    const card = document.createElement('div');
    card.className = 'product-card new-ui-card';
    card.dataset.id = product.id;

    // Simulate sale behavior for the first item to match the image UI exactly
    const isFirstItem = (product.id === "elat-hair-oil-100ml" || product.id === 1);
    const saleActive = product.on_sale || isFirstItem; 
    
    const displayPrice = product.price;
    const priceText = product.price ? `₹${parseFloat(product.price)}` : '₹249';

    const productName = product.name || product.product_name || 'Hydra Drops';

    const imageSrc = product.image || product.product_image || './assets/images/bottle_placeholder.png';

    card.innerHTML = `
    ${saleActive ? '<span class="discount-badge">-20%</span>' : ''}
    <div class="product-image-wrap">
        <img src="${imageSrc}" class="product-tile-img" alt="${productName}" loading="lazy">
    </div>
    <div class="card-bottom-info">
        <h3 class="card-title">${productName}</h3>
        <div class="card-price">
            ${saleActive ? `<span>${priceText}</span>` : `<span>${priceText}</span>`}
        </div>
    </div>
    `;

    // Attach Event Listeners
    const imgWrap = card.querySelector('.product-image-wrap');
    const title = card.querySelector('.card-title');

    const handleView = () => {
        if (window.globalModalRenderer) window.globalModalRenderer(product);
    };

    if (imgWrap) imgWrap.addEventListener('click', handleView);
    if (title) title.addEventListener('click', handleView);

    return card;
}

/**
 * Initialize shop grid
 * @param {HTMLElement} container 
 * @param {Array} productList Default to all products
 */
window.renderProductGrid = function (container, productList) {
    const list = productList || window.products;
    if (!container) return;
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p>No products found matching your criteria.</p>';
        return;
    }

    list.forEach(product => {
        container.appendChild(window.createProductCard(product));
    });
}

/**
 * Render a single product card matching the specific "Shop Our Bestsellers" reference style
 * @param {Object} product 
 * @param {String} currency
 * @returns {HTMLElement}
 */
window.createReferenceProductCard = function (product, currency = 'INR') {
    const card = document.createElement('div');
    card.className = 'ref-product-card';
    card.dataset.id = product.id;

    // Use product image or fallback to placeholder
    const imageSrc = product.image || './assets/images/bottle_placeholder.png';
    const currencySymbol = currency === 'INR' ? '₹' : '$';

    card.innerHTML = `
    <div class="ref-product-img-wrap">
      ${product.on_sale ? '<span class="ref-sale-tag">SALE!</span>' : ''}
      <img src="${imageSrc}" alt="${product.product_name}" loading="lazy">
    </div>
    <h3 class="ref-product-title">${product.product_name}</h3>
    <div class="ref-product-type">${product.size}</div>
    <div class="ref-product-price">
        ${product.on_sale ? `<del>${currencySymbol}${product.old_price}</del>` : ''}
        <span>${currencySymbol}${product.price}</span>
    </div>
    <button class="ref-btn-add">BUY NOW</button>
  `;

    // Attach Event Listeners
    const imgWrap = card.querySelector('.ref-product-img-wrap');
    const title = card.querySelector('.ref-product-title');
    const addBtn = card.querySelector('.ref-btn-add');

    const handleView = () => {
        // Since we are mocking, let's pass a mapped object to the modal if needed
        if (window.globalModalRenderer) {
            window.globalModalRenderer({
                ...product,
                name: product.product_name,
                image: imageSrc,
                category: product.size,
                short_desc: product.short_description,
                ingredients: product.key_ingredients ? product.key_ingredients.join(', ') : '',
                how_to_use: 'Apply as directed on package.'
            });
        }
    };

    imgWrap.addEventListener('click', handleView);
    title.addEventListener('click', handleView);

    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.handleBuyNowClick(e, { ...product, name: product.product_name });
    });

    return card;
}

/**
 * Initialize shop grid using the reference style
 * @param {HTMLElement} container 
 * @param {Array} productList Default to all products
 * @param {String} currency 
 */
window.renderReferenceProductGrid = function (container, productList, currency = 'INR') {
    const list = productList || window.products;
    if (!container) return;
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p>No products found matching your criteria.</p>';
        return;
    }

    list.forEach(product => {
        container.appendChild(window.createReferenceProductCard(product, currency));
    });
}
