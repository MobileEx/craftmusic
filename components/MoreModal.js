import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';

const MoreModal = ({ onClose, onShow, onShare, onBlock, onReport, blockStatus }) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
        <CustomIcon
          name="close"
          size={METRICS.fontSizeHuge}
          style={[styles.iconStyle, { color: COLORS.whiteColor }]}
        />
      </TouchableOpacity>

      <View style={[styles.moreItem, { paddingVertical: 5 * METRICS.ratioX }]}>
        <TouchableOpacity onPress={() => onShow()}>
          <View style={[styles.moreSubItemView, { marginHorizontal: 35 * METRICS.ratioX }]}>
            <CustomIcon name="info" size={METRICS.fontSizeHuge} style={styles.iconStyle} />
            <Text style={styles.moreSubItemLable}>About</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onShare()}>
          <View style={[styles.moreSubItemView, { marginHorizontal: 35 * METRICS.ratioX }]}>
            <CustomIcon name="share" size={METRICS.fontSizeHuge} style={styles.iconStyle} />
            <Text style={styles.moreSubItemLable}>Share</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.moreItem, { paddingVertical: 20 * METRICS.ratioX }]}>
        <TouchableOpacity onPress={() => onBlock()}>
          <View style={[styles.moreSubItemView, { marginHorizontal: 35 * METRICS.ratioX }]}>
            <CustomIcon
              name="do-not-disturb-rounded-sign"
              size={METRICS.fontSizeHuge}
              style={styles.iconStyle}
            />
            <Text style={styles.moreSubItemLable}>{blockStatus ? 'Unblock' : 'Block'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onReport()}>
          <View style={[styles.moreSubItemView, { marginHorizontal: 35 * METRICS.ratioX }]}>
            <CustomIcon name="flag" size={METRICS.fontSizeHuge} style={styles.iconStyle} />
            <Text style={styles.moreSubItemLable}>Report</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    position: 'absolute',

    left: 0,
    right: 0,
  },
  closeButton: {
    marginTop: METRICS.spacingNormal,
    padding: METRICS.spacingBig,
    marginLeft: METRICS.marginSmall,
  },
  iconStyle: {
    color: COLORS.primaryColor,
  },
  moreSubItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120 * METRICS.ratioX,
    height: 60 * METRICS.ratioX,
    paddingHorizontal: METRICS.marginSmall,
  },
  moreItem: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  moreSubItemLable: {
    color: COLORS.whiteColor,
    marginLeft: METRICS.marginNormal,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato-bold',
  },
});

MoreModal.propTypes = {
  onClose: PropTypes.func,
  onShow: PropTypes.func,
};

MoreModal.defaultProps = {
  onClose: () => {},
  onShow: () => {},
};

export default MoreModal;
