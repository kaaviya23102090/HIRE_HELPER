import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Chrome, Loader2, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/Primitives';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError("Invalid credentials. Please verify your email and password.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            await googleSignIn();
            navigate('/');
        } catch (err) {
            setError("Google sign-in was interrupted. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)', 
            padding: '4rem 2rem'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ 
                    width: '100%', maxWidth: '680px', backgroundColor: '#ffffff', padding: '6rem 5rem',
                    borderRadius: '56px', boxShadow: '0 40px 80px -12px rgba(37, 99, 235, 0.1)',
                    textAlign: 'center', border: '1.5px solid rgba(255,255,255,1)'
                }}
            >
                <div style={{ 
                    width: '84px', height: '84px', borderRadius: '26px', 
                    backgroundColor: '#2563eb', margin: '0 auto 3.5rem auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 15px 30px rgba(37, 99, 235, 0.25)'
                }}>
                    <UserCheck size={42} color="white" strokeWidth={2.5} />
                </div>

                <h1 style={{ fontSize: '3.75rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.25rem', letterSpacing: '-0.04em' }}>Welcome Back</h1>
                <p style={{ fontSize: '1.5rem', color: '#64748b', fontWeight: '600', marginBottom: '4.5rem', lineHeight: '1.5' }}>Sign in to your HIRE HELPER account.</p>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '1.125rem', fontWeight: '800', marginBottom: '3.5rem', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <Input 
                            label="EMAIL ADDRESS" 
                            type="email" 
                            placeholder="yourname@gmail.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{ fontSize: '1.375rem', padding: '1.375rem 1.75rem', borderRadius: '20px' }} 
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <Input 
                            label="PASSWORD" 
                            type="password" 
                            placeholder="Enter your secure password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{ fontSize: '1.375rem', padding: '1.375rem 1.75rem', borderRadius: '20px' }} 
                        />
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '-1rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '1.125rem', color: '#2563eb', fontWeight: '800', textDecoration: 'none' }}>Forgot password?</Link>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        style={{ height: '84px', fontSize: '1.5rem', borderRadius: '28px', gap: '1rem' }}
                    >
                        {loading ? <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> : <LogIn size={32} />}
                        {loading ? 'Authenticating...' : 'Sign In Now'}
                    </Button>
                </form>

                <div style={{ margin: '4rem 0', display: 'flex', alignItems: 'center', gap: '2rem', color: '#cbd5e1', fontSize: '1.125rem', fontWeight: '900', letterSpacing: '0.08em' }}>
                    <div style={{ flex: 1, height: '2px', backgroundColor: '#f1f5f9' }}></div>
                    SOCIAL LOGIN
                    <div style={{ flex: 1, height: '2px', backgroundColor: '#f1f5f9' }}></div>
                </div>

                <Button 
                    onClick={handleGoogleSignIn} 
                    disabled={googleLoading}
                    variant="secondary" 
                    type="button" 
                    style={{ 
                        width: '100%', height: '84px', fontSize: '1.375rem', borderRadius: '28px',
                        backgroundColor: '#ffffff', color: '#1e293b', border: '3px solid #f1f5f9',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.03)'
                    }}
                >
                    <Chrome size={32} color="#4285F4" />
                    Connect with Google
                </Button>

                <p style={{ marginTop: '5rem', color: '#64748b', fontSize: '1.375rem', fontWeight: '700' }}>
                    New to HIRE HELPER? <Link to="/register" style={{ color: '#2563eb', fontWeight: '900', textDecoration: 'none', borderBottom: '2px solid rgba(37,99,235,0.2)' }}>Create an account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
