import React from 'react';
import { Dimensions, StyleSheet, TextInput, View, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface InputFieldProps extends TextInputProps {
  iconName: string;
  style?: StyleProp<ViewStyle>;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  iconName,
  textContentType,
  autoComplete,
  style,
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#e0efff"
        textContentType={textContentType}
        autoComplete={autoComplete}
      />
      <MaterialCommunityIcons name={iconName} size={RFValue(12)} color={'white'} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: height * 0.013,
    marginVertical: height * 0.01,
    backgroundColor: 'transparent',
    width: width * 0.5,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingRight: width * 0.03,
    fontFamily: 'Inter_400Regular',
    fontSize: width * 0.04,
    textAlign: 'left',
  },
  icon: {
    marginRight: 0,
  },
});

export default InputField;
