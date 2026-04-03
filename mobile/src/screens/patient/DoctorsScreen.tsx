import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import api from '../../api/axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialty: string;
}

const DoctorsScreen = ({ navigation }: any) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [specialty, setSpecialty] = useState('');
  const [pendingSpecialty, setPendingSpecialty] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.get('/doctors' + (specialty ? `?specialty=${encodeURIComponent(specialty)}` : ''))
      .then(response => {
        if (isMounted) setDoctors(response.data);
      })
      .catch(error => {
        if (isMounted) console.error('Erreur chargement médecins', error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [specialty]);

  const handleFilter = () => {
    setSpecialty(pendingSpecialty);
  };

  const renderItem = ({ item }: { item: Doctor }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DoctorDetail', { doctor: item })}>
      <View style={styles.avatar}><Icon name="doctor" size={32} color="#2E67F8" /></View>
      <View style={styles.info}>
        <Text style={styles.name}>Dr. {item.first_name} {item.last_name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
      </View>
    </TouchableOpacity>
  );

  const specialties = Array.from(new Set(doctors.map((d: any) => d.specialty))).filter(Boolean);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2E67F8" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#2E67F8" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>
      <View style={styles.filterRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filtrer par service (spécialité)"
          value={pendingSpecialty}
          onChangeText={setPendingSpecialty}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilter}>
          <Icon name="filter" size={20} color="#2E67F8" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={doctors}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    filterBtn: {
      marginLeft: 8,
      padding: 8,
      backgroundColor: '#e6edfa',
      borderRadius: 8,
    },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 8,
    marginBottom: 8,
  },
  backText: {
    color: '#2E67F8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e6edfa',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  container: { flex: 1, backgroundColor: '#fff' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f6fa', padding: 16, borderRadius: 10, marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e6edfa', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#2E67F8' },
  specialty: { fontSize: 14, color: 'gray', marginTop: 2 },
});

export default DoctorsScreen;
