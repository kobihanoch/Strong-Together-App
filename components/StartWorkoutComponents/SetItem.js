// SetItem.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const SetItem = ({ index, sets, flatListHeight, exercisetosplit_id, handleUpdateSet }) => {
  const isFirstItem = index === 0;
  const isLastItem = index === sets.length - 1;

  const handleRepsChange = (text) => {
    const reps = parseInt(text, 10) || 0;
    handleUpdateSet(exercisetosplit_id, null, reps, index); // שליחת ערך החזרות ל-ExerciseItem
  };

  return (
    <View style={[styles.setContainer, { height: flatListHeight, }]}>
      <View style={{ flex: 0.15, justifyContent: 'flex-end', }}>
        <FontAwesome5
          name="arrow-up"
          color={isFirstItem ? 'transparent' : '#00142a'}
          size={15}
        />
      </View>

      <View style={{ flex: 0.7, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'flex-end', }}>
          <Text style={styles.setLabel}>Set {index + 1}</Text>
        </View>

        <View style={{flex: 0.1, alignItems: 'center',}}>
          <View style={{ height: height * 0.12, width: 1, backgroundColor: '#00142a', opacity: 0.2 }}></View>
        </View>

        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'flex-start', }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              onEndEditing={(event) => handleUpdateSet(exercisetosplit_id, event.nativeEvent.text, null, index)}
            />
            <Text style={{fontFamily: 'PoppinsRegular', fontSize: RFValue(15), marginLeft: width * 0.03, opacity: 0.7}}>Kg</Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              onEndEditing={(event) => handleUpdateSet(exercisetosplit_id, null, event.nativeEvent.text, index)}
            />
            <Text style={{fontFamily: 'PoppinsRegular', fontSize: RFValue(15), marginLeft: width * 0.03,  opacity: 0.7}}>Reps</Text>
          </View>
          
          
        </View>
      </View>

      <View style={{ flex: 0.15, justifyContent: 'flex-start' }}>
        <FontAwesome5
          name="arrow-down"
          color={isLastItem ? 'transparent' : '#00142a'}
          size={15}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  setContainer: {
    alignItems: 'center',
    width: '80%',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  setLabel: {
    fontSize: RFValue(25),
    color: '#00142a',
    marginRight: width * 0.05
  },
  input: {
    backgroundColor: '#fafafa',
    width: '50%',
    fontFamily: 'PoppinsBold',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 5,
    marginBottom: 5,
    fontSize: RFValue(10),
    justifyContent: 'center',
    textAlign: 'center',
  },
});

export default SetItem;

