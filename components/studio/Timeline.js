import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { METRICS } from '../../global';

class Timeline extends React.Component {
  // number of track parts
  // each track part 30 secs
  // 2 hours of time total
  trackParts = this.props.studioDuration / this.props.timeScale;

  containerRef = React.createRef();

  // create array with size of trackparts
  trackPartsArray = [...Array(this.trackParts).keys()];

  padZero = (duration) => {
    if (duration < 10) {
      return `0${duration}`;
    }
    return `${duration}`;
  };

  render() {
    const containerStyles = [styles.container, { paddingLeft: this.props.width / 2 }];
    return (
      <View>
        <View style={containerStyles}>
          <FlatList
            data={this.trackPartsArray}
            horizontal
            style={{ overflow: 'hidden' }}
            keyExtractor={(item, index) => String(index)}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              const timeLabel = (index * this.props.timeScale) / 1000;
              return (
                <View
                  key={index}
                  style={{
                    width: this.props.rulerUnitWidth,
                    height: 17 * METRICS.ratioX,
                    borderColor: '#191919',
                    borderLeftWidth: 2 * METRICS.ratioX,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                  }}
                >
                  <Text
                    style={{
                      color: 'rgba(178, 178, 178, 0.6)',
                      position: 'absolute',
                      top: 0,
                      left: 2 * METRICS.ratioX,
                      fontSize: METRICS.fontSizeSmall,
                    }}
                  >
                    {timeLabel}
                  </Text>
                  <View style={[styles.borderPart]} />
                  <View style={[styles.borderPart]} />
                  <View style={[styles.borderPart]} />
                  <View style={[styles.borderPart, styles.cap]} />
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,85)',
    flexDirection: 'row',
    borderTopWidth: 1 * METRICS.ratioX,
    borderColor: '#151625',
  },
  borderPart: {
    borderRightWidth: 2 * METRICS.ratioX,
    height: 6 * METRICS.ratioX,
    borderColor: '#191919',
    width: '25%',
  },
  cap: {
    borderRightWidth: 0,
  },
});

function mapStateToProps(state) {
  const { dimensions, rulerUnitWidth, timeScale, studioDuration } = state;
  return { width: dimensions.width, rulerUnitWidth, timeScale, studioDuration };
}

export default connect(mapStateToProps)(Timeline);
