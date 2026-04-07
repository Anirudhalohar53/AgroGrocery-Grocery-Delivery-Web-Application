import React, {useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {

const [searchParams, setsearchParams] = useSearchParams();
const success = searchParams.get("success");
const orderId = searchParams.get("orderId");
const navigate = useNavigate();

const verifyPayment = async() =>{
    const response = await axios.post("http://localhost:8081/api/verify",{success,orderId},{headers:{
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
    }});
    if(response.data.success){
        navigate("/myorders");
    }
    else{
        alert("Failed to verify payment");
        navigate("/");
    }
}

useEffect(()=>{
    verifyPayment();
},[])

console.log(success,orderId);
  return (
    <div className='verify mt-[30vh]'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify
