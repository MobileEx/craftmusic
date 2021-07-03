import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomIcon, CustomButton } from '../../components';
import { COLORS, METRICS, STYLES } from '../../global';
import { craft } from '../../global/Images';
import PlayingCraftService from '../../services/PlayingCraftService';
import store from '../../store/configureStore';
import {
  setPlayingCrafts,
  updateCraftPlaying,
  updatePrevState,
  updateCurCraftId,
  updateIsPlaying,
  updateTitle,
} from '../../store/actions';

class CommentReportsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
    };
  }

  componentDidMount() {
    PlayingCraftService.getCommentReport()
      .then((res) => {
        this.setState({ reports: res.data });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  onRemoveReport = (index) => {
    const { reports } = this.state;
    PlayingCraftService.removeCommentReport(reports[index].id)
      .then((res) => {
        reports.splice(index, 1);
        this.setState({ reports });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onDeleteComment = (index) => {
    const { reports } = this.state;
    PlayingCraftService.deleteComment(reports[index].comment.id)
      .then((res) => {
        this.onRemoveReport(index);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  onComment = (index) => {
    const { reports } = this.state;
    PlayingCraftService.getCraft(reports[index].comment.commentable_id)
      .then((res) => {
        this.props.setPlayingCrafts([res.data]);
        this.props.updatePrevState(store.getState());
        this.props.updateCurCraftId(0);
        this.props.updateTitle('CommentReport');
        this.props.updateIsPlaying(true);
        this.props.updateCraftPlaying(true);
      })
      .catch((err) => {
        // console.log(err.response.data.error);
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
                <Text style={styles.reported}>Commenter: {report.comment.user.username}</Text>
                <Text style={styles.reporter}>Suggester: {report.user.username}</Text>
                <View style={{ paddingVertical: METRICS.spacingTiny }}>
                  <TouchableOpacity onPress={() => this.onComment(index)}>
                    {/* <FastImage source={report.comment.attach_url} style={styles.commentImage} /> */}
                    <Text style={styles.reason}>{report.comment.body}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonstyle}>
                  <CustomButton
                    style={{ width: 1.5 * METRICS.followbuttonwidth }}
                    title="Delete Comment"
                    clickHandler={() => this.onDeleteComment(index)}
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
  const { commentreports } = state;
  return { commentreports };
}

function mapDispatchToProps(dispatch) {
  return {
    setPlayingCrafts: (data) => dispatch(setPlayingCrafts(data)),
    updateCraftPlaying: (data) => dispatch(updateCraftPlaying(data)),
    updatePrevState: (data) => dispatch(updatePrevState(data)),
    updateCurCraftId: (data) => dispatch(updateCurCraftId(data)),
    updateTitle: (data) => dispatch(updateTitle(data)),
    updateIsPlaying: (data) => dispatch(updateIsPlaying(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentReportsTab);

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
  buttonstyle: {
    paddingVertical: METRICS.spacingTiny,
  },
  commentImage: {
    height: METRICS.bigcrafts,
    width: METRICS.bigcrafts,
    marginRight: METRICS.spacingSmall,
    padding: METRICS.spacingTiny,
  },
});
