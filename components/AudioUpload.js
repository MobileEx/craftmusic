import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, METRICS } from '../global';
import CustomIcon from './CustomIcon';

class AudioUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  render() {
    const { onClose, status, onCloseRequest } = this.props;
    const { orientation } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        modalDidClose={onClose}
        visible={status}
        onRequestClose={() => onCloseRequest(false)}
      >
        <View style={styles.wrapper}>
          <View style={styles.background}>
            <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
              <View style={styles.closeButtonWrapper}>
                <CustomIcon
                  name="close"
                  size={METRICS.fontSizeBiggest}
                  style={[styles.iconStyle, { color: COLORS.whiteColor }]}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.itemWrapper}>
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.props.uploadFromLocal()}
              >
                <CustomIcon name="film" size={35 * METRICS.ratioX} style={styles.icon} />
                <Text style={styles.label}>Upload audio from photo library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.props.uploadFromCloud('audio')}
              >
                <CustomIcon name="film" size={35 * METRICS.ratioX} style={styles.icon} />
                <Text style={styles.label}>Upload audio from iCloud</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  label: {
    color: '#fff',
    fontSize: METRICS.fontSizeBig,
    textAlign: 'center',
  },
  orientationItemWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: METRICS.spacingSmall,
  },
  checkItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: METRICS.spacingSmall,
  },
  orientationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: METRICS.spacingSmall,
  },
  tipUserText: {
    flex: 1,
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    justifyContent: 'space-between',
    color: COLORS.primaryColor,
    fontFamily: 'lato-bold',
    marginTop: METRICS.spacingHuge,
  },
  closeButton: {
    marginLeft: METRICS.marginTiny,
    marginTop: METRICS.marginSmall,
    marginBottom: METRICS.marginSmall,
  },
  icon: {
    color: '#fff',
    marginRight: METRICS.marginNormal,
  },
  orientationIcon: {
    color: '#fff',
    alignSelf: 'center',
  },
  background: {
    width: METRICS.screenWidth,
    height: 250 * METRICS.ratioX,
    borderBottomColor: COLORS.primaryColor,
    borderTopColor: COLORS.primaryColor,
    borderWidth: 0.5 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    marginTop: (METRICS.screenHeight - 250 * METRICS.ratioX) / 2,
  },
  itemWrapper: {
    marginBottom: METRICS.marginNormal,
    padding: METRICS.marginBig,
    marginLeft: METRICS.marginNormal,
    flexDirection: 'column',
  },
});

AudioUpload.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

AudioUpload.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default AudioUpload;
