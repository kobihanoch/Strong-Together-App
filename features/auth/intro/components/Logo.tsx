/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

const Logo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Strong. {'\n'}
        <Text style={styles.boldText}>Together.</Text>
      </Text>
      <Image source={require('../assets/logo_512.png')} style={styles.logoImage} />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: RFValue(35),
    color: 'white',
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },
  boldText: {
    fontFamily: 'Inter_700Bold',
  },
  logoImage: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
  },
});
