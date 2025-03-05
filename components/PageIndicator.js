// PageIndicator.js
import React from 'react';
import { View } from 'react-native';

const PageIndicator = ({ totalPages, currentPage, activeColor = 'white', inactiveColor = '#8ca7d1' }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={{
            height: 8,
            width: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: index === currentPage ? activeColor : inactiveColor,
          }}
        />
      ))}
    </View>
  );
};

export default PageIndicator;
