import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import AppointmentsScreen from '../screens/patient/AppointmentsScreen';
import ProfileScreen from '../screens/patient/ProfileScreen';
import DoctorsScreen from '../screens/patient/DoctorsScreen';
import DoctorDetailScreen from '../screens/patient/DoctorDetailScreen';

const Stack = createStackNavigator();

const PatientStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Home" component={PatientHomeScreen} options={{ title: 'Accueil' }} />
    <Stack.Screen name="Doctors" component={DoctorsScreen} options={{ title: 'Médecins' }} />
    <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: 'Détail Médecin' }} />
    <Stack.Screen name="RDVs" component={AppointmentsScreen} options={{ title: 'Mes Rendez-vous' }} />
    <Stack.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil' }} />
  </Stack.Navigator>
);

export default PatientStackNavigator;
