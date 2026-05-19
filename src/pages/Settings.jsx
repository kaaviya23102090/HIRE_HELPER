import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Wallet, Camera, Phone, Mail, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button, Input } from '../components/Primitives';

const SettingsItem = ({ icon: Icon, title, description }) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', 
    backgroundColor: '#f8fafc', borderRadius: '20px', cursor: 'pointer',
    border: '1px solid rgba(0,0,0,0.03)', transition: 'all 0.2s'
  }}
  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ color: '#2563eb', padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px' }}><Icon size={22} /></div>
      <div>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b' }}>{title}</h4>
        <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>{description}</p>
      </div>
    </div>
    <span style={{ color: '#2563eb', fontSize: '0.8125rem', fontWeight: '800', letterSpacing: '0.02em' }}>EDIT</span>
  </div>
);

const Settings = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync with profile load
  useEffect(() => {
     if (profile) {
         setFormData({
             firstName: profile.first_name || '',
             lastName: profile.last_name || '',
             phone: profile.phone_number || ''
         });
     }
  }, [profile]);

  const handleUpdateProfile = async () => {
      if (!user) return;
      setLoading(true);
      setSuccess(false);

      try {
          await updateDoc(doc(db, 'users', user.uid), {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone_number: formData.phone
          });
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
          alert("Update Error: " + err.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>Your Profile</h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Manage your personal information and preferences for HireHelper.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* User Card */}
        <section style={{ 
            backgroundColor: 'white', borderRadius: '24px', 
            padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '3rem',
            border: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div style={{ position: 'relative' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '32px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                    <img 
                        src={profile?.profile_picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>
                <button style={{ 
                    position: 'absolute', bottom: '-8px', right: '-8px', backgroundColor: '#2563eb', color: 'white',
                    width: '40px', height: '40px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '4px solid #ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}>
                    <Camera size={18} />
                </button>
            </div>
            <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>
                    {profile?.first_name || 'Guest'} {profile?.last_name || 'User'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9375rem', fontWeight: '600' }}>
                        <Mail size={18} color="#2563eb" /> {user?.email}
                    </p>
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#e2e8f0' }}></div>
                    <span style={{ fontSize: '0.8125rem', padding: '0.4rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.05)', color: '#2563eb', fontWeight: '800' }}>VERIFIED ACCOUNT</span>
                </div>
            </div>
        </section>

        {/* Dynamic Edit Form */}
        <section style={{ 
            backgroundColor: 'white', borderRadius: '24px', 
            padding: '4rem 3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '3rem',
            border: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: '800', color: '#1e293b', marginBottom: '2.5rem' }}>Account Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <Input label="FIRST NAME" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    <Input label="LAST NAME" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <Input label="PHONE NUMBER" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                
                <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Button 
                        onClick={handleUpdateProfile}
                        disabled={loading || success}
                        variant="primary" 
                        style={{ 
                            padding: '0.875rem 3rem', 
                            borderRadius: '16px', 
                            fontSize: '1rem',
                            backgroundColor: success ? '#10b981' : '#2563eb',
                            boxShadow: success ? 'none' : '0 8px 24px rgba(37, 99, 235, 0.3)'
                        }}
                    >
                        {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (success ? <CheckCircle2 size={20} /> : <Save size={20} />)}
                        <span style={{ marginLeft: '10px' }}>{loading ? 'Saving...' : (success ? 'Changes Saved' : 'Save Changes')}</span>
                    </Button>
                    
                    {success && <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ color: '#10b981', fontWeight: '700', fontSize: '0.875rem' }}>Profile Synced Successully!</motion.span>}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: '800', color: '#1e293b', marginBottom: '1.25rem' }}>Preferences</h2>
                <SettingsItem icon={Bell} title="Notifications" description="Manage email and dynamic in-app alert settings." />
                <SettingsItem icon={Shield} title="Privacy & Security" description="Password management and authentication logs." />
                <SettingsItem icon={Wallet} title="Payment Methods" description="Securely manage your earnings and payout accounts." />
            </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Settings;
