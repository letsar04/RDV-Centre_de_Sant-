import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios';

interface Appointment {
  id: number;
  doctor_last_name: string;
  specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

const AppointmentsScreen = ({ navigation }: any) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/my');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmé':
      case 'confirmed':
        return '#34C759';
      case 'en attente':
      case 'pending':
        return '#FF9500';
      case 'annulé':
      case 'cancelled':
        return '#FF3B30';
      default:
        return 'gray';
    }
  };

  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.doctorInfo}>
          <View style={styles.avatarMini}>
            <Icon name="account" size={20} color="#fff" />
          </View>
          <Text style={styles.doctorName}>Dr. {item.doctor_last_name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.specialtyText}>{item.specialty}</Text>

      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <Icon name="calendar-outline" size={18} color="#666" />
          <Text style={styles.dateTimeText}>{item.appointment_date}</Text>
        </View>
        <View style={styles.dateTimeItem}>
          <Icon name="clock-outline" size={18} color="#666" />
          <Text style={styles.dateTimeText}>{item.appointment_time}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.detailsBtn}>
          <Text style={styles.detailsBtnText}>Détails</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rescheduleBtn}>
          <Text style={styles.rescheduleBtnText}>Reporter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Rendez-vous</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2E67F8" />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-blank" size={64} color="#eee" />
              <Text style={styles.emptyText}>Aucun rendez-vous prévu</Text>
              <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Doctors')}>
                <Text style={styles.bookBtnText}>Prendre un rendez-vous</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  specialtyText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 42,
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginLeft: 42,
    marginBottom: 20,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 16,
  },
  detailsBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  detailsBtnText: {
    color: '#333',
    fontWeight: '600',
  },
  rescheduleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2E67F815',
  },
  rescheduleBtnText: {
    color: '#2E67F8',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 16,
    marginBottom: 24,
  },
  bookBtn: {
    backgroundColor: '#2E67F8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AppointmentsScreen;
