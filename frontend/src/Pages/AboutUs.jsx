import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className='about-us-container'>
      {/* Hero Section */}
      <div className='about-hero'>
        <div className='hero-content'>
          <h1>About AgroGrocery</h1>
          <p>Your Trusted Partner for Fresh Groceries</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='about-content'>
        <div className='container'>
          {/* Our Story Section */}
          <section className='story-section'>
            <div className='section-content'>
              <h2>Our Story</h2>
              <p>
                Founded with a simple mission to make fresh, quality groceries accessible to everyone, 
                AgroGrocery has grown from a small startup to a trusted name in grocery delivery. 
                We believe that everyone deserves access to fresh produce, pantry staples, and household 
                essentials without the hassle of traditional grocery shopping.
              </p>
              <p>
                What started as a dream to bridge the gap between farmers and consumers has evolved 
                into a comprehensive platform that serves thousands of families across the region. 
                Our commitment to quality, freshness, and customer satisfaction remains at the heart 
                of everything we do.
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className='mission-vision-section'>
            <div className='cards-grid'>
              <div className='card'>
                <div className='card-icon'>🎯</div>
                <h3>Our Mission</h3>
                <p>
                  To provide fresh, high-quality groceries and household essentials at competitive 
                  prices while supporting local farmers and producers. We strive to make grocery 
                  shopping convenient, affordable, and enjoyable for every family.
                </p>
              </div>
              <div className='card'>
                <div className='card-icon'>👁️</div>
                <h3>Our Vision</h3>
                <p>
                  To become the most trusted grocery delivery platform by revolutionizing the way 
                  people shop for daily essentials. We aim to build a sustainable ecosystem that 
                  benefits customers, farmers, and the community.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className='values-section'>
            <h2>Our Core Values</h2>
            <div className='values-grid'>
              <div className='value-item'>
                <div className='value-icon'>🌱</div>
                <h4>Freshness First</h4>
                <p>We prioritize fresh, quality products in every order</p>
              </div>
              <div className='value-item'>
                <div className='value-icon'>🤝</div>
                <h4>Customer Trust</h4>
                <p>Built on reliability, transparency, and exceptional service</p>
              </div>
              <div className='value-item'>
                <div className='value-icon'>🚚</div>
                <h4>Convenience</h4>
                <p>Making grocery shopping easy and hassle-free</p>
              </div>
              <div className='value-item'>
                <div className='value-icon'>💚</div>
                <h4>Sustainability</h4>
                <p>Supporting local farmers and eco-friendly practices</p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className='team-section'>
            <h2>Meet Our Team</h2>
            <p className='team-intro'>
              Our dedicated team works tirelessly to ensure you receive the best service and 
              freshest products every time you order.
            </p>
            <div className='team-stats'>
              <div className='stat'>
                <div className='stat-number'>50+</div>
                <div className='stat-label'>Team Members</div>
              </div>
              <div className='stat'>
                <div className='stat-number'>24/7</div>
                <div className='stat-label'>Customer Support</div>
              </div>
              <div className='stat'>
                <div className='stat-number'>100+</div>
                <div className='stat-label'>Local Partners</div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className='contact-section'>
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you! Whether you have questions, feedback, or suggestions, 
               our team is here to help.</p>
            <div className='contact-info'>
              <div className='contact-item'>
                <div className='contact-icon'>📧</div>
                <div>
                  <h4>Email</h4>
                  <p>support@agrogrocery.com</p>
                </div>
              </div>
              <div className='contact-item'>
                <div className='contact-icon'>📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>1-800-GROCERY</p>
                </div>
              </div>
              <div className='contact-item'>
                <div className='contact-icon'>📍</div>
                <div>
                  <h4>Headquarters</h4>
                  <p>123 Market Street, Grocery City, GC 12345</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
