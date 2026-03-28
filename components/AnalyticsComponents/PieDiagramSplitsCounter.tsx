import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { RFValue } from 'react-native-responsive-fontsize';

const { height } = Dimensions.get('window');

type PieDiagramSplitsCounterProps = {
  splitsCounterWithColors: {
    value: number;
    color: string;
    text: string;
  }[];
  workoutCount: number;
};

const PieDiagramSplitsCounter = ({ splitsCounterWithColors, workoutCount }: PieDiagramSplitsCounterProps) => {
  return (
    <PieChart
      data={splitsCounterWithColors}
      donut
      radius={height * 0.1}
      innerRadius={height * 0.08}
      innerCircleColor={'#2979FF'}
      centerLabelComponent={() => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              color: 'white',
              fontSize: RFValue(25),
            }}
          >
            {workoutCount}
          </Text>
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              color: 'white',
              fontSize: RFValue(12),
              marginTop: height * 0.02,
            }}
          >
            Total workouts
          </Text>
        </View>
      )}
    />
  );
};

export default PieDiagramSplitsCounter;
