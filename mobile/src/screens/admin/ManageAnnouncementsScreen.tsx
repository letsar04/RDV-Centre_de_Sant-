import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import StatsCard from '../../components/announcements/StatsCard';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';

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

const ManageAnnouncementsScreen = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    byType: [] as Array<{type: string, count: number}>
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as 'blood_donation' | 'patient_search' | 'other',
    author: '',
    author_email: '',
    location: '',
    blood_type: '',
    urgency: 'low' as 'low' | 'medium' | 'high',
    contact: ''
  });

  useEffect(() => {
    loadAnnouncements();
    loadStats();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Erreur chargement annonces:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/announcements/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'other',
      author: '',
      author_email: '',
      location: '',
      blood_type: '',
      urgency: 'low',
      contact: ''
    });
    setEditingAnnouncement(null);
  };

  const openModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        description: announcement.description,
        type: announcement.type,
        author: announcement.author,
        author_email: announcement.author_email,
        location: announcement.location || '',
        blood_type: announcement.blood_type || '',
        urgency: announcement.urgency,
        contact: announcement.contact
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.author || !formData.contact) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement.id}`, formData);
        Alert.alert('Succès', 'Annonce mise à jour avec succès');
      } else {
        await api.post('/announcements', formData);
        Alert.alert('Succès', 'Annonce créée avec succès');
      }
      
      closeModal();
      loadAnnouncements();
      loadStats();
    } catch (error) {
      console.error('Erreur sauvegarde annonce:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'annonce');
    }
  };

  const handleDelete = (announcement: Announcement) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette annonce ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/announcements/${announcement.id}`);
              Alert.alert('Succès', 'Annonce supprimée avec succès');
              loadAnnouncements();
              loadStats();
            } catch (error) {
              console.error('Erreur suppression annonce:', error);
              Alert.alert('Erreur', 'Impossible de supprimer l\'annonce');
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnnouncements();
    loadStats();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestion des Annonces</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E67F8" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestion des Annonces</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} disabled={refreshing}>
            <Icon name="refresh" size={20} color="#2E67F8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <StatsCard stats={stats} />

        <View style={styles.announcementsList}>
          {announcements.length > 0 ? (
            announcements.map(announcement => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                showActions={true}
                onEdit={openModal}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="bullhorn" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Aucune annonce</Text>
              <Text style={styles.emptySubtext}>Appuyez sur + pour créer votre première annonce</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAnnouncement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
            </Text>
            <TouchableOpacity onPress={handleSubmit}>
              <Icon name="check" size={24} color="#2E67F8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <AnnouncementForm
              formData={formData}
              onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              isEditing={!!editingAnnouncement}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addBtn: {
    backgroundColor: '#2E67F8',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
  },
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
  announcementsList: {
    paddingBottom: 20,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  announcementDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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

export default ManageAnnouncementsScreen;
