import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface Stats {
  total: number;
  byType: Array<{
    type: string;
    count: number;
  }>;
}

interface StatsCardProps {
  stats: Stats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blood_donation': return 'Dons';
      case 'patient_search': return 'Rech.';
      case 'other': return 'Autres';
      default: return type;
    }
  };

  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Statistiques</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        {stats.byType.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statNumber}>{stat.count}</Text>
            <Text style={styles.statLabel}>{getTypeLabel(stat.type)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E67F8',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default StatsCard;
