import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, User, Calendar, Clock, Loader2, ChevronRight, UserCheck, UserX } from 'lucide-react';
import { Button } from '../components/Primitives';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Requests = () => {
  const { user } = useAuth();
  const { markAllAsRead } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    markAllAsRead(); 

    const q = query(
        collection(db, 'requests'), 
        where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const reqList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(reqList);
        setLoading(false);
      },
      (err) => {
        setError("Error syncing requests from the cloud.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleAction = async (id, newStatus) => {
    try {
        await updateDoc(doc(db, 'requests', id), { status: newStatus });
    } catch (err) { alert("Update Error: " + err.message); }
  };

  return (
    <div style={{ margin: '0' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b' }}>Requests Received</h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Instantly approve or decline help offers for your listed tasks. 📬
        </p>
      </header>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)', color: '#b91c1c', padding: '1.25rem', borderRadius: '16px', marginBottom: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
           <strong>Sync Alert:</strong> {error}
        </div>
      )}

      {loading ? (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 0' }}>
               <Loader2 size={56} style={{ animation: 'spin 1.2s linear infinite' }} color="#2563eb" />
           </div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {requests.map((req, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            key={req.id}
            style={{ 
              backgroundColor: 'white', padding: '2rem 2.5rem', borderRadius: '24px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                 <User size={32} />
               </div>
               <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '0.4rem', color: '#1e293b' }}>{req.taskTitle}</h4>
                  <p style={{ fontSize: '0.9375rem', color: '#64748b', fontWeight: '600' }}>
                    From <strong>{req.requesterName}</strong> • Offer: ₹{req.price}
                  </p>
                  <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.6rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {req.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> Just now</div>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {req.status === 'Pending' ? (
                <>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAction(req.id, 'Declined')}
                    style={{ 
                        height: '48px', padding: '0 1.5rem', 
                        borderRadius: '24px', fontWeight: '800', 
                        color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)',
                        border: '1.5px solid rgba(239, 68, 68, 0.15)'
                    }}
                  >
                    <UserX size={18} /> Decline
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => handleAction(req.id, 'Accepted')}
                    style={{ 
                        height: '48px', padding: '0 2.25rem', 
                        borderRadius: '24px', fontWeight: '800', 
                        backgroundColor: '#10b981', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',
                        border: 'none'
                    }}
                  >
                    <UserCheck size={18} /> Accept <ChevronRight size={16} />
                  </Button>
                </>
              ) : (
                <div style={{ 
                  color: req.status === 'Accepted' ? '#059669' : '#dc2626', 
                  fontWeight: '800', padding: '0.875rem 2.5rem', fontSize: '0.875rem',
                  backgroundColor: req.status === 'Accepted' ? 'rgba(52, 211, 153, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  borderRadius: '24px', border: `1px solid ${req.status === 'Accepted' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`,
                  letterSpacing: '0.04em'
                }}>
                  {req.status === 'Accepted' ? 'APPROVED' : 'DECLINED'}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {requests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '10rem 2rem', backgroundColor: '#f8fafc', borderRadius: '32px', color: '#64748b' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>No incoming requests yet.</p>
                <p style={{ fontSize: '0.875rem' }}>Your tasks are live—helpers will reach out soon! 🚀</p>
            </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Requests;
