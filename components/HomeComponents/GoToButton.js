import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const GoToButton = ({
  backgroundColor = '#F3F4F6',
  borderRadius = 10,
  borderColor = '#000',
  borderWidth = 0,
  shadowEnabled = true,
  shadow = {},
  onPress,
  children
}) => {
  // הגדרות צל ברירת מחדל
  const defaultShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          borderRadius,
          borderColor,
          borderWidth,
          // אם shadowEnabled שווה ל-true נוסיף את הצל, אחרת נשתמש במערך ריק
          ...(shadowEnabled ? { ...defaultShadow, ...shadow } : {}),
        }
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoToButton;
