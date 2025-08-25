import React from "react";
import { View, Text } from "react-native";

export function AdherenceBar({ name, actual = 0, planned = 0, pct }) {
  const p = pct ?? (planned > 0 ? (actual / planned) * 100 : 0);
  const shown = Math.max(0, Math.min(100, p));
  const color = p >= 50 ? "#2979ff" : "#dc2626";

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "600" }}>{name}</Text>
        <View style={{ flexDirection: "column", marginTop: -15 }}>
          <Text style={{ opacity: 0.7 }}>{Math.round(p)}%</Text>
        </View>
      </View>
      <View
        style={{
          height: 10,
          backgroundColor: "#e5e7eb",
          borderRadius: 6,
          marginTop: 6,
        }}
      >
        <View
          style={{
            width: `${shown}%`,
            height: 10,
            backgroundColor: color,
            borderRadius: 6,
          }}
        />
      </View>
    </View>
  );
}
