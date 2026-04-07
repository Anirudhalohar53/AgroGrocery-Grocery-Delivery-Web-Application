import React, { useState } from 'react';
import './RazorpayPayment.css';

const RazorpayPayment = ({ orderData, onPaymentSuccess, onPaymentFailure, isLoading, setIsLoading }) => {
    const [error, setError] = useState('');

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setError('');
        setIsLoading(true);

        try {
            // Load Razorpay script
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

            const { order, keyId, orderId } = orderDataResponse;

            // Razorpay options
            const options = {
                key: keyId, // Use the key ID from backend response
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
                                orderId: orderId
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error(`Verification failed! status: ${verifyResponse.status}`);
                        }

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            onPaymentSuccess(verifyData);
                        } else {
                            onPaymentFailure(verifyData.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        onPaymentFailure('Payment verification failed');
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
                        onPaymentFailure('Payment cancelled');
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
    };

    return (
        <div className="razorpay-payment">
            <div className="payment-method-card">
                <h3 className="payment-method-title">Choose Payment Method</h3>
                
                <div className="payment-options">
                    <div className="payment-option razorpay-option">
                        <div className="payment-option-header">
                            <div className="payment-info">
                                <h4>Razorpay</h4>
                                <p>Pay via UPI, Credit Card, Debit Card, Net Banking & Wallets</p>
                            </div>
                            <div className="payment-icons">
                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E" alt="Secure" />
                            </div>
                        </div>
                        
                        <button
                            className="razorpay-pay-button"
                            onClick={handlePayment}
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
                                'Pay with Razorpay'
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="payment-error">
                        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="payment-security-note">
                    <svg className="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <p>Your payment information is secure and encrypted</p>
                </div>
            </div>
        </div>
    );
};

export default RazorpayPayment;
