"use client";

import React, { useState, useEffect } from 'react';

const Card = ({ id, image, title, price, sizes, onClick, isAvailable = true }) => {
  const [imageSrc, setImageSrc] = useState(image || "/default-drink.jpg");
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Optimize image URL for better performance
  const optimizeImageUrl = (url) => {
    if (!url || url === "/default-drink.jpg") return url;
    
    // If it's a URL from a service that supports image optimization
    if (url.includes('cloudinary.com')) {
      // Add Cloudinary transformations for small card size
      return url.replace('/upload/', '/upload/w_300,h_300,c_fill,f_auto,q_auto/');
    } else if (url.includes('amazonaws.com') || url.includes('s3.')) {
      // For AWS S3, you could add query parameters if your backend supports image resizing
      return `${url}?w=300&h=300&fit=cover&format=webp`;
    }
    
    // Return original URL if no optimization available
    return url;
  };

  // Update image source when image prop changes
  useEffect(() => {
    setImageLoaded(false);
    if (image) {
      const optimizedUrl = optimizeImageUrl(image);
      setImageSrc(optimizedUrl);
      setImageError(false);
    } else {
      setImageSrc("/default-drink.jpg");
    }
  }, [image]);

  const handleImageError = () => {
    if (imageSrc !== "/default-drink.jpg") {
      // First try the default image
      setImageSrc("/default-drink.jpg");
      setImageLoaded(false);
    } else {
      // If even default image fails, show placeholder
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  // Handle price display - show smallest size price if sizes exist
  const getDisplayPrice = () => {
    if (sizes && sizes.length > 0) {
      const lowestPrice = Math.min(...sizes.map(size => parseFloat(size.price)));
      return lowestPrice.toFixed(2);
    }
    return !isNaN(parseFloat(price)) && isFinite(price) ? parseFloat(price).toFixed(2) : 'N/A';
  };

  const displayPrice = getDisplayPrice();
  const priceText = sizes && sizes.length > 1 ? `From $${displayPrice}` : `$${displayPrice}`;

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 ${
        !isAvailable ? 'opacity-60' : ''
      }`} 
      onClick={isAvailable ? onClick : undefined}
    >
      {/* Product Image - Made smaller with better sizing */}
      <div className="relative bg-gray-50 overflow-hidden">
        {!imageError ? (
          <>
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <img 
              src={imageSrc} 
              alt={title} 
              className={`w-full h-28 object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } hover:scale-105`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              style={{
                objectPosition: 'center',
                minHeight: '112px',
                maxHeight: '112px'
              }}
            />
          </>
        ) : (
          /* Fallback placeholder when all images fail */
          <div className="w-full h-28 bg-gray-100 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Availability Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium">
              Unavailable
            </span>
          </div>
        )}
        
        {/* Size Badge */}
        {sizes && sizes.length > 1 && isAvailable && (
          <div className="absolute top-1 left-1">
            <span className="bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded text-xs font-bold">
              {sizes.length}
            </span>
          </div>
        )}
      </div>

      {/* Product Details - Reduced padding */}
      <div className="p-2 space-y-2">
        {/* Title - Smaller text */}
        <h3 className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2" title={title}>
          {title}
        </h3>

        {/* Price and Button - Smaller elements */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900 text-sm">
              {priceText}
            </span>
            {sizes && sizes.length > 1 && (
              <div className="text-xs text-gray-500">
                Multiple sizes
              </div>
            )}
          </div>
          
          <button 
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
              isAvailable 
                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Add' : 'N/A'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;