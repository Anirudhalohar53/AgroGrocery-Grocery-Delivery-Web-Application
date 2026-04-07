import React from 'react'
import exclusive_image from '../Assets/exclusive_image.png'
import './Offers.css'

const Offers = () => {
  return (
    <>
    <div className='offers-background'>
       <div className="wave-border">
        <svg
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor:"#63e080ff", stopOpacity:1}} />
              <stop offset="50%" style={{stopColor:"#28a745", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#5cb85c", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <path
            d="M0,128 C80,96 160,192 240,192 C320,192 400,96 480,128 C560,160 640,224 720,208 C800,192 880,96 960,96 C1040,96 1120,192 1200,192 L1200,320 L0,320 Z"
            fill="url(#waveGradient)" // Use gradient here
            transform="scale(1, -1) translate(0, -320)" // Flip vertically
          />
        </svg>
      </div>

      <div className='offers-content-wrapper'>
        <div className='offers-left animation'>
          <div className='offers-badge'>
            <span> LIMITED TIME </span>
          </div>
          <div className='offers-title'>
            <h1 className='offers-text main'>Exclusive</h1>
            <h1 className='offers-text sub'>Offers For You</h1>
          </div>
          <p className='offers-description'>
            Only on best sellers products - Special discounts on premium items
          </p>
          <div className='offers-stats'>
            <div className='stat-item'>
              <span className='stat-number'>50%</span>
              <span className='stat-label'>OFF</span>
            </div>
            <div className='stat-item'>
              <span className='stat-number'>24h</span>
              <span className='stat-label'>LEFT</span>
            </div>
            <div className='stat-item'>
              <span className='stat-number'>100+</span>
              <span className='stat-label'>DEALS</span>
            </div>
          </div>
        </div>
        <div className='offers-right'>
          <div className='offers-image-container'>
            <img className='offers-image' src={exclusive_image} alt="Exclusive offers" />
            <div className='offers-image-overlay'></div>
          </div>
        </div>
      </div>
      <div className="wave-border">
        <svg
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor:"#63e080ff", stopOpacity:1}} />
              <stop offset="50%" style={{stopColor:"#28a745", stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#5cb85c", stopOpacity:1}} />
            </linearGradient>
          </defs>
          <path
              d="M0,128 C80,96 160,192 240,192 C320,192 400,96 480,128 C560,160 640,224 720,208 C800,192 880,96 960,96 C1040,96 1120,192 1200,192 L1200,320 L0,320 Z"
              style={{ fill: "url(#waveGradient)" }}
            />
        </svg>
      </div>
   </div>
    </>
  )
}

export default Offers