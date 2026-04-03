import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import AppointmentsScreen from '../screens/patient/AppointmentsScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import EditProfileScreen from '../screens/patient/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';

import DoctorsScreen from '../screens/patient/DoctorsScreen';
import DoctorDetailScreen from '../screens/patient/DoctorDetailScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const HomeStackNav = createStackNavigator();

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: true }}>
      <HomeStackNav.Screen name="HomeMain" component={PatientHomeScreen} options={{ title: 'Accueil' }} />
      <HomeStackNav.Screen name="Doctors" component={DoctorsScreen} options={{ title: 'Médecins' }} />
      <HomeStackNav.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: 'Détail Médecin' }} />
    </HomeStackNav.Navigator>
  );
}

const PatientProfileStackNav = createStackNavigator();

function ProfileStackScreen() {
  return (
    <PatientProfileStackNav.Navigator>
      <PatientProfileStackNav.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <PatientProfileStackNav.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Modifier le profil' }} />
      <PatientProfileStackNav.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Changer le mot de passe' }} />
    </PatientProfileStackNav.Navigator>
  );
}

const PatientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RDVs') {
            iconName = focused ? 'calendar-check' : 'calendar-blank-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'account' : 'account-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E67F8',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Accueil' }} />
      <Tab.Screen name="RDVs" component={AppointmentsScreen} options={{ title: 'Mes Rendez-vous' }} />
      <Tab.Screen name="Profil" component={ProfileStackScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

export default PatientNavigator;
