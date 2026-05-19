import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const profileRef = doc(db, 'users', currentUser.uid);
        const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            console.log("No profile found for user:", currentUser.uid);
            setProfile({});
          }
          setLoading(false);
        }, (err) => {
          console.error("Profile Sync Error:", err);
          setErrorStatus("Failed to sync profile. Check your connection.");
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const googleSignIn = async () => {
      const provider = new GoogleAuthProvider();
      try {
          const result = await signInWithPopup(auth, provider);
          const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
          if (!profileDoc.exists()) {
              const [firstName, ...lastNameParts] = result.user.displayName?.split(' ') || ['User', ''];
              await setDoc(doc(db, 'users', result.user.uid), {
                  uid: result.user.uid,
                  email: result.user.email,
                  first_name: firstName,
                  last_name: lastNameParts.join(' '),
                  profile_picture: result.user.photoURL,
                  createdAt: new Date().toISOString()
              });
          }
          return result;
      } catch (error) {
          throw error;
      }
  };

  const register = async (email, password, userData) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      ...userData,
      uid: res.user.uid,
      createdAt: new Date().toISOString()
    });
    return res;
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  if (loading) {
      return (
          <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', backgroundColor: '#ffffff' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(37, 99, 235, 0.1)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#64748b', fontWeight: '800', fontSize: '1.125rem' }}>Synchronizing your secure session...</p>
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, profile, login, register, logout, googleSignIn, resetPassword, errorStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
