import React, { useContext, useEffect, useState, useRef } from 'react';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import user_icon from '../Assets/user_icon1.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faShoppingCart, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
    const [menu, setMenu] = useState("shop");
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', address: '' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { getTotalCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const dropdownTimeoutRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            fetch('http://localhost:8081/api/auth/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            })
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                setFormData({ name: data.name, email: data.email, address: data.address });
                
                // Construct full avatar URL if needed
                if (data.avatar) {
                    const avatarUrl = data.avatar.startsWith('http') 
                        ? data.avatar 
                        : `http://localhost:8081${data.avatar}`;
                    setUserData(prevData => ({ ...prevData, avatar: avatarUrl }));
                }
            })
            .catch(error => console.error('Error fetching user data:', error));
        }

        // Handle window resize
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (showUserProfile) {
            // Clear any existing timeout
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
            }
            
            // Set new timeout to hide dropdown after 3 seconds
            dropdownTimeoutRef.current = setTimeout(() => {
                setShowUserProfile(false);
            }, 3000);
        } else {
            // Clear timeout if dropdown is manually closed
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
            }
        }

        // Cleanup function
        return () => {
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
            }
        };
    }, [showUserProfile]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth-token');
        fetch('http://localhost:8081/api/auth/updateuser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token,
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUserData(data.user);
                setEditMode(false);
            }
        })
        .catch(error => console.error('Error updating user profile:', error));
    };

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        window.location.replace('/');
    };

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
    };

    const resetDropdownTimer = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        dropdownTimeoutRef.current = setTimeout(() => {
            setShowUserProfile(false);
        }, 3000);
    };

    const handleDropdownMouseEnter = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
    };

    const handleDropdownMouseLeave = () => {
        resetDropdownTimer();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div style={{ 
            background: 'linear-gradient(135deg, #28a745 0%, #5cb85c 100%)', 
            boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)', 
            position: 'sticky', 
            top: '0', 
            zIndex: '1000',
            width: '100%'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
                flexWrap: 'wrap'
            }}>
                {/* Logo */}
                <Link to='/' onClick={() => { handleMenuClick("shop"); closeMobileMenu(); }} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    textDecoration: 'none', 
                    color: 'white',
                    outline: 'none',
                    boxShadow: 'none',
                    border: 'none'
                }}>
                    <img src={logo} alt="GrocerEase Logo" style={{ 
                        width: isMobile ? '35px' : '40px', 
                        height: isMobile ? '35px' : '40px', 
                        marginRight: '10px',
                        outline: 'none',
                        boxShadow: 'none',
                        border: 'none'
                    }} />
                    <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        outline: 'none',
                        boxShadow: 'none',
                        color: 'white'
                    }}>AgroGrocery</span>
                </Link>

                {/* Desktop Navigation Menu */}
                {!isMobile && (
                    <div style={{ 
                        display: 'flex', 
                        gap: '1.5rem', 
                        alignItems: 'center'
                    }}>
                    <Link 
                        to='/' 
                        onClick={() => handleMenuClick("shop")}
                        style={{ 
                            textDecoration: 'none', 
                            color: menu === "shop" ? '#fff' : 'rgba(255,255,255,0.9)',
                            fontWeight: menu === "shop" ? 'bold' : 'normal',
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                            textShadow: menu === "shop" ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                            backgroundColor: menu === "shop" ? 'rgba(255,255,255,0.2)' : 'transparent',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Shop
                    </Link>
                    <Link 
                        to='/Fruits' 
                        onClick={() => handleMenuClick("Fruits")}
                        style={{ 
                            textDecoration: 'none', 
                            color: menu === "Fruits" ? '#fff' : 'rgba(255,255,255,0.9)',
                            fontWeight: menu === "Fruits" ? 'bold' : 'normal',
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                            textShadow: menu === "Fruits" ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                            backgroundColor: menu === "Fruits" ? 'rgba(255,255,255,0.2)' : 'transparent',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Fruits 
                    </Link>
                    <Link 
                        to='/Vegetables' 
                        onClick={() => handleMenuClick("Vegetables")}
                        style={{ 
                            textDecoration: 'none', 
                            color: menu === "Vegetables" ? '#fff' : 'rgba(255,255,255,0.9)',
                            fontWeight: menu === "Vegetables" ? 'bold' : 'normal',
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                            textShadow: menu === "Vegetables" ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                            backgroundColor: menu === "Vegetables" ? 'rgba(255,255,255,0.2)' : 'transparent',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Vegetables 
                    </Link>
                    <Link 
                        to='/about' 
                        onClick={() => handleMenuClick("About")}
                        style={{ 
                            textDecoration: 'none', 
                            color: menu === "About" ? '#fff' : 'rgba(255,255,255,0.9)',
                            fontWeight: menu === "About" ? 'bold' : 'normal',
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                            textShadow: menu === "About" ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                            backgroundColor: menu === "About" ? 'rgba(255,255,255,0.2)' : 'transparent',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        About Us
                    </Link>
                    <Link 
                        to='/contact' 
                        onClick={() => handleMenuClick("Contact")}
                        style={{ 
                            textDecoration: 'none', 
                            color: menu === "Contact" ? '#fff' : 'rgba(255,255,255,0.9)',
                            fontWeight: menu === "Contact" ? 'bold' : 'normal',
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none',
                            textShadow: menu === "Contact" ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                            backgroundColor: menu === "Contact" ? 'rgba(255,255,255,0.2)' : 'transparent',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Contact
                    </Link>
                </div>
                )}

                {/* Search Bar - Desktop */}
                {!isMobile && (
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            style={{ 
                                padding: '0.5rem 1rem', 
                                border: 'none', 
                                borderRadius: '25px',
                                width: '200px',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                outline: 'none',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                        <button type="submit" style={{ 
                            padding: '0.5rem 1rem', 
                            background: 'linear-gradient(135deg, rgb(34, 79, 241), rgb(86, 24, 127))', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '25px',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: 'none',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                )}

                {/* User Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem' }}>
                    {/* Mobile Menu Toggle */}
                    {isMobile && (
                        <button
                            onClick={toggleMobileMenu}
                            style={{ 
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                outline: 'none',
                                boxShadow: 'none'
                            }}
                        >
                            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
                        </button>
                    )}
                    
                    {localStorage.getItem('auth-token') ? 
                        <>
                            {/* User Profile */}
                            <div style={{ position: 'relative' }}>
                                <img 
                                    src={userData?.avatar || user_icon} 
                                    alt="User Profile" 
                                    style={{ 
                                        width: isMobile ? '30px' : '35px', 
                                        height: isMobile ? '30px' : '35px', 
                                        borderRadius: '50%', 
                                        border: '2px solid white',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                        transition: 'transform 0.3s ease',
                                        objectFit: 'cover'
                                    }}
                                    onClick={() => setShowUserProfile(!showUserProfile)}
                                    onMouseEnter={handleDropdownMouseEnter}
                                />
                                
                                {/* User Profile Dropdown */}
                                {showUserProfile && userData && (
                                    <div 
                                        style={{ 
                                            position: 'absolute', 
                                            right: '0', 
                                            top: '100%', 
                                            marginTop: '0.5rem', 
                                            width: isMobile ? '200px' : '250px', 
                                            backgroundColor: 'white', 
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)', 
                                            borderRadius: '12px', 
                                            padding: isMobile ? '0.75rem' : '1rem', 
                                            border: 'none',
                                            zIndex: '1000'
                                        }}
                                        onMouseEnter={handleDropdownMouseEnter}
                                        onMouseLeave={handleDropdownMouseLeave}
                                    >
                                        <div style={{ textAlign: 'center', marginBottom: isMobile ? '0.75rem' : '1rem' }}>
                                            <img 
                                                src={userData?.avatar || user_icon} 
                                                alt="User Profile" 
                                                style={{ 
                                                    width: isMobile ? '35px' : '40px', 
                                                    height: isMobile ? '35px' : '40px', 
                                                    borderRadius: '50%', 
                                                    marginBottom: '0.5rem',
                                                    objectFit: 'cover'
                                                }} 
                                            />
                                            <div>
                                                <strong style={{ color: '#171717', fontSize: isMobile ? '0.9rem' : '1rem' }}>{userData.name}</strong>
                                                <br />
                                                <small style={{ color: '#666', fontSize: isMobile ? '0.75rem' : '0.8rem' }}>{userData.email}</small>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <Link to='/profile' style={{ 
                                                textDecoration: 'none', 
                                                color: 'white',
                                                outline: 'none',
                                                boxShadow: 'none',
                                                border: 'none'
                                            }}>
                                                <button style={{ 
                                                    width: '100%', 
                                                    padding: isMobile ? '0.4rem' : '0.5rem', 
                                                    background: 'linear-gradient(135deg, #17a2b8, #138496)', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                    fontWeight: '600',
                                                    fontSize: isMobile ? '0.85rem' : '0.9rem'
                                                }}>
                                                    My Profile
                                                </button>
                                            </Link>
                                            <Link to='/myorders' style={{ 
                                                textDecoration: 'none', 
                                                color: 'white',
                                                outline: 'none',
                                                boxShadow: 'none',
                                                border: 'none'
                                            }}>
                                                <button style={{ 
                                                    width: '100%', 
                                                    padding: isMobile ? '0.4rem' : '0.5rem', 
                                                    background: 'linear-gradient(135deg, #28a745, #20c997)', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                    fontWeight: '600',
                                                    fontSize: isMobile ? '0.85rem' : '0.9rem'
                                                }}>
                                                    My Orders
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={handleLogout} 
                                                style={{ 
                                                    width: '100%', 
                                                    padding: isMobile ? '0.4rem' : '0.5rem', 
                                                    background: 'linear-gradient(135deg, #dc3545, #c82333)', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                    fontWeight: '600',
                                                    fontSize: isMobile ? '0.85rem' : '0.9rem'
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <Link to='/cart' style={{ 
                                textDecoration: 'none', 
                                position: 'relative',
                                outline: 'none',
                                boxShadow: 'none',
                                border: 'none'
                            }}>
                                <img src={cart_icon} alt="Cart" style={{ 
                                    width: isMobile ? '20px' : '25px', 
                                    height: isMobile ? '20px' : '25px',
                                    filter: 'brightness(0) invert(1)' // Makes icon white
                                }} />
                                <span style={{ 
                                    position: 'absolute', 
                                    top: isMobile ? '-6px' : '-8px', 
                                    right: isMobile ? '-6px' : '-8px', 
                                    background: 'linear-gradient(135deg, #28a745, #5cb85c)', 
                                    color: 'white', 
                                    borderRadius: '50%', 
                                    padding: isMobile ? '1px 4px' : '2px 6px', 
                                    fontSize: isMobile ? '10px' : '12px',
                                    fontWeight: 'bold',
                                    border: '2px solid white'
                                }}>
                                    {getTotalCartItems()}
                                </span>
                            </Link>
                        </>
                        : 
                        <Link to='/login' style={{ 
                            textDecoration: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            border: 'none'
                        }}>
                            <button style={{ 
                                padding: isMobile ? '0.4rem 1rem' : '0.5rem 1.5rem', 
                                background: 'linear-gradient(135deg, rgb(34, 79, 241), rgb(86, 24, 127))', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '25px',
                                cursor: 'pointer',
                                outline: 'none',
                                boxShadow: 'none',
                                fontWeight: '600',
                                fontSize: isMobile ? '0.85rem' : '0.9rem',
                                transition: 'all 0.3s ease'
                            }}>
                                Login
                            </button>
                        </Link>
                    }
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobile && isMobileMenuOpen && (
                <div style={{ 
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    borderTop: '1px solid #eee',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {/* Mobile Search Bar */}
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            style={{ 
                                flex: 1,
                                padding: '0.5rem 1rem', 
                                border: '1px solid #ddd', 
                                borderRadius: '25px',
                                backgroundColor: 'white',
                                outline: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                        <button type="submit" style={{ 
                            padding: '0.5rem 1rem', 
                            background: 'linear-gradient(135deg, rgb(34, 79, 241), rgb(86, 24, 127))', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '25px',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: 'none',
                            fontWeight: '600'
                        }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>

                    {/* Mobile Navigation Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link 
                            to='/' 
                            onClick={() => { handleMenuClick("shop"); closeMobileMenu(); }}
                            style={{ 
                                textDecoration: 'none', 
                                color: menu === "shop" ? '#28a745' : '#333',
                                fontWeight: menu === "shop" ? 'bold' : 'normal',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                backgroundColor: menu === "shop" ? 'rgba(40,167,69,0.1)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Shop
                        </Link>
                        <Link 
                            to='/Fruits' 
                            onClick={() => { handleMenuClick("Fruits"); closeMobileMenu(); }}
                            style={{ 
                                textDecoration: 'none', 
                                color: menu === "Fruits" ? '#28a745' : '#333',
                                fontWeight: menu === "Fruits" ? 'bold' : 'normal',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                backgroundColor: menu === "Fruits" ? 'rgba(40,167,69,0.1)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Fruits
                        </Link>
                        <Link 
                            to='/Vegetables' 
                            onClick={() => { handleMenuClick("Vegetables"); closeMobileMenu(); }}
                            style={{ 
                                textDecoration: 'none', 
                                color: menu === "Vegetables" ? '#28a745' : '#333',
                                fontWeight: menu === "Vegetables" ? 'bold' : 'normal',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                backgroundColor: menu === "Vegetables" ? 'rgba(40,167,69,0.1)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Vegetables 
                        </Link>
                        <Link 
                            to='/about' 
                            onClick={() => { handleMenuClick("About"); closeMobileMenu(); }}
                            style={{ 
                                textDecoration: 'none', 
                                color: menu === "About" ? '#28a745' : '#333',
                                fontWeight: menu === "About" ? 'bold' : 'normal',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                backgroundColor: menu === "About" ? 'rgba(40,167,69,0.1)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            About Us
                        </Link>
                        <Link 
                            to='/contact' 
                            onClick={() => { handleMenuClick("Contact"); closeMobileMenu(); }}
                            style={{ 
                                textDecoration: 'none', 
                                color: menu === "Contact" ? '#28a745' : '#333',
                                fontWeight: menu === "Contact" ? 'bold' : 'normal',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                backgroundColor: menu === "Contact" ? 'rgba(40,167,69,0.1)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editMode && (
                <div style={{ 
                    position: 'fixed', 
                    top: '0', 
                    left: '0', 
                    right: '0', 
                    bottom: '0', 
                    backgroundColor: 'rgba(0,0,0,0.5)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: '2000',
                    padding: isMobile ? '0.5rem' : '1rem'
                }}>
                    <div style={{ 
                        backgroundColor: 'white', 
                        borderRadius: '12px', 
                        padding: isMobile ? '1.5rem' : '2rem', 
                        width: '100%', 
                        maxWidth: isMobile ? '95%' : '400px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ marginBottom: isMobile ? '0.75rem' : '1rem', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>Edit Profile</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: isMobile ? '0.75rem' : '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    style={{ 
                                        width: '100%', 
                                        padding: isMobile ? '0.4rem' : '0.5rem', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '8px',
                                        fontSize: isMobile ? '0.9rem' : '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: isMobile ? '0.75rem' : '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    style={{ 
                                        width: '100%', 
                                        padding: isMobile ? '0.4rem' : '0.5rem', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '8px',
                                        fontSize: isMobile ? '0.9rem' : '1rem'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: isMobile ? '0.75rem' : '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your address"
                                    rows="3"
                                    style={{ 
                                        width: '100%', 
                                        padding: isMobile ? '0.4rem' : '0.5rem', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '8px',
                                        fontSize: isMobile ? '0.9rem' : '1rem',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" style={{ 
                                    flex: 1, 
                                    padding: isMobile ? '0.4rem' : '0.5rem', 
                                    backgroundColor: '#007bff', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    fontWeight: '600'
                                }}>
                                    Save Changes
                                </button>
                                <button type="button" onClick={() => setEditMode(false)} style={{ 
                                    flex: 1, 
                                    padding: isMobile ? '0.4rem' : '0.5rem', 
                                    backgroundColor: '#6c757d', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    fontWeight: '600'
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;
