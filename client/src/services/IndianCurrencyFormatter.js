export const formatIndianCurrency = (amount) => {
  // Check for invalid or empty values and return a default formatted string.
  if (amount === null || typeof amount === 'undefined' || isNaN(amount)) {
    return '₹0.00';
  }

  // Use the Intl.NumberFormat object with the 'en-IN' locale.
  // This automatically applies the correct formatting for thousands, lakhs, and crores.
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', // Use currency formatting
    currency: 'INR', // Specify Indian Rupee
    minimumFractionDigits: 2, // Ensure at least two decimal places
    maximumFractionDigits: 2, // Do not exceed two decimal places
  }).format(amount);
};