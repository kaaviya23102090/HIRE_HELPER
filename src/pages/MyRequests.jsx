import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Search, Loader2, User, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const MyRequests = () => {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
        collection(db, 'requests'), 
        where('requesterId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSentRequests(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted': return { color: '#059669', bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.2)' };
      case 'Declined': return { color: '#dc2626', bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.2)' };
      default: return { color: '#2563eb', bg: 'rgba(37, 99, 235, 0.05)', border: 'rgba(37, 99, 235, 0.2)' };
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1e293b' }}>Sent Requests</h1>
        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
          Track the status of help offers you've sent across HireHelper.
        </p>
      </header>

      {loading ? (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 0' }}>
               <Loader2 size={56} style={{ animation: 'spin 1.2s linear infinite' }} color="#2563eb" />
           </div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {sentRequests.map((req, i) => {
          const status = getStatusStyle(req.status);
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              key={req.id}
              style={{ 
                backgroundColor: 'white', padding: '2rem 2.5rem', borderRadius: '24px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: '1px solid rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                 <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                   <Search size={32} />
                 </div>
                 <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem', color: '#1e293b' }}>{req.taskTitle}</h4>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>Submitted to Task Owner • Offer: ₹{req.price}</p>
                    <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', fontSize: '0.8125rem', color: '#94a3b8', fontWeight: '700' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {req.date}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> Sent 2h ago</div>
                    </div>
                 </div>
              </div>

              <div style={{ 
                color: status.color, 
                fontWeight: '800', padding: '0.75rem 1.75rem', fontSize: '0.875rem',
                backgroundColor: status.bg, borderRadius: '16px', border: `1px solid ${status.border}`,
                display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.02em'
              }}>
                {req.status.toUpperCase()}
                <ChevronRight size={16} style={{ opacity: 0.5 }} />
              </div>
            </motion.div>
          );
        })}
        {sentRequests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '10rem 2rem', backgroundColor: '#f8fafc', borderRadius: '32px', color: '#64748b' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>No requests sent yet.</p>
                <p style={{ fontSize: '0.9375rem' }}>Start browsing the feed to find tasks! 🚀</p>
            </div>
        )}
      </div>
      )}
    </div>
  );
};

export default MyRequests;
