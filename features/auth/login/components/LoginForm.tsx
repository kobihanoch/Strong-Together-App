import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import InputField from '../../../../shared/components/InputField';
import { useAuth } from '../../shared/providers/AuthProvider';
import { showErrorAlert } from '../../../../shared/errors/error-alerts';
import { forgotPassword } from '../services/login.service';

const { width, height } = Dimensions.get('window');

export default function LoginForm() {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, loading } = useAuth();
  const [isSendingForgot, setIsSendingForgot] = useState<boolean>(false);
  const [forgotCooldown, setForgotCooldown] = useState<number>(0);
  const forgotCooldownUntilRef = useRef<number | null>(null);
  const forgotPasswordLockRef = useRef<number>(0);

  useEffect(() => {
    if (forgotCooldown <= 0) return;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((forgotCooldownUntilRef.current! - Date.now()) / 1000));
      setForgotCooldown(remaining);
      if (remaining === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [forgotCooldown]);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      showErrorAlert('Error', 'Please fill all fields');
      return;
    }
    await login(identifier, password);
  };

  const handleForgotPassword = async () => {
    if (isSendingForgot || forgotCooldown > 0) return;
    if (forgotPasswordLockRef.current >= 3) {
      showErrorAlert('Too many requests', 'You requested too many reset password emails.');
      return;
    }
    if (!identifier?.trim()) {
      showErrorAlert('Missing Information', 'Please enter your email or username first');
      return;
    }

    try {
      setIsSendingForgot(true);
      await forgotPassword(identifier);
      forgotPasswordLockRef.current += 1;
      const COOLDOWN_MS = 45_000;
      forgotCooldownUntilRef.current = Date.now() + COOLDOWN_MS;
      setForgotCooldown(Math.ceil(COOLDOWN_MS / 1000));
    } catch {
    } finally {
      setIsSendingForgot(false);
    }
  };

  return (
    <>
      <Text style={styles.welcomeText}>Welcome back</Text>
      <Text style={styles.loginText}>Log in now</Text>
      <View style={styles.divider} />
      <View style={styles.inputContainer}>
        <InputField
          placeholder="Username or Email"
          iconName="account"
          value={identifier}
          onChangeText={setIdentifier}
        />
        <View style={{ marginTop: 0 }} />
        <InputField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          iconName="lock"
        />
        <TouchableOpacity
          style={[styles.forgotWrapper, { opacity: isSendingForgot || forgotCooldown > 0 ? 0.6 : 1 }]}
          onPress={handleForgotPassword}
          disabled={isSendingForgot || forgotCooldown > 0}
        >
          <View style={styles.rowCenter}>
            {isSendingForgot ? <ActivityIndicator /> : null}
            <Text style={[styles.forgotText, { marginLeft: isSendingForgot ? 8 : 0 }]}>
              {forgotCooldown > 0 ? `Resend in ${forgotCooldown}s` : 'Forgot your password?'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin} disabled={loading}>
          <View style={styles.buttonContent}>
            {loading ? <ActivityIndicator /> : <Text style={styles.buttonLoginText}>Log in</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 40,
    color: 'white',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  loginText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Inter_400Regular',
  },
  divider: {
    height: 0.5,
    width: width * 0.7,
    backgroundColor: 'white',
    marginTop: height * 0.05,
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  forgotWrapper: {
    marginTop: 10,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotText: {
    fontFamily: 'Inter_400Regular',
    color: 'white',
    fontSize: RFValue(10),
    opacity: 0.9,
  },
  buttonLogin: {
    backgroundColor: '#f0f0f0',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    width: width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
    opacity: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: height * 0.015,
  },
  buttonLoginText: {
    fontSize: RFValue(14),
    color: '#007bff',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
});
