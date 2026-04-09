import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../api/axios';

interface AppointmentDetail {
  id: number;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_specialty: string;
  doctor_phone?: string;
  doctor_email?: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
  notes?: string;
  created_at: string;
}

const AppointmentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appointmentId } = route.params as { appointmentId: number };
  
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetail();
  }, [appointmentId]);

  const fetchAppointmentDetail = async () => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      setAppointment(response.data);
    } catch (error) {
      console.error('Failed to fetch appointment detail', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du rendez-vous');
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

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmé':
      case 'confirmed':
        return 'Confirmé';
      case 'en attente':
      case 'pending':
        return 'En attente';
      case 'annulé':
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler le rendez-vous',
      'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', onPress: confirmCancel }
      ]
    );
  };

  const confirmCancel = async () => {
    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      Alert.alert('Succès', 'Rendez-vous annulé avec succès');
      fetchAppointmentDetail(); // Refresh the data
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'annuler le rendez-vous');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2E67F8" />
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Rendez-vous non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du rendez-vous</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
            {getStatusText(appointment.status)}
          </Text>
        </View>

        {/* Doctor Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Médecin</Text>
          <View style={styles.doctorInfo}>
            <View style={styles.avatar}>
              <Icon name="account" size={32} color="#fff" />
            </View>
            <View style={styles.doctorText}>
              <Text style={styles.doctorName}>
                Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
              </Text>
              <Text style={styles.specialty}>{appointment.doctor_specialty}</Text>
              {appointment.doctor_phone && (
                <Text style={styles.contactInfo}>Tél: {appointment.doctor_phone}</Text>
              )}
              {appointment.doctor_email && (
                <Text style={styles.contactInfo}>Email: {appointment.doctor_email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Appointment Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations du rendez-vous</Text>
          
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{appointment.appointment_date}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Heure:</Text>
            <Text style={styles.infoValue}>{appointment.appointment_time}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="file-text-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Motif:</Text>
            <Text style={styles.infoValue}>{appointment.reason}</Text>
          </View>

          {appointment.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Icon name="clock-time-eight" size={20} color="#666" />
            <Text style={styles.infoLabel}>Créé le:</Text>
            <Text style={styles.infoValue}>
              {new Date(appointment.created_at).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {appointment.status.toLowerCase() === 'en attente' || appointment.status.toLowerCase() === 'pending' ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Icon name="close" size={20} color="#FF3B30" />
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        ) : appointment.status.toLowerCase() === 'confirmé' || appointment.status.toLowerCase() === 'confirmed' ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.rescheduleButton}>
              <Icon name="calendar-sync" size={20} color="#2E67F8" />
              <Text style={styles.rescheduleButtonText}>Reporter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Icon name="close" size={20} color="#FF3B30" />
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorText: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  notesSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E67F8',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  rescheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 8,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentDetailScreen;
