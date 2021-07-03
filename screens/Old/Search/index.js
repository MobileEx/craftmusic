import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomButton from '../CustomButton';
import { COLORS, METRICS } from '../../global';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  renderSearch = () => {
    const { list, setFilter } = this.props;
    switch (this.state.tab) {
      case 1:
        return (
          <Shop
            onPress={() => this.setTab(0)}
            setFilter={this.props.setFilter}
            data={this.props.crafts.shop_categories}
          />
        );
      case 2:
        return (
          <Users
            onPress={() => this.setTab(0)}
            setFilter={this.props.setFilter}
            data={this.props.user}
          />
        );
      case 3:
        return (
          <Music
            onPress={() => this.setTab(0)}
            setFilter={this.props.setFilter}
            data={this.props.crafts.music_categories}
          />
        );
      case 4:
        return (
          <Art
            onPress={() => this.setTab(0)}
            setFilter={this.props.setFilter}
            data={this.props.crafts.art_categories}
          />
        );
      default:
        return (
          <Home2
            list={list}
            onPress={this.setTab}
            onCheck={this.props.setCheck}
            onCollapse={this.props.setCollapse}
            setFilter={this.props.setFilter}
          />
        );
    }
  };

  setTab = (value) => {
    this.setState({
      tab: value,
    });
  };

  render() {
    const { status } = this.props;

    if (!status) {
      return <></>;
    }
    return (
      <View style={styles.wrapper}>
        {this.renderSearch()}
        <CustomButton title="Apply" style={styles.button} clickHandler={this.props.onSearch} />
        <TouchableOpacity onPress={this.props.onReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.blackColor,
    flex: 1,
    paddingTop: METRICS.spacingNormal,
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 0.5 * METRICS.ratioX,
    borderBottomColor: COLORS.primaryColor,
    paddingBottom: METRICS.spacingBig,
  },

  button: {
    borderColor: COLORS.btnGrey,
    marginBottom: METRICS.spacingBig,
  },
  resetText: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeLight,
    paddingHorizontal: METRICS.spacingHuge,
  },
});

export default Menu;
