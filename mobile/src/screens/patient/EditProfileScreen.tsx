import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const EditProfileScreen = ({ navigation }: any) => {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
      });
      setUser(res.data);
      Alert.alert('Succès', 'Profil mis à jour !');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erreur', e?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Modifier le profil</Text>
        
        <CustomInput
          label="Prénom"
          placeholder="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          icon="account-outline"
        />

        <CustomInput
          label="Nom"
          placeholder="Nom"
          value={lastName}
          onChangeText={setLastName}
          icon="account-outline"
        />

        <CustomInput
          label="Téléphone"
          placeholder="Téléphone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          icon="phone-outline"
        />

        <CustomInput
          label="Adresse"
          placeholder="Adresse"
          value={address}
          onChangeText={setAddress}
          icon="map-marker-outline"
        />

        <CustomButton
          title="Enregistrer les modifications"
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: 24 }}
        />
        
        <CustomButton
          title="Annuler"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  content: { 
    padding: 24 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 24, 
    color: '#333' 
  },
});

export default EditProfileScreen;
