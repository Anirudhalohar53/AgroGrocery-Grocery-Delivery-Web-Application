import React, { useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios';
import parcel from '../../Components/Assets/parcel_icon.png'

const MyOrders = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTrackingModal, setShowTrackingModal] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8081/api/userorders", {}, {
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                }
            });
            setData(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatItems = (items) => {
        return items.map((item, index) => {
            const itemText = `${item.name} x ${item.quantity}`;
            return index === items.length - 1 ? itemText : `${itemText}, `;
        });
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'Delivered': '#10b981',
            'Processing': '#f59e0b',
            'Shipped': '#3b82f6',
            'Pending': '#6b7280',
            'Cancelled': '#ef4444'
        };
        return statusColors[status] || '#667eea';
    };

    const trackOrder = (order) => {
        setSelectedOrder(order);
        setShowTrackingModal(true);
    };

    const closeModal = () => {
        setShowTrackingModal(false);
        setSelectedOrder(null);
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/cancel', {
                orderId
            }, {
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                alert('Order cancelled successfully');
                fetchOrders(); // Refresh orders
            } else {
                alert(response.data.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Error cancelling order. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className='mt-[20vh] my-orders'>
                <h2 className='order-h2'>My Orders</h2>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='mt-[20vh] my-orders'>
                <h2 className='order-h2'>My Orders</h2>
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={fetchOrders} className="retry-button">Retry</button>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className='mt-[20vh] my-orders'>
                <h2 className='order-h2'>My Orders</h2>
                <div className="empty-container">
                    <div className="empty-icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>Start shopping to see your orders here!</p>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-[20vh] my-orders'>
            <h2 className='order-h2'>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <div className="order-icon-container">
                            <img src={parcel} alt="Package" />
                        </div>
                        <div className="order-items">
                            <p>{formatItems(order.items)}</p>
                        </div>
                        <div className="order-amount">
                            <p className="amount-label">Amount</p>
                            <p className="amount-value">₹{order.amount}.00</p>
                        </div>
                        <div className="order-items-count">
                            <p className="items-label">Items</p>
                            <p className="items-count">{order.items.length}</p>
                        </div>
                        <div className="order-status">
                            <p className="status-label">Status</p>
                            <p>
                                <span style={{ color: getStatusColor(order.status) }}>● </span>
                                <b>{order.status}</b>
                            </p>
                        </div>
                        <div className="order-action">
                            <button onClick={() => trackOrder(order)} className="track-btn">Track Order</button>
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button onClick={() => cancelOrder(order.id)} className="cancel-btn">Cancel</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Order Tracking Modal */}
            {showTrackingModal && selectedOrder && (
                <div className="tracking-modal-overlay" onClick={closeModal}>
                    <div className="tracking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tracking-modal-header">
                            <h3>Order Tracking</h3>
                            <button className="close-modal" onClick={closeModal}>×</button>
                        </div>
                        <div className="tracking-modal-content">
                            <div className="order-info">
                                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                <p><strong>Order Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                                <p><strong>Payment Status:</strong> {selectedOrder.payment ? 'Paid' : 'Pending'}</p>
                            </div>
                            
                            <div className="tracking-timeline">
                                <h4>Order Status</h4>
                                <div className={`timeline-item ${selectedOrder.status === 'Order Processing' || selectedOrder.status === 'Processing' ? 'active' : ''}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h5>Order Processing</h5>
                                        <p>Your order has been received and is being processed</p>
                                    </div>
                                </div>
                                <div className={`timeline-item ${selectedOrder.status === 'Out for delivery' || selectedOrder.status === 'Shipped' ? 'active' : ''}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h5>Out for Delivery</h5>
                                        <p>Your order is on its way to your address</p>
                                    </div>
                                </div>
                                <div className={`timeline-item ${selectedOrder.status === 'Delivered' ? 'active' : ''}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h5>Delivered</h5>
                                        <p>Your order has been successfully delivered</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="delivery-address">
                                <h4>Delivery Address</h4>
                                <p>{selectedOrder.address?.firstName} {selectedOrder.address?.lastName}</p>
                                <p>{selectedOrder.address?.street}, {selectedOrder.address?.city}</p>
                                <p>{selectedOrder.address?.state}, {selectedOrder.address?.country} - {selectedOrder.address?.zipCode}</p>
                                <p>Phone: {selectedOrder.address?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyOrders
