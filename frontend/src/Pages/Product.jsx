import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../Components/Context/ShopContext'
import {useParams} from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';



const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId}=useParams();
  const product = all_product.find((e)=>e.id===productId || e.productId===Number(productId));

  useEffect(() => {
    // Check if we need to scroll to top (from item click)
    const shouldScrollToTop = sessionStorage.getItem('scrollToTop') === 'true';
    
    if (shouldScrollToTop) {
      // Clear the flag immediately
      sessionStorage.removeItem('scrollToTop');
      
      // Force scroll to top with multiple attempts
      const forceScrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      forceScrollToTop();
      
      // Additional fallback scrolls
      const timeout1 = setTimeout(forceScrollToTop, 0);
      const timeout2 = setTimeout(forceScrollToTop, 50);
      const timeout3 = setTimeout(forceScrollToTop, 100);
      
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
      };
    }
  }, [productId]);
 
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrum product ={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox productId={product.productId || product.id} />
      <RelatedProducts />
    </div>
  )
}

export default Product