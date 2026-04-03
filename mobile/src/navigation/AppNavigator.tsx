import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import AdminNavigator from './AdminNavigator';
import SplashScreen from '../screens/SplashScreen';

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = React.useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer onReady={() => console.log('NavigationContainer is ready')}>
      {user ? (
        user.role === 'admin' ? (
          <AdminNavigator />
        ) : (
          <PatientNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
