import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SlidingBottomModal, { SlidingBottomModalRef } from '../../../../shared/components/SlidingBottomModal';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import ExerciseLibrarySheet from '../components/ExerciseLibrarySheet';
import PlanEditorActions from '../components/PlanEditorActions';
import PlanEditorHeader from '../components/PlanEditorHeader';
import PlanExerciseList from '../components/PlanExerciseList';
import useEditWorkoutPlan from '../hooks/use-edit-workout-plan.hook';

const CreateWorkout = () => {
  const { data, actions } = useEditWorkoutPlan();
  const exerciseSheet = useRef<SlidingBottomModalRef>(null);
  const splitSheet = useRef<SlidingBottomModalRef>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const gutter = Math.max(14, Math.min(width * 0.045, 20));
  const headerRadius = Math.max(26, Math.min(width * 0.075, 34));

  if (data.isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: data.theme.canvas }]}>
        <ActivityIndicator color={data.theme.primary} />
      </View>
    );
  }

  const split = data.selectedSplit;
  if (!split) return null;

  return (
    <View style={[styles.screen, { backgroundColor: data.theme.canvas }]}>
      <SafeAreaView style={styles.screen} edges={[]}>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <PlanEditorHeader
              splits={data.splits}
              selectedIndex={data.selectedSplitIndex}
              isCreateMode={data.isCreateMode}
              isDirty={data.isDirty}
              isSaving={data.isSaving}
              topInset={insets.top}
              radius={headerRadius}
              theme={data.theme}
              onCancel={actions.cancel}
              onSave={actions.save}
              onSelect={actions.selectSplit}
              onRename={actions.renameSplit}
              onAddSplit={actions.addSplit}
              onSplitOptions={() => splitSheet.current?.open(0)}
            />

            <View style={[styles.heading, { paddingHorizontal: gutter }]}>
              <Text style={[styles.headingText, { color: data.theme.textPrimary }]}>{split.name} exercises</Text>
              <Text style={[styles.meta, { color: data.theme.textSecondary }]}>
                Hold and drag to reorder · {split.exercises.length} of 12
              </Text>
            </View>

            {split.exercises.length ? (
              <PlanExerciseList
                exercises={split.exercises}
                exercisesById={data.exercisesById}
                expandedExerciseId={data.expandedExerciseId}
                horizontalPadding={gutter}
                theme={data.theme}
                onToggle={actions.toggleExercise}
                onRemove={actions.removeExercise}
                onReorder={actions.reorderExercises}
                onSetCount={actions.updateSetCount}
                onRep={actions.updateRep}
              />
            ) : (
              <View style={styles.empty}>
                <Text style={[styles.emptyTitle, { color: data.theme.textPrimary }]}>Build {split.name}</Text>
                <Text style={[styles.emptyCopy, { color: data.theme.textSecondary }]}>Add the exercises you want in this split.</Text>
              </View>
            )}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>

      <PlanEditorActions
        horizontalPadding={gutter}
        bottomInset={insets.bottom}
        isCreateMode={data.isCreateMode}
        isSaving={data.isSaving}
        theme={data.theme}
        onAdd={() => exerciseSheet.current?.open(1)}
        onSave={actions.save}
      />

      <ExerciseLibrarySheet
        modalRef={exerciseSheet}
        height={height}
        split={split}
        exercises={data.filteredExercises}
        isLoading={data.exercisesLoading}
        muscles={data.muscles}
        selectedMuscle={data.selectedMuscle}
        query={data.exerciseQuery}
        theme={data.theme}
        themeMode={data.themeMode}
        onQuery={actions.setExerciseQuery}
        onMuscle={actions.setSelectedMuscle}
        onAdd={actions.addExercise}
      />

      <SlidingBottomModal ref={splitSheet} title="Split options" snapPoints={['32%', '42%']} flatListUsage={false}>
        <View style={[styles.options, { backgroundColor: data.theme.surface }]}>
          <TextInput
            value={split.name}
            onChangeText={actions.renameSplit}
            maxLength={32}
            style={[styles.renameInput, { color: data.theme.textPrimary, borderColor: data.theme.border }]}
          />
          <Pressable
            disabled={data.splits.length === 1}
            onPress={() => {
              actions.removeSelectedSplit();
              splitSheet.current?.close();
            }}
            style={styles.deleteRow}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={fontSizes.title} color={data.theme.textSecondary} />
            <Text style={[styles.deleteText, { color: data.theme.textSecondary, opacity: data.splits.length === 1 ? 0.4 : 1 }]}>
              Delete split
            </Text>
          </Pressable>
        </View>
      </SlidingBottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { paddingTop: 16, paddingBottom: 10 },
  headingText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.title },
  meta: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label, marginTop: 3 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 120 },
  emptyTitle: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.title },
  emptyCopy: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, marginTop: 6, textAlign: 'center' },
  options: { paddingHorizontal: 18, paddingBottom: 30 },
  label: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 1 },
  renameInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 8,
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.body,
  },
  deleteRow: { height: 54, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  deleteText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
});

export default CreateWorkout;
