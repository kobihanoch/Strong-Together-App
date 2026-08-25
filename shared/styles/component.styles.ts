import { StyleSheet } from 'react-native';
import { AppThemeColors } from '../constants/theme';
import { fontFamilies, fontSizes } from '../constants/typography';

export const createSharedComponentStyles = (theme: AppThemeColors) => StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: theme.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 0.3, color: theme.textPrimary },
  detailRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  detailCopy: { flex: 1 },
  detailTitle: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body, color: theme.textPrimary },
  detailMeta: { marginTop: 4, fontFamily: fontFamilies.regular, fontSize: fontSizes.label, color: theme.textSecondary },
  primaryButton: {
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
  },
  primaryButtonText: {
    flex: 1,
    marginLeft: 24,
    textAlign: 'center',
    fontFamily: fontFamilies.semiBold,
    fontSize: fontSizes.body,
    color: theme.white,
  },
});
