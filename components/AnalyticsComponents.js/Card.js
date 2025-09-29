import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const Card = ({
  title,
  titleSize,
  titleFont,
  subtitle,
  children,
  iconName,
  iconBgColor,
  iconW,
  iconH,
  headerRight,
  height,
  style,

  // colors
  titleColor = "#111827",
  subtitleColor = "#6B7280",
  iconColor = "#919191",

  // gradient
  useGradient = false,
  gradientColors = ["#FFFFFF", "#F7F7F7"],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },

  // border
  useBorder = true,
  borderColor = "rgba(0,0,0,0.06)",
  borderWidth = 1,
}) => {
  const Bg = useGradient ? LinearGradient : View;
  const bgProps = useGradient
    ? { colors: gradientColors, start: gradientStart, end: gradientEnd }
    : {};

  return (
    <View
      style={[
        styles.wrapper,
        useBorder ? { borderWidth, borderColor } : { borderWidth: 0 },
        height ? { minHeight: height } : null,
        style,
      ]}
    >
      <Bg {...bgProps} style={[styles.inner, !useGradient && styles.solid]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.title,
                {
                  color: titleColor,
                  fontSize: titleSize ? titleSize : RFValue(17),
                  fontFamily: titleFont ? titleFont : "Inter_700Bold",
                },
              ]}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: subtitleColor }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Right-top icon or custom element */}
          {headerRight ? (
            <View style={styles.icon}>
              <Text>{headerRight}</Text>
            </View>
          ) : iconName ? (
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: iconBgColor
                    ? iconBgColor
                    : "rgba(0,0,0,0.04)",
                  width: iconW ?? 32,
                  height: iconH ?? 32,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={18}
                color={iconColor}
              />
            </View>
          ) : null}
        </View>

        {/* Body */}
        <View style={styles.body}>{children}</View>
      </Bg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  inner: {
    padding: width * 0.05,
    flex: 1,
  },
  solid: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: RFValue(17),
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: RFValue(12),
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  icon: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  body: {},
});

export default Card;
