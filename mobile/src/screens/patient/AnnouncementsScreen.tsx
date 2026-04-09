import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/axios';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import CategoryFilter from '../../components/announcements/CategoryFilter';
import SearchBar from '../../components/announcements/SearchBar';

interface Announcement {
  id: number;
  title: string;
  description: string;
  type: 'blood_donation' | 'patient_search' | 'other';
  author: string;
  author_email: string;
  location?: string;
  blood_type?: string;
  urgency: 'low' | 'medium' | 'high';
  contact: string;
  created_at: string;
}

const AnnouncementsScreen = () => {
  const navigation = useNavigation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', name: 'Toutes', icon: 'view-list' },
    { id: 'blood_donation', name: 'Dons de sang', icon: 'water' },
    { id: 'patient_search', name: 'Recherches', icon: 'account-search' },
    { id: 'other', name: 'Autres', icon: 'dots-horizontal' }
  ];

  useEffect(() => {
    loadAnnouncements();
  }, [selectedCategory, searchQuery]);

  const loadAnnouncements = async () => {
    try {
      const params: any = {};
      if (selectedCategory !== 'all') {
        params.type = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/announcements/public', { params });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Erreur chargement annonces:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnnouncements();
  };

  const handleContact = (announcement: Announcement) => {
    alert(`Pour contacter : ${announcement.author}\n${announcement.contact}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Annonces Communautaires</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E67F8" />
          <Text style={styles.loadingText}>Chargement des annonces...</Text>
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
        <Text style={styles.headerTitle}>Annonces Communautaires</Text>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
          <Icon name="refresh" size={24} color="#2E67F8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher une annonce..."
        />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <View style={styles.announcementsList}>
          {announcements.length > 0 ? (
            announcements.map(announcement => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onContact={handleContact}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="bullhorn" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Aucune annonce trouvée</Text>
              <Text style={styles.emptySubtext}>Essayez de modifier votre recherche ou vos filtres</Text>
            </View>
          )}
        </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  announcementsList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default AnnouncementsScreen;
