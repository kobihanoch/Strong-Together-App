// English comments only inside the code

import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCreateWorkout } from "../../context/CreateWorkoutContext";
// Adjust this import path to where your SlidingBottomModal lives
import SlidingBottomModal from "../../components/SlidingBottomModal";

const { width, height } = Dimensions.get("window");

const ExercisePickerModal = forwardRef(function ExercisePickerModal(_, ref) {
  // Pull DB from context
  const { DB, actions } = useCreateWorkout();

  // Refs for programmatic scrolling inside the sheet
  const sectionListRef = useRef(null);
  const tabsRef = useRef(null);

  // Forward the ref control to the inner bottom sheet (open/close/snapToIndex)
  // SlidingBottomModal already implements the imperative API, so we just pass the ref through.
  const sheetRef = ref;

  // Build sections grouped by targetmuscle
  const sections = useMemo(() => {
    const all = DB?.dbExercises ?? [];
    const map = {};
    for (const ex of all) {
      const key = ex?.targetmuscle ? String(ex.targetmuscle) : "Other";
      if (!map[key]) map[key] = [];
      map[key].push(ex);
    }
    const titles = Object.keys(map).sort((a, b) => a.localeCompare(b));
    return titles.map((title) => ({
      title, // section header is targetmuscle
      data: map[title].sort((a, b) => {
        // sort inside section (first by specifictargetmuscle then by name)
        const sa = String(a?.specifictargetmuscle || "");
        const sb = String(b?.specifictargetmuscle || "");
        if (sa !== sb) return sa.localeCompare(sb);
        return String(a?.name).localeCompare(String(b?.name));
      }),
    }));
  }, [DB?.dbExercises]);

  // Tabs data = section titles (targetmuscle)
  const tabItems = useMemo(() => sections.map((s) => s.title), [sections]);

  // Selected tab (synced with visible section)
  const [selectedTab, setSelectedTab] = useState(tabItems[0] || null);

  // Jump to a section when tapping a tab
  const handlePressTab = useCallback(
    (title) => {
      const sectionIndex = sections.findIndex((s) => s.title === title);
      if (sectionIndex >= 0 && sectionListRef.current?.scrollToLocation) {
        setSelectedTab(title);
        sectionListRef.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          viewPosition: 0,
          animated: true,
        });
        const tabIndex = tabItems.findIndex((t) => t === title);
        if (tabIndex >= 0 && tabsRef.current?.scrollToIndex) {
          tabsRef.current.scrollToIndex({
            index: tabIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }
    },
    [sections, tabItems]
  );

  // Keep tab selection in sync while scrolling the SectionList
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const firstHeader = viewableItems.find(
      (vi) => vi.section && vi.index === null
    );
    const sec = firstHeader?.section?.title;
    if (sec && sec !== selectedTab) {
      setSelectedTab(sec);
      const idx = tabItems.indexOf(sec);
      if (idx >= 0 && tabsRef.current?.scrollToIndex) {
        tabsRef.current.scrollToIndex({
          index: idx,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 10 });

  // Render one exercise card
  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: width * 0.02 }}>
      <TouchableOpacity
        onPress={() => {
          // Add to the current split as the last exercise. No closing logic here.
          actions?.addExercise?.(item);
        }}
        style={styles.card}
        activeOpacity={0.9}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.dot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item?.name}
            </Text>
            <Text style={styles.cardSub} numberOfLines={1}>
              {item?.targetmuscle}
              {item?.specifictargetmuscle
                ? ` • ${item.specifictargetmuscle}`
                : ""}
            </Text>
          </View>
          <View style={styles.choosePill}>
            <Text style={styles.chooseText}>Choose</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Section header = targetmuscle
  const renderSectionHeader = ({ section }) => (
    <View
      style={{
        marginTop: height * 0.03,
        marginBottom: height * 0.03,
        paddingHorizontal: width * 0.02,
      }}
    >
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  // Tab chip
  const renderTab = ({ item }) => {
    const selected = item === selectedTab;
    return (
      <TouchableOpacity
        onPress={() => handlePressTab(item)}
        activeOpacity={0.9}
        style={[
          styles.tabBtn,
          { backgroundColor: selected ? "#2979FF" : "rgb(234,240,246)" },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[styles.tabText, { color: selected ? "white" : "#111" }]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SlidingBottomModal
      ref={sheetRef}
      title="Pick an exercise"
      // Open from parent with: ref.current.open(1)
      snapPoints={["90%", "90%", "100%"]}
      flatListUsage={false}
    >
      {/* Tabs strip (jump between target muscles) */}
      <FlatList
        ref={tabsRef}
        data={tabItems}
        keyExtractor={(it) => it}
        renderItem={renderTab}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: width * 0.02,
          paddingBottom: height * 0.012,
        }}
        getItemLayout={(data, index) => ({
          length: Math.max(38, height * 0.046) + 12,
          offset: (Math.max(38, height * 0.046) + 12) * index,
          index,
        })}
      />

      {/* Sectioned list (section header = targetmuscle) */}
      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.02 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        getItemLayout={(sectionData, index) => {
          // Approximate layout for smoother scrollToLocation on large lists
          return { length: 64, offset: 64 * index, index };
        }}
      />
    </SlidingBottomModal>
  );
});

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(15),
    color: "#1A1A1A",
    opacity: 0.9,
  },
  card: {
    backgroundColor: "rgb(234, 240, 246)",
    borderRadius: width * 0.035,
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.012,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2979FF",
    marginRight: 10,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(13),
    color: "#111",
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(11),
    color: "#58606A",
  },
  choosePill: {
    backgroundColor: "#2979FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chooseText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(11),
  },
  tabBtn: {
    borderRadius: width * 0.025,
    marginHorizontal: width * 0.012,
    paddingHorizontal: 14,
    minWidth: width * 0.22,
    height: Math.max(38, height * 0.046),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
  },
});

export default ExercisePickerModal;
