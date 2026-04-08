// src/Components/Popular/Popular.jsx
import React, { useEffect, useState } from 'react';
import Item from '../Item/Item';
import '../Popular/Popular.css';

function Popular() {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/popularinfruits')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Response:', data);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setPopularProducts(data);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setPopularProducts([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching popular products:', error);
        setPopularProducts([]);
      });
  }, []);

  return (
    <>
      <div id="popular-sections" className='background'>
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
              style={{ fill: "url(#waveGradient)"}}
              transform="scale(1, -1) translate(0, -320)"
            />
          </svg>
        </div>
        <div id="popular-section" className='popular-section'>
          <h1 className='popular-title'>Popular in Fruits</h1>
          <hr className='popular-divider' />
          <div className="popular-products">
            {Array.isArray(popularProducts) && popularProducts.length > 0 ? (
              popularProducts.map((item, i) => (
                <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} stock={item.stock} available={item.available} unit={item.unit} />
              ))
            ) : (
              <p>No popular fruits available at the moment.</p>
            )}
          </div>
        </div>
        <div className='wave-border'>
          <svg
            viewBox="0 0 1200 320"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M0,128 C80,96 160,192 240,192 C320,192 400,96 480,128 C560,160 640,224 720,208 C800,192 880,96 960,96 C1040,96 1120,192 1200,192 L1200,320 L0,320 Z"
              style={{ fill: "url(#waveGradient)" }}
            />
          </svg>
        </div>
      </div>
    </>
  );
}

export default Popular;
