import React, { useContext } from 'react'
import { ShopContext } from '../Components/Context/ShopContext'
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Item/Item'
import '../Pages/ShopCategory.css'

const ShopCateogary = (props) => {
  const {all_product}=useContext(ShopContext)  
  
  
  return (
    <div>
      <img className='responsive-img display-block m-auto h-[40vh] object-cover mb-10' src={props.banner} alt="" />
      <div className='filter-section'>
        <p className='product-count'>
          <span className='font-semibold'>12 Showing </span>out of {all_product.length} products
        </p>
        <div className='sort-dropdown'>
          sort by <img className='h-[1vh] mt-[1.3vh]' src={dropdown_icon} alt="" />
        </div>
      </div>
    <div className='main-div bg-no-repeat bg-cover'>
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
            style={{ fill: "url(#waveGradient)"  }} // Same wave color here
            transform="scale(1, -1) translate(0, -320)" // Flip vertically
          />
        </svg>
      </div>
      
      <div className=' pl-4 sm:pl-6 md:pl-8 lg:pl-8 pt-2 shopcategory-products grid gap-4 sm:gap-6 md:gap-8 lg:gap-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
    
        {all_product.map((item,i)=>{
          if(props.category===item.category){
            return <Item  key={i} id ={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            
          }
          else{
            return null
          }
          
        })}
        
        
      </div>
      <div className='wave-border'>
        <svg
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path
          d="M0,128 C80,96 160,192 240,192 C320,192 400,96 480,128 C560,160 640,224 720,208 C800,192 880,96 960,96 C1040,96 1120,192 1200,192 L1200,320 L0,320 Z"
          style={{ fill:"url(#waveGradient)"  }}
        />
      </svg>
        </div>
      </div>
      <div className="loadmore mb-10 flex justify-center items-center mx-auto mt-[8vh] w-[200px] sm:w-[233px] h-[60px] sm:h-[69px] rounded-2xl bg-[#ededed] text-[#787878] text-[16px] sm:text-[18px] font-medium">
        Explore More
      </div>
      
    </div>
  )
}

export default ShopCateogary