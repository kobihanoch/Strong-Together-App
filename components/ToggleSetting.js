import React, { useState } from "react";
import { View, Switch, Text } from "react-native";

export default function ToggleSetting() {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}>
      <Switch
        trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
        thumbColor={isEnabled ? "#22C55E" : "#F9FAFB"}
        ios_backgroundColor="#D1D5DB"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}
