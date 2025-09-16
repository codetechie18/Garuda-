/**
 * Utility functions for the Report Table
 */

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Open Google Maps in a new tab with specific coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
export const openGoogleMaps = (lat, lng) => {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Format coordinate display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinate string
 */
export const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(7)}, ${lng.toFixed(7)}`;
};

/**
 * Get toxicity level color class
 * @param {number} score - Toxicity score (0-10)
 * @returns {string} CSS class name
 */
export const getToxicityColorClass = (score) => {
  if (score >= 7) return 'toxicity-score--high';
  if (score >= 4) return 'toxicity-score--medium';
  return 'toxicity-score--low';
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// TODO: For embedded map functionality, uncomment the following and install react-leaflet + leaflet
/*
import L from 'leaflet';

export const createMapMarker = (lat, lng, popupText) => {
  // Fix for default markers in react-leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  return L.marker([lat, lng]).bindPopup(popupText);
};
*/