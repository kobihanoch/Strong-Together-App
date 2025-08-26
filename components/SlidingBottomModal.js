import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const SlidingBottomModal = forwardRef(function SlidingBottomModal(
  {
    data = [],
    renderItem,
    title = "Items",
    snapPoints: snapPointsProp = ["25%", "50%", "90%"],
    initialIndex = -1,
    contentContainerStyle,
    flatListUsage = false,
    children,
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

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  const snapPoints = useMemo(() => snapPointsProp, [snapPointsProp]);

  const Handle = useCallback(() => {
    return (
      <View>
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#C4C4C4",
              alignSelf: "center",
              marginBottom: 10,
              marginTop: 20,
            }}
          ></View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
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
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleComponent={Handle}
        backgroundStyle={styles.sheetBg} // optional, just to see it while testing
      >
        {flatListUsage ? (
          <BottomSheetFlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.contentContainer,
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View>{children}</View>
        )}
      </BottomSheet>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
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
    marginTop: 10,
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

export default SlidingBottomModal;
