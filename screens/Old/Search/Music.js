import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { COLORS, METRICS, STYLES } from '../../global';

import PlayingCraftService from '../../services/PlayingCraftService';

import {
  CustomCheck,
  CustomAccordion,
  CustomSwitch,
  SearchInput,
  CustomIcon,
  SliderNumbers,
  Button2,
  GenreModal,
} from '..';

class Music extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musicTypes: ['Instrumental'],
      moods: ['Sad'],
      explicit: true,
      genreModalVisible: false,
      genres_list: [],
    };
  }

  componentDidMount() {
    PlayingCraftService.getGenre()
      .then((res) => {
        // console.log('genre data: ', res.data);
        this.setState({
          genres_list: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  setMusicType = (musicType) => {
    this.props.setFilter('music_type', musicType);
  };

  setMood = (mood) => {
    this.props.setFilter('music_mood', mood);
  };

  onExplicit = () => {
    this.props.setFilter('music_explicit', !this.props.data.explicit);
  };

  setGenre = (genre) => {
    this.props.setFilter('music_genre', genre);
  };

  setGenreModalVisible = (value) => {
    // console.log(this.state.genres_list);
    this.setState({
      genreModalVisible: value,
    });
  };

  render() {
    const { onPress } = this.props;
    const { musicTypes, moods, explicit } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.part} onPress={() => onPress()}>
            <CustomIcon name="back" style={styles.iconHeader} />
          </TouchableOpacity>
          <Text style={styles.title}>Music</Text>
          <View style={styles.part} />
        </View>

        <View style={styles.section}>
          <CustomAccordion primary isOpen title="Music Type">
            <View style={styles.collapseBody}>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.type.includes('Instrumental')}
                  clickHandler={() => this.setMusicType('Instrumental')}
                />
                <TouchableOpacity onPress={() => this.setMusicType('Instrumental')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Instrumental</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.type.includes('Instrumental + Vocal')}
                  clickHandler={() => this.setMusicType('Instrumental + Vocal')}
                />
                <TouchableOpacity onPress={() => this.setMusicType('Instrumental + Vocal')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>
                    Instrumental + Vocal
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.type.includes('Acapella')}
                  clickHandler={() => this.setMusicType('Acapella')}
                />
                <TouchableOpacity onPress={() => this.setMusicType('Acapella')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Acapella</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.type.includes('Sample Pack')}
                  clickHandler={() => this.setMusicType('Sample Pack')}
                />
                <TouchableOpacity onPress={() => this.setMusicType('Sample Pack')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Sample Pack</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.type.includes('Podcast')}
                  clickHandler={() => this.setMusicType('Podcast')}
                />
                <TouchableOpacity onPress={() => this.setMusicType('Podcast')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Podcast</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomAccordion>
          <CustomAccordion primary isOpen title="Genre">
            <View style={styles.collapseBody}>
              <View style={styles.checkItem}>
                <Button2
                  title="Choose Genre"
                  style={styles.button}
                  callback={() => this.setGenreModalVisible(true)}
                />
              </View>
            </View>
          </CustomAccordion>
          <CustomAccordion primary isOpen title="BPM">
            <SliderNumbers min={0} max={200} setFilter={() => {}} />
          </CustomAccordion>
          <CustomAccordion primary isOpen title="Mood">
            <View style={styles.collapseBody}>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Happy')}
                  clickHandler={() => this.setMood('Happy')}
                />
                <TouchableOpacity onPress={() => this.setMood('Happy')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Happy</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Sad')}
                  clickHandler={() => this.setMood('Sad')}
                />
                <TouchableOpacity onPress={() => this.setMood('Sad')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Sad</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Angry')}
                  clickHandler={() => this.setMood('Angry')}
                />
                <TouchableOpacity onPress={() => this.setMood('Angry')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Angry</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Upbeat')}
                  clickHandler={() => this.setMood('Upbeat')}
                />
                <TouchableOpacity onPress={() => this.setMood('Upbeat')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Upbeat</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Calm')}
                  clickHandler={() => this.setMood('Calm')}
                />
                <TouchableOpacity onPress={() => this.setMood('Calm')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Calm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomAccordion>
          <View style={STYLES.horizontalAlign}>
            <CustomSwitch
              primary
              value={this.props.data.explicit}
              title="Explicit"
              fieldName="explicit"
              swipeHandler={() => this.onExplicit()}
            />
          </View>
        </View>
        <GenreModal
          onClose={() => this.setGenreModalVisible(false)}
          onCloseRequest={() => this.setGenreModalVisible(false)}
          genrelist={this.state.genres_list}
          data={this.props.data.genre}
          setGenre={this.setGenre}
          status={this.state.genreModalVisible}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  header: {
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconHeader: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
  },
  part: {
    width: 80 * METRICS.ratioX,
    paddingBottom: METRICS.spacingNormal,
  },
  title: {
    textAlign: 'center',
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato-bold',
    flex: 1,
    paddingBottom: METRICS.spacingNormal,
  },
  checkItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: METRICS.spacingSmall,
  },
  section: {
    // marginBottom: 30 * METRICS.ratioY,
    color: COLORS.primaryColor,
    paddingHorizontal: METRICS.spacingHuge,
  },
  collapseBody: {
    paddingVertical: METRICS.marginSmallY,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: METRICS.rowHeight,
  },
  checkTitle: {
    marginLeft: METRICS.spacingTiny,
  },
  removableItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: METRICS.rowHeight,
  },
  removableItemText: {
    marginLeft: METRICS.marginNormal,
  },
  searchBoxWrapper: {
    // marginBottom: METRICS.marginNormal,
    height: 40 * METRICS.ratioX,
  },
  button: {
    width: 140 * METRICS.ratioX,
    marginLeft: 20 * METRICS.ratioX,
  },
});

export default Music;
