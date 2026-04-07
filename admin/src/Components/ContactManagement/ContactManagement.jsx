import React, { useState, useEffect } from 'react'
import './ContactManagement.css'

const ContactManagement = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8081/api/contacts')
      
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      } else {
        console.error('Failed to fetch contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8081/api/contacts/${contactId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Refresh contacts list to get updated data
        fetchContacts()
      } else {
        console.error('Failed to update contact status')
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
    }
  }

  const deleteContact = async (contactId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/contacts/${contactId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh contacts list to get updated data
        fetchContacts()
      } else {
        console.error('Failed to delete contact')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading contacts...</div>
  }

  return (
    <div className='contact-management'>
      <h1>Contact Management</h1>
      <div className="contacts-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td className="message-cell">{contact.message}</td>
                <td>{new Date(contact.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${contact.status}`}>
                    {contact.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {contact.status === 'pending' && (
                      <button 
                        onClick={() => updateContactStatus(contact.id, 'resolved')}
                        className="resolve-btn"
                      >
                        Resolve
                      </button>
                    )}
                    {contact.status === 'resolved' && (
                      <button 
                        onClick={() => updateContactStatus(contact.id, 'pending')}
                        className="pending-btn"
                      >
                        Reopen
                      </button>
                    )}
                    <button 
                      onClick={() => deleteContact(contact.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && (
          <div className="no-contacts">No contacts found</div>
        )}
      </div>
    </div>
  )
}

export default ContactManagement
