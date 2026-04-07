import React, { createContext, useEffect, useState, useCallback } from 'react'

// import all_product from '../Assets/all_product'
export const ShopContext=createContext(null);



const getDefaultCart =()=>{
  let cart={};
  for (let index=0; index < 300+1; index++){
    cart[index] = 0;
  }
  return cart;
}

const ShopContextProvider = (props) => {
  const [all_product,setAll_Product] = useState([]);
  const[cartItems,setCartItems] = useState(getDefaultCart());
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(()=>{
    fetch('http://localhost:8081/api/allproducts')
    .then((response)=> {
      console.log('Fetch response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data)=> {
      console.log('Fetch data:', data);
      setAll_Product(data);
    })
    .catch((error)=> {
      console.error('Fetch error:', error);
    });


    //to fetch the the cart item added by the user and he is login again 
    if(localStorage.getItem('auth-token')){
      fetch('http://localhost:8081/api/getcart',{
        method:'POST',
        headers:{
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',

        },
        body:"",
      }).then((response)=> {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data)=> {
        console.log('Cart data:', data);
        setCartItems(data);
      })
      .catch((error)=> {
        console.error('Cart fetch error:', error);
        // Use default cart if authentication fails
      }); 
    }
  },[])

  const addToCart=async (itemId)=>{
    // Update local state immediately for responsive UI
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
    
    if(localStorage.getItem('auth-token')){
      try {
        const response = await fetch('http://localhost:8081/api/addtocart',{
          method:'POST',
          headers:{
            'auth-token':`${localStorage.getItem('auth-token')}`,
            'Content-Type':'application/json',
          },
          body:JSON.stringify({"itemId":itemId}),
        });
        
        if (response.ok) {
          // Fetch updated cart data from backend
          const cartResponse = await fetch('http://localhost:8081/api/getcart',{
            method:'POST',
            headers:{
              'auth-token':`${localStorage.getItem('auth-token')}`,
              'Content-Type':'application/json',
            },
            body:"",
          });
          
          if (cartResponse.ok) {
            const updatedCart = await cartResponse.json();
            console.log('Updated cart from backend:', updatedCart);
            setCartItems(updatedCart);
          }
        } else {
          console.error('Failed to add item to cart');
          // Revert the local state change if backend update failed
          setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Revert the local state change if there's an error
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
      }
    }
    
    setMessage('Product Added to your Cart 🎉');
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  }


  const removeFromCart=async (itemId)=>{
    // Update local state immediately for responsive UI
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
    
    if(localStorage.getItem('auth-token')){
      try {
        const response = await fetch('http://localhost:8081/api/removefromcart',{
          method:'POST',
          headers:{
            'auth-token':`${localStorage.getItem('auth-token')}`,
            'Content-Type':'application/json',
          },
          body:JSON.stringify({"itemId":itemId}),
        });
        
        if (response.ok) {
          // Fetch updated cart data from backend
          const cartResponse = await fetch('http://localhost:8081/api/getcart',{
            method:'POST',
            headers:{
              'auth-token':`${localStorage.getItem('auth-token')}`,
              'Content-Type':'application/json',
            },
            body:"",
          });
          
          if (cartResponse.ok) {
            const updatedCart = await cartResponse.json();
            console.log('Updated cart from backend after removal:', updatedCart);
            setCartItems(updatedCart);
          }
        } else {
          console.error('Failed to remove item from cart');
          // Revert the local state change if backend update failed
          setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        // Revert the local state change if there's an error
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
      }
    }
  }


  // const getTotalCartAmount=()=>{
  //   let totalAmount = 0;
  //   for(const item in cartItems)
  //     {
  //     if(cartItems[item]>0)
  //       {
  //       let itemInfo = all_product.find((product)=>product.id===Number(item))
  //       totalAmount += itemInfo.new_price * cartItems[item];
  //       // console.log(itemInfo)
  //       // console.log(cartItems)
  //       // console.log(all_product)
  //     } 
    
    
  //   }
  //   return totalAmount;
  // }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find(product => product.id === item);
        
        if (itemInfo) {
          if (itemInfo.new_price !== undefined) {
            totalAmount += itemInfo.new_price * cartItems[item];
          } else {
            console.warn(`'new_price' is missing for product with id ${item}`, itemInfo);
          }
        } else {
          console.warn(`Product with id ${item} not found in products list. This might be a deleted product still in cart.`);
        }
      }
    }
    return parseFloat(totalAmount); // Ensure always returns a float
  };

  // Clean up orphaned cart items
  const cleanupOrphanedItems = useCallback(() => {
    const orphanedItems = [];
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find(product => product.id === item);
        if (!itemInfo) {
          orphanedItems.push(item);
        }
      }
    }
    
    if (orphanedItems.length > 0) {
      console.log('Cleaning up orphaned cart items:', orphanedItems);
      const newCart = { ...cartItems };
      orphanedItems.forEach(item => delete newCart[item]);
      setCartItems(newCart);
      
      // Also update localStorage if user is not logged in
      if (!localStorage.getItem('auth-token')) {
        localStorage.setItem('cartItems', JSON.stringify(newCart));
      }
    }
    return orphanedItems;
  }, [all_product, cartItems]);

  useEffect(() => {
    cleanupOrphanedItems();
  }, [all_product]);

  // Immediate cleanup for orphaned items
  useEffect(() => {
    const timer = setTimeout(() => {
      const orphaned = cleanupOrphanedItems();
      if (orphaned.length > 0) {
        console.log('Immediate cleanup completed for:', orphaned);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [cartItems]);

  // Expose cleanup function globally for manual triggering
  useEffect(() => {
    window.cleanupOrphanedCartItems = cleanupOrphanedItems;
    return () => {
      delete window.cleanupOrphanedCartItems;
    };
  }, [cleanupOrphanedItems]);



  const getTotalCartItems=()=>{
    let totalItem=0;
    for(const item in cartItems){
      if(cartItems[item]>0){
        totalItem+=cartItems[item];
      }
    }
    return totalItem;
    }
  const contextValue={getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart,message,showMessage};
  return (
    <ShopContext.Provider value={contextValue}>
     {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;

