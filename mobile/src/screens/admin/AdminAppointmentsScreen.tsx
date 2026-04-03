import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios';

const AdminAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger les rendez-vous');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const updateStatus = (id: number, status: string) => {
    const actionName = status === 'confirme' ? 'Confirmer' : 'Annuler';
    Alert.alert(`Confirmation`, `Voulez-vous ${actionName.toLowerCase()} ce rendez-vous ?`, [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', onPress: async () => {
          try {
            await api.put(`/appointments/${id}/status`, { status });
            fetchAppointments();
            Alert.alert('Succès', `Le rendez-vous a été ${status === 'confirme' ? 'confirmé' : 'annulé'}.`);
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de modifier le statut.');
          }
        }
      }
    ]);
  };

  const renderStatus = (status: string) => {
    switch(status) {
      case 'confirme': return <Text style={[styles.statusBadge, {backgroundColor: '#E8F5E9', color: '#4CAF50'}]}>Confirmé</Text>;
      case 'annule': return <Text style={[styles.statusBadge, {backgroundColor: '#FFEBEE', color: '#F44336'}]}>Annulé</Text>;
      default: return <Text style={[styles.statusBadge, {backgroundColor: '#FFF8E1', color: '#FFB300'}]}>En attente</Text>;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.dateBox}>
          <Icon name="calendar" size={16} color="#2E67F8" />
          <Text style={styles.dateText}>{item.appointment_date}</Text>
          <Icon name="clock-outline" size={16} color="#2E67F8" style={{marginLeft: 10}} />
          <Text style={styles.dateText}>{item.appointment_time.substring(0, 5)}</Text>
        </View>
        {renderStatus(item.status)}
      </View>
      
      <View style={styles.detailsBlock}>
        <View style={styles.row}>
          <Icon name="account" size={18} color="#718096" />
          <Text style={styles.detailText}>Patient: <Text style={{fontWeight: 'bold'}}>{item.patient_first_name} {item.patient_last_name}</Text></Text>
        </View>
        <View style={styles.row}>
          <Icon name="doctor" size={18} color="#718096" />
          <Text style={styles.detailText}>Médecin: Dr. {item.doctor_last_name}</Text>
        </View>
        {item.reason && (
          <View style={[styles.row, {alignItems: 'flex-start'}]}>
             <Icon name="text-box-outline" size={18} color="#718096" />
             <Text style={[styles.detailText, {fontStyle: 'italic', flex: 1}]}>{item.reason}</Text>
          </View>
        )}
      </View>

      {item.status === 'en_attente' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => updateStatus(item.id, 'annule')}>
            <Icon name="close" size={18} color="#F44336" />
            <Text style={styles.cancelBtnText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.confirmBtn]} onPress={() => updateStatus(item.id, 'confirme')}>
            <Icon name="check" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Gestion des Réservations</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2E67F8" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun rendez-vous sur le système.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', padding: 20, paddingTop: 60, backgroundColor: '#fff', color: '#1A202C' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#EDF2F7', paddingBottom: 12 },
  dateBox: { flexDirection: 'row', alignItems: 'center' },
  dateText: { marginLeft: 6, fontWeight: '600', color: '#2E67F8', fontSize: 14 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  detailsBlock: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { marginLeft: 8, color: '#4A5568', fontSize: 14 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EDF2F7' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginLeft: 10 },
  cancelBtn: { backgroundColor: '#FFEBEE' },
  cancelBtnText: { color: '#F44336', fontWeight: 'bold', marginLeft: 4 },
  confirmBtn: { backgroundColor: '#4CAF50' },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  emptyText: { textAlign: 'center', color: '#718096', marginTop: 40 }
});

export default AdminAppointmentsScreen;
