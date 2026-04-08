import React, { useContext } from 'react'
import star_icon from '../Assets/star_icon.png'
// import star_dull_icon from '../Assets/star_dull_icon.png'
import './ProductDisplay.css'
import { ShopContext } from '../Context/ShopContext';
import { getProductImage } from '../../utils/imageUtils';

const ProductDisplay = (props) => {
    const {product}=props;
    const {addToCart,message,showMessage}=useContext(ShopContext);

    // Determine stock status
    const getStockStatus = () => {
        const stock = product.stock || 0;
        const available = product.available !== undefined ? product.available : true;
        
        if (!available || stock === 0) {
            return { status: 'out-of-stock', text: 'Out of Stock', color: '#dc3545' };
        } else if (stock <= 10) {
            return { status: 'low-stock', text: `Only ${stock} ${product.unit || 'kg'} left`, color: '#ffc107' };
        } else {
            return { status: 'in-stock', text: `${stock} ${product.unit || 'kg'} in Stock`, color: '#28a745' };
        }
    };

    const stockStatus = getStockStatus();
    


  return (
    <div className='productDisplay flex'>
        <div className="productleft">
            <div className="img-list w-[100px] h-[60px] mt-2 object-contain">
                <img 
                    src={getProductImage(product.image)} 
                    alt={product.name}
                    onError={(e) => {
                        console.log('ProductDisplay thumbnail failed to load:', product.image);
                        e.target.src = '/images/placeholder.svg';
                    }}
                />
                <img 
                    src={getProductImage(product.image)} 
                    alt={product.name}
                    onError={(e) => {
                        console.log('ProductDisplay thumbnail failed to load:', product.image);
                        e.target.src = '/images/placeholder.svg';
                    }}
                />
                <img 
                    src={getProductImage(product.image)} 
                    alt={product.name}
                    onError={(e) => {
                        console.log('ProductDisplay thumbnail failed to load:', product.image);
                        e.target.src = '/images/placeholder.svg';
                    }}
                />
                <img 
                    src={getProductImage(product.image)} 
                    alt={product.name}
                    onError={(e) => {
                        console.log('ProductDisplay thumbnail failed to load:', product.image);
                        e.target.src = '/images/placeholder.svg';
                    }}
                />
            </div>
        </div>
        <div className="productdisplay-img w-[80vw] h-[60vh] mt-[40px]">
            <img 
                className='productdisplay-main-img w-full h-full object-contain' 
                src={getProductImage(product.image)} 
                alt={product.name}
                onError={(e) => {
                    console.log('ProductDisplay main image failed to load:', product.image);
                    e.target.src = '/images/placeholder.svg';
                }}
            />
        </div>
            <div className="productdisplay-right">
                <h1 className='font-bold text-black'>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">
                    ₹{product.old_price}/{product.unit || 'kg'}
                    </div>
                <div className="productdisplay-right-price-new">₹{product.new_price}/{product.unit || 'kg'}</div>
                </div>
                <div className="productdisplay-right-description ">
                    {product.description}
                </div>
                <div className="productdisplay-right-stock">
                    <span 
                        className="stock-indicator"
                        style={{ 
                            backgroundColor: stockStatus.color,
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px'
                        }}
                    ></span>
                    <span style={{ color: stockStatus.color, fontWeight: '600' }}>
                        {stockStatus.text}
                    </span>
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Quantity</h1>
                    <div className="productdisplay-right-sizes">
                        <div>Small Amount 100g</div>
                        <div>Medium Amount 250g</div>
                        <div>Large Amount 400g</div>
                        <div>EXtra Large Amount 500g</div>
                        <div>Too Large Amount 1kg</div>
                    </div>
                </div>
                <div className='flex gap-[20px]'>
                <button 
                    className={`active:bg-green-600 ${stockStatus.status === 'out-of-stock' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                        if (stockStatus.status !== 'out-of-stock') {
                            addToCart(product.id);
                        }
                    }}
                    disabled={stockStatus.status === 'out-of-stock'}
                >
                    {stockStatus.status === 'out-of-stock' ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
                {showMessage && (<p className={`fade-message ${showMessage ? 'visible' : ''} text-green-600 mt-4`}>{message}</p>)}
                </div>
                <p className="productdisplay-right-category"><span>Category :</span>{product.category}</p>
                <p className="productdisplay-right-category"><span>Tag :</span>Fresh</p>
            </div>
      
        </div>
    )
}

export default ProductDisplay