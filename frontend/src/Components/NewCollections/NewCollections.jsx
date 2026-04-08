import React, { useEffect, useState, useRef } from 'react';
import './NewCollections.css';
import '../../Pages/ShopCategory.css';
import Item from '../Item/Item';

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8081/api/newcollections')
      .then((response) => response.json())
      .then((data) => {
        setNew_collection(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching new collections:', error);
        setLoading(false);
      });
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const LoadingSkeleton = () => (
    <div className='shopcategory-products grid gap-4 sm:gap-6 md:gap-8 lg:gap-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
      {[...Array(5)].map((_, index) => (
        <div key={index}>
          <div className='card h-100'>
            <div className='skeleton-image'></div>
            <div className='card-body'>
              <div className='skeleton-text skeleton-title'></div>
              <div className='skeleton-text skeleton-price'></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className='wave-border' id='latest-collection'>
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
      <div className='new-collections bg-gradient-to-br from-green-50 via-green-100 to-green-200 py-5'>
        <h1 className='text-center mb-4'>NEWLY ADDED</h1>
        <hr className='w-25 mx-auto mb-5' />
        <div className='collections-container'>
          {/* Scroll Buttons */}
          <button 
            className='scroll-btn scroll-btn-left' 
            onClick={scrollLeft}
            aria-label='Scroll left'
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M15 18l-6-6 6-6'/>
            </svg>
          </button>
          
          <button 
            className='scroll-btn scroll-btn-right' 
            onClick={scrollRight}
            aria-label='Scroll right'
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M9 18l6-6-6-6'/>
            </svg>
          </button>

          {/* Scrollable Container */}
          <div className='collections-scroll' ref={scrollContainerRef}>
            <div className='collections'>
              {loading ? (
                <LoadingSkeleton />
              ) : new_collection.length > 0 ? (
                <div className='shopcategory-products grid gap-4 sm:gap-6 md:gap-8 lg:gap-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
                  {new_collection.map((item, i) => (
                    <div key={i}>
                      <Item 
                        id={item.id} 
                        name={item.name} 
                        image={item.image} 
                        new_price={item.new_price} 
                        old_price={item.old_price}
                        stock={item.stock}
                        available={item.available}
                        unit={item.unit}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='alert alert-info text-center'>
                  <i className='bi bi-info-circle me-2'></i>
                  No new products available at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="wave-border">
        <svg
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <path
            d="M0,128 C80,96 160,192 240,192 C320,192 400,96 480,128 C560,160 640,224 720,208 C800,192 880,96 960,96 C1040,96 1120,192 1200,192 L1200,320 L0,320 Z"
            style={{ fill: "url(#waveGradient)" }}
            transform="scale(1, -1) translate(0, -320)"
          />
        </svg>
      </div>
    </>
  );
};

export default NewCollections;
