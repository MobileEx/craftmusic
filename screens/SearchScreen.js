import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigationFocus } from 'react-navigation';
import _ from 'lodash';
import SideMenu from 'react-native-side-menu';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { ScreenHeader, CustomIcon, StoreList, SearchInput, BaseScreen } from '../components';
import { COLORS, METRICS, STYLES } from '../global';
import { menus } from '../global/Seeds';
import SearchService from '../services/SearchService';
import PlayingCraftService from '../services/PlayingCraftService';
import SearchMenu from '../components/Search/Menu';
import {
  updateCraftPlaying,
  setPlayingCrafts,
  updateProfileUserId,
  updateTitle,
  updateCurCraftId,
  updatePrevState,
  updateCraftListId,
  updateIsPlaying,
  updateBackScreen,
} from '../store/actions';
import store from '../store/configureStore';

INITIAL_SEARCH_OPTIONS = {
  keyword: '',
  user: {
    type: [],
    rank: [],
    location: '',
    radius: 100,
    checked: false,
  },
  crafts: {
    art_categories: {
      type: [],
      subject: [],
      color: [],
      mood: [],
      checked: false,
    },
    music_categories: {
      type: [],
      genre: [],
      bpm: {
        min: 0,
        max: 200,
      },
      mood: [],
      checked: false,
    },
    brand_items: false,
    shop_categories: {
      price: {
        lowPrice: 0,
        highPrice: 1000,
      },
      overprice: false,
      purchase_option: [],
      art_checked: false,
      music_checked: false,
    },
    checked: false,
  },
  craftlists: false,
  hashtags: false,
};

const Search_option = {
  keyword: '',
  user: {
    type: [],
    rank: [],
    location: '',
    radius: 100,
    checked: false,
  },
  crafts: {
    art_categories: {
      type: [],
      subject: [],
      color: [],
      mood: [],
      checked: false,
    },
    music_categories: {
      type: [],
      genre: [],
      bpm: {
        min: 0,
        max: 200,
      },
      mood: [],
      checked: false,
    },
    brand_items: false,
    shop_categories: {
      price: {
        lowPrice: 0,
        highPrice: 1000,
      },
      overprice: false,
      purchase_option: [],
      art_checked: false,
      music_checked: false,
    },
    checked: false,
  },
  craftlists: false,
  hashtags: false,
};

const initPanel = [
  {
    Filter: [
      {
        title: 'Users',
        checked: false,
        select: 'Any',
      },
      {
        title: 'Crafts',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Art',
            select: 'Any',
            checked: false,
          },
          {
            title: 'Music',
            select: 'Any',
            checked: false,
          },
          {
            title: 'Brand Items',
            checked: false,
          },
        ],
      },
      {
        title: 'Craftlists',
        checked: false,
      },
      {
        title: 'Hashtags',
        checked: false,
      },
      {
        title: 'Reset',
        type: 'Button',
      },
    ],
  },
  {
    Users: [
      {
        title: 'User Type',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Artist',
            checked: false,
          },
          {
            title: 'Musician',
            checked: false,
          },
          {
            title: 'Brand',
            checked: false,
          },
          {
            title: 'Patron',
            checked: false,
          },
          {
            title: 'Verified',
            checked: false,
          },
        ],
      },
      {
        title: 'User Rank',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Black (Highest)',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.greygreyColor,
            },
            checked: false,
          },
          {
            title: 'Grey',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.lightGrey,
            },
            checked: false,
          },
          {
            title: 'White',
            checked: false,
          },
          {
            title: 'Teal',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.primaryColor,
            },
            checked: false,
          },
          {
            title: 'Blue',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.blueColor,
            },
            checked: false,
          },
          {
            title: 'Violet',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.violetColor,
            },
            checked: false,
          },
          {
            title: 'Pink (Lowest)',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.pinkColor,
            },
            checked: false,
          },
        ],
      },
    ],
    Art: [
      {
        title: 'Art Type',
        select: 'Any',
        collapse: false,
        checked: false,
        children: [
          {
            title: 'Photo',
            checked: false,
          },
          {
            title: 'Video',
            checked: false,
          },
        ],
      },
      {
        title: 'Subject',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'People',
            checked: false,
          },
          {
            title: 'Objects',
            checked: false,
          },
          {
            title: 'Animals',
            checked: false,
          },
          {
            title: 'Nature',
            checked: false,
          },
          {
            title: 'Abstract',
            checked: false,
          },
        ],
      },
      {
        title: 'Colors',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Red',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.redColor,
            },
            checked: false,
          },
          {
            title: 'Orange',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.orangeColor,
            },
            checked: false,
          },
          {
            title: 'Yellow',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.yellowColor,
            },
            checked: false,
          },
          {
            title: 'Green',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.greenColor,
            },
            checked: false,
          },
          {
            title: 'Teal',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.primaryColor,
            },
            checked: false,
          },
          {
            title: 'Blue',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.blueColor,
            },
            checked: false,
          },
          {
            title: 'Violet',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.violetColor,
            },
            checked: false,
          },
          {
            title: 'Pink',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.pinkColor,
            },
            checked: false,
          },
          {
            title: 'Black',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.greygreyColor,
            },
            checked: false,
          },
          {
            title: 'Grey',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.lightGrey,
            },
            checked: false,
          },
          {
            title: 'White',
            checked: false,
          },
          {
            title: 'Brown',
            style: {
              fontSize: METRICS.fontSizeMedium,
              fontFamily: 'lato',
              paddingLeft: METRICS.spacingHuge,
              color: COLORS.brownColor,
            },
            checked: false,
          },
        ],
      },
      {
        title: 'Mood',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Happy',
            checked: false,
          },
          {
            title: 'Sad',
            checked: false,
          },
          {
            title: 'Angry',
            checked: false,
          },
          {
            title: 'Upbeat',
            checked: false,
          },
          {
            title: 'Calm',
            checked: false,
          },
        ],
      },
      {
        title: 'Price',
        type: 'slider',
        checked: false,
        value: 0,
        min: 0,
        max: 1000,
        collapse: false,
        children: [],
      },
      {
        title: 'Purchase Option',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Exclusive License',
            checked: false,
          },
          {
            title: 'Lease',
            checked: false,
          },
          {
            title: 'Free',
            checked: false,
          },
        ],
      },
    ],
    Music: [
      {
        title: 'Music Type',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Instrumental',
            checked: false,
          },
          {
            title: 'Instrumental + vocal',
            checked: false,
          },
          {
            title: 'Acapella',
            checked: false,
          },
          {
            title: 'Sample pack',
            checked: false,
          },
          {
            title: 'Podcast',
            checked: false,
          },
        ],
      },
      {
        title: 'BPM',
        collapse: false,
        type: 'slider',
        checked: false,
        min: 0,
        max: 200,
        value: 0,
        children: [],
      },
      {
        title: 'Genre',
        select: 'Any',
        checked: false,
      },
      {
        title: 'Mood',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Happy',
            checked: false,
          },
          {
            title: 'Sad',
            checked: false,
          },
          {
            title: 'Angry',
            checked: false,
          },
          {
            title: 'Upbeat',
            checked: false,
          },
          {
            title: 'Calm',
            checked: false,
          },
        ],
      },
      {
        title: 'Price',
        collapse: false,
        type: 'slider',
        checked: false,
        value: 0,
        min: 0,
        max: 1000,
        children: [],
      },
      {
        title: 'Purchase Option',
        select: 'Any',
        checked: false,
        collapse: false,
        children: [
          {
            title: 'Exclusive License',
            checked: false,
          },
          {
            title: 'Lease MP3',
            checked: false,
          },
          {
            title: 'Lease WAV',
            checked: false,
          },
          {
            title: 'Lease Tracked Out',
            checked: false,
          },
          {
            title: 'Buy Sample Pack',
            checked: false,
          },
          {
            title: 'Free',
            checked: false,
          },
        ],
      },
    ],
    BrandItems: [],
  },
  {
    Genre: [
      {
        title: 'Alternative',
        checked: false,
      },
      {
        title: 'Blues',
        checked: false,
      },
      {
        title: 'Children’s',
        checked: false,
      },
      {
        title: 'Classical',
        checked: false,
      },
      {
        title: 'Comedy',
        checked: false,
      },
      {
        title: 'Country',
        checked: false,
      },
      {
        title: 'Disco',
        checked: false,
      },
      {
        title: 'Downtempo',
        checked: false,
      },
      {
        title: 'Drum & Bass',
        checked: false,
      },
      {
        title: 'Dubstep',
        checked: false,
      },
      {
        title: 'EDM',
        checked: false,
      },
      {
        title: 'Electro',
        checked: false,
      },
      {
        title: 'Eurodance',
        checked: false,
      },
      {
        title: 'Folk',
        checked: false,
      },
      {
        title: 'Gospel',
        checked: false,
      },
      {
        title: 'Hardcore',
        checked: false,
      },
      {
        title: 'Hip Hop',
        checked: false,
      },
      {
        title: 'House',
        checked: false,
      },
      {
        title: 'Jazz',
        checked: false,
      },
      {
        title: 'K-Pop',
        checked: false,
      },
      {
        title: 'Latin',
        checked: false,
      },
      {
        title: 'Metal',
        checked: false,
      },
      {
        title: 'New Age',
        checked: false,
      },
      {
        title: 'Opera',
        checked: false,
      },
      {
        title: 'Pop',
        checked: false,
      },
      {
        title: 'Progressive',
        checked: false,
      },
      {
        title: 'Psychedelic',
        checked: false,
      },
      {
        title: 'R&B',
        checked: false,
      },
      {
        title: 'Reggae',
        checked: false,
      },
      {
        title: 'Rap',
        checked: false,
      },
      {
        title: 'Rock',
        checked: false,
      },
      {
        title: 'Ska',
        checked: false,
      },
      {
        title: 'Spoken Word',
        checked: false,
      },
      {
        title: 'Techno',
        checked: false,
      },
      {
        title: 'Trance',
        checked: false,
      },
      {
        title: 'Trap',
        checked: false,
      },
      {
        title: 'World',
        checked: false,
      },
    ],
  },
];

let timer = null;

class SearchScreen extends BaseScreen {
  navbarHidden = false;

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    const mainPanel = _.cloneDeep(initPanel);
    this.toggle = this.toggle.bind(this);
    this.state = {
      toggle: false,
      trendingHashTags: [],
      resUser: [],
      resCraft: [],
      resCraftlist: [],
      resHashtags: [],
      searched: false,
      enableSearchOptions: true,
      ...INITIAL_SEARCH_OPTIONS,
      menulist: [],
      collapse: false,
      menuIndex: 0,
      route: ['Filter', '', ''],
      mainPanel,
    };
  }

  componentDidMount() {
    this.props.updateBackScreen('Search');
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getTrandingHashTags();
    });
    const menulist = _.cloneDeep(menus);
    this.setState({
      menulist,
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  getTrandingHashTags = () => {
    if (!this.state.searched) {
      SearchService.trendingHashTags()
        .then((res) => {
          this.setState({
            trendingHashTags: res.data.hashtags,
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    }
  };

  setToggle = (value) => {
    this.setState({
      toggle: value,
    });
  };

  search = () => {
    if (!this.state.enableSearchOptions) return;
    const { user, crafts, craftlists, keyword, mainPanel } = this.state;
    crafts.shop_categories.art_checked = mainPanel[1].Art[5].checked;
    crafts.shop_categories.music_checked = mainPanel[1].Music[5].checked;
    crafts.shop_categories.art_price = mainPanel[1].Art[4].checked;
    crafts.shop_categories.music_price = mainPanel[1].Music[4].checked;
    this.setState({ crafts }, () => {
      SearchService.search(keyword, user, crafts, craftlists)
        .then((res) => {
          this.setState({
            resUser: res.data.user,
            resCraft: res.data.craft,
            resCraftlist: res.data.craftlist,
            resHashtags: [], // hash tag result
            searched: true,
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error);
        });
    });
  };

  onUser = (id) => {
    this.props.updateProfileUserId(id);
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('Profile');
    this.props.navigation.navigate('Profile', { refresh: true });
  };

  onCraftlist = (id) => {
    this.props.updateCraftListId(id);
    this.props.updatePrevState(store.getState());
    this.props.updateTitle('Craftlist');
    this.props.navigation.push('Craftlist');
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        const crafts = [res.data];
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
        this.props.setPlayingCrafts(crafts);
        this.props.updateCurCraftId(0);
        this.props.updatePrevState(store.getState());
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  showUsertypeIcon(types, verified) {
    return (
      <>
        {types.map((item, index) => {
          return (
            <View key={index}>
              {item.id === 1 && (
                <CustomIcon name="brush" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
              {item.id === 2 && (
                <CustomIcon name="music" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
              {item.id === 3 && (
                <CustomIcon name="briefcase" size={METRICS.fontSmall} style={styles.iconStyle} />
              )}
              {item.id === 4 && (
                <CustomIcon name="heart" size={METRICS.fontSizeSmall} style={styles.iconStyle} />
              )}
            </View>
          );
        })}
        {verified && (
          <CustomIcon
            name="mark-as-favorite-star"
            size={METRICS.fontSizeOK}
            style={[styles.iconStyle, { color: COLORS.starColor }]}
          />
        )}
      </>
    );
  }

  onChangeSearchInput = (keyword) => {
    this.setState({ keyword }, () => {
      clearTimeout(timer);
      timer = setTimeout(this.searchWithInput, 500);
    });
  };

  searchWithInput = () => {
    if (this.state.keyword === '') {
      this.onClickReset();
      return;
    }
    if (this.state.keyword.startsWith('#')) {
      this.setState({
        enableSearchOptions: false,
        toggle: false,
      });
      this.getHashTags(this.state.keyword);
    } else {
      const { mainPanel } = this.state;
      mainPanel[0].Filter[3].checked = false;
      this.setState({
        enableSearchOptions: true,
      });
    }
    this.search();
  };

  getHashTags = _.debounce((keyword) => {
    SearchService.only_show_lists(keyword).then((res) => {
      this.setState({
        resUser: [],
        resCraft: [],
        resCraftlist: [],
        resHashtags: this.state.keyword ? res.data.hashtags : [],
        searched: true,
      });
    });
  }, 300);

  onHashtag = (hashtag, crafts_count) => {
    this.props.navigation.navigate('HashedCrafts', {
      refresh: true,
      hashtag,
      crafts_count,
    });
  };

  setCheck = (arrIdx, childIdx = 0) => {
    const list = this.state.menulist;

    if (childIdx === 0) {
      if (arrIdx === 0) {
        this.setFilter('usercheck', !list[arrIdx].checked);
      }
      if (arrIdx === 1) {
        if (list[arrIdx].checked) {
        }
        this.setFilter('craftcheck', !list[arrIdx].checked);
      }
      if (arrIdx === 2) {
        this.setFilter('craftlists', !list[arrIdx].checked);
      }
      list[arrIdx].checked = !list[arrIdx].checked;
    } else {
      if (childIdx === 1) {
        this.setFilter('artcheck', !list[arrIdx].child[childIdx - 1].checked);
      }
      if (childIdx === 2) {
        this.setFilter('musiccheck', !list[arrIdx].child[childIdx - 1].checked);
      }
      if (childIdx === 3) {
        this.setFilter('brand_items', !list[arrIdx].child[childIdx - 1].checked);
      }
      if (childIdx === 4) {
        this.setFilter('shopcheck', !list[arrIdx].child[childIdx - 1].checked);
      }
      list[arrIdx].child[childIdx - 1].checked = !list[arrIdx].child[childIdx - 1].checked;
      list[1].checked = true;
    }
    this.setState({ menulist: list });
  };

  setCollapse = (index) => {
    const list = this.state.menulist;
    list[index].status = !list[index].status;
    this.setState({ menulist: list });
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ toggle: isOpen });
  }

  onPriceChanged = (lowPrice, highPrice, max) => {
    const { crafts } = this.state;
    crafts.checked = true;

    if (max === 1000) {
      if (highPrice === 1000) {
        crafts.shop_categories.overprice = true;
      } else {
        crafts.shop_categories.overprice = false;
      }
      crafts.shop_categories.price = { lowPrice, highPrice };
    } else {
      crafts.music_categories.bpm = { min: lowPrice, max: highPrice };
    }
    this.setState({ crafts });
    this.search();
  };

  onMenuItemSelected = (item, index) => {
    let { menuIndex } = this.state;
    let { route } = this.state;
    let { mainPanel } = this.state;
    if (mainPanel[menuIndex][route[menuIndex]][index].children) {
      if (mainPanel[menuIndex][route[menuIndex]][index].checked === true) {
        if (mainPanel[menuIndex][route[menuIndex]][index].collapse === false) {
          mainPanel[menuIndex][route[menuIndex]][index].checked = false;
        } else {
          mainPanel[menuIndex][route[menuIndex]][index].collapse = !mainPanel[menuIndex][
            route[menuIndex]
          ][index].collapse;
        }
      } else {
        mainPanel[menuIndex][route[menuIndex]][index].checked = true;
        mainPanel[menuIndex][route[menuIndex]][index].collapse = !mainPanel[menuIndex][
          route[menuIndex]
        ][index].collapse;
      }

      if (mainPanel[menuIndex][route[menuIndex]][index].title === 'Crafts') {
        var { crafts } = this.state;
        crafts.checked = mainPanel[menuIndex][route[menuIndex]][index].checked;
        this.setState({ crafts });
      }
    } else if (menuIndex === 2 || !mainPanel[menuIndex + 1][item]) {
      mainPanel[menuIndex][route[menuIndex]][index].checked = !mainPanel[menuIndex][
        route[menuIndex]
      ][index].checked;

      switch (item) {
        case 'Craftlists':
          this.setState({ craftlists: mainPanel[menuIndex][route[menuIndex]][index].checked });
          break;
        default:
          var genre = [];
          mainPanel[menuIndex][route[menuIndex]].forEach((item) => {
            if (item.checked === true) {
              genre.push(item.title);
            }
          });
          var { crafts } = this.state;
          crafts.checked = true;
          crafts.music_categories.genre = genre;
          this.setState({ crafts });
          break;
      }
    } else {
      mainPanel[menuIndex][route[menuIndex]][index].checked = !mainPanel[menuIndex][
        route[menuIndex]
      ][index].checked;
      if (item != 'Genre') {
        const { user } = this.state;
        user.checked = mainPanel[menuIndex][route[menuIndex]][index].checked;
        this.setState({ user });
      }

      if (mainPanel[menuIndex][route[menuIndex]][index].checked != false) {
        menuIndex++;
        route[menuIndex] = item;
      }
    }

    if (item === 'Hashtags') {
      mainPanel = _.cloneDeep(initPanel);
      mainPanel[menuIndex][route[menuIndex]][index].checked = !mainPanel[menuIndex][
        route[menuIndex]
      ][index].checked;
      menuIndex = 0;
      route = ['Filter', '', ''];
      this.setState(
        {
          mainPanel,
          resUser: [],
          resCraftlist: [],
          resCraft: [],
          resHashtags: [],
          toggle: false,
          searched: false,
          hashtags: mainPanel[menuIndex][route[menuIndex]][index].checked,
          keyword: '#',
          enableSearchOptions: false,
        },
        () => {
          this.getHashTags(this.state.keyword);
        }
      );
    } else {
      this.setState({ menuIndex, route, mainPanel }, () => {
        this.search();
      });
    }
  };

  onSubMenuItemSelected = (item, i, j) => {
    let { menuIndex } = this.state;
    const { route } = this.state;
    const { mainPanel } = this.state;

    if (!mainPanel[menuIndex + 1][item]) {
      mainPanel[menuIndex][route[menuIndex]][i].children[j].checked = !mainPanel[menuIndex][
        route[menuIndex]
      ][i].children[j].checked;

      switch (mainPanel[menuIndex][route[menuIndex]][i].title) {
        case 'User Type':
          var type = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              type.push(item.title);
            }
          });
          var { user } = this.state;
          if (type.length > 0 || user.rank.size > 0) {
            user.checked = true;
          } else {
            user.checked = false;
          }
          user.type = type;
          this.setState({ user });
          break;
        case 'User Rank':
          var rank = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              rank.push(item.title);
            }
          });
          var { user } = this.state;
          if (rank.length > 0 || user.type.size > 0) {
            user.checked = true;
          } else {
            user.checked = false;
          }
          user.rank = rank;
          this.setState({ user });
          break;
        case 'Art Type':
          var type = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              type.push(item.title);
            }
          });
          var { crafts } = this.state;
          crafts.checked = true;
          crafts.art_categories.type = type;
          this.setState({ crafts });
          break;
        case 'Music Type':
          var type = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              type.push(item.title);
            }
          });
          var { crafts } = this.state;
          crafts.checked = true;
          crafts.music_categories.type = type;
          this.setState({ crafts });
          break;
        case 'Subject':
          var subject = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              subject.push(item.title);
            }
          });
          var { crafts } = this.state;
          crafts.checked = true;
          if (route[menuIndex] === 'Art') {
            crafts.art_categories.subject = subject;
          } else if (route[menuIndex] === 'Music') {
            crafts.music_categories.subject = subject;
          }
          this.setState({ crafts });
          break;
        case 'Colors':
          var color = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              color.push(item.title.toLowerCase());
            }
          });
          var { crafts } = this.state;
          crafts.checked = true;
          crafts.art_categories.color = color;
          this.setState({ crafts });
          break;
        case 'Mood':
          var mood = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              mood.push(item.title);
            }
          });
          var { crafts } = this.state;
          crafts.checked = true;
          if (route[menuIndex] === 'Art') {
            crafts.art_categories.mood = mood;
          } else if (route[menuIndex] == 'Music') {
            crafts.music_categories.mood = mood;
          }
          this.setState({ crafts });
          break;
        case 'Purchase Option':
          var purchase_option = [];
          mainPanel[menuIndex][route[menuIndex]][i].children.forEach((item) => {
            if (item.checked === true) {
              purchase_option.push(item.title);
            }
          });
          var { crafts } = this.state;
          crafts.checked = true;
          crafts.shop_categories.purchase_option = purchase_option;
          this.setState({ crafts });
          break;
        case 'Crafts':
          var { crafts } = this.state;
          crafts.brand_items = mainPanel[menuIndex][route[menuIndex]][i].children[j].checked;
          this.setState({ crafts });
          break;
        default:
          break;
      }
    } else {
      var { crafts } = this.state;
      mainPanel[menuIndex][route[menuIndex]][i].children[j].checked = !mainPanel[menuIndex][
        route[menuIndex]
      ][i].children[j].checked;
      if (item === 'Art') {
        crafts.art_categories.checked =
          mainPanel[menuIndex][route[menuIndex]][i].children[j].checked;
      }
      if (item === 'Music') {
        crafts.music_categories.checked =
          mainPanel[menuIndex][route[menuIndex]][i].children[j].checked;
      }
      if (item === 'Genre') {
      }
      if (mainPanel[menuIndex][route[menuIndex]][i].children[j].checked === true) {
        menuIndex++;
        route[menuIndex] = item;
      }
    }
    this.setState({ menuIndex, route, mainPanel }, () => {
      this.search();
    });
  };

  onBack = () => {
    let { menuIndex } = this.state;
    if (menuIndex > 0) {
      menuIndex--;
    }
    this.setState({ menuIndex }, () => {});
  };

  onClickDone = () => {
    this.setState({ toggle: false });
  };

  onClickReset = () => {
    const mainPanel = _.cloneDeep(initPanel);
    INITIAL_SEARCH_OPTIONS = _.cloneDeep(Search_option);
    this.setState({ mainPanel });
    this.setState({
      ...INITIAL_SEARCH_OPTIONS,
      resUser: [],
      resCraftlist: [],
      resCraft: [],
      resHashtags: [],
      menuIndex: 0,
      route: ['Filter', '', ''],
      mainPanel,
      toggle: false,
      searched: false,
    });
  };

  render() {
    const {
      trendingHashTags,
      resUser,
      resCraft,
      resCraftlist,
      resHashtags,
      menuIndex,
      mainPanel,
    } = this.state;
    const userAvatar2 = require('../assets/images/user.png');
    const craftImage = require('../assets/images/craft.png');
    const craftlistImage = require('../assets/images/craftlist.png');
    const searchMenu = (
      <SearchMenu
        onItemSelected={this.onMenuItemSelected}
        onSubItemSelected={this.onSubMenuItemSelected}
        onPriceChanged={this.onPriceChanged}
        onBack={this.onBack}
        onClickReset={this.onClickReset}
        onClickDone={this.onClickDone}
        menu={mainPanel[menuIndex][this.state.route[menuIndex]]}
        title={this.state.route[menuIndex]}
      />
    );

    return (
      <View style={styles.container1}>
        <View style={styles.sidemenu}>
          <SideMenu
            menu={searchMenu}
            isOpen={this.state.toggle}
            onChange={(isOpen) => this.updateMenuState(isOpen)}
            menuPosition="right"
            openMenuOffset={METRICS.screenWidth * 0.8}
            disableGestures
          >
            <SafeAreaView style={styles.container}>
              <ScreenHeader pageTitle="Search" />
              <View style={styles.searchWrapper}>
                <View style={styles.searchItem}>
                  <SearchInput
                    placeholder="Search"
                    value={this.state.keyword}
                    onSubmit={this.search}
                    changeHandler={this.onChangeSearchInput}
                    onSearch={this.onSearch}
                  />
                </View>
                <TouchableOpacity
                  style={styles.searchIconWrapper}
                  disabled={!this.state.enableSearchOptions}
                  onPress={() => this.setToggle(!this.state.toggle)}
                >
                  <CustomIcon name="adjust" style={styles.searchIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.container}>
                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {this.state.searched ? (
                    <View style={styles.searchResultWrapper}>
                      {resUser.map((userItem, index) => (
                        <TouchableOpacity onPress={() => this.onUser(userItem.id)}>
                          <View style={styles.userItem} key={index}>
                            <View style={STYLES.horizontalAlign}>
                              <FastImage
                                source={userItem.avatar ? { uri: userItem.avatar } : userAvatar2}
                                style={styles.avatar}
                              />
                              <Text style={styles.usernameText}>{userItem.username}</Text>
                              {userItem.types &&
                                this.showUsertypeIcon(userItem.types, userItem.verified_at)}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                      {resCraft.map((item, index) => (
                        <TouchableOpacity onPress={() => this.onCraft(item.id)}>
                          <View style={styles.userItem} key={index}>
                            <View style={STYLES.horizontalAlign}>
                              <FastImage
                                source={
                                  item.thumbnail_url ? { uri: item.thumbnail_url } : craftImage
                                }
                                style={styles.craftImage}
                              />
                              <Text style={styles.usernameText}>{item.title}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                      {resCraftlist.map((item, index) => (
                        <TouchableOpacity onPress={() => this.onCraftlist(item.id)}>
                          <View style={styles.userItem} key={index}>
                            <View style={STYLES.horizontalAlign}>
                              <FastImage
                                source={item.image ? { uri: item.image } : craftlistImage}
                                style={styles.craftImage}
                              />
                              <Text style={styles.usernameText}>{item.title}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                      {resHashtags.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => this.onHashtag(item.tags, item.crafts_count)}
                        >
                          <View style={styles.userItem} key={index}>
                            <View style={STYLES.columnLeftAlign}>
                              <Text style={styles.usernameText}>{item.tags}</Text>
                              <Text style={styles.hashCraftsCount}>
                                {item.crafts_count} craft
                                {(item.crafts_count === 0 && 's') || (item.crafts_count > 1 && 's')}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.container}>
                      <Text style={styles.title1}>Top Users</Text>
                      {/* <UserList items={}/> */}
                      <Text style={styles.title2}>Trending Hashtags</Text>
                      {trendingHashTags.map((item, index) => (
                        <StoreList
                          title={`${item.tags}`}
                          count={`(${item.crafts_count})`}
                          items={item.crafts}
                          onCraft={this.onCraft}
                          onPress={() => this.onHashtag(item.tags, item.crafts_count)}
                        />
                      ))}
                      <View style={{ height: 50 }} />
                    </View>
                  )}
                </KeyboardAwareScrollView>
              </View>
            </SafeAreaView>
          </SideMenu>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sidemenu: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
    marginTop: 40 * METRICS.ratioX,
  },
  container1: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
  },
  container: {
    backgroundColor: COLORS.blackColor,
    minHeight: '100%',
    paddingBottom: 150 * METRICS.ratioY,
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingHorizontal: METRICS.spacingNormal,
    paddingVertical: METRICS.marginSmall,
  },
  searchItem: {
    flex: 10,
    height: 40 * METRICS.ratioX,
  },
  searchIconWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  searchIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeHuge,
  },
  title1: {
    marginBottom: METRICS.spacingBig,
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBig,
    textAlign: 'center',
    marginTop: METRICS.spacingNormal,
    fontFamily: 'lato-bold',
  },
  title2: {
    marginBottom: METRICS.spacingBig,
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBig,
    textAlign: 'center',
    marginTop: METRICS.spacingExtra,
    fontFamily: 'lato-bold',
  },
  searchResultWrapper: {
    paddingHorizontal: METRICS.spacingBig,
    paddingBottom: 70 * METRICS.ratioY,
    flexGrow: 1,
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
  craftImage: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    marginRight: METRICS.spacingSmall,
    borderRadius: 2,
  },
  usernameText: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeOK,
    color: COLORS.whiteColor,
    paddingRight: METRICS.marginTiny,
  },
  hashCraftsCount: {
    fontFamily: 'Lato-Semibold',
    fontSize: METRICS.fontSizeLight,
    color: COLORS.inActive,
    paddingRight: METRICS.marginTiny,
  },
  iconStyle: {
    color: COLORS.primaryColor,
    paddingRight: METRICS.marginTiny,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateCraftListId: (data) => dispatch(updateCraftListId(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateProfileUserId: (data) => dispatch(updateProfileUserId(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
    updateBackScreen: (data) => dispatch(updateBackScreen(data)),
  };
}

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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(SearchScreen));
