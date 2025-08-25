import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { RFValue } from "react-native-responsive-fontsize";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const BottomModalFlatlist = forwardRef(function BottomModalFlatlist(
  {
    data = [],
    renderItem,
    title = "Items",
    snapPoints: snapPointsProp = ["25%", "50%", "90%"],
    initialIndex = -1,
    contentContainerStyle,
  },
  ref
) {
  const sheetRef = useRef(null);

  // Imperative API
  useImperativeHandle(ref, () => ({
    open: (i = 1) => sheetRef.current?.snapToIndex?.(i),
    close: () => sheetRef.current?.close?.(),
    snapToIndex: (i) => sheetRef.current?.snapToIndex?.(i),
  }));

  const snapPoints = useMemo(() => snapPointsProp, [snapPointsProp]);

  const Handle = useCallback(() => {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#C4C4C4",
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 10,
            }}
          ></View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity
              onPress={() => sheetRef.current?.close?.()}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeX}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [title]);

  const keyExtractor = useCallback((item, index) => {
    if (Array.isArray(item)) return String(item[0]);
    if (item && (item.id ?? item.key)) return String(item.id ?? item.key);
    return String(index);
  }, []);

  return (
    <GestureHandlerRootView
      style={StyleSheet.absoluteFill}
      pointerEvents="box-none"
    >
      <BottomSheet
        ref={sheetRef}
        index={initialIndex} // start closed
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        handleComponent={Handle}
        backgroundStyle={styles.sheetBg} // optional, just to see it while testing
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.contentContainer,
            contentContainerStyle,
          ]}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(15),
    color: "black",
  },
  closeBtn: {
    position: "absolute",
    right: 12,
    top: 8,
    bottom: 8,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  closeX: {
    fontSize: 22,
    lineHeight: 22,
    color: "black",
  },
  contentContainer: {
    backgroundColor: "white",
    padding: width * 0.05,
  },
});

export default BottomModalFlatlist;
