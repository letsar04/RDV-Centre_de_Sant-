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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../../api/axios';

interface DoctorAvailability {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

interface AppointmentDetail {
  id: number;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_specialty: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
}

const RescheduleAppointmentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { appointmentId } = route.params as { appointmentId: number };
  
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [appointmentId]);

  const fetchData = async () => {
    try {
      // Get appointment details
      const appointmentResponse = await api.get(`/appointments/${appointmentId}`);
      setAppointment(appointmentResponse.data);
      
      // Get doctor availabilities
      const availabilitiesResponse = await api.get(`/doctors/${appointmentResponse.data.doctor_id}/availabilities`);
      setAvailabilities(availabilitiesResponse.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
      Alert.alert('Erreur', 'Impossible de charger les informations');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimes = (date: Date) => {
    const dayOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][date.getDay()];
    const dayAvailabilities = availabilities.filter(avail => avail.day_of_week === dayOfWeek);
    
    const times: string[] = [];
    dayAvailabilities.forEach(avail => {
      const start = new Date(`2000-01-01T${avail.start_time}`);
      const end = new Date(`2000-01-01T${avail.end_time}`);
      
      while (start < end) {
        times.push(start.toTimeString().slice(0, 5));
        start.setHours(start.getHours() + 1);
      }
    });
    
    return times;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setSelectedTime(''); // Reset time when date changes
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime.toTimeString().slice(0, 5));
    }
  };

  const handleReschedule = async () => {
    if (!selectedTime) {
      Alert.alert('Erreur', 'Veuillez sélectionner une heure');
      return;
    }

    Alert.alert(
      'Reporter le rendez-vous',
      `Êtes-vous sûr de vouloir reporter ce rendez-vous au ${selectedDate.toLocaleDateString('fr-FR')} à ${selectedTime} ?`,
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', onPress: confirmReschedule }
      ]
    );
  };

  const confirmReschedule = async () => {
    setSubmitting(true);
    try {
      await api.put(`/appointments/${appointmentId}/reschedule`, {
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime
      });
      
      Alert.alert(
        'Succès',
        'Rendez-vous reporté avec succès',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de reporter le rendez-vous');
    } finally {
      setSubmitting(false);
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

  const availableTimes = getAvailableTimes(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reporter le rendez-vous</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Appointment Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rendez-vous actuel</Text>
          <View style={styles.infoRow}>
            <Icon name="account" size={20} color="#666" />
            <Text style={styles.infoText}>
              Dr. {appointment.doctor_first_name} {appointment.doctor_last_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.infoText}>{appointment.appointment_date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{appointment.appointment_time}</Text>
          </View>
        </View>

        {/* New Date Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nouvelle date</Text>
          <TouchableOpacity 
            style={styles.dateSelector} 
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" size={20} color="#2E67F8" />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nouvelle heure</Text>
          {availableTimes.length > 0 ? (
            <View style={styles.timeGrid}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.selectedTimeSlotText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noAvailability}>
              <Icon name="calendar-remove" size={48} color="#ccc" />
              <Text style={styles.noAvailabilityText}>
                Aucune disponibilité ce jour
              </Text>
              <Text style={styles.noAvailabilitySubtext}>
                Veuillez sélectionner une autre date
              </Text>
            </View>
          )}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedTime || submitting) && styles.disabledButton
          ]}
          onPress={handleReschedule}
          disabled={!selectedTime || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="calendar-sync" size={20} color="#fff" />
              <Text style={styles.confirmButtonText}>Confirmer le report</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: '28%',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#2E67F8',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  noAvailability: {
    alignItems: 'center',
    padding: 40,
  },
  noAvailabilityText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  noAvailabilitySubtext: {
    fontSize: 14,
    color: '#999',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E67F8',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RescheduleAppointmentScreen;
