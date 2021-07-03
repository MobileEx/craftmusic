import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CustomSlider } from '..';

import { COLORS, METRICS } from '../../global';

class EffectOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: this.props.initialValue,
      initialValue: this.props.initialValue,
    };
  }

  componentDidMount() {
    // console.log('effect option is mounted', this.props.title, this.props.initialValue);
    // this.setState({ initialValue: this.props.initialValue });
  }

  dispatchEffectUpdate = (val, complete) => {
    this.setState({ currentVal: val });
    if (this.props.callback) {
      this.props.callback(this.props.effectKey, val, complete);
    }
  };

  render() {
    let displayVal = this.state.currentVal.toFixed(2);
    if (displayVal > 1) {
      displayVal = (displayVal / 100).toFixed(2);
    } else if (displayVal < 0) {
      displayVal = (displayVal / 100).toFixed(2);
    }

    return (
      <View style={styles.effectOptionContainer}>
        <View style={styles.effectInfo}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={text}>{displayVal}</Text>
        </View>
        <View style={styles.sliderPanel}>
          <CustomSlider
            style={styles.slider}
            minimumValue={this.props.minimumValue}
            maximumValue={this.props.maximumValue}
            step={this.props.step}
            callback={this.dispatchEffectUpdate}
            value={this.state.initialValue}
          />
          <View style={styles.valsWrap}>
            <Text style={text} textAlignVertical="top">
              0
            </Text>
            <Text style={text} textAlignVertical="top">
              100
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const text = {
  fontSize: METRICS.fontSizeLight,
  fontFamily: 'lato',
  textAlign: 'left',
  color: COLORS.inActive,
};

const styles = StyleSheet.create({
  effectOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50 * METRICS.ratioY,
    paddingVertical: METRICS.spacingNormal,
  },
  slider: {
    // react native slider sets a default height of 40
    // we want values underneath to be closer to slider so we make height shorter
    height: 35 * METRICS.ratioY,
  },
  sliderPanel: {
    flex: 1,
    maxWidth: '80%',
  },
  title: {
    ...text,
    fontFamily: 'lato-bold',
    marginBottom: 3 * METRICS.ratioY,
    color: COLORS.primaryColor,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  valsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

EffectOption.propTypes = {
  effectKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  initialValue: PropTypes.number.isRequired,
  minimumValue: PropTypes.number.isRequired,
  maximumValue: PropTypes.number.isRequired,
};

export default connect()(EffectOption);
