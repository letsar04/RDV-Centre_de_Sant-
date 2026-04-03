import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Image } from 'react-native';
import api from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import DoctorAvailableCard from '../../components/admin/DoctorAvailableCard';

const AdminHomeScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/appointments/stats');
      setStats(res.data);
    } catch (e) {
      console.error('Error fetching stats:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2E67F8" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcome}>Tableau de bord</Text>
            <Text style={styles.subtitle}>Résumé de activité du centre</Text>
          </View>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.row}>
          <StatCard 
            label="Total RDVs" 
            value={stats?.total || 0} 
            icon="calendar-multiselect" 
            color="#2E67F8" 
          />
          <StatCard 
            label="En attente" 
            value={stats?.en_attente || 0} 
            icon="clock-outline" 
            color="#FF9500" 
          />
        </View>
        <View style={styles.row}>
          <StatCard 
            label="Confirmés" 
            value={stats?.confirme || 0} 
            icon="check-circle-outline" 
            color="#34C759" 
          />
          <StatCard 
            label="Annulés" 
            value={stats?.annule || 0} 
            icon="close-circle-outline" 
            color="#FF3B30" 
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Médecins dispo aujourd'hui</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{stats?.doctors_today?.length || 0}</Text>
          </View>
        </View>

        {stats?.doctors_today && stats.doctors_today.length > 0 ? (
          stats.doctors_today.map((doc: any, index: number) => (
            <DoctorAvailableCard 
              key={index}
              name={`${doc.first_name} ${doc.last_name}`}
              specialty={doc.specialty}
            />
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aucun médecin disponible aujourd'hui.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLogo: {
    width: 60,
    height: 40,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    padding: 24,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: '#2E67F820',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: '#2E67F8',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default AdminHomeScreen;
