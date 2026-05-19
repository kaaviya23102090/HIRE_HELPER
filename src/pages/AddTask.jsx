import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '../components/Primitives';
import { useNavigate } from 'react-router-dom';
import { Image, X, Clock, Calendar, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const AddTask = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', price: '',
    startDate: '', startTime: '', endTime: '', picture: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, picture: reader.result });
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to post a task.");

    setLoading(true);
    try {
      // Real implementation: Storing in Firestore 'tasks'
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'open'
      });
      
      setIsSuccess(true);
      setTimeout(() => {
          setLoading(false);
          setIsSuccess(false);
          navigate('/');
      }, 1500);
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to publish task: " + err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>Post New Task</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
          Describe the assistance you need. High-quality details attract premium helpers.
        </p>
      </header>

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'var(--surface-container-lowest)', padding: '3.5rem', borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', gap: '2.5rem'
      }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headline)' }}>1. Core Details</h2>
            <Input label="TASK TITLE" placeholder="e.g. Assemble a luxury desk" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            <Input label="DESCRIPTION" placeholder="Provide as much detail as possible..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input label="LOCATION" placeholder="e.g. Midtown Manhattan" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                <Input label="OFFERED PRICE (₹)" type="number" placeholder="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headline)' }}>2. Timing</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Input label="START DATE" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
                <Input label="START TIME" type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required />
            </div>
            <Input label="END TIME (OPTIONAL)" type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-headline)' }}>3. Visual Assistance</h2>
            <div 
                onClick={() => fileInputRef.current.click()}
                style={{ 
                    height: '240px', borderRadius: 'var(--radius-default)', border: '2px dashed var(--outline-variant)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                    gap: '1rem', color: 'var(--on-surface-variant)', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
                }}
            >
                {formData.picture ? (
                    <>
                        <img src={formData.picture} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setFormData({...formData, picture: ''}); }}
                            style={{ position: 'absolute', top: 10, right: 10, padding: 8, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none' }}
                        >
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        <Image size={40} strokeWidth={1} />
                        <span style={{ fontSize: '0.875rem' }}>Click or tap to upload a task picture</span>
                    </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
        </section>

        <Button type="submit" disabled={loading} style={{ height: '3.5rem', fontSize: '1rem', gap: '1rem' }}>
            {isSuccess ? <CheckCircle size={20} /> : null}
            {loading ? (isSuccess ? "Published Successful!" : "Publishing to Firestore...") : 'Publish to Feed'}
        </Button>
      </form>
    </motion.div>
  );
};

export default AddTask;
