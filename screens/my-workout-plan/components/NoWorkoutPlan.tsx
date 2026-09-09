import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const { width } = Dimensions.get('window');

type NoWorkoutPlanProps = {
  onCreatePress: () => void;
};

// Reusable empty-state screen for when there's no workout plan
const NoWorkoutPlan = ({ onCreatePress }: NoWorkoutPlanProps) => {
  const { colors } = useAppTheme();
  return (
    <View style={[stylesNW.container, { backgroundColor: colors.canvas }]}>
      {/* Icon + soft badge */}
      <View style={stylesNW.illustrationWrap}>
        <View style={[stylesNW.circleOuter, { backgroundColor: colors.surfaceMuted }]}>
          <View style={[stylesNW.circleMid, { backgroundColor: colors.surface }]}>
            <View style={[stylesNW.circleInner, { backgroundColor: colors.primarySoft }]}>
              <MaterialCommunityIcons name="dumbbell" size={RFValue(36)} color={colors.primary} />
            </View>
          </View>
        </View>
      </View>

      {/* Title + subtitle */}
      <Text style={[stylesNW.title, { color: colors.textPrimary }]}>No workout plan yet</Text>
      <Text style={[stylesNW.subtitle, { color: colors.textSecondary }]}>
        Create your first split and add exercises. Keep it simple - you can edit anytime.
      </Text>

      {/* Primary and secondary actions */}
      <View style={stylesNW.actionsRow}>
        <TouchableOpacity style={[stylesNW.btn, { backgroundColor: colors.primary }]} onPress={onCreatePress}>
          <MaterialCommunityIcons name="plus" size={RFValue(14)} color="white" />
          <Text style={stylesNW.btnPrimaryText}>Create workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const stylesNW = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  // Illustration
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E9EEF9',
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(10),
    color: '#2979FF',
  },
  circleOuter: {
    width: width * 0.42,
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  circleMid: {
    width: '78%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: '72%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(18),
    color: 'black',
    marginTop: 6,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
    marginHorizontal: 6,
    lineHeight: RFValue(18),
  },

  // Buttons
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnPrimary: {
    backgroundColor: '#2979FF',
  },
  btnPrimaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(12),
    color: 'white',
  },
  btnGhost: {
    backgroundColor: '#ECF2FF',
  },
  btnGhostText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(12),
    color: '#2979FF',
  },

  // Link
  linkBtn: {
    marginTop: 12,
    padding: 6,
  },
  linkBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(12),
    color: '#2979FF',
    opacity: 0.9,
  },
});

export default NoWorkoutPlan;
