// Utility function to handle product images
export const getProductImage = (imagePath) => {
  if (!imagePath) {
    return '/images/placeholder.svg';
  }
  
  // If it's already a local path or relative path, return as is
  if (imagePath.startsWith('/') || imagePath.startsWith('./') || imagePath.startsWith('../')) {
    return imagePath;
  }
  
  // If it's an i.ibb.co URL, replace with local SVG based on product name
  if (imagePath.includes('i.ibb.co/')) {
    const imageName = imagePath.split('/').pop().split('.')[0];
    return `/images/${imageName}.svg`;
  }
  
  // If it's a localhost:8081/images URL, return as is since we now serve static files
  if (imagePath.includes('localhost:8081/images/')) {
    return imagePath;
  }
  
  // For any other external URLs, return placeholder for safety
  if (imagePath.startsWith('http')) {
    return '/images/placeholder.svg';
  }
  
  // Default case
  return imagePath;
};
