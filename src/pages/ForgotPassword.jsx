import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/Primitives';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await resetPassword(email);
            setSent(true);
        } catch (err) {
            setError("We couldn't find an account with that email address. Please verify and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%)', // Warn-toned inviting background
            padding: '4rem 2rem'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ 
                    width: '100%', maxWidth: '680px', backgroundColor: '#ffffff', padding: '6rem 5rem',
                    borderRadius: '56px', boxShadow: '0 40px 80px -12px rgba(217, 119, 6, 0.1)',
                    textAlign: 'center', border: '1.5px solid rgba(255,255,255,1)'
                }}
            >
                <div style={{ 
                    width: '84px', height: '84px', borderRadius: '26px', 
                    backgroundColor: sent ? '#10b981' : '#f59e0b', margin: '0 auto 3.5rem auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 15px 30px ${sent ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                    transition: 'all 0.3s'
                }}>
                    {sent ? <CheckCircle2 size={42} color="white" /> : <KeyRound size={42} color="white" strokeWidth={2.5} />}
                </div>

                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.25rem', letterSpacing: '-0.04em' }}>
                    {sent ? 'Check Inbox' : 'Reset Password'}
                </h1>
                <p style={{ fontSize: '1.5rem', color: '#64748b', fontWeight: '600', marginBottom: '4.5rem', lineHeight: '1.5' }}>
                    {sent ? `A secure link has been sent to ${email}` : 'Enter your HIRE HELPER email to recover your account.'}
                </p>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '1.125rem', fontWeight: '800', marginBottom: '3.5rem', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                        {error}
                    </motion.div>
                )}

                {sent ? (
                    <Button 
                        onClick={() => navigate('/login')}
                        style={{ width: '100%', height: '84px', fontSize: '1.5rem', borderRadius: '28px', backgroundColor: '#10b981' }}
                    >
                        Return to Login
                    </Button>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <Input 
                                label="ENTER REGISTERED EMAIL" 
                                type="email" 
                                placeholder="name@email.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                style={{ fontSize: '1.375rem', padding: '1.375rem 1.75rem', borderRadius: '20px' }} 
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading} 
                            style={{ height: '84px', fontSize: '1.5rem', borderRadius: '28px', gap: '1rem', backgroundColor: '#f59e0b', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)' }}
                        >
                            {loading ? <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /> : <Mail size={32} />}
                            {loading ? 'Sending Link...' : 'Send Recovery Link'}
                        </Button>
                    </form>
                )}

                <p style={{ marginTop: '5rem', color: '#64748b', fontSize: '1.375rem', fontWeight: '700' }}>
                    Remember your details? <Link to="/login" style={{ color: '#2563eb', fontWeight: '900', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><ArrowLeft size={20} /> Back to Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
