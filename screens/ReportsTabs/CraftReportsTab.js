import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomIcon, CustomButton } from '../../components';
import { COLORS, METRICS, STYLES } from '../../global';
import { craft } from '../../global/Images';
import PlayingCraftService from '../../services/PlayingCraftService';
import _ from 'lodash';
import ProfileService from '../../services/ProfileService';
import NavigationService from '../../navigation/NavigationService';
import store from '../../store/configureStore';
import { setPlayingCrafts, updateCraftPlaying, updatePrevState, updateCurCraftId, updateIsPlaying } from '../../store/actions';

class CraftReportsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
    };
  }

  componentDidMount() {
    PlayingCraftService.getCraftReport()
      .then((res) => {
        this.setState({ reports: res.data });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  onRemoveReport = (index) => {
    const { reports } = this.state;
    PlayingCraftService.removeCraftReport(reports[index].id)
      .then((res) => {
        reports.splice(index, 1);
        this.setState({ reports });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  onDeleteCraft = (index) => {
    const { reports } = this.state;
    PlayingCraftService.deleteCraft(reports[index].craft.id)
      .then((res) => {
        this.onRemoveReport(index);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  onCraft = (id) => {
    PlayingCraftService.getCraft(id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updateCurCraftId(0);
        this.props.updatePrevState(store.getState());
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  render() {
    const { userreports, craftreports, commentreports } = this.props;
    const { reports } = this.state;
    let data = userreports;
    if (this.props.route.key === 'craftreports') {
      data = craftreports;
    } else if (this.props.route.key === 'commentreports') {
      data = commentreports;
    }
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {reports.map((report, index) => (
            <View style={STYLES.horizontalAlign}>
              <View style={styles.wrapper}>
                <TouchableOpacity
                  style={([STYLES.horizontalAlign], { flexDirection: 'row', flex: 1 })}
                  onPress={() => this.onCraft(report.craft.id)}
                >
                  <FastImage source={craft} style={styles.craftImage} />
                  <Text style={styles.craftTitle}>{report.craft.title}</Text>
                </TouchableOpacity>
                <Text style={styles.reporter}>Suggester: {report.reporter.username}</Text>
                <Text style={styles.reason}>{report.report_content}</Text>
                <View style={styles.buttonstyle}>
                  <CustomButton
                    title="Delete Craft"
                    clickHandler={() => this.onDeleteCraft(index)}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{ position: 'absolute', right: 0 }}
                onPress={() => this.onRemoveReport(index)}
              >
                <CustomIcon name="cancel-button" style={styles.iconRight} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { craftreports } = state;
  return { craftreports };
}

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CraftReportsTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blackColor,
  },
  container1: {
    paddingLeft: METRICS.spacingNormal,
    paddingRight: METRICS.spacingNormal,
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: METRICS.spacingNormal,
  },
  reported: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
    padding: 0.5 * METRICS.spacingTiny,
  },
  reporter: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.nameDM,
    padding: 0.5 * METRICS.spacingTiny,
  },
  reason: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.primaryColor,
    padding: 0.5 * METRICS.spacingTiny,
  },
  iconRight: {
    fontSize: METRICS.fontSizeHuge,
    color: COLORS.primaryColor,
    marginHorizontal: METRICS.spacingBig,
  },
  craftImage: {
    height: METRICS.avatarsmall,
    width: METRICS.avatarsmall,
    marginRight: METRICS.spacingSmall,
    borderRadius: 2,
    padding: 0.5 * METRICS.spacingTiny,
  },
  craftTitle: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    color: COLORS.whiteColor,
    padding: 0.5 * METRICS.spacingTiny,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonstyle: {
    paddingVertical: METRICS.spacingTiny,
  },
});
