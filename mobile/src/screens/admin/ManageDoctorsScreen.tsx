import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios';
import { useNavigation } from '@react-navigation/native';

const ManageDoctorsScreen = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', specialty: '', phone: '', email: '' });
  
  const navigation = useNavigation<any>();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors');
      setDoctors(res.data);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de charger les médecins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDoctors();
    });
    return unsubscribe;
  }, [navigation]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentDoctorId(null);
    setFormData({ first_name: '', last_name: '', specialty: '', phone: '', email: '' });
    setModalVisible(true);
  };

  const openEditModal = (doc: any) => {
    setIsEditing(true);
    setCurrentDoctorId(doc.id);
    setFormData({
      first_name: doc.first_name,
      last_name: doc.last_name,
      specialty: doc.specialty,
      phone: doc.phone || '',
      email: doc.email || ''
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.first_name || !formData.last_name || !formData.specialty) {
      Alert.alert('Erreur', 'Prénom, nom et spécialité sont requis.');
      return;
    }
    
    try {
      if (isEditing && currentDoctorId) {
        await api.put(`/doctors/${currentDoctorId}`, formData);
        Alert.alert('Succès', 'Médecin mis à jour.');
      } else {
        await api.post('/doctors', formData);
        Alert.alert('Succès', 'Médecin ajouté.');
      }
      setModalVisible(false);
      fetchDoctors();
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Confirmation', 'Voulez-vous vraiment supprimer ce médecin ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/doctors/${id}`);
            fetchDoctors();
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de supprimer.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardContent} 
        onPress={() => navigation.navigate('ManageAvailabilities', { doctorId: item.id, doctorName: `${item.first_name} ${item.last_name}` })}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.first_name[0]}{item.last_name[0]}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Dr. {item.first_name} {item.last_name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <Text style={styles.clickHint}>Gérer horaires ➝</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => openEditModal(item)}>
          <Icon name="pencil" size={24} color="#2E67F8" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.id)}>
          <Icon name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2E67F8" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{isEditing ? 'Modifier Médecin' : 'Ajouter Médecin'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Prénom *"
              value={formData.first_name}
              onChangeText={(text) => setFormData({...formData, first_name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom *"
              value={formData.last_name}
              onChangeText={(text) => setFormData({...formData, last_name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Spécialité *"
              value={formData.specialty}
              onChangeText={(text) => setFormData({...formData, specialty: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              keyboardType="email-address"
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={formData.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Enregistrer</Text>
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
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  cardContent: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e6edfa', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#2E67F8', fontWeight: 'bold', fontSize: 18 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1A202C' },
  specialty: { fontSize: 14, color: '#718096', marginVertical: 4 },
  clickHint: { fontSize: 12, color: '#2E67F8', fontWeight: '600' },
  actions: { flexDirection: 'row' },
  iconBtn: { padding: 8, marginLeft: 5 },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#2E67F8',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#2E67F8', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalView: { width: '90%', backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1A202C', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#F8FAFC' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, padding: 15, borderRadius: 8, backgroundColor: '#EDF2F7', marginRight: 10, alignItems: 'center' },
  cancelBtnText: { color: '#4A5568', fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: 15, borderRadius: 8, backgroundColor: '#2E67F8', marginLeft: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default ManageDoctorsScreen;
