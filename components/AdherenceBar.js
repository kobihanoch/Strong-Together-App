import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing } from "react-native";

export function AdherenceBar({
  name,
  actual = 0,
  planned = 0,
  pct,
  showPct = true,
}) {
  // Compute % and clamp to [0,100]
  const p = pct ?? (planned > 0 ? (actual / planned) * 100 : 0);
  const shown = Math.max(0, Math.min(100, p));
  const color = shown >= 50 ? "#2979ff" : "#dc2626";

  // Animated progress (0..1) and measured track width
  const progress = useRef(new Animated.Value(0)).current;
  const [trackW, setTrackW] = useState(0);
  const DOT = 12; // dot size in px
  const BAR_H = 10;

  // Animate to current percentage
  useEffect(() => {
    Animated.timing(progress, {
      toValue: shown / 100,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width/translateX are layout properties
    }).start();
  }, [shown, progress]);

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
            backgroundColor: color,
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
              borderColor: color,
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
