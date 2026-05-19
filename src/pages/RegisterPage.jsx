import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Chrome, Loader2, ArrowRight, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/Primitives';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { register, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await register(formData.email, formData.password, {
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.phone
            });
            navigate('/');
        } catch (err) {
            setError("Registration failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await googleSignIn();
            navigate('/');
        } catch (err) {
            setError("Google sign-in error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', // Soft green brand background for success
            padding: '4rem 2rem'
        }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ 
                    width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', padding: '4rem 3.5rem',
                    borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.1)',
                    textAlign: 'center'
                }}
            >
                {/* Success/Green Icon as per Register mockup */}
                <div style={{ 
                    width: '64px', height: '64px', borderRadius: '20px', 
                    backgroundColor: '#10b981', margin: '0 auto 2.5rem auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)'
                }}>
                    <UserCircle2 size={32} color="white" strokeWidth={2.5} />
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Create Account</h1>
                <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: '500', marginBottom: '3.5rem' }}>Join the HIRE HELPER community today.</p>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1rem', borderRadius: '14px', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '0.9375rem', fontWeight: '700', marginBottom: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Input 
                            label="FIRST NAME" placeholder="Kaaviya" 
                            value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                            required style={{ fontSize: '1.125rem', padding: '1rem 1.25rem' }} 
                        />
                        <Input 
                            label="LAST NAME" placeholder="S" 
                            value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                            required style={{ fontSize: '1.125rem', padding: '1rem 1.25rem' }} 
                        />
                    </div>
                    <Input 
                        label="EMAIL ADDRESS" type="email" placeholder="name@example.com" 
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required style={{ fontSize: '1.125rem', padding: '1rem 1.25rem' }} 
                    />
                    <Input 
                        label="PHONE NUMBER (OPTIONAL)" placeholder="10-digit number" 
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        style={{ fontSize: '1.125rem', padding: '1rem 1.25rem' }} 
                    />
                    <Input 
                        label="PASSWORD" type="password" placeholder="Create a password" 
                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required style={{ fontSize: '1.125rem', padding: '1rem 1.25rem' }} 
                    />

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        style={{ height: '64px', fontSize: '1.125rem', borderRadius: '20px', backgroundColor: '#2563eb' }}
                    >
                        {loading ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={24} />}
                        {loading ? 'Creating Account...' : 'Create Account'}
                        {!loading && <ArrowRight size={20} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                    </Button>
                </form>

                <div style={{ margin: '2.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '700' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                    OR JOIN WITH
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                <Button 
                    onClick={handleGoogleSignIn} 
                    type="button" 
                    variant="secondary" 
                    style={{ 
                        width: '100%', height: '64px', fontSize: '1.125rem', borderRadius: '20px',
                        backgroundColor: '#ffffff', color: '#1e293b', border: '2px solid #f1f5f9'
                    }}
                >
                    <Chrome size={24} color="#4285F4" />
                    Sign up with Google
                </Button>

                <p style={{ marginTop: '3.5rem', color: '#64748b', fontSize: '1.125rem', fontWeight: '600' }}>
                    Already have an account? <Link to="/login" style={{ color: '#2563eb', fontWeight: '800', textDecoration: 'none' }}>Log in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
