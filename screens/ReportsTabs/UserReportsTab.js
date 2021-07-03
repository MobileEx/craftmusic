import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomIcon } from '../../components';
import { COLORS, METRICS, STYLES } from '../../global';
import ProfileService from '../../services/ProfileService';

class UserReportsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
    };
  }

  componentDidMount() {
    ProfileService.getUserReport()
      .then((res) => {
        this.setState({ reports: res.data });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }

  onRemoveReport = (index) => {
    const { reports } = this.state;

    ProfileService.removeUserReport(reports[index].id)
      .then((res) => {
        reports.splice(index, 1);
        this.setState({ reports });
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  render() {
    const { userreports, craftreports } = this.props;
    const { reports } = this.state;
    let data = userreports;
    if (this.props.route.key === 'craftreports') {
      data = craftreports;
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {reports.map((report, index) => (
            <View style={STYLES.horizontalAlign}>
              <View style={styles.wrapper}>
                <Text style={styles.reported}>Reported: {report.reporter.username}</Text>
                <Text style={styles.reporter}>Suggester: {report.suggester.username}</Text>
                <Text style={styles.reason}>{report.report_content}</Text>
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
  const { craftreports, commentreports, userreports, user } = state;
  return { craftreports, commentreports, userreports, user };
}

export default connect(mapStateToProps)(UserReportsTab);

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
});
