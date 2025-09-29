// English comments only
import React, { useEffect, useRef, useState, useMemo } from "react";
import { View, Text, Animated, Easing } from "react-native";

export function AdherenceBar({
  name,
  actual = 0,
  planned = 0,
  pct,
  showPct = true,
  changeColors = true, // NEW: animate color changes along the progress (default true)
  colorStatic, // Optional: fixed color when changeColors=false
}) {
  // Compute % and clamp to [0,100]
  const p = pct ?? (planned > 0 ? (actual / planned) * 100 : 0);
  const shown = Math.max(0, Math.min(100, p));

  // Animated progress (0..1) and measured track width
  const progress = useRef(new Animated.Value(0)).current;
  const [trackW, setTrackW] = useState(0);
  const DOT = 12; // dot size in px
  const BAR_H = 10;

  // Helper: map percentage to a color bucket
  const colorFromPct = (percent) => {
    if (percent >= 85) return "#16a34a"; // green
    if (percent >= 60) return "#2979ff"; // blue
    if (percent >= 35) return "#f59e0b"; // orange
    return "#dc2626"; // red
  };

  // Fallback fixed color when changeColors=false (backward compatible behavior)
  const fixedColor = useMemo(() => {
    if (colorStatic) return colorStatic;
    return shown >= 50 ? "#2979ff" : "#dc2626";
  }, [shown, colorStatic]);

  // Current bar color (state only used when changeColors=true)
  const [barColor, setBarColor] = useState(
    changeColors ? colorFromPct(shown) : fixedColor
  );

  // Keep barColor in sync if the inputs change
  useEffect(() => {
    if (!changeColors) {
      setBarColor(fixedColor);
    } else {
      setBarColor(colorFromPct(shown));
    }
  }, [changeColors, shown, fixedColor]);

  // Animate to current percentage
  useEffect(() => {
    Animated.timing(progress, {
      toValue: shown / 100,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width/translateX are layout properties
    }).start();
  }, [shown, progress]);

  // If changeColors=true, update color buckets as the animation progresses
  useEffect(() => {
    if (!changeColors) return;

    // Throttle updates by bucket (avoid setState on every frame)
    let lastBucket = -1;
    const subId = progress.addListener(({ value }) => {
      const percent = Math.round(value * 100);
      const bucket =
        percent >= 85 ? 3 : percent >= 60 ? 2 : percent >= 35 ? 1 : 0;
      if (bucket !== lastBucket) {
        lastBucket = bucket;
        setBarColor(colorFromPct(percent));
      }
    });
    return () => {
      progress.removeListener(subId);
    };
  }, [changeColors, progress]);

  // Interpolations for width and dot position (in px)
  const widthPx = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackW],
  });
  const dotX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(0, trackW - DOT)], // keep dot inside track
  });

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "600" }}>{name}</Text>
        <View style={{ flexDirection: "column", marginTop: -15 }}>
          <Text style={{ opacity: 0.7 }}>
            {showPct ? Math.round(shown) + "%" : null}
          </Text>
        </View>
      </View>

      <View
        // Measure track width once it's laid out
        onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
        style={{
          height: BAR_H,
          backgroundColor: "#e5e7eb",
          borderRadius: 6,
          marginTop: 6,
          position: "relative",
        }}
      >
        {/* Animated fill */}
        <Animated.View
          style={{
            width: widthPx,
            height: BAR_H,
            backgroundColor: barColor,
            borderRadius: 6,
          }}
        />

        {/* White dot at the end of the progress */}
        {trackW > 0 && (
          <Animated.View
            style={{
              position: "absolute",
              top: (BAR_H - DOT) / 2, // vertically center around the bar
              left: 0,
              transform: [{ translateX: dotX }],
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: barColor,
              // subtle elevation/shadow
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        )}
      </View>
    </View>
  );
}
