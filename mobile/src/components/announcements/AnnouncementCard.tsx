import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AnnouncementCardProps {
  announcement: {
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
  };
  onContact?: (announcement: any) => void;
  onEdit?: (announcement: any) => void;
  onDelete?: (announcement: any) => void;
  showActions?: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onContact,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#666';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Urgent';
      case 'medium': return 'Modéré';
      case 'low': return 'Normal';
      default: return urgency;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood_donation': return 'water';
      case 'patient_search': return 'account-search';
      case 'other': return 'information';
      default: return 'information';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blood_donation': return '#E91E63';
      case 'patient_search': return '#2E67F8';
      case 'other': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blood_donation': return 'Don de sang';
      case 'patient_search': return 'Recherche';
      case 'other': return 'Autre';
      default: return 'Autre';
    }
  };

  return (
    <View style={styles.announcementCard}>
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Icon 
            name={getTypeIcon(announcement.type)} 
            size={20} 
            color={getTypeColor(announcement.type)} 
          />
          <Text style={[styles.typeText, { color: getTypeColor(announcement.type) }]}>
            {getTypeLabel(announcement.type)}
          </Text>
        </View>
        <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(announcement.urgency) + '20' }]}>
          <Text style={[styles.urgencyText, { color: getUrgencyColor(announcement.urgency) }]}>
            {getUrgencyText(announcement.urgency)}
          </Text>
        </View>
      </View>

      <Text style={styles.announcementTitle}>{announcement.title}</Text>
      <Text style={styles.announcementDescription}>{announcement.description}</Text>

      {announcement.location && (
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={16} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>{announcement.location}</Text>
        </View>
      )}

      {announcement.blood_type && (
        <View style={styles.infoRow}>
          <Icon name="water" size={16} color="#E91E63" style={{ marginRight: 8 }} />
          <Text style={styles.infoText}>Groupe sanguin : {announcement.blood_type}</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{announcement.author}</Text>
          <Text style={styles.dateText}>
            {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        
        {showActions ? (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionBtn, { marginRight: 12 }]}
              onPress={() => onEdit?.(announcement)}
            >
              <Icon name="pencil" size={16} color="#2E67F8" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => onDelete?.(announcement)}
            >
              <Icon name="delete" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.contactBtn}
            onPress={() => onContact?.(announcement)}
          >
            <Icon name="message" size={16} color="#2E67F8" style={{ marginRight: 4 }} />
            <Text style={styles.contactBtnText}>Contacter</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 11,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2E67F815',
    borderRadius: 8,
  },
  contactBtnText: {
    fontSize: 12,
    color: '#2E67F8',
    fontWeight: '600',
  },
});

export default AnnouncementCard;
