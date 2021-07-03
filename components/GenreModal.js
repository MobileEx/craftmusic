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
import { COLORS, METRICS, STYLES } from '../global';
import CustomCheck from './CustomCheck';

setGenre = (genre) => {
  this.props.setFilter('genre', genre);
};

const GenreModal = ({ onClose, status, onCloseRequest, setGenre, data, genrelist }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onCloseRequest}
      onRequestClose={onCloseRequest}
      visible={status}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.wrapper}>
          <View style={styles.background}>
            <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
              <Text style={styles.iconStyle}>X</Text>
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Choose Genre(s)</Text>
            </View>

            <ScrollView style={{ height: 500 * METRICS.ratioY }} showsVerticalScrollIndicator>
              {genrelist.map((item, index) => (
                <TouchableOpacity
                  style={styles.checkItem}
                  key={index}
                  onPress={() => setGenre(item.type)}
                >
                  <CustomCheck
                    value={data.includes(item.type)}
                    clickHandler={() => setGenre(item.type)}
                  />
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>{item.type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    height: 500,
  },
  background: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    position: 'relative',
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingNormal,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
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
    marginBottom: METRICS.spacingHuge,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',

    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: METRICS.rowHeight,
  },
  checkTitle: {
    marginLeft: METRICS.spacingTiny,
  },
});

GenreModal.propTypes = {
  onClose: PropTypes.func,
  onPress: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

GenreModal.defaultProps = {
  onClose: () => {},
  onPress: this.props,
  status: false,
  onCloseRequest: () => {},
};

export default GenreModal;
