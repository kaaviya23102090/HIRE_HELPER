import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useUI } from '../context/UIContext';
import { LayoutDashboard, PlusCircle, Settings as SettingsIcon, LogOut, User, Activity, Inbox as InboxIcon, Bell, Search, ChevronDown } from 'lucide-react';

const Header = () => {
    const { user, profile, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const { searchQuery, setSearchQuery } = useUI();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
    const navigate = useNavigate();
    
    // Refs for outside click handling
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileMenuOpen(false);
            if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async (e) => {
        e.stopPropagation();
        try {
            await logout();
            navigate('/login');
        } catch (error) { console.error("Logout Error", error); }
    };

    const toggleNotifMenu = () => {
        if (!isNotifMenuOpen) markAllAsRead();
        setIsNotifMenuOpen(!isNotifMenuOpen);
        setIsProfileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
        setIsNotifMenuOpen(false);
    };
    
    return (
        <header style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '1.25rem 0', marginBottom: '2.5rem', gap: '2rem', position: 'relative'
        }}>
            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks by title, category, or location." 
                    style={{ 
                        width: '100%', padding: '0.875rem 1rem 0.875rem 3.5rem', backgroundColor: '#f1f5f9', border: 'none',
                        borderRadius: '16px', fontSize: '1rem', outline: 'none', color: '#1e293b', fontFamily: 'inherit'
                    }}
                />
            </div>

            {/* Right Side Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Notifications Ring */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <div 
                        style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                        onClick={toggleNotifMenu}
                    >
                        <Bell size={20} color={isNotifMenuOpen ? '#2563eb' : '#64748b'} />
                        {unreadCount > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: 'white', minWidth: '18px', height: '18px', padding: '0 4px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: '900', border: '2px solid white', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)' }}>{unreadCount}</span>}
                    </div>

                    {isNotifMenuOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.75rem', minWidth: '340px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', zIndex: 100 }}>
                             <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '900', color: '#1e293b' }}>Recent Activity</h3>
                                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '800' }}>{unreadCount} NEW</span>
                             </div>
                             <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                                {notifications.length > 0 ? notifications.map((n, i) => (
                                    <div key={n.id} onClick={() => { setIsNotifMenuOpen(false); navigate(n.link || '/'); }} style={{ padding: '1.25rem 1.75rem', borderBottom: i < notifications.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', gap: '1rem', cursor: 'pointer', transition: 'background 0.2s', backgroundColor: n.read ? 'transparent' : 'rgba(37, 99, 235, 0.02)' }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(37, 99, 235, 0.02)')}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: n.type === 'request' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(37, 99, 235, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.type === 'request' ? '#10b981' : '#2563eb', flexShrink: 0 }}>{n.type === 'request' ? <User size={20} /> : <Bell size={20} />}</div>
                                        <div>
                                            <div style={{ fontSize: '0.9375rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.2rem' }}>{n.title}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{n.message}</div>
                                        </div>
                                    </div>
                                )) : <div style={{ padding: '3rem 2rem', textAlign: 'center' }}><p style={{ fontSize: '1rem', color: '#94a3b8' }}>No new notifications.</p></div>}
                             </div>
                        </div>
                    )}
                </div>

                {/* Profile Control */}
                <div style={{ position: 'relative' }} ref={profileRef}>
                    <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer', padding: '0.5rem 0.875rem', borderRadius: '16px', backgroundColor: isProfileMenuOpen ? '#f1f5f9' : 'transparent', transition: 'all 0.2s' }} 
                        onClick={toggleProfileMenu}
                        onMouseOver={(e) => !isProfileMenuOpen && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseOut={(e) => !isProfileMenuOpen && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #f1f5f9' }}>
                            <img src={profile?.profile_picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '1rem', fontWeight: '900', color: '#1e293b' }}>{profile?.first_name} {profile?.last_name}</div>
                            <div style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '600' }}>{user?.email}</div>
                        </div>
                        <ChevronDown size={18} color="#64748b" style={{ marginLeft: '4px', transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>

                    {isProfileMenuOpen && (
                        <div style={{ 
                            position: 'absolute', top: '100%', right: 0, marginTop: '0.875rem', minWidth: '220px',
                            backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                            border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', zIndex: 100
                        }}>
                            <Link 
                                to="/settings" 
                                onClick={() => setIsProfileMenuOpen(false)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1.125rem 1.5rem', color: '#334155', textDecoration: 'none', fontSize: '1rem', fontWeight: '800', transition: 'background 0.2s' }} 
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} 
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <SettingsIcon size={20} /> Settings
                            </Link>
                            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }}></div>
                            <button 
                                onClick={handleLogout} 
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1.125rem 1.5rem', color: '#ef4444', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', fontWeight: '800', fontFamily: 'inherit' }} 
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.04)'} 
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <LogOut size={20} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); } catch (error) { console.error(error); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {user && (
        <aside style={{ width: '320px', backgroundColor: '#ffffff', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, height: '100vh', zIndex: 50 }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '3.5rem', color: '#2563eb', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity size={32} strokeWidth={3} /> HireHelper.</h1>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
            {[
                { to: '/', label: 'Global Feed', icon: LayoutDashboard },
                { to: '/my-tasks', label: 'My Published Tasks', icon: Activity },
                { to: '/requests', label: 'Inbox', icon: InboxIcon, badge: unreadCount },
                { to: '/my-requests', label: 'My Requests', icon: User },
                { to: '/add-task', label: 'Add Task', icon: PlusCircle },
                { to: '/settings', label: 'Profile Settings', icon: SettingsIcon },
            ].map(item => (
                <NavLink key={item.to} to={item.to} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: isActive ? '#2563eb' : '#64748b', fontWeight: isActive ? '800' : '600', padding: '1.125rem 1.5rem', borderRadius: '18px', backgroundColor: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent', position: 'relative' })}>
                    <item.icon size={22} /> {item.label}
                    {item.badge > 0 && <span style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#ef4444', color: 'white', fontSize: '0.75rem', fontWeight: '900', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>}
                </NavLink>
            ))}
          </nav>
        </aside>
      )}
      <main style={{ flex: 1, padding: '1rem 4rem 4rem 4rem', overflowY: 'auto' }}>
        {user && <Header />}
        <div style={{ maxWidth: '1400px' }}>{children}</div>
      </main>
    </div>
  );
};
