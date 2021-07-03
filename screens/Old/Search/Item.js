import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import SideMenu from 'react-native-side-menu';
import CustomIcon from '../CustomIcon';
import { METRICS, COLORS } from '../../global';

// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import SideMenu from 'react-native-side-menu';
// import SearchMenu from './Menu';

// const image = require('./assets/menu.png');

// const styles = StyleSheet.create({
//   button: {
//     position: 'absolute',
//     top: 20,
//     padding: 10,
//   },
//   caption: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     alignItems: 'center',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: 'white',
//     marginBottom: 5,
//   },
// });

// export default class SearchOption extends React.Component {
//   constructor(props) {
//     super(props);

//     this.toggle = this.toggle.bind(this);

//     this.state = {
//       isOpen: false,
//       selectedItem: 'About',
//     };
//   }

//   toggle() {
//     this.setState({
//       isOpen: !this.state.isOpen,
//     });
//   }

//   updateMenuState(isOpen) {
//     this.setState({ isOpen });
//   }

//   onMenuItemSelected = item =>
//     this.setState({
//       isOpen: false,
//       selectedItem: item,
//     });

//   render() {
//     const menu = <SearchMenu onItemSelected={this.onMenuItemSelected} />;

//     return (
//       <SideMenu
//         menu={menu}
//         isOpen={this.state.isOpen}
//         onChange={isOpen => this.updateMenuState(isOpen)}
//       >
//         <View style={styles.container}>
//           <Text style={styles.welcome}>
//             Welcome to React Native!
//           </Text>
//           <Text style={styles.instructions}>
//             To get started, edit index.ios.js
//           </Text>
//           <Text style={styles.instructions}>
//             Press Cmd+R to reload,{'\n'}
//             Cmd+Control+Z for dev menu
//           </Text>
//           <Text style={styles.instructions}>
//             Current selected menu item is: {this.state.selectedItem}
//           </Text>
//         </View>
//         <TouchableOpacity
//           onPress={this.toggle}
//           style={styles.button}
//         >
//           <Text>Toggle Menu</Text>
//         </TouchableOpacity>
//       </SideMenu>
//     );
//   }
// }

class Item extends React.Component {
  onPress = (tab, index) => {
    this.props.onCheck(index);
    this.props.onPress(tab);
  };

  onPressSub = (tab, index, subid) => {
    this.props.onCheck(index, subid + 1);
    this.props.onPress(tab);
  };

  render() {
    const { title, status, checked, child, onPress, tab, index, onCheck, onCollapse } = this.props;

    return (
      <>
        <View style={styles.row}>
          <TouchableOpacity style={styles.checkedWrapper} onPress={() => onCheck(index)}>
            {checked && <CustomIcon name="check-sign" style={styles.leftIcon} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onCheck(index)} style={styles.textWrapper}>
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
          {child && (
            <TouchableOpacity onPress={() => onCollapse(index)}>
              <CustomIcon
                name={status ? 'ionicons_svg_md-arrow-dropup' : 'ionicons_svg_md-arrow-dropdown'}
                style={styles.dropdown}
              />
            </TouchableOpacity>
          )}
          {!child && tab != 0 && (
            <TouchableOpacity onPress={() => this.onPress(tab, index)}>
              <CustomIcon name="angle-right" style={styles.rightIcon} />
            </TouchableOpacity>
          )}
        </View>
        {status &&
          child.map((item, subid) => (
            <View style={styles.row1} key={subid}>
              <TouchableOpacity
                style={styles.checkedWrapper}
                onPress={() => onCheck(index, subid + 1)}
              >
                {item.checked && <CustomIcon name="check-sign" style={styles.leftIcon} />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onCheck(index, subid + 1)}
                style={styles.textWrapper}
              >
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
              {item.tab != 0 && (
                <TouchableOpacity onPress={() => this.onPressSub(item.tab, index, subid)}>
                  <CustomIcon
                    name={item.status ? 'ionicons_svg_md-arrow-dropdown' : 'angle-right'}
                    style={styles.rightIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
      </>
    );
  }
}

Item.propTypes = {
  title: PropTypes.string,
  status: PropTypes.bool,
  checked: PropTypes.bool,
  onPress: PropTypes.func,
  tab: PropTypes.number,
};

Item.defaultProps = {
  title: 'tab',
  status: false,
  checked: false,
  onPress: () => {},
  tab: 0,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: METRICS.spacingHuge,
    alignItems: 'center',
    marginBottom: METRICS.spacingNormal,
  },
  row1: {
    flexDirection: 'row',
    paddingLeft: METRICS.spacingHuge + 25 * METRICS.ratioX + METRICS.spacingBig,
    alignItems: 'center',
    marginBottom: METRICS.spacingNormal,
  },
  checkedWrapper: {
    width: 25 * METRICS.ratioX,
    height: 25 * METRICS.ratioX,
    borderRadius: 25 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.primaryColor,
  },
  leftIcon: {
    fontSize: 23.5 * METRICS.ratioX,
    color: COLORS.primaryColor,
  },
  title: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato-bold',
    marginLeft: METRICS.spacingBig,
  },
  textWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  rightIcon: {
    color: COLORS.whiteColor,
    fontSize: METRICS.rightarrow,
    paddingHorizontal: METRICS.spacingBig,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dropdown: {
    color: COLORS.lightGrey,
    fontSize: 0.9 * METRICS.rightarrow,
    paddingHorizontal: METRICS.spacingBig,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default Item;
