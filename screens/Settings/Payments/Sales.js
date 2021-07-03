import React from 'react';
import { SafeAreaView, View, ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { SearchInput, Thumbnail, ThumbAvatar } from '../../../components';
import { METRICS, STYLES, COLORS } from '../../../global';
import PaymentService from '../../../services/PaymentService';
import ProfileService from '../../../services/ProfileService';
import { user, craft } from '../../../global/Images';
import PlayingCraftService from '../../../services/PlayingCraftService';
import Environment from '../../../helpers/environment';

class Sales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      userId: 1,
      history: [],
    };
  }

  componentDidMount() {
    PaymentService.getTransactionHistory(this.props.user.id)
      .then((res) => {
        const history = [];
        for (let i = 0; i < res.data.length; i++) {
          history.push(res.data[i]);
          history[i].target_name = history[i].seller_name;
          history[i].target_id = history[i].seller_id;
          if (history[i].target_id === this.props.user.id) {
            history[i].target_name = history[i].buyer_name;
            history[i].target_id = history[i].buyer_id;
          }
          ProfileService.getUserProfile(history[i].target_id)
            .then((res) => {
              history[i].avatar = res.data.avatar;
              if (history[i].item_id != 'Tip') {
                PlayingCraftService.getCraft(history[i].item_id)
                  .then((res) => {
                    history[i].avatar = Environment.S3URL + res.data.thumbnail_url;
                    history[i].item_id = res.data.title;
                    this.setState({ history });
                  })
                  .catch((err) => {
                    // console.log(err.response.data.error);
                  });
              }
              this.setState({ history });
            })
            .catch((err) => {
              // console.log(err.response.data.error);
            });
        }
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  handleFilter = (text) => {
    this.setState({ filterText: text });
  };

  render() {
    const { filterText, history } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={STYLES.horizontalAlign}>
            <SearchInput placeholder="Search" changeHandler={this.handleFilter} />
            {/* <TouchableOpacity style={styles.filterButton} onPress={() => {}}>
              <CustomIcon name="adjust" size={METRICS.fontSizeHuge} style={{ color: COLORS.whiteColor }} />
            </TouchableOpacity> */}
          </View>
          <View style={styles.cardsListContainer}>
            {history
              .filter((filteredItem) =>
                filteredItem.target_name.toLowerCase().includes(filterText.toLowerCase())
              )
              .map((item) => (
                <View key={item.id} style={styles.item}>
                  <View style={STYLES.horizontalAlign}>
                    {item.item_id === 'Tip' ? (
                      <ThumbAvatar imageSource={item.avatar ? { uri: item.avatar } : user} />
                    ) : (
                      <Thumbnail imageSource={item.avatar ? { uri: item.avatar } : craft} />
                    )}
                    <View style={{ marginLeft: METRICS.spaceNormal }}>
                      <Text style={STYLES.normalText}>
                        {item.item_id === 'Tip' ? item.target_name : item.item_id}
                      </Text>
                      <Text style={STYLES.normalText}>
                        Purchased on: {item.created_at.substring(0, 11)}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      ...STYLES.normalText,

                      color:
                        item.target_name === item.buyer_name
                          ? COLORS.primaryColor
                          : COLORS.whiteColor,
                    }}
                  >
                    {item.target_name === item.buyer_name ? `+$${item.amount}` : `-$${item.amount}`}
                  </Text>
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
    paddingHorizontal: METRICS.spacingSmall,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: METRICS.spacingSmall,
  },
  cardsListContainer: {
    paddingTop: METRICS.spacingSmall,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: METRICS.spacingTiny,
    paddingVertical: METRICS.spacingSmall,
  },
  cardImageStyle: {
    width: METRICS.smallcrafts,
    height: METRICS.smallcrafts,
    resizeMode: 'cover',
    borderRadius: METRICS.craftborder,
    marginRight: METRICS.spacingSmall,
  },
  smallText: {
    fontFamily: 'Lato',
    fontSize: METRICS.fontSizeOK,
    color: COLORS.lightGrey,
  },
});
function mapStateToProps(state) {
  return {
    user: state.user,
    craftPlaying: state.craftPlaying,
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

export default connect(mapStateToProps)(Sales);
