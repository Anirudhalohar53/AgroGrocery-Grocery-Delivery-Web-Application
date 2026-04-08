import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Item.css';
import { ShopContext } from '../Context/ShopContext'; // Update the path as per your project structure
import { getProductImage } from '../../utils/imageUtils';

function Item(props) {
  const { addToCart, cartItems } = useContext(ShopContext); // Access the addToCart and cartItems from the context
  const [showMessage, setShowMessage] = useState(false); // Local state to handle message visibility
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Determine stock status
  const getStockStatus = () => {
    const stock = props.stock || 0;
    const available = props.available !== undefined ? props.available : true;
    
    if (!available || stock === 0) {
      return { status: 'out-of-stock', text: 'Out of Stock', color: '#dc3545' };
    } else if (stock <= 10) {
      return { status: 'low-stock', text: `Only ${stock} ${props.unit || 'kg'} left`, color: '#ffc107' };
    } else {
      return { status: 'in-stock', text: 'In Stock', color: '#28a745' };
    }
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    // Prevent adding to cart if out of stock
    if (stockStatus.status === 'out-of-stock') {
      return;
    }
    addToCart(props.id); // Call the addToCart function with the product ID
    setShowMessage(true);
    setIsAdded(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  useEffect(() => {
    // This useEffect will run every time cartItems changes, forcing a re-render if needed
  }, [cartItems]);

  const discountPercentage = Math.round(((props.old_price - props.new_price) / props.old_price) * 100);

  return (
    <div 
      className='premium-product-card'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Background Effects */}
      <div className='card-background'>
        <div className='gradient-orb orb-1'></div>
        <div className='gradient-orb orb-2'></div>
        <div className='gradient-orb orb-3'></div>
      </div>

      {/* Premium Badge System */}
      <div className='badge-system'>
        {discountPercentage > 20 && (
          <div className='premium-badge hot-deal'>
            <span className='badge-icon'>🔥</span>
            <span className='badge-text'>HOT DEAL</span>
          </div>
        )}
        <div className='premium-badge new-arrival'>
          <span className='badge-icon'>✨</span>
          <span className='badge-text'>NEW</span>
        </div>
        <div className='premium-badge discount-badge'>
          <span className='badge-text'>-{discountPercentage}%</span>
        </div>
      </div>

      {/* Favorite Button */}
      <button 
        className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
        onClick={handleFavorite}
      >
        <span className='heart-icon'>{isFavorited ? '❤️' : '🤍'}</span>
      </button>

      {/* Product Image Section */}
      <div className='product-image-section'>
        <Link 
          to={`/product/${props.id}`} 
          className='image-link'
          onClick={() => {
            window.scrollTo(0, 0);
            sessionStorage.setItem('scrollToTop', 'true');
          }}
        >
          <div className='image-container'>
            <img 
              className='product-image' 
              src={getProductImage(props.image)} 
              alt={props.name}
              onError={(e) => {
                console.log('Image failed to load:', props.image);
                e.target.src = '/images/placeholder.svg';
              }}
            />
            <div className='image-shine'></div>
          </div>
          
        </Link>
      </div>

      {/* Product Content */}
      <div className='product-content'>
        {/* Product Title */}
        <div className='product-header'>
          <h3 className='product-title'>{props.name}</h3>
          <div className='product-meta'>
            <div className='rating-system'>
              <div className='stars'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`star ${star <= 4 ? 'filled' : 'half-filled'}`}>
                    {star <= 4 ? '⭐' : '⭐'}
                  </span>
                ))}
              </div>
              <span className='rating-count'>(4.5)</span>
            </div>
            <div className='stock-status'>
              <span 
                className={`status-indicator ${stockStatus.status}`}
                style={{ backgroundColor: stockStatus.color }}
              ></span>
              <span className='status-text'>{stockStatus.text}</span>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className='price-section'>
          <div className='price-main'>
            <span className='current-price'>₹{props.new_price}/{props.unit || 'kg'}</span>
            <span className='original-price'>₹{props.old_price}/{props.unit || 'kg'}</span>
          </div>
          <div className='price-savings'>
            <span className='savings-text'>You save ₹{props.old_price - props.new_price} per {props.unit || 'kg'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='action-section'>
          <button 
            className={`premium-add-btn ${isAdded ? 'success' : ''} ${isHovered ? 'expanded' : ''} ${stockStatus.status === 'out-of-stock' ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={stockStatus.status === 'out-of-stock'}
          >
            <div className='btn-content'>
              <span className='btn-icon'>
                {stockStatus.status === 'out-of-stock' ? '🚫' : (isAdded ? '✅' : '🛒')}
              </span>
              <span className='btn-text'>
                {stockStatus.status === 'out-of-stock' ? 'Out of Stock' : (isAdded ? 'Added to Cart' : 'Add to Cart')}
              </span>
            </div>
            <div className='btn-ripple'></div>
          </button>
          
          <div className='secondary-actions'>
            <button className='action-btn buy-now-btn'>
              <span className='btn-icon'>⚡</span>
              <span className='btn-tooltip'>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Success Notification */}
      {showMessage && (
        <div className="premium-notification">
          <div className='notification-backdrop'></div>
          <div className='notification-content'>
            <div className='notification-icon'>
              <div className='icon-circle'>
                <span className='check-icon'>✓</span>
              </div>
            </div>
            <div className='notification-text'>
              <h4>Added to Cart!</h4>
              <p>{props.name} has been added to your cart</p>
            </div>
            <button className='notification-close' onClick={() => setShowMessage(false)}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Item;
