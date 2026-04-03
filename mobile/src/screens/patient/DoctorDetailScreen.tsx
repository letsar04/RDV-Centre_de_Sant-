import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert, SafeAreaView, ScrollView, Platform } from 'react-native';
import api from '../../api/axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DoctorDetailScreen = ({ route, navigation }: any) => {
  const { doctor } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAppointment = async () => {
    if (!date || !time) {
      Alert.alert('Erreur', 'Veuillez renseigner la date et l\'heure');
      return;
    }
    setLoading(true);
    try {
      await api.post('/appointments', {
        doctor_id: doctor.id,
        appointment_date: date,
        appointment_time: time,
        reason,
      });
      Alert.alert('Succès', 'Votre rendez-vous a été demandé !', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error(error);
      let message = error.response?.data?.message || 'Une erreur est survenue';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        message += '\n' + error.response.data.errors.map((e: any) => e.msg).join('\n');
      }
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#2E67F8" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.avatar}><Icon name="doctor" size={48} color="#2E67F8" /></View>
          <Text style={styles.name}>Dr. {doctor.first_name} {doctor.last_name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
        </View>
        <Text style={styles.sectionTitle}>Prendre rendez-vous</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: date ? '#222' : '#aaa' }}>{date ? date : 'Sélectionner une date'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                setDate(`${yyyy}-${mm}-${dd}`);
              }
            }}
          />
        )}
        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text style={{ color: time ? '#222' : '#aaa' }}>{time ? time : 'Sélectionner une heure'}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time ? new Date(`1970-01-01T${time}:00`) : new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                const hh = String(selectedTime.getHours()).padStart(2, '0');
                const min = String(selectedTime.getMinutes()).padStart(2, '0');
                setTime(`${hh}:${min}`);
              }
            }}
          />
        )}
        <TextInput style={styles.input} placeholder="Motif (optionnel)" value={reason} onChangeText={setReason} />
        <TouchableOpacity style={styles.button} onPress={handleAppointment} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Valider</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#2E67F8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#e6edfa', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#2E67F8' },
  specialty: { fontSize: 16, color: 'gray', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e6edfa', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2E67F8', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default DoctorDetailScreen;
