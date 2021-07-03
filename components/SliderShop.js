import React from 'react';
import PropTypes from 'prop-types';
import { PanResponder, View, StyleSheet, Text } from 'react-native';
import RangeSlider from 'rn-range-slider';
import { COLORS, METRICS } from '../global';

class SliderShop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lowPrice: 250,
      highPrice: 750,
    };
    this.slider = React.createRef();
  }

  componentDidMount() {
    this.slider.current.setLowValue(this.props.data.lowPrice);
    this.slider.current.setHighValue(this.props.data.highPrice);
  }

  render() {
    const {
      min,
      max,
      rangeEnabled,
      style,
      blankColor,
      labelStyle,
      syntax,
      wrapperStyle,
      bottom,
      thumbBorderWidth,
      thumbRadius,
      onPriceChanged,
    } = this.props;
    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <RangeSlider
          style={[styles.slider, style]}
          ref={this.slider}
          gravity="center"
          min={min}
          max={max}
          step={1}
          labelStyle={labelStyle}
          rangeEnabled={rangeEnabled}
          selectionColor={COLORS.primaryColor}
          blankColor={blankColor}
          thumbBorderWidth={thumbBorderWidth}
          labelBackgroundColor={COLORS.blackColor}
          labelBorderColor={COLORS.blackColor}
          labelTextColor={COLORS.selectedGrey}
          thumbRadius={thumbRadius}
          initialLowValue={30}
          onTouchStart={() => {
            // console.log('touch start for slider');
          }}
          onTouchEnd={() => {
            // console.log('touch END for slider');
            onPriceChanged(this.state.lowPrice, this.state.highPrice, max);
          }}
          onValueChanged={(lowPrice, highPrice) => {
            const res = { lowPrice, highPrice };
            this.setState({ lowPrice, highPrice });
            // console.log(res);
          }}
        />
        {bottom && <Text style={styles.min}>{min}</Text>}

        {bottom && <Text style={styles.max}>{max}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    paddingBottom: METRICS.spacingBig,
    marginBottom: METRICS.spacingTiny,
    paddingHorizontal: METRICS.spacingBig,
    justifyContent: 'center',
    alignContent: 'center',
  },
  min: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    color: COLORS.selectedGrey,
    fontFamily: 'lato',
    paddingHorizontal: METRICS.spacingBig + METRICS.spacingTiny,
    textAlign: 'center',
  },
  max: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: COLORS.selectedGrey,
    fontFamily: 'lato',
    paddingHorizontal: METRICS.spacingBig + METRICS.spacingTiny,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 65 * METRICS.ratioX,
  },
});

SliderShop.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  rangeEnabled: PropTypes.bool,
  labelStyle: PropTypes.string,
  syntax: PropTypes.string,
  bottom: PropTypes.bool,
  blankColor: PropTypes.string,
  thumbBorderWidth: PropTypes.number,
  thumbRadius: PropTypes.number,
};

SliderShop.defaultProps = {
  min: 0,
  max: 1000,
  rangeEnabled: true,
  labelStyle: 'bubble',
  syntax: '',
  bottom: true,
  blankColor: COLORS.nameDM,
  thumbBorderWidth: 0,
  thumbRadius: METRICS.sliderthumb,
};

export default SliderShop;
