import React, { useContext } from 'react';
import './CartItems.css';
import remove_icon from '../Assets/cart_cross_icon.png';
import { ShopContext } from '../Context/ShopContext';
import { useNavigate } from 'react-router-dom';


const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart, addToCart } = useContext(ShopContext);
    const navigate = useNavigate();

    return (
        <div className='cartitems'>
            {/* Products Section */}
            <div className="cart-products-section">
                <h2 className="section-title">Shopping Cart</h2>
                <div className="cart-items-container">
                    {all_product.map((e) => {
                        if (cartItems[e.id] > 0) {
                            return (
                                <div key={e.id} className="cart-item-card">
                                    <div className="cart-item-left">
                                        <div className="cart-item-image">
                                            <img src={e.image} alt={e.name} />
                                        </div>
                                        <div className="cart-item-details">
                                            <h3 className="cart-item-name">{e.name}</h3>
                                            <p className="cart-item-price">₹{e.new_price}</p>
                                        </div>
                                    </div>
                                    <div className="cart-item-right">
                                        <div className="cart-item-controls">
                                            <div className="cart-item-quantity">
                                                <button 
                                                    className="quantity-btn decrease" 
                                                    onClick={() => removeFromCart(e.id)}
                                                >
                                                    -
                                                </button>
                                                <span className="quantity-value">{cartItems[e.id]}</span>
                                                <button 
                                                    className="quantity-btn increase" 
                                                    onClick={() => addToCart(e.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="cart-item-total">
                                                <p className="total-price">₹{e.new_price * cartItems[e.id]}</p>
                                            </div>
                                            <div className="cart-item-remove">
                                                <button 
                                                    className="remove-btn" 
                                                    onClick={() => removeFromCart(e.id)}
                                                >
                                                    <img src={remove_icon} alt="Remove" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>

            {/* Cart Total Section */}
            <div className="cart-total-section">
                <div className="cartitems-total">
                    <h2 className="section-title">Cart Summary</h2>
                    <div className="cartitems-total-item">
                        <p>Subtotal</p>
                        <p>₹{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <h3>Total</h3>
                        <h3>₹{getTotalCartAmount()}</h3>
                    </div>
                    <div className="checkout-button-container">
                        <button className='checkout-button' onClick={() => { navigate('/order') }}>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
