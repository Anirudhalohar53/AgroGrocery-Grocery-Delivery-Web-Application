import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios';

const PlaceOrder = () => {
    const {getTotalCartAmount,token,all_product,cartItems}=useContext(ShopContext)
    const [data,setData]=useState({
        firstName:"",
        lastName:"",
        email:"",
        street:"",
        city:"",
        state:"",
        zipCode:"",
        country:"",
        phone:""
    })
    const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const onChangeHandler=(event)=>{
        const name=event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
        setError(''); // Clear error when user types
    }

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                setError(`Please fill in all required fields`);
                return false;
            }
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        // Validate phone number (basic validation)
        const phoneRegex = /^[0-9]{10,}$/;
        if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

  const placeOrder = async (event)=>{
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
        let orderItems =[];
        all_product.map((item)=>{
            if(cartItems[item.id]>0){
                let itemInfo = item;
                itemInfo["quantity"]=cartItems[item.id];
                orderItems.push(itemInfo);
            }
        })
        
        if (orderItems.length === 0) {
            setError('Your cart is empty');
            setIsLoading(false);
            return;
        }
        
        let orderData={
            address:data,
            items:orderItems,
            amount:parseFloat(getTotalCartAmount()), // Ensure amount is always a float
            paymentMethod: paymentMethod
        }
        
        if (paymentMethod === 'COD') {
            await handleCODOrder(orderData);
        } else {
            await handleRazorpayPayment(orderData);
        }
        
    } catch (error) {
        console.error('Order placement error:', error);
        if (error.code === 'ECONNABORTED') {
            setError('Request timeout. Please try again.');
        } else if (error.response) {
            setError(error.response.data.message || 'Server error occurred');
        } else if (error.request) {
            setError('Network error. Please check your connection.');
        } else {
            setError('An unexpected error occurred');
        }
        setIsLoading(false);
    }
  }

  const handleCODOrder = async (orderData) => {
    try {
        const response = await fetch('http://localhost:8081/api/place-cod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token'),
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = `/verify?success=true&orderId=${result.orderId}&paymentMethod=COD`;
        } else {
            setError(result.message || 'Failed to place COD order');
            setIsLoading(false);
        }
    } catch (error) {
        console.error('COD order error:', error);
        setError('Failed to place COD order. Please try again.');
        setIsLoading(false);
    }
  }

  const handleRazorpayPayment = async (orderData) => {
    try {
        // Load Razorpay script
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                if (window.Razorpay) {
                    resolve(true);
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setError('Failed to load payment gateway. Please try again.');
            setIsLoading(false);
            return;
        }

        // Create order on backend
        const response = await fetch('http://localhost:8081/api/razorpay/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('auth-token'),
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const orderDataResponse = await response.json();

        if (!orderDataResponse.success) {
            setError(orderDataResponse.message || 'Failed to create payment order');
            setIsLoading(false);
            return;
        }

        const { order, keyId, tempOrderId, orderData: tempOrderData } = orderDataResponse;

        // Razorpay options
        const options = {
            key: keyId,
            amount: order.amount,
            currency: order.currency,
            name: 'GrocerEase',
            description: 'Grocery Delivery Payment',
            order_id: order.id,
            handler: async function (response) {
                // Verify payment on backend
                try {
                    const verifyResponse = await fetch('http://localhost:8081/api/razorpay/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': localStorage.getItem('auth-token'),
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: tempOrderId,
                            orderData: tempOrderData // Pass the order data for verification
                        }),
                    });

                    if (!verifyResponse.ok) {
                        throw new Error(`Verification failed! status: ${verifyResponse.status}`);
                    }

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        window.location.href = `/verify?success=true&orderId=${verifyData.orderId}&paymentMethod=RAZORPAY`;
                    } else {
                        setError(verifyData.message || 'Payment verification failed');
                        setIsLoading(false);
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    setError('Payment verification failed');
                    setIsLoading(false);
                }
            },
            prefill: {
                name: `${orderData.address.firstName} ${orderData.address.lastName}`,
                email: orderData.address.email,
                contact: orderData.address.phone,
            },
            theme: {
                color: '#3399cc',
            },
            modal: {
                ondismiss: function () {
                    setIsLoading(false);
                },
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

    } catch (error) {
        console.error('Payment error:', error);
        setError(error.message || 'Payment failed. Please try again.');
        setIsLoading(false);
    }
  }

  return (
    <form onSubmit={placeOrder} className='place-order mt-[16vh]'>
       {/* Delivery Information Section */}
       <div className="delivery-info-section">
        <h2 className="section-title">Delivery Information</h2>
        <div className="delivery-form-card">
            <div className="multi-fields">
                <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' className="form-input"/>
                <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' className="form-input"/>
            </div>
            <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' className="form-input"/>
            <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' className="form-input"/>

            <div className="multi-fields">
                <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' className="form-input"/>
                <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' className="form-input"/>
            </div>
            <div className="multi-fields">
                <input required name='zipCode' onChange={onChangeHandler} value={data.zipCode} type="text" placeholder='Zip Code' className="form-input"/>
                <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' className="form-input"/>
            </div>
            <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' className="form-input"/>
        </div>
       </div> 

       {/* Order Summary Section */}
        <div className="order-summary-section">
            <div className="order-summary-card">
                <h2 className="section-title">Order Summary</h2>
                <div className="order-totals">
                    <div className="order-total-item">
                        <p>Subtotal</p>
                        <p>₹{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="order-total-item">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="order-total-item">
                        <h3>Total</h3>
                        <h3>₹{getTotalCartAmount()}</h3>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="payment-method-section">
                    <h3 className="payment-method-title">Payment Method</h3>
                    <div className="payment-options">
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="RAZORPAY"
                                checked={paymentMethod === 'RAZORPAY'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className="payment-option-content">
                                <div className="payment-option-header">
                                    <span className="payment-icon">💳</span>
                                    <span className="payment-name">Online Payment</span>
                                </div>
                                <span className="payment-description">Pay securely with credit/debit card, UPI, or other online methods</span>
                            </div>
                        </label>
                        
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === 'COD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className="payment-option-content">
                                <div className="payment-option-header">
                                    <span className="payment-icon">💵</span>
                                    <span className="payment-name">Cash on Delivery</span>
                                </div>
                                <span className="payment-description">Pay when your order is delivered</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="checkout-button-container">
                    <button 
                        className='checkout-button' 
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            paymentMethod === 'COD' ? 'PLACE ORDER (COD)' : 'PROCEED TO PAYMENT'
                        )}
                    </button>
                </div>
                
                {error && (
                    <div className="error-message">
                        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    </form>
  )
}

export default PlaceOrder
