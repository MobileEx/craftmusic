import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-view';
import { CustomIcon, CustomButton } from '../../components';
import { COLORS, METRICS, STYLES } from '../../global';
import ProfileService from '../../services/ProfileService';

class RequestsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestData: [],
    };
  }

  componentDidMount() {
    ProfileService.getVerifyRequest()
      .then((res) => {
        this.setState({ requestData: res.data });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  }

  remove = (index) => {
    const { requestData } = this.state;

    ProfileService.removeVerifyRequest(requestData[index].id)
      .then((res) => {
        requestData.splice(index, 1);
        this.setState({ requestData });
      })
      .catch((err) => {
        // console.log(err.response.data.error);
      });
  };

  verify = (index) => {
    const { requestData } = this.state;

    ProfileService.verifyUser(requestData[index].user_id)
      .then((res) => {})
      .catch((err) => {
        // console.log(err.response.data.error);
      });
    
    this.remove(index);
  };

  render() {
    const { requests, searchverify } = this.props;
    const { requestData, image } = this.state;
    let data = requests;
    if (this.props.route.key === 'searchverify') {
      data = searchverify;
    }

    const images = [
      {
        source: {
          uri: image,
        },
        width: METRICS.screenWidth,
        height: METRICS.screenWidth,
      },
    ];
    return (
      <SafeAreaView style={styles.container}>
        {this.state.image && (
          <ImageView
            images={images}
            imageIndex={0}
            onClose={() => {
              this.setState({ image: null });
            }}
          />
        )}
        <ScrollView>
          {requestData.map((request, index) => (
            <View style={STYLES.horizontalAlign}>
              <View style={styles.wrapper}>
                <Text style={styles.reported}>Username: {request.username}</Text>
                <Text style={styles.reported}>Full name: {request.fullname}</Text>
                <Text style={styles.reported}>Known As: {request.knownas}</Text>
                <View style={{ paddingVertical: METRICS.spacingTiny }}>
                  <TouchableOpacity onPress={() => this.setState({ image: request.idphoto })}>
                    <FastImage source={{ uri: request.idphoto }} style={styles.commentImage} />
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonstyle}>
                  <CustomButton title="Verify" clickHandler={() => this.verify(index)} />
                </View>
              </View>
              <TouchableOpacity style={{ position: 'absolute', right: 0 }}>
                <CustomIcon
                  name="cancel-button"
                  style={styles.iconRight}
                  onPress={() => this.remove(index)}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { requests, searchverify, user } = state;
  return { requests, searchverify, user };
}

export default connect(mapStateToProps)(RequestsTab);

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
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  commentImage: {
    height: METRICS.bigcrafts,
    width: METRICS.bigcrafts,
    marginRight: METRICS.spacingSmall,
    padding: METRICS.spacingTiny,
  },
});
