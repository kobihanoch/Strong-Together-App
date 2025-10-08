import React, { useEffect, useState } from "react";
import { Modal, Text, View, TouchableOpacity, Linking } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  registerUpdateModal,
  unregisterUpdateModal,
} from "../utils/imperativeUpdateModal";

export default function UpdateAppModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Register imperative methods on mount
    const ctrl = {
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
    registerUpdateModal(ctrl);
    return () => unregisterUpdateModal();
  }, []);

  if (!open) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 24,
            borderRadius: 14,
            width: "86%",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(16),
              fontFamily: "Inter_600SemiBold",
              marginBottom: 8,
            }}
          >
            Update required
          </Text>
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: "Inter_400Regular",
              marginBottom: 16,
            }}
          >
            A newer app version is required. Please update to continue.
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("itms-apps://itunes.apple.com/app/id6745721821")
            }
            style={{
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: "#2979FF",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: RFValue(14),
                fontFamily: "Inter_600SemiBold",
              }}
            >
              Open App Store
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
