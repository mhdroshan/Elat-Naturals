/**
 * WhatsApp Integration Utilities (Global Functions)
 */

window.BUSINESS_PHONE = '919544894588'; // Updated contact number

/**
 * Generates a WhatsApp wa.me URL with a prefilled message
 * @param {string} productName 
 * @param {string} productCode 
 * @returns {string} The encoded URL
 */
window.generateWhatsAppLink = function (productName, productCode) {
  const message = `Hi Elat Naturals - I'm interested in [${productName} – Code ${productCode}]. Please assist.`;
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

  // Track event
  window.trackWhatsAppClick(product.sku || product.id, product.price);

  // Try to open WhatsApp
  const url = window.generateWhatsAppLink(product.name || product.product_name, product.sku || product.id);

  // Open in new tab/window
  window.open(url, '_blank', 'noopener,noreferrer');
}
