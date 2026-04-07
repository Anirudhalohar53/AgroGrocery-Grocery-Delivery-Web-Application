// Simple test script to verify Razorpay integration
const testRazorpayIntegration = async () => {
    console.log('Testing Razorpay integration...');
    
    // Test 1: Check if Razorpay script loads
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        
        if (window.Razorpay) {
            console.log('✅ Razorpay object available');
        } else {
            console.error('❌ Razorpay object not available');
        }
    };
    
    script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
    };
    
    document.body.appendChild(script);
    
    // Test 2: Check backend connectivity
    try {
        const response = await fetch('http://localhost:8081/api/test');
        if (response.ok) {
            console.log('✅ Backend is running');
        } else {
            console.error('❌ Backend not responding');
        }
    } catch (error) {
        console.error('❌ Cannot connect to backend:', error.message);
    }
    
    // Test 3: Check Razorpay controller
    try {
        const response = await fetch('http://localhost:8081/api/razorpay/test');
        if (response.ok) {
            console.log('✅ Razorpay controller is loaded');
        } else {
            console.error('❌ Razorpay controller not responding');
        }
    } catch (error) {
        console.error('❌ Cannot connect to Razorpay controller:', error.message);
    }
};

// Export for use in browser console
window.testRazorpayIntegration = testRazorpayIntegration;

console.log('Test script loaded. Run testRazorpayIntegration() in console to test.');
