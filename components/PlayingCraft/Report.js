import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomIcon from '../CustomIcon';
import { COLORS, METRICS } from '../../global';

class ReportView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideStatus: false,
    };
  }

  onHide = () => {
    this.setState({
      hideStatus: !this.state.hideStatus,
    });
  };

  render() {
    const { onClose, onReport } = this.props;
    return (
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <TouchableOpacity style={styles.button} onPress={() => this.onHide()}>
              <CustomIcon name={this.state.hideStatus ? 'show' : 'hide'} style={styles.icon} />
              <Text style={styles.text}>{this.state.hideStatus ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onReport()}>
              <CustomIcon name="flag" style={styles.icon} />
              <Text style={styles.text}>Report</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
            <CustomIcon name="close" style={styles.closeButton} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.screenHeight,
    width: METRICS.screenWidth,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flexDirection: 'column',
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: METRICS.screenWidth,
    width: METRICS.screenWidth,
    top: METRICS.storeheight,
  },
  wrapper: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: COLORS.primaryColor,
    marginRight: METRICS.spacingBig,
    fontSize: METRICS.fontSizeHuge,
  },
  text: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato-bold',
  },
  closeButton: {
    position: 'absolute',
    top: 5 * METRICS.ratioX,
    left: 5 * METRICS.ratioX,
    zIndex: 100,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
    padding: METRICS.spacingNormal,
  },
  iconStyle: {
    marginLeft: METRICS.marginSmall,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
});
export default ReportView;
