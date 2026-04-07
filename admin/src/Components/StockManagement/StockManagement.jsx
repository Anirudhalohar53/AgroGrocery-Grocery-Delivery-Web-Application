import React, { useState, useEffect } from 'react'
import './StockManagement.css'

const StockManagement = () => {
  const [products, setProducts] = useState([])
  const [editingStock, setEditingStock] = useState(null)
  const [newStock, setNewStock] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [stockStats, setStockStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalStockValue: 0
  })

  useEffect(() => {
    fetchProducts()
    fetchStockStatus()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/allproducts')
      const data = await response.json()
      const productsWithStock = data.map(product => ({
        ...product,
        id: product.productId,
        stock: product.stock || 0,
        lowStockThreshold: 20
      }))
      setProducts(productsWithStock)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchStockStatus = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/stockstatus')
      const data = await response.json()
      if (data.success) {
        setStockStats({
          totalProducts: data.totalProducts,
          lowStockItems: data.lowStockItems,
          totalStockValue: data.totalStockValue
        })
      }
    } catch (error) {
      console.error('Error fetching stock status:', error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...new Set(products.map(product => product.category))]

  const handleStockUpdate = async (productId) => {
    if (newStock && !isNaN(newStock) && Number(newStock) >= 0) {
      try {
        const response = await fetch('http://localhost:8081/api/updatestock', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: productId,
            stock: Number(newStock)
          })
        })
        
        const data = await response.json()
        if (data.success) {
          setProducts(products.map(product => 
            product.id === productId 
              ? { ...product, stock: Number(newStock) }
              : product
          ))
          fetchStockStatus()
          setEditingStock(null)
          setNewStock('')
        } else {
          console.error('Error updating stock:', data.message)
        }
      } catch (error) {
        console.error('Error updating stock:', error)
      }
    }
  }

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return { status: 'Out of Stock', color: '#dc3545' }
    if (stock <= threshold) return { status: 'Low Stock', color: '#ffc107' }
    return { status: 'In Stock', color: '#28a745' }
  }

  const getTotalStockValue = () => {
    return stockStats.totalStockValue.toFixed(2)
  }

  const getLowStockProducts = () => {
    return stockStats.lowStockItems
  }

  return (
    <div className='stock-management'>
      <div className='stock-header'>
        <h1>Stock Management</h1>
        <div className='stock-stats'>
          <div className='stat-card'>
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>
          <div className='stat-card'>
            <h3>Low Stock Items</h3>
            <p>{getLowStockProducts()}</p>
          </div>
          <div className='stat-card'>
            <h3>Total Stock Value</h3>
            <p>₹{getTotalStockValue()}</p>
          </div>
        </div>
      </div>

      <div className='stock-filters'>
        <input
          type='text'
          placeholder='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-input'
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='category-filter'
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className='stock-table-container'>
        <table className='stock-table'>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Stock Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stock, product.lowStockThreshold)
              const stockValue = (product.stock * product.new_price).toFixed(2)
              
              return (
                <tr key={product.id} className={product.stock <= product.lowStockThreshold ? 'low-stock-row' : ''}>
                  <td>{product.id}</td>
                  <td>
                    <div className='product-info'>
                      <img src={product.image} alt={product.name} className='product-thumb' />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    {editingStock === product.id ? (
                      <div className='stock-edit'>
                        <input
                          type='number'
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          placeholder='Enter stock'
                          min='0'
                          className='stock-input'
                        />
                        <button 
                          onClick={() => handleStockUpdate(product.id)}
                          className='save-btn'
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => {
                            setEditingStock(null)
                            setNewStock('')
                          }}
                          className='cancel-btn'
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className='stock-quantity'>{product.stock}</span>
                    )}
                  </td>
                  <td>₹{product.new_price}</td>
                  <td>
                    <span className='stock-status' style={{ color: stockStatus.color }}>
                      {stockStatus.status}
                    </span>
                  </td>
                  <td>₹{stockValue}</td>
                  <td>
                    <button 
                      onClick={() => {
                        setEditingStock(product.id)
                        setNewStock(product.stock.toString())
                      }}
                      className='edit-stock-btn'
                      disabled={editingStock !== null}
                    >
                      Edit Stock
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className='no-products'>
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default StockManagement
