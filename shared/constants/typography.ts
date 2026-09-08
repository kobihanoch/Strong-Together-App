import { RFValue } from 'react-native-responsive-fontsize';

export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const fontSizes = {
  caption: RFValue(9),
  label: RFValue(11),
  bodySmall: RFValue(13),
  body: RFValue(15),
  title: RFValue(18),
  metric: RFValue(28),
  hero: RFValue(32),
} as const;
