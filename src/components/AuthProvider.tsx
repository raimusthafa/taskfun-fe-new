import React, { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getProfile = useUserStore((state) => state.getProfile);
  const loading = useUserStore((state) => state.loading);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('token')) {
        await getProfile();
      }
      setIsReady(true);
    };
    fetchUser();
  }, [getProfile]);

  if (!isReady || loading) {
    // Render loading indicator or null while fetching user
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
