/**
 * WhatsApp Integration Utilities (Global Functions)
 */

window.BUSINESS_PHONE = '918075996201'; // Updated contact number

/**
 * Generates a WhatsApp wa.me URL with a prefilled message
 * @param {string} productName 
 * @param {string} productCode 
 * @param {number|string} quantity
 * @returns {string} The encoded URL
 */
window.generateWhatsAppLink = function (productName, productCode, quantity = 1) {
  const message = `Hi Elat Naturals - I'm interested in [${productName} – Code ${productCode}] (Quantity: ${quantity}). Please assist.`;
  return `https://wa.me/${window.BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Tracks a WhatsApp click event in Google Analytics
 * @param {string} productCode 
 * @param {number|string} price 
 */
window.trackWhatsAppClick = function (productCode, price) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'whatsapp_click', {
      product: productCode,
      value: price,
      currency: 'INR'
    });
  } else {
    // Fallback console log for dev environment
    console.log(`[Analytics Mock] Event: whatsapp_click | Product: ${productCode} | Value: ${price}`);
  }
}

/**
 * Handles the Buy Now action across the site
 * @param {Event} e 
 * @param {Object} product 
 */
window.handleBuyNowClick = function (e, product) {
  if (e) e.preventDefault();

  const qty = product.selectedQuantity || 1;

  // Track event
  window.trackWhatsAppClick(product.sku || product.id, product.price);

  // Try to open WhatsApp
  const url = window.generateWhatsAppLink(product.name || product.product_name, product.sku || product.id, qty);

  // Open in new tab/window
  window.open(url, '_blank', 'noopener,noreferrer');
}
