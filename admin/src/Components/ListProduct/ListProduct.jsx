import React, { useEffect, useState } from 'react';
import './ListProduct.css';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    old_price: '',
    new_price: '',
    unit: ''
  });

  const fetchInfo = async () => {
    await fetch('http://localhost:8081/api/allproducts')
      .then((res) => res.json())
      .then((data) => { setAllProducts(data) });
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id, productName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`);
    
    if (confirmDelete) {
      await fetch('http://localhost:8081/api/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: parseInt(id) })
      });
      await fetchInfo();
    }
  }

  const handleEditClick = (product) => {
    setEditProductId(product.productId);
    setEditFormData({
      name: product.name,
      old_price: product.old_price,
      new_price: product.new_price,
      unit: product.unit || 'kg'
    });
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    
    setEditFormData({
      ...editFormData,
      [name]: value
    });
    
    // Debug: Log current state after change
    setTimeout(() => {
      console.log('Updated editFormData:', editFormData);
    }, 100);
  }

  const handleSaveClick = async (id) => {
    // Debug: Check current form data
    console.log('Current editFormData:', editFormData);
    console.log('Unit value being sent:', editFormData.unit);
    
    const updateData = {
      id: parseInt(id),
      name: editFormData.name,
      old_price: editFormData.old_price,
      new_price: editFormData.new_price,
      unit: editFormData.unit
    };
    
    console.log('Final update data being sent:', updateData);
    console.log('Stringified data:', JSON.stringify(updateData));
    
    try {
      const response = await fetch('http://localhost:8081/api/updateproduct', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setEditProductId(null);
        fetchInfo(); // Refresh the list of products
        alert('Product updated successfully! Unit: ' + updateData.unit);
      } else {
        console.error('Update Error:', data.message);
        alert('Failed to update product: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error while updating product: ' + error.message);
    }
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Unit</p>
        <p>Category</p>
        <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className='listproduct-product-icon' />
              {editProductId === product.productId ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="listproduct-edit-input"
                  />
                  <input
                    type="text"
                    name="old_price"
                    value={editFormData.old_price}
                    onChange={handleEditChange}
                    className="listproduct-edit-input"
                  />
                  <input
                    type="text"
                    name="new_price"
                    value={editFormData.new_price}
                    onChange={handleEditChange}
                    className="listproduct-edit-input"
                  />
                  <select
                    name="unit"
                    value={editFormData.unit}
                    onChange={handleEditChange}
                    className="listproduct-edit-select"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="pcs">pcs</option>
                    <option value="dozen">dozen</option>
                    <option value="liter">liter</option>
                    <option value="ml">ml</option>
                    <option value="pack">pack</option>
                    <option value="bottle">bottle</option>
                  </select>
                  <button onClick={() => handleSaveClick(product.productId)} className="listproduct-save-button">Save</button>
                </>
              ) : (
                <>
                  <p>{product.name}</p>
                  <p>₹{product.old_price}</p>
                  <p>₹{product.new_price}</p>
                  <p className="unit-display">{product.unit || 'kg'}</p>
                </>
              )}
              <p>{product.category}</p>
              <div className="listproduct-actions">
                <button onClick={() => handleEditClick(product)} className={`listproduct-edit-button ${editProductId === product.productId ? 'hidden' : ''}`}>Edit</button>
                {editProductId === product.productId && <button onClick={() => setEditProductId(null)} className="listproduct-cancel-button">Cancel</button>}
                <button 
                  onClick={() => { remove_product(product.productId, product.name) }} 
                  className='listproduct-remove-button'
                  title="Delete Product"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default ListProduct;
