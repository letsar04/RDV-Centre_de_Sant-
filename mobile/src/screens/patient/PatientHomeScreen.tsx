import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';

import api from '../../api/axios';

interface Appointment {
  id: number;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const PatientHomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const now = new Date();
      try {
        const res = await api.get('/appointments/my');
          // Filtrer les rendez-vous confirmés et à venir
          const upcoming = res.data.filter((a: Appointment) => {
            const dateTime = new Date(a.appointment_date + 'T' + a.appointment_time);
            return dateTime >= now && a.status.toLowerCase() === 'confirme';
          });
          if (upcoming.length > 0) {
            // Trier par date croissante
            upcoming.sort((a: Appointment, b: Appointment) => {
              const da = new Date(a.appointment_date + 'T' + a.appointment_time);
              const db = new Date(b.appointment_date + 'T' + b.appointment_time);
              return da.getTime() - db.getTime();
            });
            setNextAppointment(upcoming[0]);
          } else {
          setNextAppointment(null);
        }
      } catch (e) {
        setNextAppointment(null);
      } finally {
        setLoadingAppointment(false);
      }
    };
    fetchAppointments();
  }, []);

  const ActionCard = ({ icon, title, color, onPress }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}> 
        <Icon name={icon} size={32} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.first_name} {user?.last_name} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.headerLogo} 
              resizeMode="contain" 
            />
          </View>
        </View>

        <View style={styles.searchBar}>
          <Icon name="magnify" size={24} color="gray" />
          <Text style={styles.searchText}>Rechercher un médecin, une spécialité...</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          <View style={styles.actionGrid}>
            <ActionCard icon="calendar-plus" title="Prendre RDV" color="#2E67F8" onPress={() => navigation.navigate('Doctors')} />
            <ActionCard icon="doctor" title="Mes Médecins" color="#FF9500" onPress={() => navigation.navigate('Doctors')} />
            <ActionCard icon="file-document-outline" title="Ordonnances" color="#34C759" />
            <ActionCard icon="pill" title="Traitements" color="#AF52DE" />
          </View>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Téléconsultation</Text>
            <Text style={styles.promoDesc}>Consultez votre médecin depuis chez vous</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>En savoir plus</Text>
            </TouchableOpacity>
          </View>
          <Icon name="video-medical" size={64} color="rgba(255,255,255,0.3)" style={styles.promoIcon} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rendez-vous confirmé</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RDVs')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {loadingAppointment ? (
            <Text>Chargement du prochain rendez-vous...</Text>
          ) : nextAppointment ? (
            <View style={styles.appointmentCard}>
              <View style={styles.doctorInfo}>
                <View style={styles.avatarPlaceholder}>
                  <Icon name="account" size={30} color="#fff" />
                </View>
                <View style={styles.doctorText}>
                  <Text style={styles.doctorName}>Dr. {nextAppointment.doctor_first_name} {nextAppointment.doctor_last_name}</Text>
                  <Text style={styles.doctorSpecialty}>{nextAppointment.doctor_specialty}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeItem}>
                  <Icon name="calendar" size={20} color="#666" />
                  <Text style={styles.dateTimeText}>{nextAppointment.appointment_date}</Text>
                </View>
                <View style={styles.dateTimeItem}>
                  <Icon name="clock-outline" size={20} color="#666" />
                  <Text style={styles.dateTimeText}>{nextAppointment.appointment_time}</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text>Aucun rendez-vous à venir.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: 'gray',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    padding: 2,
  },
  headerLogo: {
    width: 60,
    height: 40,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 24,
  },
  searchText: {
    color: 'gray',
    marginLeft: 10,
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  promoCard: {
    backgroundColor: '#2E67F8',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  promoTextContainer: {
    flex: 1,
    zIndex: 2,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promoDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 16,
  },
  promoBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#2E67F8',
    fontWeight: 'bold',
    fontSize: 13,
  },
  promoIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    zIndex: 1,
  },
  seeAll: {
    color: '#2E67F8',
    fontSize: 14,
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorText: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

export default PatientHomeScreen;
