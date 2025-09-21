import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Dimensions, StyleSheet, Text, View, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { BlurView } from "expo-blur";
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

// Custom backdrop with Blur + dark overlay
const CustomBackdrop = ({
  animatedIndex,
  close,
  blurIntensity = 24,
  tint = "light",
  overlayAlpha = 0.25,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedIndex.value,
        [-1, 0, 1],
        [0, 1, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View
      pointerEvents="auto"
      style={[StyleSheet.absoluteFill, animatedStyle]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={close}>
        <BlurView
          intensity={blurIntensity}
          tint={tint}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: `rgba(0,0,0,${overlayAlpha})` },
          ]}
        />
      </Pressable>
    </Animated.View>
  );
};

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
    enableBackDrop = true,
    enablePanDownClose = true,
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
      <CustomBackdrop
        {...props}
        close={() => sheetRef.current?.close?.()}
        blurIntensity={22}
        tint="dark"
        overlayAlpha={0.2}
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
          />
          {title && (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          )}
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
        index={initialIndex}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={enableBackDrop ? renderBackdrop : undefined}
        enablePanDownToClose={enablePanDownClose}
        handleComponent={Handle}
        backgroundStyle={styles.sheetBg}
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
  contentContainer: {
    backgroundColor: "white",
    padding: width * 0.05,
  },
});

export default SlidingBottomModal;
