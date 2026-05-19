import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, Star, IndianRupee, Loader2, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Button } from '../components/Primitives';

const TaskCard = ({ task, onSendRequest }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleRequest = async () => {
      setSending(true);
      const success = await onSendRequest(task);
      setSending(false);
      if (success) {
          setSent(true);
          setTimeout(() => setSent(false), 3000);
      }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      style={{ 
          backgroundColor: 'white', overflow: 'hidden', borderRadius: '32px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column',
          border: '1px solid rgba(0,0,0,0.05)', transition: 'transform 0.2s'
      }}
      whileHover={{ y: -5 }}
    >
      <div style={{ height: '220px', position: 'relative', background: '#f1f5f9' }}>
        {task.picture ? (
            <img src={task.picture} alt={task.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Task Image Not Provided</div>
        )}
        <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', padding: '0.5rem 1rem', borderRadius: '14px', backgroundColor: 'rgba(37, 99, 235, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: '800', backdropFilter: 'blur(8px)', boxDecorationBreak: 'clone' }}>
            {task.category || 'GENERAL'}
        </div>
        <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', padding: '0.75rem 1.25rem', borderRadius: '18px', backgroundColor: '#fff', color: '#1e293b', fontWeight: '900', fontSize: '1.125rem', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            ₹{task.price}
        </div>
      </div>

      <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', marginBottom: '0.5rem' }}>
                <Star size={16} fill="#f59e0b" /> <span style={{ fontSize: '0.875rem', fontWeight: '800' }}>4.8 (NEW)</span>
            </div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: '900', color: '#1e293b', lineHeight: '1.3' }}>{task.title}</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: '#64748b', fontSize: '0.875rem', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="#2563eb" /> {task.location}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} color="#2563eb" /> {task.startDate}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} color="#2563eb" /> {task.startTime}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IndianRupee size={16} color="#2563eb" /> Fixed Price</div>
        </div>

        <Button 
            onClick={handleRequest}
            disabled={sending || sent}
            variant="primary" 
            style={{ 
                marginTop: 'auto', height: '56px', borderRadius: '18px', fontSize: '1rem', fontWeight: '800',
                backgroundColor: sent ? '#10b981' : '#2563eb',
                boxShadow: sent ? 'none' : '0 8px 24px rgba(37, 99, 235, 0.25)'
            }}
        >
            {sending ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> : (sent ? <CheckCircle2 size={22} /> : <Send size={22} />)}
            <span style={{ marginLeft: '12px' }}>{sending ? 'Sending...' : (sent ? 'Request Sent!' : 'Send Request')}</span>
            {!sending && !sent && <ChevronRight size={18} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
        </Button>
      </div>
    </motion.div>
  );
};

const TaskFeed = () => {
  const { user, profile } = useAuth();
  const { searchQuery } = useUI();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSendRequest = async (task) => {
      if (!user) return false;
      try {
          await addDoc(collection(db, 'requests'), {
              taskId: task.id,
              taskTitle: task.title,
              ownerId: task.userId,
              requesterId: user.uid,
              requesterName: profile?.first_name || 'HireHelper User',
              price: task.price,
              date: new Date().toLocaleDateString(),
              status: 'Pending',
              createdAt: serverTimestamp()
          });
          
          await addDoc(collection(db, 'notifications'), {
              userId: task.userId,
              title: "New Help Request!",
              message: `${profile?.first_name || 'Someone'} requested to help with "${task.title}".`,
              read: false,
              link: '/requests',
              createdAt: serverTimestamp()
          });

          return true;
      } catch (err) {
          console.error("Request Error:", err);
          return false;
      }
  };

  // 1. Implementation of real-time search filtering
  const filteredTasks = tasks.filter(task => {
      const query = searchQuery.toLowerCase();
      return (
          task.title.toLowerCase().includes(query) ||
          task.category?.toLowerCase().includes(query) ||
          task.location?.toLowerCase().includes(query)
      );
  });

  return (
    <div style={{ margin: '0' }}>
      <header style={{ marginBottom: '3.5rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Available Tasks</h1>
        <p style={{ color: '#64748b', fontSize: '1.125rem', fontWeight: '500' }}>
            Discover and apply for help requests in your local area. 🌍
        </p>
      </header>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0' }}>
          <Loader2 size={64} style={{ animation: 'spin 1.2s linear infinite' }} color="#2563eb" />
          <p style={{ marginTop: '1.5rem', color: '#64748b', fontWeight: '700' }}>Synchronizing tasks...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '3rem' }}>
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onSendRequest={handleSendRequest} />
            ))}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ gridColumn: '1 / -1', padding: '12rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '40px', border: '2px dashed #e2e8f0' }}
              >
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <Search size={56} color="#cbd5e1" />
                    <div>
                        <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem' }}>No results found for "{searchQuery}"</p>
                        <p style={{ fontSize: '1rem', color: '#64748b' }}>Try adjusting your keywords or category filters.</p>
                    </div>
                </div>
              </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFeed;
