import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import { zip } from 'react-native-zip-archive';
import { connect } from 'react-redux';
import { METRICS, COLORS } from '../../global';
import CustomIcon from '../CustomIcon';
import { setPlayingCrafts } from '../../store/actions';

class ContestTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curCraftId: 0,
      thumbnailUrl: '',
      downloadPosition: 0,
    };
    this.arrToDownload = [];
  }

  componentDidMount() {
    this.setState({
      curCraftId: this.props.curCraftId,
    });
  }

  refreshContent = () => {
    this.setState({
      curCraftId: this.props.curCraftId,
    });
  };

  onDownload = (url, item_id) => {
    const { config, fs } = RNFetchBlob;
    const { DocumentDir } = fs.dirs; // this is the pictures directory. You can check the available directories in the wiki.
    const date = new Date();

    const tmp = url.split('.');
    const options = {
      fileCache: false,
      appendExt: tmp[1],
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: false,
        autorename: true,
        path: `${DocumentDir}/contest_${item_id}${1}`, // this is the path where your downloaded file will live in
        description: 'Downloading contest file.',
      },
    };
    config(options)
      .fetch('GET', url)
      .then(async (res) => {
        const { status } = res.info();
        if (status === '200') {
          // console.log('downloadPosition =>', this.state.downloadPosition+1);
          // console.log('arrToDownload =>', this.arrToDownload.length);
          // console.log('zip url--> ',url)
          // on success
          if (this.state.downloadPosition + 1 == this.arrToDownload.length) {
            // Go for zip
            const targetPath = `${DocumentDir}/${Math.floor(
              date.getTime() + date.getSeconds() / 2
            )}.zip`;
            const sourcePath = res.path();
            const lastIndex = String(sourcePath).lastIndexOf('/');
            const path = String(sourcePath).substring(0, lastIndex);
            this.setState({ temp_path: String(path) });
            zip(path, targetPath)
              .then((path) => {
                // console.log('zip completed at--',path)
                const shareOptions = {
                  title: 'Share file',
                  failOnCancel: false,
                  saveToFiles: true,
                  url: path, // base64 with mimeType or path to local file
                };
                Share.open(shareOptions);
                RNFetchBlob.fs
                  .unlink(String(this.state.temp_path))
                  .then(() => {
                    console.log('zip success at--', path);
                  })
                  .catch((err) => {
                    console.log('zip err at--', err);
                  });
                this.arrToDownload = [];
                this.setState({ downloadPosition: 0 });
              })
              .catch((error) => {
                console.log(error);
              });
            // }
          } else {
            const newPoistion = this.state.downloadPosition + 1;
            this.setState({ downloadPosition: newPoistion });
            this.onDownload(this.arrToDownload[this.state.downloadPosition]);
          }
        }
      })
      .catch((error) => {
        console.log('Error =>', error);
      });
  };

  render() {
    const craft = this.props.playingCrafts ? this.props.playingCrafts[this.state.curCraftId] : null;
    return (
      <View style={styles.container}>
        <View style={styles.subInfo}>
          <Text style={styles.name}>Contest Instructions</Text>
          <Text style={styles.desc}>{craft.description}</Text>
        </View>
        <View style={styles.storeWrapper}>
          {craft.contest_url && (
            <TouchableOpacity
              style={styles.store}
              onPress={() => {
                this.arrToDownload = [];
                if (craft.contest_url != null) {
                  this.arrToDownload.push(craft.contest_url);
                }
                if (craft.thumbnail_url != null) {
                  this.arrToDownload.push(craft.thumbnail_url);
                }
                if (craft.photo_url != null) {
                  this.arrToDownload.push(craft.photo_url);
                }
                if (craft.video_url != null) {
                  this.arrToDownload.push(craft.video_url);
                }
                if (craft.audio_url != null) {
                  this.arrToDownload.push(craft.audio_url);
                }
                if (craft.cover_media_url != null) {
                  this.arrToDownload.push(craft.cover_media_url);
                }
                if (craft.playable_media_url != null) {
                  this.arrToDownload.push(craft.playable_media_url);
                }
                if (this.arrToDownload.length === 0) {
                  alert('This file does not have any data to download');
                } else {
                  this.onDownload(this.arrToDownload[this.state.downloadPosition]);
                }
              }}
            >
              <CustomIcon name="download" style={styles.exporticon} />
              <Text style={styles.storeText}>Download File</Text>
            </TouchableOpacity>
          )}

          <View style={styles.storeWrapper}>
            <TouchableOpacity style={styles.store}>
              <Text style={styles.enterText}>Enter Contest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'lato-bold',
    textAlign: 'center',
  },
  exporticon: {
    fontSize: METRICS.fontSizeBigger,
    color: COLORS.whiteColor,
    marginRight: METRICS.spacingSmall,
  },
  desc: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    marginTop: METRICS.spacingNormal,
    fontFamily: 'lato',
    textAlign: 'center',
  },
  subInfo: {
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
    marginBottom: METRICS.spacingHuge,
  },
  storeWrapper: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  store: {
    width: METRICS.storewidth,
    height: METRICS.storeheight,
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: METRICS.spacingBig,
    flexDirection: 'row',
  },
  storeText: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeLight,
    fontFamily: 'lato',
  },
  enterText: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeOK,
    fontFamily: 'lato',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (crafts) => dispatch(setPlayingCrafts(crafts)),
  };
}

function mapStateToProps(state) {
  return {
    prevState: state.prevState,
    playingCrafts: state.playingCrafts,
    profileUserId: state.profileUserId,
    backScreen: state.backScreen,
    editingCraftId: state.editingCraftId,
    title: state.title,
    curCraftId: state.curCraftId,
    openComments: state.openComments,
    miniPlay: state.miniPlay,
    deepAlert: state.deepAlert,
    craftlistId: state.craftlistId,
    backupCraft: state.backupCraft,
    seekOnBack: state.seekOnBack,
    currentTime: state.currentTime,
    followId: state.followId,
    storeState: state.storeState,
    addMusicMethod: state.addMusicMethod,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContestTab);
