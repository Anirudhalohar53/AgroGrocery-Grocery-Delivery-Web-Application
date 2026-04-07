import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8081/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact form submitted:', result);
        
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Reset status after 5 seconds
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        throw new Error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='contact-us-container'>
      {/* Hero Section */}
      <div className='contact-hero'>
        <div className='hero-content'>
          {/* <h1>Contact Us</h1> */}
          <p>Get in touch with AgroGrocery - We're here to help!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='contact-content'>
        <div className='container'>
          <div className='contact-grid'>
            {/* Contact Information */}
            <div className='contact-info-section'>
              <h2>Get in Touch</h2>
              <p className='contact-intro'>
                We'd love to hear from you! Whether you have questions about our products, 
                need help with your order, or want to provide feedback, our team is here to assist you.
              </p>

              <div className='contact-methods'>
                <div className='contact-method'>
                  <div className='contact-icon'>📍</div>
                  <div className='contact-details'>
                    <h3>Visit Us</h3>
                    <p>123 Market Street<br />Grocery City, GC 12345<br />maharashtra</p>
                  </div>
                </div>

                <div className='contact-method'>
                  <div className='contact-icon'>📞</div>
                  <div className='contact-details'>
                    <h3>Call Us</h3>
                    <p>Customer Service: 1-800-GROCERY<br />Mon-Fri: 8AM-8PM<br />Sat-Sun: 9AM-6PM</p>
                  </div>
                </div>

                <div className='contact-method'>
                  <div className='contact-icon'>✉️</div>
                  <div className='contact-details'>
                    <h3>Email Us</h3>
                    <p>General: support@agrogrocery.com<br />Orders: orders@agrogrocery.com<br />Partnerships: partners@agrogrocery.com</p>
                  </div>
                </div>

                <div className='contact-method'>
                  <div className='contact-icon'>💬</div>
                  <div className='contact-details'>
                    <h3>Live Chat</h3>
                    <p>Available 24/7 on our website<br />Average response time: 2 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className='contact-form-section'>
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className='contact-form'>
                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor='name'>Name *</label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder='Your full name'
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='email'>Email *</label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder='your.email@example.com'
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group'>
                    <label htmlFor='phone'>Phone Number</label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='+91 9854 7123-45'
                    />
                  </div>
                  <div className='form-group'>
                    <label htmlFor='subject'>Subject *</label>
                    <select
                      id='subject'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value=''>Select a subject</option>
                      <option value='general'>General Inquiry</option>
                      <option value='order'>Order Issue</option>
                      <option value='product'>Product Question</option>
                      <option value='delivery'>Delivery Issue</option>
                      <option value='refund'>Refund Request</option>
                      <option value='partnership'>Partnership</option>
                      <option value='feedback'>Feedback</option>
                    </select>
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='message'>Message *</label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows='6'
                    placeholder='Please describe your inquiry in detail...'
                  ></textarea>
                </div>

                <button 
                  type='submit' 
                  className='submit-btn'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className='success-message'>
                    ✅ Thank you for your message! We'll get back to you within 24 hours.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className='error-message'>
                    ❌ Sorry, there was an error sending your message. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
