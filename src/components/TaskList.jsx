import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

export const TaskList = ({ title, description, tasks = [] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{title}</h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>{description}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.length > 0 ? tasks.map((task, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={task.id}
            style={{ 
              backgroundColor: 'var(--surface-container-lowest)', 
              padding: '1.5rem 2rem', 
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--secondary-container)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--on-secondary-container)'
              }}>
                <Clock size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontFamily: 'var(--font-headline)' }}>{task.title}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{task.location} • {task.time}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
               <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>₹{task.price}</span>
               <div style={{ 
                 padding: '0.5rem 1rem', 
                 borderRadius: 'var(--radius-full)', 
                 backgroundColor: 'var(--secondary-container)',
                 color: 'var(--on-secondary-container)',
                 fontSize: '0.75rem',
                 fontWeight: '600',
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.5rem'
               }}>
                 <CheckCircle size={14} /> {task.status || 'Active'}
               </div>
            </div>
          </motion.div>
        )) : (
          <div style={{ 
            padding: '4rem', 
            textAlign: 'center', 
            color: 'var(--on-surface-variant)', 
            backgroundColor: 'var(--surface-container-low)', 
            borderRadius: 'var(--radius-card)',
            border: '2px dashed var(--outline-variant)',
            opacity: 0.5
          }}>
            No tasks found in this category.
          </div>
        )}
      </div>
    </motion.div>
  );
};
