import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios';

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const ManageAvailabilitiesScreen = ({ route }: any) => {
  const doctorId = route?.params?.doctorId;
  const doctorName = route?.params?.doctorName || 'ce médecin';
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ day_of_week: 'lundi', start_time: '08:00', end_time: '12:00' });

  const fetchAvailabilities = async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(`/availabilities/doctor/${doctorId}`);
      setAvailabilities(res.data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger les disponibilités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, [doctorId]);

  const handleSave = async () => {
    try {
      await api.post('/availabilities', {
        doctor_id: doctorId,
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time
      });
      Alert.alert('Succès', 'Créneau ajouté avec succès');
      setModalVisible(false);
      fetchAvailabilities();
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Confirmation', 'Supprimer ce créneau ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/availabilities/${id}`);
            fetchAvailabilities();
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de supprimer.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.dayText}>{item.day_of_week.toUpperCase()}</Text>
        <Text style={styles.timeText}>{item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <Icon name="delete-outline" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Horaires de {doctorName}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2E67F8" />
      ) : (
        <FlatList
          data={availabilities}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune disponibilité configurée.</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nouveau créneau</Text>
            
            <Text style={styles.label}>Jour de la semaine</Text>
            <View style={styles.daysContainer}>
              {DAYS.map(day => (
                <TouchableOpacity 
                  key={day} 
                  style={[styles.dayChip, formData.day_of_week === day && styles.dayChipActive]}
                  onPress={() => setFormData({...formData, day_of_week: day})}
                >
                  <Text style={[styles.dayChipText, formData.day_of_week === day && styles.dayChipTextActive]}>
                    {day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Heure de début (HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="08:00"
              value={formData.start_time}
              onChangeText={t => setFormData({...formData, start_time: t})}
            />

            <Text style={styles.label}>Heure de fin (HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="12:00"
              value={formData.end_time}
              onChangeText={t => setFormData({...formData, end_time: t})}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', padding: 16, backgroundColor: '#fff', color: '#1A202C' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', elevation: 2 },
  cardInfo: { flex: 1 },
  dayText: { fontSize: 16, fontWeight: 'bold', color: '#2E67F8' },
  timeText: { fontSize: 14, color: '#4A5568', marginTop: 4 },
  deleteBtn: { padding: 8 },
  emptyText: { textAlign: 'center', color: '#718096', marginTop: 20 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2E67F8', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '90%', backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#1A202C' },
  label: { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, backgroundColor: '#F8FAFC' },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EDF2F7', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 },
  dayChipActive: { backgroundColor: '#2E67F8', borderColor: '#2E67F8' },
  dayChipText: { color: '#4A5568', fontWeight: 'bold' },
  dayChipTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cancelBtn: { flex: 1, padding: 15, borderRadius: 8, backgroundColor: '#EDF2F7', marginRight: 10, alignItems: 'center' },
  cancelBtnText: { color: '#4A5568', fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: 15, borderRadius: 8, backgroundColor: '#2E67F8', marginLeft: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default ManageAvailabilitiesScreen;
