/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigation } from '@react-navigation/native';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../../shared/constants/colors';
import Column from '../../../../../shared/components/Column';
import Row from '../../../../../shared/components/Row';
import { WorkoutSplitEntity } from '@strong-together/shared';

const { height } = Dimensions.get('window');

type TopSectionProps = {
  hasWorkout: boolean;
  splitsList: WorkoutSplitEntity['name'][];
  setSelectedSplit: Dispatch<SetStateAction<WorkoutSplitEntity['name']>>;
  selectedSplit: WorkoutSplitEntity['name'];
  exerciseCountMap: Record<WorkoutSplitEntity['name'], number>;
  totalExercises: number;
  addSplit: () => void;
  removeSplit: (splitName: WorkoutSplitEntity['name']) => void;
  saveWorkout: () => Promise<void>;
};

const TopSection = ({
  hasWorkout,
  splitsList,
  setSelectedSplit,
  selectedSplit,
  exerciseCountMap,
  totalExercises,
  addSplit,
  removeSplit,
  saveWorkout,
}: TopSectionProps) => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [splitCardW, setSplitCardW] = useState(0);
  // Calculate an x-offset for a given index (includes card width + horizontal margins)
  const getOffsetX = useCallback((index: number) => index * splitCardW, [splitCardW]);

  // Scroll to a specific index safely
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!scrollViewRef.current || !splitCardW) return;
      scrollViewRef.current.scrollTo({
        x: getOffsetX(index),
        animated: true,
      });
    },
    [getOffsetX, splitCardW],
  );

  const handleExit = () => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Exit editing',
      textBody: 'Are you sure you want to exit? Any unsaved progress will be lost.',
      button: 'Exit',
      closeOnOverlayTap: true,
      onPressButton: () => {
        Dialog.hide();
        navigation.goBack();
      },
      onHide: () => {
        Dialog.hide();
      },
    });
  };

  // When selection changes (including after adding a split), scroll it into view
  useEffect(() => {
    if (!selectedSplit) return;
    const idx = splitsList.indexOf(selectedSplit);
    if (idx >= 0) scrollToIndex(idx);
  }, [selectedSplit, splitsList.length, scrollToIndex]);

  return (
    <Column style={styles.container}>
      <Row style={{ justifyContent: 'space-between' }}>
        <TouchableOpacity style={styles.exitBtnContainer} onPress={handleExit}>
          <MaterialCommunityIcons name={'close'} size={RFValue(14)} color={'#1A1A1A'}></MaterialCommunityIcons>
          <Text style={styles.exitBtnText}>Exit</Text>
        </TouchableOpacity>
        <Column>
          <Text style={styles.headerText}>{hasWorkout ? 'Edit workout' : 'Create workout'}</Text>
          <Row style={{ gap: 10 }}>
            <Text style={styles.splitsCountText}>{splitsList.length} splits</Text>
            <Text style={styles.splitsCountText}>{totalExercises} exercises</Text>
          </Row>
        </Column>
        <TouchableOpacity style={styles.saveBtnContainer} onPress={saveWorkout}>
          <MaterialCommunityIcons name={'check'} size={RFValue(14)} color={'white'}></MaterialCommunityIcons>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </Row>

      {/* Splits Bar */}
      <Row
        style={{
          alignItems: 'center',
          width: '100%',
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingTop: 30 }} ref={scrollViewRef}>
          {splitsList.map((split, i) => {
            const isSelectedSplit = selectedSplit === split;
            const exCount = exerciseCountMap[split] ?? 0;
            return (
              <View key={split} onLayout={(e) => setSplitCardW(e.nativeEvent.layout.width)}>
                <TouchableOpacity style={styles.splitsRemoveBtn} onPress={() => removeSplit(split)}>
                  <MaterialCommunityIcons name={'close'} size={RFValue(12)} color={'white'}></MaterialCommunityIcons>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedSplit(split)} key={split}>
                  <Column style={[styles.splitsContainer, isSelectedSplit ? { backgroundColor: colors.primary } : {}]}>
                    <Text style={[styles.splitsText, isSelectedSplit ? { color: 'white' } : {}]}>{split}</Text>
                    <Row style={{ gap: 5 }}>
                      <View style={[styles.dot, isSelectedSplit ? { backgroundColor: 'white' } : {}]}></View>
                      <Text style={[styles.exerciseCountText, isSelectedSplit ? { color: 'white' } : {}]}>
                        {exCount}
                      </Text>
                    </Row>
                  </Column>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.addSplitBtn} onPress={addSplit}>
          <MaterialCommunityIcons name={'plus'} size={RFValue(14)} color={colors.primaryDark}></MaterialCommunityIcons>
        </TouchableOpacity>
      </Row>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.3,
    backgroundColor: colors.lightCardBg,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(18),
  },
  exitBtnContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 7,
  },
  exitBtnText: {
    fontSize: RFValue(12),
    fontFamily: 'Inter_600SemiBold',
    color: colors.textSecondary,
  },
  saveBtnContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    borderRadius: 16,
    gap: 7,
  },
  saveBtnText: {
    fontSize: RFValue(12),
    fontFamily: 'Inter_600SemiBold',
    color: 'white',
  },
  splitsCountText: {
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    fontSize: RFValue(12),
    alignSelf: 'center',
  },
  splitsContainer: {
    height: height * 0.1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    gap: 7,
  },
  splitsRemoveBtn: {
    position: 'absolute',
    aspectRatio: 1,
    top: -5,
    right: 0,
    height: 25,
    borderRadius: 20,
    backgroundColor: 'grey',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitsText: {
    fontFamily: 'Inter_500Medium',
    color: 'black',
    fontSize: RFValue(15),
  },
  dot: {
    height: 6,
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: 'black',
  },
  exerciseCountText: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(10),
  },
  addSplitBtn: {
    height: height * 0.09,
    width: height * 0.09,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    opacity: 0.8,
    borderStyle: 'dashed',
    borderWidth: 1.2,
    borderColor: colors.primaryDark,
    borderRadius: 16,
    marginTop: 30,
    marginLeft: 'auto',
  },
});

export default TopSection;
