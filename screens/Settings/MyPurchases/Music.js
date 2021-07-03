import React from 'react';
import { SafeAreaView, View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import { zip } from 'react-native-zip-archive';
import { SearchInput, Thumbnail, IconButton } from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import ProfileService from '../../../services/ProfileService';
import { craft } from '../../../global/Images';
import Env from '../../../helpers/environment';
import PlayingCraftService from '../../../services/PlayingCraftService';

class Music extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      salesItems: [],
      userId: 1,
      downloadPosition: 0,
      temp_path: '',
    };
    this.arrToDownload = [];
  }

  handleFilter = (text) => {
    this.setState({ filterText: text });
  };

  componentDidMount() {
    ProfileService.getMyPurchase(this.state.userId, 2)
      .then((res) => {
        // console.log("music res-->",res);
        this.setState({
          salesItems: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  getFileExtension(filename) {
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  }

  onDownload = (file, item_id) => {
    console.log(file);

    const { config, fs } = RNFetchBlob;
    const { DownloadDir } = fs.dirs; // this is the pictures directory. You can check the available directories in the wiki.
    const date = new Date();

    // const AWS = require('aws-sdk/dist/aws-sdk-react-native');

    // const spacesEndpoint = new AWS.Endpoint(Env.doLink);
    // const s3 = new AWS.S3({
    // endpoint: spacesEndpoint,
    // accessKeyId: Env.accessKey,
    // secretAccessKey: Env.secretKey
    // });

    const urlParts = file.url.split('/');

    const url = s3.getSignedUrl('getObject', {
      Bucket: Env.bucket,
      Key: `export/${urlParts[urlParts.length - 1]}`,
      Expires: 60 * 30,
    });

    console.log(url);

    Alert.alert('Downloading started', item_id);

    const options = {
      fileCache: false,
      appendExt: 'zip',
      addAndroidDownloads: {
        fileCache: false,
        path: DownloadDir + item_id, // this is the path where your downloaded file will live in
      },
    };

    config(options)
      .fetch('GET', url)
      .then(async (res) => {
        const { status } = res.info();
        console.log('file', res, res.info());
        if (status === 200) {
          Alert.alert('File saved', `Path: ${res.path()}`);
        }
      })
      .catch((error) => {
        console.log('Error =>', error);
      });
  };

  setCraftMedia = (purchaseId) => {
    PlayingCraftService.setCraftMediaPurchase(this.props.craftId, purchaseId, '2')
      .then((res) => {
        // console.log(res.data);
        this.props.navigation.goBack();
        this.props.updateAddMusicMethod('Purchased');
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  render() {
    const { filterText, salesItems } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <SearchInput placeholder="Search" changeHandler={this.handleFilter} />
          <View style={styles.cardsListContainer}>
            {salesItems
              .filter((filteredItem) =>
                filteredItem.purchase_option.toLowerCase().includes(filterText.toLowerCase())
              )
              .map((item) => (
                <View key={item.id} style={styles.item}>
                  <Thumbnail
                    imageSource={item.thumbnail_url ? { uri: item.thumbnail_url } : craft}
                    onCraft={() => this.props.onCraft(item.craft_id)}
                  />
                  <View style={styles.rightContent}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <View style={{ ...STYLES.horizontalAlign, justifyContent: 'space-between' }}>
                      <IconButton
                        iconName="plus"
                        title={this.props.isAdd ? 'Add' : 'Studio'}
                        clickHandler={() => (this.props.isAdd ? this.setCraftMedia(item.id) : null)}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.onDownload(
                            item.craft_item.files[item.craft_item.files.length - 1],
                            item.name
                          );
                        }}
                      >
                        <IconButton iconName="export" title="Export" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: -METRICS.spacingHuge,
    paddingHorizontal: METRICS.spacingNormal,
  },
  cardsListContainer: {
    paddingTop: METRICS.spacingSmall,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: METRICS.spacingTiny,
    paddingVertical: METRICS.spacingNormal,
  },
  nameText: {
    fontFamily: 'Lato-SemiBold',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    textAlign: 'center',
  },
  rightContent: {
    flex: 1,
    marginLeft: METRICS.spacingNormal,
    justifyContent: 'space-between',
    paddingVertical: 7 * METRICS.ratioX,
    paddingHorizontal: METRICS.spacingNormal,
  },
  cardImageStyle: {
    width: METRICS.smallcrafts,
    height: METRICS.smallcrafts,
    resizeMode: 'cover',
    borderRadius: METRICS.craftborder,
    marginRight: METRICS.spacingSmall,
  },
});

export default Music;
