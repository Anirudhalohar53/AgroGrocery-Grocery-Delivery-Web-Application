import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
  const [image,setImage]=useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image:"",
    category:"Fruits",
    new_price:"",
    old_price:"",
    description:"",
  })
  const imageHandler =(e)=>{
      setImage(e.target.files[0]);
  }

  const changHandler =(e)=>{
      setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }

  const Add_Product=async ()=>{
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();;
    formData.append('product',image);

    await fetch('http://localhost:8081/api/upload',{
      method:'POST',
      headers:{
        Accept:'application/json',
      },
      body:formData,
    }).then((resp)=>resp.json()).then((data)=>{responseData=data});

    if(responseData.success){
      product.image=responseData.image_url;
      console.log(product);
      await fetch('http://localhost:8081/api/addproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify(product),
      }).then((resp)=>resp.json()).then((data)=>{
        if(data.success){
          alert("Product Added Successfully!");
          // Reset form after successful addition
          setProductDetails({
            name: "",
            image:"",
            category:"Fruits",
            new_price:"",
            old_price:"",
            description:"",
          });
          setImage(false);
          // Reset file input
          document.getElementById('file-input').value = '';
        } else {
          alert("Failed to Add Product");
        }
      })
    } else {
      alert("Failed to upload image");
    }
  }


  return (
    <div className='add-product'>
      <h2>Add New Product</h2>
      <div className="addproduct-form-container">
        <div className="image-upload-section">
          <div className="image-upload-info">
            <div className="addproduct-itemfield">
              <p>Product Image</p>
              <label htmlFor="file-input" className="upload-label">
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="Upload product" />
                <span className="upload-text">Click to upload image</span>
              </label>
              <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
            </div>
          </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={productDetails.name} onChange={changHandler} type="text" name='name' placeholder='Enter product name'/>
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <p>Price</p>
              <input value={productDetails.old_price} onChange={changHandler} type="text" name='old_price' placeholder='Enter original price' />
          </div>
          <div className="addproduct-itemfield">
            <p>Offer Price</p>
              <input value={productDetails.new_price} onChange={changHandler} type="text" name='new_price' placeholder='Enter sale price' />
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p>Product Category</p>
          <select value={productDetails.category} onChange={changHandler} name="category" className='add-product-selector'>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            {/* <option value="HouseHolds">HouseHolds</option> */}
          </select>
        </div>
        <div className='addproduct-itemfield'>
          <p>Product Description</p>
          <textarea className='text-area' value={productDetails.description} onChange={changHandler} name='description' placeholder='Enter product description' />
        </div>
        <div className="addproduct-button-container">
          <button onClick={()=>{Add_Product()}} className='addproduct-btn'>Add Product</button>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
