import React from 'react';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import CustomIcon from './CustomIcon';
import { METRICS, COLORS } from '../global';

class CollapseSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
    };
  }

  componentDidMount() {
    const { isOpen } = this.props;

    if (isOpen) {
      this.setState({ isCollapsed: true });
    }
  }

  render() {
    const { isCollapsed } = this.state;
    const { title, children, iconName, avatar, uppercase, primary } = this.props;

    return (
      <Collapse
        isCollapsed={isCollapsed}
        onToggle={() =>
          this.setState((prevState) => {
            return { isCollapsed: !prevState.isCollapsed };
          })
        }
      >
        <CollapseHeader style={styles.container}>
          <View style={styles.sectionTitleContainer}>
            {iconName !== '' && (
              <CustomIcon
                name={iconName}
                size={METRICS.fontSizeBiggest}
                style={styles.sectionHeaderIcon}
              />
            )}
            {avatar && <FastImage source={avatar} style={styles.avatarImage} />}
            <Text
              style={[
                uppercase
                  ? { ...styles.textUppercase, ...styles.sectionTitleText }
                  : styles.sectionTitleText,
                { color: primary ? COLORS.primaryColor : COLORS.whiteColor },
              ]}
            >
              {title}
            </Text>
          </View>
        </CollapseHeader>
        <CollapseBody>{children}</CollapseBody>
      </Collapse>
    );
  }
}

CollapseSettings.propTypes = {
  uppercase: PropTypes.bool,
  iconName: PropTypes.string,
  title: PropTypes.string,
  // avatar: PropTypes.string,
  primary: PropTypes.bool,
};

CollapseSettings.defaultProps = {
  uppercase: false,
  iconName: '',
  title: '',
  // avatar: '',
  primary: true,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: METRICS.spacingNormal,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderIcon: {
    color: COLORS.primaryColor,
    marginRight: METRICS.spacingTiny,
  },
  sectionTitleText: {
    fontFamily: 'Lato-Bold',
    fontSize: METRICS.fontSizeMedium,
    color: COLORS.primaryColor,
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  avatarImage: {
    width: METRICS.avatarsmall,
    height: METRICS.avatarsmall,
    marginRight: METRICS.spacingTiny,
    borderRadius: METRICS.avatarsmall / 2,
  },
});

export default CollapseSettings;
