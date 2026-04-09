import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FormData {
  title: string;
  description: string;
  type: 'blood_donation' | 'patient_search' | 'other';
  author: string;
  author_email: string;
  location: string;
  blood_type: string;
  urgency: 'low' | 'medium' | 'high';
  contact: string;
}

interface AnnouncementFormProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  const updateField = (field: keyof FormData, value: string) => {
    onChange({ [field]: value });
  };

  const OptionButton = ({ 
    selected, 
    onPress, 
    children 
  }: { 
    selected: boolean; 
    onPress: () => void; 
    children: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[
        styles.optionBtn,
        selected && styles.selectedOptionBtn
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.optionText,
        selected && styles.selectedOptionText
      ]}>{children}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.formContainer}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => updateField('title', text)}
          placeholder="Titre de l'annonce"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="Description détaillée"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Type</Text>
        <View style={styles.buttonGroup}>
          <OptionButton
            selected={formData.type === 'other'}
            onPress={() => updateField('type', 'other')}
          >
            Autre
          </OptionButton>
          <OptionButton
            selected={formData.type === 'blood_donation'}
            onPress={() => updateField('type', 'blood_donation')}
          >
            Don de sang
          </OptionButton>
          <OptionButton
            selected={formData.type === 'patient_search'}
            onPress={() => updateField('type', 'patient_search')}
          >
            Recherche patient
          </OptionButton>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Auteur *</Text>
        <TextInput
          style={styles.input}
          value={formData.author}
          onChangeText={(text) => updateField('author', text)}
          placeholder="Nom de l'auteur"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email auteur *</Text>
        <TextInput
          style={styles.input}
          value={formData.author_email}
          onChangeText={(text) => updateField('author_email', text)}
          placeholder="email@exemple.com"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Lieu</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => updateField('location', text)}
          placeholder="Lieu (optionnel)"
        />
      </View>

      {formData.type === 'blood_donation' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Groupe sanguin</Text>
          <TextInput
            style={styles.input}
            value={formData.blood_type}
            onChangeText={(text) => updateField('blood_type', text)}
            placeholder="O+, A-, etc."
          />
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Urgence</Text>
        <View style={styles.buttonGroup}>
          <OptionButton
            selected={formData.urgency === 'low'}
            onPress={() => updateField('urgency', 'low')}
          >
            Normal
          </OptionButton>
          <OptionButton
            selected={formData.urgency === 'medium'}
            onPress={() => updateField('urgency', 'medium')}
          >
            Modéré
          </OptionButton>
          <OptionButton
            selected={formData.urgency === 'high'}
            onPress={() => updateField('urgency', 'high')}
          >
            Urgent
          </OptionButton>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Contact *</Text>
        <TextInput
          style={styles.input}
          value={formData.contact}
          onChangeText={(text) => updateField('contact', text)}
          placeholder="Téléphone ou email"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedOptionBtn: {
    backgroundColor: '#2E67F8',
    borderColor: '#2E67F8',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
});

export default AnnouncementForm;
