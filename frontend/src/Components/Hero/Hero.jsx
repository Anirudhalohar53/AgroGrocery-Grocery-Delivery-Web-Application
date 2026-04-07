import React from 'react';
import hand_wave from '../Assets/hand_wave.svg';
import arrow_right from '../Assets/arrow_right.svg';
import grocery_hero from '../Assets/grocery_hero.png';
import '../Hero/Hero.css';

const Hero = () => {
  const scrollToNewCollections = () => {
    const element = document.getElementById('latest-collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='hero-container'>
      <div className='hero-background-pattern'></div>
      <div className='hero-content-wrapper'>
        <div className='hero-left animation'>
          {/* <div className='hero-badge'>
            <span>🌟 Fresh Arrivals</span>
          </div> */}
          <div className='hero-title'>
            <div className='hero-title-line'>
              <h1 className='hero-text main'>New</h1>
              <img className='hand' src={hand_wave} alt="" />
            </div>
            <h2 className='hero-text sub'>Groceries</h2>
            <h2 className='hero-text sub accent' data-text="for Everyday">for Everyday</h2>
          </div>
          <p className='hero-description'>
            Discover fresh produce, quality ingredients, and everything you need for delicious meals delivered right to your door.
          </p>
          <div className='hero-stats'>
            <div className='stat-item'>
              <span className='stat-number'>1000+</span>
              <span className='stat-label'>Products</span>
            </div>
            <div className='stat-item'>
              <span className='stat-number'>30min</span>
              <span className='stat-label'>Delivery</span>
            </div>
            <div className='stat-item'>
              <span className='stat-number'>4.8★</span>
              <span className='stat-label'>Rating</span>
            </div>
          </div>
          <div
            className="hero-cta"
            onClick={scrollToNewCollections}
          >
            <button>Shop Newly Added</button>
            <img src={arrow_right} alt="" />
          </div>
        </div>
        <div className='hero-right'>
          <div className='hero-image-container'>
            <img className='hero-image' src={grocery_hero} alt="Fresh groceries delivery" />
            <div className='hero-image-overlay'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
