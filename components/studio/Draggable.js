import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ImageBackground,
  PanResponder,
  Animated,
} from 'react-native';
import _ from 'lodash';

class Draggable extends React.Component {
  constructor(props) {
    super(props);

    // const horizontal = props.horizontal ? props.horizontal : true;
    // const vertical = props.vertical ? props.vertical : true;
    const throttled = _.throttle(
      (xPosition) => {
        if (this.props.onMove) {
          return this.props.onMove(xPosition);
        }
      },
      250,
      { trailing: true }
    );
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 };
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        // console.log('draggable onMoveShouldSet');
      },
      onMoveShouldSetPanResponderCapture: () => {
        return this.props.active;
      },
      // onStartShouldSetPanResponderCapture: () => {
      //   console.log('draggable should set responder capture');
      // },
      // onStartShouldSetPanResponder: (e, gesture) => {
      //   console.log('draggable capture', e.target);
      // },
      onPanResponderStart: () => {
        // console.log('Pan responder START');
      },
      onPanResponderMove: (rawEvent, gestureState) => {
        if (this.props.active) {
          // console.log('show the gestureState.dx', gestureState.dx);
          // console.log('show the maxXPosition', this.props.maxXPosition);
          let newVal = this._val.x + gestureState.dx;

          if (this.props.minXPosition && newVal <= this.props.minXPosition) {
            // console.log('new val less than min position', this.props.minXPosition);
            newVal = this.props.minXPosition;
          }

          if (this.props.maxXPosition && newVal >= this.props.maxXPosition) {
            newVal = this.props.maxXPosition;
          }
          throttled(newVal);
          // const outcome = throttled(newVal);
          // if (outcome) {
          //   newVal = outcome;
          // }
          // console.log('show throttled result:', outcome);
          // console.log('show the newVal', newVal);
          this.state.pan.x.setValue(newVal);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (this.props.active) {
          let updatedX = this._val.x + gestureState.dx;
          if (this.props.minXPosition && updatedX <= this.props.minXPosition) {
            updatedX = this.props.minXPosition;
          }
          if (this.props.maxXPosition && updatedX >= this.props.maxXPosition) {
            updatedX = this.props.maxXPosition;
          }
          this.state.pan.x.setValue(updatedX);
          this._val.x = updatedX;
          // call drag finish callback
          if (this.props.dragFinish) {
            this.props.dragFinish(updatedX);
          }
        }
      },
      // adjusting delta value
    });

    this.state = {
      pan: new Animated.ValueXY(),
    };
  }

  componentDidMount = () => {
    // calculate initial pan based on position
    if (this.props.minXPosition) {
      this.state.pan.setValue({ x: this.props.minXPosition, y: 0 });
      this._val.x = this.props.minXPosition;
      // console.log('draggable id', this.props.id);
      // console.log('show initial value for this draggable', this.props.minXPosition);
    }
  };

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    let pointerEvents = 'none';
    if (this.props.active) {
      pointerEvents = 'auto';
    }
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        ref={(component) => {
          this._draggable = component;
        }}
        style={[this.props.style, panStyle]}
        // pointerEvents={pointerEvents}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({});

Draggable.defaultProps = {
  offset: 0,
};

export default Draggable;
