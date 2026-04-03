import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import api from '../../api/axios';

import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';

const RegisterScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role: 'patient',
      });
      Alert.alert('Succès', 'Compte créé avec succès. Vous pouvez maintenant vous connecter.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      console.error(error);
      let message = error.response?.data?.message || 'Une erreur est survenue';
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        message += '\n' + error.response.data.errors.map((e: any) => e.msg).join('\n');
      }
      Alert.alert('Erreur d\'inscription', message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={styles.subtitle}>Créez votre compte RdvSante</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Prénom"
              placeholder="Ex: Jean"
              value={firstName}
              onChangeText={setFirstName}
              icon="account-outline"
            />

            <CustomInput
              label="Nom"
              placeholder="Ex: Dupont"
              value={lastName}
              onChangeText={setLastName}
              icon="account-outline"
            />

            <CustomInput
              label="Email"
              placeholder="jean.dupont@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              icon="email-outline"
            />

            <CustomInput
              label="Téléphone"
              placeholder="06 34 56 78"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="phone-outline"
            />

            <CustomInput
              label="Mot de passe"
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock-outline"
            />

            <CustomInput
              label="Confirmer le mot de passe"
              placeholder="********"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon="lock-check-outline"
            />

            <CustomButton
              title="S'inscrire"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: 16 }}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 100,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  registerBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#2E67F8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  registerBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  footerText: {
    color: 'gray',
  },
  loginText: {
    color: '#2E67F8',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
