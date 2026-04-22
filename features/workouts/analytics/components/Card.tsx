/* eslint-disable @typescript-eslint/no-explicit-any */
import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { Dimensions, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

// Define Props Interface
interface CardProps {
  title: string;
  titleSize?: number;
  titleFont?: string;
  subtitle?: string;
  children?: ReactNode;
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconBgColor?: string;
  iconW?: number;
  iconH?: number;
  headerRight?: ReactNode;
  height?: number | string;
  style?: StyleProp<ViewStyle>;

  // colors
  titleColor?: string;
  subtitleColor?: string;
  iconColor?: string;

  // gradient
  useGradient?: boolean;
  gradientColors?: string[];
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };

  // border
  useBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
}

const Card: React.FC<CardProps> = ({
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
  titleColor = '#111827',
  subtitleColor = '#6B7280',
  iconColor = '#919191',

  // gradient
  useGradient = false,
  gradientColors = ['#FFFFFF', '#F7F7F7'],
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },

  // border
  useBorder = true,
  borderColor = 'rgba(0,0,0,0.06)',
  borderWidth = 1,
}) => {
  const Bg = useGradient ? LinearGradient : View;
  const bgProps = useGradient ? { colors: gradientColors, start: gradientStart, end: gradientEnd } : {};

  return (
    <View
      style={[
        styles.wrapper,
        useBorder ? { borderWidth, borderColor } : { borderWidth: 0 },
        height ? { minHeight: height as any } : null,
        style,
      ]}
    >
      <Bg {...(bgProps as any)} style={[styles.inner, !useGradient && styles.solid]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.title,
                {
                  color: titleColor,
                  fontSize: titleSize ? titleSize : RFValue(17),
                  fontFamily: titleFont ? titleFont : 'Inter_700Bold',
                },
              ]}
            >
              {title}
            </Text>
            {subtitle ? <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text> : null}
          </View>

          {/* Right-top icon or custom element */}
          {headerRight ? (
            <View style={styles.icon}>
              {typeof headerRight === 'string' ? <Text>{headerRight}</Text> : headerRight}
            </View>
          ) : iconName ? (
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: iconBgColor ? iconBgColor : 'rgba(0,0,0,0.04)',
                  width: iconW ?? 32,
                  height: iconH ?? 32,
                },
              ]}
            >
              <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
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
    overflow: 'hidden',
  },
  inner: {
    padding: width * 0.05,
    flex: 1,
  },
  solid: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: RFValue(17),
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: RFValue(12),
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  icon: {
    marginLeft: 12,
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  body: {},
});

export default Card;
