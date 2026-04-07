import React, { useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios';
import parcel from '../../Components/Assets/parcel_icon.png'
const MyOrders = () => {

    const [data, setData] = useState([]);

    const fetchOrders=async()=>{
        const response = await axios.post("http://localhost:8081/api/userorders",{},{headers:{
            'auth-token':`${localStorage.getItem('auth-token')}`,
            'Content-Type': 'application/json',
        }})
        setData(response.data.data); //in auto intellisence in place of 2nd data put orders
       
         
    }

    useEffect(()=>{
        fetchOrders();
    },[])

  return (
    <div className='mt-[20vh] my-orders'>
        <h2 className='order-h2'>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return (
                    <div key={index} className="my-orders-order">
                        <img src={parcel} alt="" />
                        <p>{order.items.map((item,index)=>{
                            if(index===order.items.length-1){
                                return item.name+" x "+item.quantity
                            }
                            else{
                                return item.name+" x "+item.quantity+", "

                            }
                        })}</p>
                        <p>₹{order.amount}.00</p>
                        <p>Items:{order.items.length}</p>
                        <p><span>&#x25cf; </span><b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                )
                
            })}
        </div>
    </div>
  )
}

export default MyOrders
