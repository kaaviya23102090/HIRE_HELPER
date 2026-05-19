import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
        setNotifications([]);
        setPendingRequests([]);
        setUnreadCount(0);
        return;
    }

    // 1. Listen for new notifications
    const qNotif = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid)
    );

    const unsubNotif = onSnapshot(qNotif, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(list);
    });

    // 2. Listen for pending requests (Owners need to see these)
    const qReq = query(
        collection(db, 'requests'),
        where('ownerId', '==', user.uid),
        where('status', '==', 'Pending')
    );

    const unsubReq = onSnapshot(qReq, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, type: 'request', ...doc.data() }));
        setPendingRequests(list);
    });

    return () => {
        unsubNotif();
        unsubReq();
    };
  }, [user]);

  // Combine and calculate unread count
  useEffect(() => {
      const unreadNotifs = notifications.filter(n => !n.read).length;
      const unreadReqs = pendingRequests.length; 
      setUnreadCount(unreadNotifs + unreadReqs);
  }, [notifications, pendingRequests]);

  const markAllAsRead = async () => {
      const unread = notifications.filter(n => !n.read);
      for (const n of unread) {
          await updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
  };

  const getCombinedNotifications = () => {
      const combined = [
          ...notifications.map(n => ({ ...n, type: 'notif' })),
          ...pendingRequests.map(r => ({ 
              id: r.id, 
              title: 'New Help Offer!', 
              message: `${r.requesterName} offered help for "${r.taskTitle}".`, 
              link: '/requests', 
              createdAt: r.createdAt,
              type: 'request',
              read: false
          }))
      ];
      return combined.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  };

  return (
    <NotificationContext.Provider value={{ 
        notifications: getCombinedNotifications(), 
        unreadCount, 
        markAllAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
