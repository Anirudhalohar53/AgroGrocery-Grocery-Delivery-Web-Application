
import './App.css';
import Navbar from './Components/NavBar/Navbar';
import SearchResults from './Components/SearchResults/SearchResults';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCateogary from './Pages/ShopCateogary';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import ScrollToTop from './Pages/ScrollToTop';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';


import LoginSignup from './Pages/LoginSignup';
import Profile from './Pages/Profile';
import DairyEssentials from './Pages/DairyEssentials';
import men_banner from './Components/Assets/banner_mens.jpg' ;
import women_banner from './Components/Assets/banner_women.png' 
import kid_banner from './Components/Assets/banner_kids.png'
import dairy_banner from './Components/Assets/banner5.jpg'
import Footer from './Components/Footer/Footer';
import PlaceOrder from './Components/PlaceOrder/PlaceOrder';
import Verify from './Pages/Verify/Verify';
import MyOrders from './Pages/MyOrders/MyOrders';

function App() {
  return (
    <div >
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <ScrollToTop />
      <Routes>
      
                <Route path="/search" element={<SearchResults />} />
        <Route path='/' element={<Shop/>}/>
        <Route path='/Fruits' element={<ShopCateogary banner={men_banner} category="Fruits"/>}/>
        {/* <Route path='/ColdDrinks' element={<ShopCateogary banner={women_banner} category="ColdDrinks"/>}/> */}
        {/* <Route path='/BreakFast' element={<ShopCateogary banner={kid_banner} cateogary="BreakFast"/>}/> */}
        <Route path='/Vegetables' element={<ShopCateogary banner={women_banner}  category="Vegetables"/>}/>
        {/* <Route path='/HouseHolds' element={<ShopCateogary banner={kid_banner} category="HouseHolds"/>}/> */}
        <Route path='/dairy-essentials' element={<DairyEssentials banner={dairy_banner}/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='/contact' element={<ContactUs/>}/>

        <Route path='/product/:productId' element={<Product/>}/>
        {/* <Route path=':productId' element={<Product/>}/> */}
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/order' element={<PlaceOrder />}/>
        <Route path='/verify' element={<Verify/>}></Route>
        <Route path='/myorders' element={<MyOrders/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
      <Footer/>
      </BrowserRouter>

    </div>
  );
}

export default App;
