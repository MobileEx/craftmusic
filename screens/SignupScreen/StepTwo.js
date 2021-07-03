import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomIcon, CustomButton } from '../../components';
import { COLORS, METRICS } from '../../global';

class StepTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.accountType,
    };
  }

  saveSelected() {
    this.props.onPress('storeAccountTypes', this.state.active);
  }

  updateSelected(accountType) {
    const currentActive = this.state.active;
    let activeId;
    let newActive = [];
    if (accountType === 'musician') {
      activeId = 1;
    } else if (accountType === 'digital_artist') {
      activeId = 2;
    } else if (accountType === 'business') {
      activeId = 3;
    } else if (accountType === 'user') {
      activeId = 4;
    }

    if (currentActive.includes(activeId)) {
      newActive = currentActive.filter((id) => {
        if (id === activeId) {
          return false;
        }
        return true;
      });
    } else {
      newActive = [...currentActive, activeId];
    }
    this.setState({ active: newActive });
  }

  back = () => {
    this.saveSelected();
    this.props.onPress(1, { change: true });
  };

  render() {
    const { active } = this.state;
    const iconActive = <CustomIcon name="check-sign" style={styles.iconTick} />;

    let musician;
    let digitalArtist;
    let business;
    let casualUser;
    const musicianIconWrapperStyles = [styles.iconTickWrapper];
    const digitalArtistIconWrapperStyles = [styles.iconTickWrapper];
    const businessIconWrapperStyles = [styles.iconTickWrapper];
    const patronIconWrapperStyles = [styles.iconTickWrapper];

    if (active.includes(1)) {
      musician = iconActive;
      musicianIconWrapperStyles.push(styles.borderOff);
    }
    if (active.includes(2)) {
      digitalArtist = iconActive;
      digitalArtistIconWrapperStyles.push(styles.borderOff);
    }
    if (active.includes(3)) {
      business = iconActive;
      businessIconWrapperStyles.push(styles.borderOff);
    }
    if (active.includes(4)) {
      casualUser = iconActive;
      patronIconWrapperStyles.push(styles.borderOff);
    }
    return (
      <View style={styles.content}>
        <View style={styles.titlewrapper}>
          <TouchableOpacity style={styles.backButton} onPress={this.back}>
            <CustomIcon
              name="back"
              size={METRICS.fontSizeNormal}
              style={{ color: COLORS.whiteColor }}
            />
          </TouchableOpacity>
          <Text style={styles.title}>I am a:</Text>
          <CustomIcon name="close" size={METRICS.fontSizeNormal} />
        </View>
        <TouchableOpacity
          style={styles.formRow}
          onPress={() => {
            this.updateSelected('musician');
          }}
        >
          <View style={styles.iconWrapper}>
            <CustomIcon name="music" style={styles.icon} />
          </View>
          <Text style={styles.label}>Musician</Text>
          <View style={musicianIconWrapperStyles}>{musician}</View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formRow}
          onPress={() => {
            this.updateSelected('digital_artist');
          }}
        >
          <View style={styles.iconWrapper}>
            <CustomIcon name="brush" style={styles.icon} />
          </View>
          <Text style={styles.label}>Digital Artist</Text>
          <View style={digitalArtistIconWrapperStyles}>{digitalArtist}</View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formRow}
          onPress={() => {
            this.updateSelected('business');
          }}
        >
          <View style={styles.iconWrapper}>
            <CustomIcon name="briefcase" style={styles.icon} />
          </View>
          <Text style={styles.label}>Brand/Business</Text>
          <View style={businessIconWrapperStyles}>{business}</View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.formRow}
          onPress={() => {
            this.updateSelected('user');
          }}
        >
          <View style={styles.iconWrapper}>
            <CustomIcon name="heart" style={styles.icon} />
          </View>
          <Text style={styles.label}>Patron</Text>
          <View style={patronIconWrapperStyles}>{casualUser}</View>
        </TouchableOpacity>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="SUBMIT"
            style={styles.button}
            clickHandler={() => this.props.onPress(2, active)}
          />
          {this.props.isFetching && (
            <ActivityIndicator
              size="small"
              color="#3acecc"
              style={{ paddingTop: METRICS.spacingNormal }}
            />
          )}
        </View>
      </View>
    );
  }
}

StepTwo.defaultProps = {
  accountType: [],
};

function mapStateToProps(state) {
  const { isFetching } = state;
  return { isFetching };
}

export default connect(mapStateToProps)(StepTwo);
const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    flex: 1,
    width: '70%',
    marginTop: 1.2 * METRICS.spacingHuge * METRICS.ratioY * METRICS.ratioY,
  },
  title: {
    fontSize: METRICS.fontSizeBig,
    color: COLORS.whiteColor,
    textAlign: 'center',
    marginBottom: METRICS.spacingHuge,
    fontFamily: 'lato-bold',
  },
  titlewrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: METRICS.spacingHuge,
    alignItems: 'center',
    width: '100%',
    height: 30 * METRICS.ratioX,
  },
  iconWrapper: {
    marginRight: METRICS.spacingNormal,
  },
  icon: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeBig,
  },
  label: {
    color: COLORS.whiteColor,
    flex: 1,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato',
  },
  buttonWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: METRICS.spacingGiant,
  },
  iconTickWrapper: {
    width: 25 * METRICS.ratioX,
    height: 25 * METRICS.ratioX,
    borderRadius: 25 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
  },
  borderOff: {
    borderWidth: 0,
  },
  iconTick: {
    fontSize: 23.5 * METRICS.ratioX,
    color: COLORS.primaryColor,
  },
  button: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
  },
  backButton: {
    position: 'relative',
    marginTop: 4 * METRICS.ratioX,
  },
});
