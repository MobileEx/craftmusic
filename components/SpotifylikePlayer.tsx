import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  PanResponder,
} from "react-native";
import { useDispatch, useStore } from "react-redux";
import Animated, { Easing } from "react-native-reanimated";
import { State } from "react-native-gesture-handler";
import { clamp, onGestureEvent, timing, withSpring } from "react-native-redash";
import { getBottomSpace } from "react-native-iphone-x-helper";
import Player from "../screens/PlayingCraftScreen";
import { MiniCraftPlayer } from ".";

const { height } = Dimensions.get("window");
const TABBAR_HEIGHT = getBottomSpace() + 55;
const MINIMIZED_PLAYER_HEIGHT = 50;
const SNAP_TOP = 0;
const SNAP_BOTTOM = height - TABBAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT;
const config = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1,
};
const {
  Clock,
  Value,
  cond,
  useCode,
  set,
  block,
  not,
  clockRunning,
  interpolate,
  diffClamp,
  Extrapolate,
} = Animated;

const styles = StyleSheet.create({
  playerSheet: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  container: {
    backgroundColor: "black",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TABBAR_HEIGHT,
    flexDirection: "row",
    borderTopColor: "black",
    borderWidth: 1,
  },
});

let onPlayPause = () => {
  // console.log("not");
};

let onLike = () => {
  // console.log("not");
};

let onRepeat = () => {
  // console.log("not");
};

let onShuffle = (id) => {
  // console.log("not");
};

let togglePlay = () => {
  // console.log("not");
};

let onFinishSliderStatus = (value) => {
  // console.log("not");
};
let onChangeSliderStatus = (value) => {
  // console.log("not");
};

export default ({
  children,
  navigation,
  onClosePlayer,
  isPlaying,
  updateCraftPlaying,
}) => {
  const store = useStore();
  const [thisPlaying, thisPlayingSetter] = useState(false);
  const [showMini, showMiniSetter] = useState(false);
  const [progress, progressSetter] = useState(0);
  const [swipeAvailable, swipeAvailableSetter] = useState(true);

  const dispatch = useDispatch();

  const [offset, offsetSetter] = useState(new Value(SNAP_BOTTOM));

  const translationY = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  // const offset = new Value(SNAP_BOTTOM);
  const goUp: Animated.Value<0 | 1> = new Value(0);
  const goDown: Animated.Value<0 | 1> = new Value(0);
  const gestureHandler = onGestureEvent({
    state,
    translationY,
    velocityY,
  });
  const translateY = withSpring({
    value: clamp(translationY, SNAP_TOP, SNAP_BOTTOM),
    velocity: velocityY,
    offset,
    state,
    snapPoints: [SNAP_TOP, SNAP_BOTTOM],
    config,
  });
  const translateBottomTab = interpolate(translateY, {
    inputRange: [SNAP_TOP, SNAP_BOTTOM],
    outputRange: [TABBAR_HEIGHT, 0],
    extrapolate: Extrapolate.CLAMP,
  });
  const opacity = interpolate(translateY, {
    inputRange: [SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT, SNAP_BOTTOM],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const opacity2 = interpolate(translateY, {
    inputRange: [
      SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT * 2,
      SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT,
    ],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });
  const clock = new Clock();
  useCode(
    block([
      cond(goUp, [
        set(
          offset,
          timing({
            clock,
            from: offset,
            to: SNAP_TOP,
          })
        ),
        cond(not(clockRunning(clock)), [set(goUp, 0)]),
      ]),
      cond(goDown, [
        set(
          offset,
          timing({
            clock,
            from: offset,
            to: SNAP_BOTTOM,
          })
        ),
        cond(not(clockRunning(clock)), [set(goDown, 0)]),
      ]),
    ]),
    []
  );

  const setGoUp = (current = height) => {
    Animated.timing(offset, {
      toValue: SNAP_TOP,
      duration: 400 * (current / height),
      easing: Easing.linear,
    }).start();

    thisPlayingSetter(false);
    showMiniSetter(false);
    swipeAvailableSetter(true);
  };

  const open = () => {
    Animated.timing(offset, {
      toValue: SNAP_TOP,
      duration: 4,
      easing: Easing.linear,
    }).start();

    thisPlayingSetter(false);
    showMiniSetter(false);
    swipeAvailableSetter(true);
  };

  const setGoDown = (current = 0) => {
    Animated.timing(offset, {
      toValue: SNAP_BOTTOM,
      duration: 400 * ((height - current) / height),
      easing: Easing.linear,
    }).start();
    showMiniSetter(true);
    swipeAvailableSetter(true);
    dispatch({
      type: "UPDATE_CRAFT_PLAYING",
      playing: false,
    });
  };

  useEffect(() => {
    thisPlayingSetter(updateCraftPlaying);
    if (updateCraftPlaying) {
      Animated.timing(offset, {
        toValue: SNAP_TOP,
        duration: 4,
        easing: Easing.linear,
      }).start();

      thisPlayingSetter(false);
      showMiniSetter(false);
    } else {
      showMiniSetter(isPlaying !== -1);
    }
  }, [updateCraftPlaying]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        //return true if user is swiping, return false if it's a single click

        return (
          !(gestureState.dy < 20 && gestureState.dy > -20) &&
          (gestureState.moveY > (height * 5) / 6
            ? gestureState.vy < 0
            : gestureState.moveY < height / 5)
        );
      },
      onPanResponderMove: (e, gestureState) => {
        offset.setValue(gestureState.moveY - 10);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.y0 > (height * 5) / 6) {
          if (gestureState.moveY > (height * 5) / 6)
            setGoDown(gestureState.moveY);
          else setGoUp(gestureState.moveY);
        } else {
          if (gestureState.moveY > height / 6) setGoDown(gestureState.moveY);
          else setGoUp(gestureState.moveY);
        }
      },
    })
  ).current;

  // @ts-ignore
  return (
    <>
      {isPlaying !== -1 ? (
        <Animated.View
          style={{
            height: MINIMIZED_PLAYER_HEIGHT,
            transform: [{ translateY: translateBottomTab }],
          }}
        />
      ) : null}
      {isPlaying !== -1 && store.getState().playingCrafts?.length > 0 ? (
        <Animated.View
          style={[styles.playerSheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
          onMoveShouldSetResponder={
            swipeAvailable
              ? panResponder.panHandlers.onMoveShouldSetResponder
              : () => false
          }
        >
          <Player
            navigation={navigation}
            setSwipeAwailable={(status) => {
              swipeAvailableSetter(status);
            }}
            goDown={() => setGoDown()}
            goUp={() => setGoUp()}
            open={() => open()}
            onProgress={(value) => progressSetter(value)}
            setPlayPause={(func) => {
              onPlayPause = () => func();
            }}
            onLike={(func) => {
              onLike = () => func();
            }}
            onRepeat={(func) => {
              onRepeat = () => func();
            }}
            onShuffle={(func) => {
              onShuffle = (id) => func(id);
            }}
            togglePlay={(func) => {
              togglePlay = () => func();
            }}
            setFinsihSliderStatus={(func) => {
              onFinishSliderStatus = (value) => func(value);
            }}
            setChangeSliderStatus={(func) => {
              onChangeSliderStatus = (value) => func(value);
            }}
          />
          <Animated.View
            pointerEvents="none"
            style={{
              opacity: opacity2,
              backgroundColor: "#000",
              ...StyleSheet.absoluteFillObject,
            }}
          />
          <Animated.View
            style={{
              opacity,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: MINIMIZED_PLAYER_HEIGHT,
            }}
          >
            {showMini ? (
              //@ts-ignore
              <MiniCraftPlayer
                navigation={navigation}
                onPlayPause={onPlayPause}
                progress={progress}
                onLike={onLike}
                onRepeat={onRepeat}
                onShuffle={onShuffle}
                togglePlay={togglePlay}
                onFinsihSliderStatus={onFinishSliderStatus}
                onChangeSliderStatus={onChangeSliderStatus}
                onClosePlayer={onClosePlayer}
                goUp={() => open()}
              />
            ) : (
              <View
                style={{ height: 42, width: "100%", backgroundColor: "black" }}
              />
            )}
          </Animated.View>
        </Animated.View>
      ) : null}
      <Animated.View
        style={{
          height: TABBAR_HEIGHT,
          transform: [{ translateY: translateBottomTab }],
        }}
      >
        <SafeAreaView style={styles.container}>{children}</SafeAreaView>
      </Animated.View>
    </>
  );
};
