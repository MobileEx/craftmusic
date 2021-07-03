import { StyleSheet } from 'react-native';
import METRICS from './Metrics';
import COLORS from './Colors';

const STYLES = StyleSheet.create({
  normalText: {
    fontFamily: 'Lato-Regular',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
  },
  mediumText: {
    fontFamily: 'Lato-Semibold',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
  },
  contentWrapper: {
    paddingLeft: METRICS.spaceNormal,
    paddingRight: METRICS.spaceNormal,
    paddingBottom: METRICS.spacingHuge,
  },
  horizontalAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topAlign: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  centerAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnLeftAlign: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  columnCenterAlign: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Lato-Bold',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
  },
  smallText: {
    fontFamily: 'Lato-Regular',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeSmall,
  },
  tinyText: {
    fontFamily: 'Lato-Regular',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeTiny,
  },
  lightText: {
    fontFamily: 'Lato-Regular',
    color: COLORS.lightGrey,
    fontSize: METRICS.fontSizeLight,
  },
  trackActiveOverlay: {
    opacity: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryColorRgb(0.2),
    borderWidth: 2,
    borderColor: COLORS.primaryColor,
    borderRadius: 10,
  },
  trackConflictColors: {
    backgroundColor: 'rgba(243, 71, 71, 0.2)',
    borderColor: 'rgba(243, 71, 71, 1)',
  },
});

export default STYLES;
