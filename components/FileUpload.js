import React from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, METRICS } from '../global';
import CustomIcon from './CustomIcon';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      orientation: 0,
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
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.wrapper}>
            <View style={styles.background}>
              <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
                <Text style={styles.iconStyle}>X</Text>
              </TouchableOpacity>
              <ScrollView>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>Upload Artwork</Text>
                  <Text style={styles.subtitle}>
                    Select orientation, then choose an upload option.
                  </Text>
                </View>

                <View style={styles.orientationWrapper}>
                  <TouchableOpacity
                    style={[styles.orientationItemWrapper]}
                    onPress={() => this.setOrientation(0)}
                  >
                    <CustomIcon
                      name="square"
                      size={40 * METRICS.ratioX}
                      style={[
                        styles.orientationIcon,
                        { color: orientation === 0 ? COLORS.primaryColor : COLORS.whiteColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.label2,
                        { color: orientation === 0 ? COLORS.primaryColor : COLORS.whiteColor },
                      ]}
                    >
                      Square
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.orientationItemWrapper}
                    onPress={() => this.setOrientation(1)}
                  >
                    <CustomIcon
                      name="portrait"
                      size={40 * METRICS.ratioX}
                      style={[
                        styles.orientationIcon,
                        { color: orientation === 1 ? COLORS.primaryColor : COLORS.whiteColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.label2,
                        { color: orientation === 1 ? COLORS.primaryColor : COLORS.whiteColor },
                      ]}
                    >
                      Portrait
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.orientationItemWrapper}
                    onPress={() => this.setOrientation(2)}
                  >
                    <CustomIcon
                      name="landscape"
                      size={40 * METRICS.ratioX}
                      style={[
                        styles.orientationIcon,
                        { color: orientation === 2 ? COLORS.primaryColor : COLORS.whiteColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.label2,
                        { color: orientation === 2 ? COLORS.primaryColor : COLORS.whiteColor },
                      ]}
                    >
                      Landscape
                    </Text>
                  </TouchableOpacity>
                </View>

                {this.props.storeType==='Music' ?
                  <View style={styles.itemWrapper}>
                    <TouchableOpacity
                      style={styles.checkItemWrapper}
                      onPress={() => this.props.uploadFromCloud('audio')}
                    >
                      <CustomIcon
                        name="cloud-download"
                        size={28 * METRICS.ratioX}
                        style={styles.icon}
                      />
                      <Text style={styles.label}>
                        Upload <Text style={styles.boldtext}>Music</Text> from{' '}
                        <Text style={styles.boldtext}>iCloud</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={styles.itemWrapper}>
                    <TouchableOpacity
                      style={styles.checkItemWrapper}
                      onPress={() => this.props.uploadFromLocal(1)}
                    >
                      <CustomIcon name="camera-1" size={30 * METRICS.ratioX} style={styles.icon} />
                      <Text style={styles.label}>
                        Upload <Text style={styles.boldtext}>Video</Text> from{' '}
                        <Text style={styles.boldtext}>Camera Roll</Text>
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.checkItemWrapper}
                      onPress={() => this.props.uploadFromCloud('video')}
                    >
                      <CustomIcon
                        name="cloud-download"
                        size={28 * METRICS.ratioX}
                        style={styles.icon}
                      />
                      <Text style={styles.label}>
                        Upload <Text style={styles.boldtext}>Video</Text> from{' '}
                        <Text style={styles.boldtext}>iCloud</Text>
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.checkItemWrapper}
                      onPress={() => this.props.uploadFromLocal(0)}
                    >
                      <CustomIcon name="gallery" size={28 * METRICS.ratioX} style={styles.icon} />
                      <Text style={styles.label}>
                        Upload <Text style={styles.boldtext}>Photo</Text> from{' '}
                        <Text style={styles.boldtext}>Camera Roll</Text>
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.checkItemWrapper}
                      onPress={() => this.props.uploadFromCloud('photo')}
                    >
                      <CustomIcon
                        name="cloud-download"
                        size={28 * METRICS.ratioX}
                        style={styles.icon}
                      />
                      <Text style={styles.label}>
                        Upload <Text style={styles.boldtext}>Photo</Text> from{' '}
                        <Text style={styles.boldtext}>iCloud</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>

                }

              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  background: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    position: 'relative',
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingBig,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  label: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    fontFamily: 'lato-light',
  },
  label2: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeOK,
    textAlign: 'center',
    paddingTop: METRICS.spacingNormal,
  },
  boldtext: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    fontFamily: 'lato-bold',
  },
  orientationItemWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
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
  icon: {
    color: '#fff',
    marginRight: METRICS.marginNormal,
  },
  orientationIcon: {
    color: '#fff',
    alignSelf: 'center',
  },
  itemWrapper: {
    marginBottom: METRICS.marginBig,
    paddingHorizontal: METRICS.marginBig,
    paddingTop: METRICS.marginNormal,
    marginLeft: METRICS.marginNormal,
    flexDirection: 'column',
  },
  closeButton: {
    marginLeft: METRICS.marginBig,
    marginTop: METRICS.marginBig,
    position: 'absolute',
    top: -15,
    left: -20,
    zIndex: 100,
  },
  iconStyle: {
    marginLeft: METRICS.marginSmall,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
    paddingLeft: METRICS.spacingTiny,
    paddingTop: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
  },
  titleWrapper: {
    marginBottom: METRICS.spacingNormal,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  subtitle: {
    color: COLORS.lightGrey,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeOK,
    textAlign: 'center',
    paddingTop: METRICS.spacingNormal,
  },
});

FileUpload.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

FileUpload.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default FileUpload;
