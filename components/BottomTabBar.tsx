import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuth } from '../context/AuthContext';
import { useGlobalAppLoadingContext } from '../context/GlobalAppLoadingContext';
import { RootParamList } from '../navigation/types/appStackTypes';

const { width, height } = Dimensions.get('window');

type RouteName = keyof RootParamList;

const BottomTabBar = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { isLoading } = useGlobalAppLoadingContext();

  const routeName = useNavigationState((state) => {
    if (!state?.routes || state.index === undefined) return 'Home';

    const appRoute = state.routes[state.index];
    const nested = appRoute?.state;

    if (nested?.routes?.length && nested.index !== undefined) {
      const inner = nested.routes[nested.index];
      return inner?.name ?? appRoute?.name ?? 'Home';
    }
    return appRoute?.name ?? 'Home';
  });

  const { isWorkoutMode } = useAuth();
  const navDisabled = isLoading;

  const handleTabPress = (tabName: RouteName) => {
    navigation.navigate(tabName as never);
  };

  const tabs: { name: RouteName; icon: keyof typeof MaterialCommunityIcons.glyphMap; label?: string }[] = [
    { name: 'Home', icon: 'home-variant' },
    { name: 'Statistics', icon: 'poll' },
    { name: 'MyWorkoutPlan', label: 'StartWorkout', icon: 'fire' },
    { name: 'Profile', icon: 'account' },
    { name: 'Settings', icon: 'wrench' },
  ];

  return (
    !isWorkoutMode && (
      <View style={styles.tabBarContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, tab.name === 'MyWorkoutPlan' && styles.specialTabButton]}
            onPress={() => handleTabPress(tab.name)}
            disabled={navDisabled}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={RFValue(20)}
              color={routeName === tab.name ? '#2979FF' : 'rgb(184, 184, 184)'}
              style={tab.name === 'MyWorkoutPlan' ? styles.specialIcon : undefined}
            />
          </TouchableOpacity>
        ))}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.12,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingBottom: height * 0.02,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    width: width * 0.2,
    marginHorizontal: height * -0.002,
  },
  specialTabButton: {
    backgroundColor: '#2979FF',
    borderRadius: width * 0.15,
    padding: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  specialIcon: {
    color: 'white',
  },
  timerText: {
    color: '#2979FF',
    fontSize: RFValue(12),
    fontFamily: 'Inter_700Bold',
  },
  exitButton: {
    color: '#2979FF',
    fontSize: RFValue(12),
    fontFamily: 'Inter_700Bold',
  },
});

export default BottomTabBar;
