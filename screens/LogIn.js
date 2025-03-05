import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputField from '../components/InputField'; 
import CryptoJS from 'crypto-js';
import Validators from '../components/Validators';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import supabase from '../src/supabaseClient';  
import { useAuth } from '../context/AuthContext'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); 

    const handleLogin = async () => {
        const errorMessages = validateInputs();
        
        if (errorMessages.length === 0) {
            const hashedPassword = CryptoJS.SHA256(password).toString();  // Hashing
            
            try {
                
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('username', username); 

                if (error) {
                    console.error('Supabase error:', error);
                    Alert.alert('Login Failed', 'An error occurred while fetching user data.');
                    return;
                }

                if (!data || data.length === 0) {
                    Alert.alert('Login Failed', 'User not found.');
                    return;
                }

                const userData = data[0];  

                if (!userData || !userData.username || !userData.passwordhash) {
                    console.error('Invalid user data:', userData);
                    Alert.alert('Login Failed', 'Invalid user data received.');
                    return;
                }

                // השוואת הסיסמה המוצפנת
                if (userData.passwordhash === hashedPassword) {
                    const userContextData = { 
                        username: userData.username,  
                        name: userData.name,        
                        email: userData.email ,  
                        id: userData.id
                        // Need to add more user properties (Like profile pic, etc..)
                    };
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                    await AsyncStorage.setItem('user', JSON.stringify(userData));
                    console.log('Login successful. User data:', userContextData);
                    login(userContextData);  
                    navigation.navigate('Home'); 
                } else {
                    console.log('Incorrect password for user:', username);
                    Alert.alert('Login Failed', 'Incorrect password.');
                }
            } catch (error) {
                console.error('Error logging in:', error.message);
                Alert.alert('Login Failed', 'An error occurred while logging in.');
            }
        } else {
            Alert.alert('Login Failed', errorMessages.join('\n'));
        }
    };

    const validateInputs = () => {
        let errorMessages = [];

        const usernameError = Validators({ value: username, type: 'username' });
        if (usernameError) errorMessages.push(usernameError);

        const passwordError = Validators({ value: password, type: 'password' });
        if (passwordError) errorMessages.push(passwordError);

        return errorMessages;
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
        >
            <LinearGradient colors={['#007bff', '#004fa3']} style={{flex: 1}}>
                <View style={{flex: 1, marginTop: height * 0.08}}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name="arrow-left" size={20} color="white" />
                                <Text style={styles.introText}>Intro</Text>
                            </View>
                        </TouchableOpacity>
                        <Image source={require('../assets/minilogoNew.png')} style={styles.logoImage} />
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.loginText}>Log in now</Text>

                        <View style={styles.divider}/>

                        <View style={styles.inputContainer}>
                            <InputField 
                                placeholder="Username"
                                iconName="user"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <View style={{marginTop: 0}} />
                            <InputField 
                                placeholder="Password"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                iconName={"lock"} 
                            />
                            <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonLoginText}>Log in</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </KeyboardAwareScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    header: {
        marginLeft: width * 0.05, 
        flexDirection: 'row', 
        justifyContent: 'space-between',
    },
    introText: {
        justifyContent: 'center', 
        fontSize: 17, 
        marginLeft: 10, 
        color: 'white', 
        fontFamily: 'PoppinsRegular',
    },
    logoImage: {
        width: 30, 
        height: 30, 
        resizeMode: 'contain', 
        marginRight: width * 0.055,
    },
    body: {
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1,
    },
    welcomeText: {
        fontSize: 40, 
        color: 'white', 
        fontFamily: 'PoppinsRegular', 
        textAlign: 'center',
    },
    loginText: {
        fontSize: 20, 
        color: 'white', 
        fontFamily: 'PoppinsRegular',
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
    buttonLogin: {
        backgroundColor: '#f0f0f0',
        paddingVertical: height * 0.01, 
        paddingHorizontal: width * 0.1, 
        borderRadius: 25,
        width: width * 0.45,  
        justifyContent: 'center',  
        alignItems: 'center',
        marginTop: height * 0.04,    
    },
    buttonContent: {
        flexDirection: 'row',       
        justifyContent: 'center', 
        alignItems: 'center',      
        width: '100%',
        paddingVertical: height * 0.015,
    },
    buttonLoginText: {
        fontSize: 18,
        color: '#007bff',
        flex: 1,                   
        textAlign: 'center',
        fontFamily: 'PoppinsRegular',
    },
});
