import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomIcon, SearchInput } from '../../components';
import { COLORS, METRICS, STYLES } from '../../global';
import SearchService from '../../services/SearchService';
import ProfileService from '../../services/ProfileService';
import { updateProfileUserId } from '../../store/actions';
import NavigationService from '../../navigation/NavigationService';

class SearchVerifyTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilterText: '',
      userId: 1,
      statusFlags: [],
      resUser: [],
      keyword: '',
      user: {
        type: [],
        rank: [],
        location: '',
        radius: 100,
        checked: false,
      },
      userFeatureStatus: [],
    };
  }

  componentDidMount() {
    const { statusFlags } = this.state;
  }

  search = () => {
    const { user, keyword } = this.state;
    SearchService.search(keyword, user)
      .then((res) => {
        const userFeatureStatus = [];
        for (let i = 0; i < res.data.user.length; i++) {
          userFeatureStatus[res.data.user[i].id] = res.data.user[i].verified_at;
        }
        this.setState({
          resUser: res.data.user,
          searched: true,
          userFeatureStatus,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  onUser = (id) => {
    this.props.dispatch(updateProfileUserId(id));

    NavigationService.navigate('Profile', { refresh: true });
  };

  featureHandler = (type, id, action) => {
    const userStatus = this.state.userFeatureStatus;
    if (type === 0) {
      if (action === 1) {
        // console.log('set');
        ProfileService.verifyUser(id)
          .then((res) => {
            // console.log(res.data);
          })
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      } else {
        ProfileService.unVerifyUser(id)
          .then((res) => {
            // console.log(res.data);
          })
          .catch((err) => {
            // console.log(err.response.data.error);
          });
      }
      userStatus[id] = !userStatus[id];
      this.setState({
        userFeatureStatus: userStatus,
      });
    }
  };

  render() {
    const { requests, searchverify } = this.props;
    let data = requests;
    if (this.props.route.key === 'searchverify') {
      data = searchverify;
    }
    const { navigation } = this.props;
    const { resUser } = this.state;
    const userAvatar2 = require('../../assets/images/user.png');

    return (
      <View style={styles.contain}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchItem}>
            <SearchInput
              placeholder="Search"
              value={this.state.keyword}
              onSubmit={this.search}
              changeHandler={(value) =>
                this.setState({ keyword: value }, () => {
                  this.search();
                })
              }
            />
          </View>
        </View>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 * METRICS.ratioY }}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.usersWrapper}>
            <View style={styles.searchResultWrapper}>
              {resUser.map((userItem, index) => (
                <View style={styles.userItem} key={index}>
                  <TouchableOpacity onPress={() => this.onUser(userItem.id)}>
                    <View style={STYLES.horizontalAlign}>
                      <FastImage
                        source={userItem.avatar ? { uri: userItem.avatar } : userAvatar2}
                        style={styles.avatar}
                      />
                      <Text style={styles.usernameText}>{userItem.username}</Text>
                    </View>
                  </TouchableOpacity>
                  {this.state.userFeatureStatus[userItem.id] ? (
                    <TouchableOpacity onPress={() => this.featureHandler(0, userItem.id, 0)}>
                      <CustomIcon name="cancel-button" style={styles.iconRight} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => this.featureHandler(0, userItem.id, 1)}>
                      <CustomIcon name="plus1" style={styles.iconRight} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { searchverify } = state;
  return { searchverify };
}

export default connect(mapStateToProps)(SearchVerifyTab);

const styles = StyleSheet.create({
  contain: {
    backgroundColor: COLORS.blackColor,
    flex: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: METRICS.marginNormal,
  },
  searchItem: {
    flex: 10,
    height: 40 * METRICS.ratioX,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: METRICS.followspacing,
  },
  avatar: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    marginRight: METRICS.spacingSmall,
    borderRadius: METRICS.avatarsmall / 2,
  },
  usernameText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  blockButton: {
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    backgroundColor: COLORS.blackColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  unblockButton: {
    backgroundColor: COLORS.primaryColor,
    height: METRICS.followbuttonheight,
    borderRadius: 20 * METRICS.ratioX,
    width: METRICS.followbuttonwidth,
  },
  buttonText: {
    fontFamily: 'lato-bold',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
  },
  searchResultWrapper: {
    marginLeft: METRICS.marginNormal,
  },
  iconRight: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
    marginHorizontal: METRICS.spacingBig,
  },
});
