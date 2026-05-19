import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, MapPin, Edit3, Trash2, Loader2, Star, Plus } from 'lucide-react';
import { Button } from '../components/Primitives';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const MyTasks = () => {
  const { user } = useAuth();
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    const q = query(
        collection(db, 'tasks'), 
        where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedList = list.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setMyTasks(sortedList);
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error in MyTasks:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteTask = async (taskId, e) => {
      e.stopPropagation(); // Prevent any parent click events
      
      const confirmDelete = window.confirm("Are you sure you want to remove this task from the feed permanently?");
      if (!confirmDelete) return;
      
      setDeletingId(taskId);
      try {
          // 1. Delete from Firestore
          await deleteDoc(doc(db, 'tasks', taskId));
          console.log("Task successfully deleted from Firestore:", taskId);
      } catch (err) {
          console.error("Deletion Error:", err);
          alert("Error deleting task: " + err.message);
      } finally {
          setDeletingId(null);
      }
  };

  return (
    <div style={{ margin: '0' }}>
      <header style={{ marginBottom: '3.5rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
            <h1 style={{ fontSize: '2.75rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>My Published Tasks</h1>
            <p style={{ color: '#64748b', fontSize: '1.25rem', fontWeight: '500' }}>
                Your private task library. These will remain live until you delete them. ⚙️
            </p>
        </div>
        <Button onClick={() => navigate('/add-task')} style={{ height: '56px', padding: '0 2.5rem', borderRadius: '18px' }}>
            <Plus size={22} /> Post New Task
        </Button>
      </header>

      {loading ? (
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12rem 0', gap: '2rem' }}>
               <Loader2 size={64} style={{ animation: 'spin 1.2s linear infinite' }} color="#2563eb" />
               <p style={{ color: '#64748b', fontWeight: '800', fontSize: '1.125rem' }}>Fetching your task history...</p>
           </div>
      ) : (
      <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '2.5rem' 
      }}>
        <AnimatePresence mode="popLayout">
            {myTasks.map((task) => (
            <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={{ duration: 0.3 }}
                style={{ 
                    backgroundColor: 'white', overflow: 'hidden', borderRadius: '32px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column',
                    border: '1px solid rgba(0,0,0,0.05)', position: 'relative'
                }}
            >
                {/* Deleting Overlay */}
                {deletingId === task.id && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', borderRadius: '32px' }}>
                        <Loader2 size={48} color="#ef4444" style={{ animation: 'spin 1.2s linear infinite' }} />
                    </div>
                )}

                <div style={{ height: '220px', position: 'relative', background: '#f1f5f9' }}>
                    {task.picture ? (
                    <img src={task.picture} alt={task.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '2rem' }}>📸</div>
                    )}
                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '0.75rem 1.25rem', borderRadius: '16px', backgroundColor: '#fff', color: '#1e293b', fontWeight: '900', fontSize: '1.25rem', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }}>
                        ₹{task.price}
                    </div>
                </div>
                
                <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', lineHeight: '1.4' }}>{task.title}</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', color: '#64748b', fontSize: '0.9375rem', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><MapPin size={18} color="#2563eb" /> {task.location}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Calendar size={18} color="#2563eb" /> {task.startDate}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Clock size={18} color="#2563eb" /> {task.startTime}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b' }}><Star size={18} fill="#f59e0b" /> 4.8 Rating</div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                        <Button variant="secondary" style={{ flex: 1, height: '60px', borderRadius: '20px', fontWeight: '800' }}><Edit3 size={20} /> Manage</Button>
                        <Button 
                            variant="danger" 
                            onClick={(e) => handleDeleteTask(task.id, e)}
                            style={{ 
                                width: '60px', height: '60px', borderRadius: '20px', 
                                transition: 'all 0.2s', padding: 0
                            }}
                        >
                            <Trash2 size={24} />
                        </Button>
                    </div>
                </div>
            </motion.div>
            ))}
        </AnimatePresence>

        {!loading && myTasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1 / -1', padding: '12rem 2rem', textAlign: 'center', border: '3px dashed #f1f5f9', borderRadius: '40px' }}>
                <p style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b', marginBottom: '1rem' }}>Your task feed is empty.</p>
                <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2.5rem' }}>Any tasks you post will be stored here permanently.</p>
                <Button onClick={() => navigate('/add-task')} style={{ padding: '1.25rem 3.5rem', borderRadius: '20px', fontSize: '1.125rem' }}>Start Now</Button>
            </motion.div>
        )}
      </div>
      )}
    </div>
  );
};

export default MyTasks;
