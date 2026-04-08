import React from 'react'
import Item from '../Item/Item'
import data_product from '../Assets/data'
import './RelatedProducts.css'

const RelatedProducts = () => {
  // Limit to 8 related products for better performance and layout
  const relatedProducts = data_product.slice(0, 8);

  return (
    <section className='related-products-section' aria-labelledby='related-products-title'>
      <div className='related-products-container'>
        <h2 id='related-products-title' className='related-products-title'>
          Related Products
        </h2>
        <div className='related-products-divider' role='separator' aria-hidden='true'></div>
        <div className='related-products-grid'>
          {relatedProducts.map((item, index) => (
            <Item 
              key={`${item.id}-${index}`} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price}
              stock={item.stock}
              available={item.available}
              unit={item.unit}
              aria-label={`Product: ${item.name}, Price: ${item.new_price}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts;
