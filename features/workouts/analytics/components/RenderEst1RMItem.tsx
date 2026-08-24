/* eslint-disable @typescript-eslint/no-unused-vars */
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Exercise } from '../../shared/types/workout.types';
import type { AnalyticsRmRecord } from '../types/use-analytics.types';

const { width, height } = Dimensions.get('window');

const RenderEst1RMItem = ({ k, v }: { k: Exercise['id']; v: AnalyticsRmRecord }) => {
  return (
    <View
      style={{
        width: '100%',
        marginTop: height * 0.01,
        paddingHorizontal: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(233, 233, 233, 1)',
        borderWidth: 0.5,
        borderRadius: width * 0.02,
        height: height * 0.068,
      }}
    >
      <View
        style={{
          height: 30,
          width: 30,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.04)',
        }}
      >
        <FontAwesome5 name="dumbbell" size={RFValue(12)} color="black" />
      </View>

      <View style={{ flexDirection: 'column', paddingLeft: 15, flex: 6 }}>
        <Text
          style={{
            fontFamily: 'Inter_700Bold',
            color: 'black',
            fontSize: RFValue(13),
          }}
        >
          {v.exercise}
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            color: 'black',
            fontSize: RFValue(10),
            opacity: 0.5,
            marginTop: 3,
          }}
        >
          {v.prWeight} x {v.prReps}
        </Text>
      </View>

      <View style={{ flexDirection: 'column', flex: 3 }}>
        <Text
          style={{
            fontFamily: 'Inter_700Bold',
            color: 'black',
            fontSize: RFValue(13),
            textAlign: 'right',
          }}
        >
          {v.max1Rm} kg
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            color: 'black',
            fontSize: RFValue(8),
            textAlign: 'right',
          }}
        >
          Est. 1RM
        </Text>
      </View>
    </View>
  );
};

export default RenderEst1RMItem;
