// import React from 'react';
// import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import moment from 'moment';
// import * as Progress from 'react-native-progress';
// import { COLORS, METRICS } from '../../global';
// import { AudioPlayer } from '../../libs/rnsuperpowered';
// import { CustomIcon, CustomSlider } from '../index';

// class Player extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       playing: false,
//       selected: null,
//       durationMs: 0,
//       currentTime: 0,
//       // tracks: (props.tracks && props.tracks) || [
//       //   {
//       //     id: 1,
//       //     title: `Chief Keef - Baby What's Wrong With You`,
//       //     url:
//       //       'https://craftmusic.nyc3.digitaloceanspaces.com/demo/14-Chief_Keef-Baby_Whats_Wrong_With_You.mp3',
//       //     durationMs: null,
//       //   },
//       // ],
//     };

//     this.timeInterval = null;
//   }

//   // static getDerivedStateFromProps(nextProps, prevState) {
//   //   if (prevState.selected !== nextProps.tracks[0]) {
//   //     return { selected: nextProps.tracks[0] };
//   //   }
//   //   return null;
//   // }

//   componentDidMount() {
//     this.audioEventsLoop();
//     // this.select(this.props.tracks[0]);

//     const { tracks } = this.props;
//     if (tracks[0] && tracks[0].url) {
//       AudioPlayer.loadFile(tracks[0].url);
//     }
//     // start audio player event loop
//     this.audioEventsLoop();

//     // start audio player event loop

//     if (this.timer === null)
//       this.timer = setInterval(() => {
//         // this.props.onProgress(this.state.progress);
//       }, 1000);
//   }

//   loopInterval = null;

//   timer = null;

//   receiveDuration = (error, { durationMs }) => {
//     this.setState({ durationMs, duration: durationMs / 1000 });
//   };

//   togglePlay = () => {
//     this.setState((state) => {
//       return { playing: !state.playing };
//     });

//     AudioPlayer.togglePlayback();
//     AudioPlayer.getDuration(this.receiveDuration);
//   };

//   componentWillUnmount() {
//     this.setState((state) => {
//       return { playing: false };
//     });
//     clearInterval(this.timer);
//     clearInterval(this.loopInterval);
//     this.timer = null;
//     this.loopInterval = null;
//     AudioPlayer.pause();
//   }

//   componentDidUpdate() {
//     if (this.timer === null)
//       this.timer = setInterval(() => {
//         // this.props.onProgress(this.state.progress);
//       }, 1000);
//   }

//   receiveLatestEvent = (error, event) => {
//     // console.log('show the audio player latest event', event);
//     if (event !== 'None') {
//       console.log('event', event);
//     }

//     if (event === 'Opening') {
//       this.setState({ buffering: true });
//     }

//     if (event === 'Opened') {
//       // file was opened get duration now
//       // this.togglePlay();
//       this.setState({ buffering: null });
//       AudioPlayer.getDuration(this.receiveDuration);
//     }

//     if (event !== 'None') {
//       AudioPlayer.getProgress(this.receiveProgress);
//     }
//   };

//   receiveProgress = (error, { progress }) => {
//     const currentTime = progress * this.state.duration;

//     this.setState({
//       currentTime,
//       progress,
//     });

//     if (progress > 0.999) this.onEnd();
//   };

//   setPositionMs = (ms) => {
//     AudioPlayer.setPositionMs(ms);
//   };

//   audioEventsLoop = () => {
//     setInterval(() => {
//       AudioPlayer.getLatestEvent(this.receiveLatestEvent);
//       AudioPlayer.getProgress(this.receiveProgress);
//     }, 150);
//   };

//   rewind = () => {
//     this.setPositionMs(0);
//   };

//   select = (track) => {
//     AudioPlayer.loadFile(track.url);
//     this.setState({ playing: false, selected: track, durationMs: null });
//   };

//   onEnd() {
//     // when audio is end
//     this.setState({
//       progress: 0,
//       currentTime: 0,
//       playing: false,
//     });

//     this.setPositionMs(0);
//   }

//   onLoad(data) {
//     // start video
//     this.setState({
//       duration: data.duration,
//       progress: this.getSeekTimePercentage(0, data.duration),
//     });
//   }

//   render() {
//     const { durationMs, selected, playing, buffering } = this.state;
//     const { tracks } = this.props;

//     let trackDuration;
//     if (durationMs >= 0) {
//       trackDuration = durationMs;
//     }
//     // const sources = tracks.map((track, index) => {
//     //   const trackStyles = [styles.track];
//     //   if (selected && selected.id == track.id) {
//     //     trackStyles.push(styles.trackActive);
//     //   }
//     //   return (
//     //     <TouchableOpacity onPress={() => this.select(track)} key={track.id} style={trackStyles}>
//     //       <Text style={{ color: COLORS.whiteColor }}>{track.title}</Text>
//     //     </TouchableOpacity>
//     //   );
//     // });
//     return (
//       <View style={styles.wrapper}>
//         <View style={{ backgroundColor: COLORS.blackColor, flexDirection: 'row' }}>
//           <View>
//             <TouchableOpacity onPress={this.togglePlay} style={styles.button}>
//               {!playing ? (
//                 <CustomIcon name="play" size={25 * METRICS.ratioX} color={COLORS.whiteColor} />
//               ) : (
//                 <CustomIcon name="pausethin" color={COLORS.whiteColor} size={25 * METRICS.ratioX} />
//               )}
//             </TouchableOpacity>
//           </View>
//           {trackDuration >= 0 && (
//             <View
//               style={{
//                 flexDirection: 'row',

//                 backgroundColor: '#000',
//                 padding: 10,
//                 flex: 1,
//                 justifyContent: 'space-evenly',
//                 alignItems: 'center',
//               }}
//             >
//               {/* <CustomSlider
//                 style={{ height: METRICS.studioBtns }}
//                 minimumValue={0}
//                 maximumValue={1}
//                 value={0}
//                 callback={(val, complete) => {
//                   const newPosition = ((val * 100) / 100) * trackDuration;
//                   this.setPositionMs(newPosition);
//                 }}
//               /> */}

//               {buffering && (
//                 <ActivityIndicator
//                   color={COLORS.primaryColor}
//                   style={{ margin: 1, position: 'absolute', left: -5 }}
//                 />
//               )}

//               <Progress.Bar
//                 progress={this.state.progress}
//                 color={COLORS.primaryColor}
//                 unfilledColor="rgba(255,255,255,.5)"
//                 borderColor={COLORS.primaryColor}
//                 width={METRICS.screenWidth / 2.5}
//                 height={8}
//               />

//               {trackDuration && this.state.currentTime ? (
//                 <Text style={styles.duration}>
//                   {moment.utc(this.state.currentTime * 1000).format('mm:ss')}
//                 </Text>
//               ) : (
//                 <Text style={styles.duration}>0:00</Text>
//               )}
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     // padding: 0,
//     // backgroundColor: '#000',
//     borderColor: COLORS.editingGrey,
//     borderWidth: 1,
//     borderRadius: 5,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     height: 48,
//     left: 0,
//     bottom: 0,
//     right: 0,
//     // position: 'absolute',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-evenly',
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     width: METRICS.screenWidth / 1.4,
//   },
//   trackActive: {
//     borderWidth: 1,
//     padding: 10,
//     // alignItems: 'center',
//   },
//   button: {
//     margin: 10,
//     color: '#fff',
//   },
//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   duration: {
//     color: COLORS.whiteColor,
//     marginLeft: 10 * METRICS.ratioX,
//   },
// });

// export default Player;
