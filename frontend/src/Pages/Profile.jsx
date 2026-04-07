import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                window.location.replace('/login');
                return;
            }

            const response = await fetch('http://localhost:8081/api/auth/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    address: data.address || ''
                });
                if (data.avatar) {
                    // Construct full URL for avatar if it's a relative path
                    const avatarUrl = data.avatar.startsWith('http') 
                        ? data.avatar 
                        : `http://localhost:8081${data.avatar}`;
                    console.log('Avatar data:', data.avatar);
                    console.log('Avatar URL:', avatarUrl);
                    setAvatarPreview(avatarUrl);
                } else {
                    console.log('No avatar found in user data');
                }
            } else {
                showMessage('Failed to fetch user data', 'error');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage('File size should be less than 5MB', 'error');
                return;
            }
            if (!file.type.startsWith('image/')) {
                showMessage('Please select an image file', 'error');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:8081/api/auth/updateuser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                setUserData(data.user);
                showMessage('Profile updated successfully!', 'success');
            } else {
                showMessage(data.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('New passwords do not match', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage('Password should be at least 6 characters long', 'error');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:8081/api/auth/changepassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }),
            });

            const data = await response.json();
            if (data.success) {
                showMessage('Password updated successfully!', 'success');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                showMessage(data.message || 'Failed to update password', 'error');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) {
            showMessage('Please select an avatar image', 'error');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch('http://localhost:8081/api/auth/uploadavatar', {
                method: 'POST',
                headers: {
                    'auth-token': token,
                },
                body: formData,
            });

            const data = await response.json();
            console.log('Avatar upload response:', data);
            if (data.success) {
                showMessage('Avatar uploaded successfully!', 'success');
                setAvatarFile(null);
                fetchUserData(); // Refresh user data
            } else {
                showMessage(data.message || 'Failed to upload avatar', 'error');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="avatar-section">
                        <div className="avatar-container">
                            <img 
                                src={avatarPreview || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjI1IiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0zMCAxMjVIMTIwVjEwNUMxMjAgOTUgMTA1IDg1IDc1IDg1QzQ1IDg1IDMwIDk1IDMwIDEwNVYxMjVaIiBmaWxsPSIjQ0NDQ0NDIi8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Tm8gQXZhdGFyPC90ZXh0Pgo8L3N2Zz4='} 
                                alt="Profile Avatar" 
                                className="avatar-image"
                            />
                            <button 
                                className="avatar-edit-btn"
                                onClick={() => fileInputRef.current.click()}
                            >
                                📷
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                        {avatarFile && (
                            <div className="avatar-upload-actions">
                                <button 
                                    className="upload-btn"
                                    onClick={handleAvatarUpload}
                                    disabled={loading}
                                >
                                    {loading ? 'Uploading...' : 'Upload Avatar'}
                                </button>
                                <button 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setAvatarFile(null);
                                        setAvatarPreview(userData?.avatar || null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="user-info">
                        <h3>{userData?.name}</h3>
                        <p>{userData?.email}</p>
                        <small>Member since {new Date(userData?.date).toLocaleDateString()}</small>
                    </div>

                    <div className="profile-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            📝 Profile Information
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            🔒 Security
                        </button>
                    </div>
                </div>

                <div className="profile-main">
                    {activeTab === 'profile' && (
                        <div className="profile-form">
                            <h2>Profile Information</h2>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Enter your address"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="security-form">
                            <h2>Change Password</h2>
                            <form onSubmit={handlePasswordUpdate}>
                                <div className="form-group">
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength="6"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
