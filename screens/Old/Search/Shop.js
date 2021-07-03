import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import CustomIcon from '../CustomIcon';
import Checkbox from '../Checkbox';
import { COLORS, METRICS, STYLES } from '../../global';

import { CustomCheck, CustomAccordion, SliderShop } from '..';

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shopTypes: ['Lease'],
      overThousand: true,
    };
  }

  setShopType = (shopType) => {
    this.props.setFilter('purchase_option', shopType);
  };

  onCheck = () => {
    this.props.setFilter('overprice', !this.props.data.overprice);
  };

  render() {
    const { onPress } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onPress()} style={styles.part}>
            <CustomIcon name="back" style={styles.iconHeader} />
          </TouchableOpacity>
          <Text style={styles.title}>Shop</Text>
          <View style={styles.part} />
        </View>

        <View style={styles.section}>
          <CustomAccordion primary isOpen title="Price Range">
            <SliderShop
              min={0}
              max={1000}
              setFilter={this.props.setFilter}
              data={this.props.data.price}
            />
            <View style={styles.checkbox}>
              <Checkbox value={this.props.data.overprice} clickHandler={this.onCheck} />
              <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>
                Include items over $1,000 USD
              </Text>
            </View>
          </CustomAccordion>

          <CustomAccordion primary isOpen title="Purchase Options">
            <View style={styles.collapseBody}>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.purchase_option.includes('Buy')}
                  clickHandler={() => this.setShopType('Buy')}
                />
                <TouchableOpacity onPress={() => this.setShopType('Buy')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Buy</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.purchase_option.includes('Lease')}
                  clickHandler={() => this.setShopType('Lease')}
                />
                <TouchableOpacity onPress={() => this.setShopType('Lease')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Lease</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.purchase_option.includes('Free')}
                  clickHandler={() => this.setShopType('Free')}
                />
                <TouchableOpacity onPress={() => this.setShopType('Free')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Free</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomAccordion>
          <View style={{ paddingBottom: METRICS.spacingNormal }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
  },
  checkbox: {
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
    marginBottom: METRICS.spacingHuge,
    flexDirection: 'row',
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
  min: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    color: COLORS.selectedGrey,
    fontFamily: 'lato',
  },
  max: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    color: COLORS.selectedGrey,
    fontFamily: 'lato',
  },
});

export default Shop;
