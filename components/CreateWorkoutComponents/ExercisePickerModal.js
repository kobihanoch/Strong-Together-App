// English comments only inside code

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCreateWorkout } from "../../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");
const SHEET_MAX_H = Math.min(height * 0.85, 720);

const ExercisePickerModal = ({ visible, onClose }) => {
  // Pull DB from context
  const { DB } = useCreateWorkout();

  // Animated sheet + backdrop
  const translateY = useRef(new Animated.Value(SHEET_MAX_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Refs for programmatic scrolling
  const sectionListRef = useRef(null);
  const tabsRef = useRef(null);

  // Sections are grouped by targetmuscle; titles are targetmuscle
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

  // Animate in/out
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    } else {
      translateY.setValue(SHEET_MAX_H);
      backdropOpacity.setValue(0);
    }
  }, [visible, translateY, backdropOpacity]);

  const handleCloseAnimated = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
        easing: Easing.in(Easing.quad),
      }),
      Animated.timing(translateY, {
        toValue: SHEET_MAX_H,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(({ finished }) => {
      if (finished) onClose();
    });
  }, [onClose, backdropOpacity, translateY]);

  // Scroll to section by tab press
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
        // Also center the pressed tab in the tabs FlatList
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

  // Sync selected tab while user scrolls the SectionList
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    // Find first visible section header
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
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
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
  );

  // Section header = targetmuscle
  const renderSectionHeader = ({ section }) => (
    <View style={{ marginTop: height * 0.01, marginBottom: height * 0.006 }}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  // Tabs row (FlatList horizontal) for targetmuscle jump
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
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleCloseAnimated}
    >
      <Pressable
        onPress={handleCloseAnimated}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.55)", opacity: backdropOpacity },
          ]}
        />
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          onStartShouldSetResponder={() => true}
          onResponderStart={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Pick an exercise</Text>
            <TouchableOpacity
              onPress={handleCloseAnimated}
              activeOpacity={0.8}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

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
              length: Math.max(38, height * 0.046) + 12, // approximate for smooth scrollToIndex
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
              // Optional: implement more precise layout if lists are very large
              return { length: 64, offset: 64 * index, index };
            }}
          />
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    width: "100%",
    height: SHEET_MAX_H,
    backgroundColor: "#fff",
    borderTopLeftRadius: width * 0.06,
    borderTopRightRadius: width * 0.06,
    paddingTop: height * 0.018,
    paddingHorizontal: width * 0.045,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.012,
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(16),
    color: "#111",
  },
  closeBtn: {
    height: 36,
    minWidth: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 12,
  },
  closeText: {
    fontSize: RFValue(12),
    color: "#111",
    fontFamily: "Inter_600SemiBold",
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(12),
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
