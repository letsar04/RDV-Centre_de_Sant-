import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import ManageDoctorsScreen from '../screens/admin/ManageDoctorsScreen';
import ManageAvailabilitiesScreen from '../screens/admin/ManageAvailabilitiesScreen';
import AdminAppointmentsScreen from '../screens/admin/AdminAppointmentsScreen';
import ManageAnnouncementsScreen from '../screens/admin/ManageAnnouncementsScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import EditProfileScreen from '../screens/patient/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const AdminStack = createStackNavigator();
const AdminProfileStack = createStackNavigator();

function DoctorsStack() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: true }}>
      <AdminStack.Screen name="DoctorsList" component={ManageDoctorsScreen} options={{ title: 'Gestion Médecins' }} />
      <AdminStack.Screen name="ManageAvailabilities" component={ManageAvailabilitiesScreen} options={{ title: 'Disponibilités' }} />
    </AdminStack.Navigator>
  );
}

function AnnouncementsStack() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: true }}>
      <AdminStack.Screen name="AnnouncementsMain" component={ManageAnnouncementsScreen} options={{ title: 'Annonces' }} />
    </AdminStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <AdminProfileStack.Navigator>
      <AdminProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <AdminProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Modifier le profil' }} />
      <AdminProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Changer le mot de passe' }} />
    </AdminProfileStack.Navigator>
  );
}

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'view-dashboard';
          if (route.name === 'TableauD') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Gestion') {
            iconName = focused ? 'doctor' : 'doctor';
          } else if (route.name === 'Annonces') {
            iconName = focused ? 'bullhorn' : 'bullhorn-outline';
          } else if (route.name === 'RDVs') {
            iconName = focused ? 'calendar-multiple-check' : 'calendar-multiple';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'account-cog' : 'account-cog-outline';
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
      <Tab.Screen name="TableauD" component={AdminHomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Gestion" component={DoctorsStack} options={{ title: 'Médecins' }} />
      <Tab.Screen name="Annonces" component={AnnouncementsStack} options={{ title: 'Annonces' }} />
      <Tab.Screen name="RDVs" component={AdminAppointmentsScreen} options={{ title: 'Réservations' }} />
      <Tab.Screen name="Profil" component={ProfileStackScreen} options={{ title: 'Session' }} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
