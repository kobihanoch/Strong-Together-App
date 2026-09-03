import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { fontFamilies, fontSizes } from '../constants/typography';
import { useAppTheme } from '../providers/AppThemeProvider';
import { useAuth } from '../../features/auth/providers/AuthProvider.tsx';
import { RootParamList } from '../../navigation/types/appStackTypes';

type RouteName = keyof RootParamList;

const BottomTabBar = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors } = useAppTheme();

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
  const navDisabled = false;

  const handleTabPress = (tabName: RouteName) => {
    navigation.navigate(tabName as never);
  };

  const tabs: { name: RouteName; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }[] = [
    { name: 'Home', icon: 'home-variant-outline', label: 'Home' },
    { name: 'MyWorkoutPlan', icon: 'calendar-blank-outline', label: 'Plan' },
    { name: 'TrackHistory', icon: 'chart-bar', label: 'Progress' },
    { name: 'Profile', icon: 'account-outline', label: 'Profile' },
  ];

  return (
    !isWorkoutMode &&
    routeName !== 'CreateWorkout' && (
      <View style={[styles.tabBarContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {tabs.map((tab, index) => {
          const isActive = routeName === tab.name || (tab.name === 'Profile' && routeName === 'Settings');

          return (
            <TouchableOpacity key={index} style={styles.tabButton} onPress={() => handleTabPress(tab.name)} disabled={navDisabled}>
              <View style={[styles.iconContainer, isActive && { backgroundColor: colors.primarySoft }]}>
                <MaterialCommunityIcons name={tab.icon} size={RFValue(19)} color={isActive ? colors.primary : colors.textSecondary} />
              </View>
              <Text
                style={[styles.tabLabel, { color: isActive ? colors.primary : colors.textSecondary }, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    minHeight: 76,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 12,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 42,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
  },
  tabLabelActive: {
    fontFamily: fontFamilies.semiBold,
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
