import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import Button from './Button';
import { COLORS, METRICS, STYLES } from '../global';
import CustomIcon from './CustomIcon';

class ArtUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  setOrientation = (value) => {
    this.setState({ orientation: value });
    this.props.setOrientation(value);
  };

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
                onPress={() => this.props.uploadFromLocal(1)}
              >
                <CustomIcon name="film" size={35 * METRICS.ratioX} style={styles.icon} />
                <Text style={styles.label}>Upload video from photo library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.props.uploadFromCloud('video')}
              >
                <CustomIcon name="film" size={35 * METRICS.ratioX} style={styles.icon} />
                <Text style={styles.label}>Upload video from iCloud</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.props.uploadFromLocal(0)}
              >
                <CustomIcon name="gallery" size={35 * METRICS.ratioX} style={styles.icon} />
                <Text style={styles.label}>Upload photo from photo library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkItemWrapper}
                onPress={() => this.props.uploadFromCloud('image')}
              >
                <CustomIcon name="gallery" size={35 * METRICS.ratioX} style={styles.icon} />
                <Text style={styles.label}>Upload photo from iCloud</Text>
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
    height: 450 * METRICS.ratioX,
    borderBottomColor: COLORS.primaryColor,
    borderTopColor: COLORS.primaryColor,
    borderWidth: 0.5 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    marginTop: (METRICS.screenHeight - 450 * METRICS.ratioX) / 2,
  },
  itemWrapper: {
    marginBottom: METRICS.marginNormal,
    padding: METRICS.marginBig,
    marginLeft: METRICS.marginNormal,
    flexDirection: 'column',
  },
});

ArtUpload.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

ArtUpload.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default ArtUpload;
