import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { METRICS, COLORS } from '../../global';
import CustomButton from '../CustomButton';
import CustomIcon from '../CustomIcon';
import SliderShop from '../SliderShop';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: 'black',
    marginBottom: 80 * METRICS.ratioY,
    borderColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
  },
  subitem: {
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato',
    paddingLeft: METRICS.spacingHuge,
    color: 'white',
  },
  titlemain: {
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato-semibold',
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    left: -5 * METRICS.ratioX,
    top: 4 * METRICS.ratioX,
    padding: 10 * METRICS.ratioX,
    paddingRight: METRICS.spacingBig,
    zIndex: 101,
  },
  container: {
    flexDirection: 'row',
    height: METRICS.rowHeightMedium,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.editingGrey,
    borderTopColor: COLORS.whiteColor,
    borderLeftColor: COLORS.whiteColor,
    borderRightColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
  },
  pageTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  pageTitleText: {
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'lato-semibold',
    color: COLORS.whiteColor,
  },
  doneButton: {
    position: 'absolute',
    width: '20%',
    top: 10 * METRICS.ratioX,
    right: 15 * METRICS.ratioY,
    zIndex: 101,
  },
  resetButton: {
    width: '100%',
    height: 50 * METRICS.ratioY,
    top: 5 * METRICS.ratioX,
    zIndex: 101,
    borderColor: COLORS.blackColor,
  },
});

export default function SearchMenu({
  onItemSelected,
  onSubItemSelected,
  onPriceChanged,
  onBack,
  onClickReset,
  onClickDone,
  menu,
  title,
}) {
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          {title != 'Filter' && (
            <CustomIcon
              name="back"
              size={METRICS.fontSizeBigger}
              style={{ color: COLORS.whiteColor }}
            />
          )}
        </TouchableOpacity>
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitleText}>{title}</Text>
        </View>
        <CustomButton style={styles.doneButton} title="Done" clickHandler={() => onClickDone()} />
      </View>
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {menu.map((item, i) => (
          <>
            {item.type == 'Button' && (
              <CustomButton
                style={styles.resetButton}
                title="Reset"
                clickHandler={() => onClickReset()}
              />
            )}
            {(item.select || item.type == 'slider') && item.checked == false && (
              <ListItem
                title={item.title}
                rightTitle={item.select}
                bottomDivider
                onPress={() => onItemSelected(item.title, i)}
                chevron={{
                  color: 'white',
                  size: METRICS.fontSizeBig,
                  marginVertical: -METRICS.spacingSmall,
                }}
                titleStyle={styles.titlemain}
                containerStyle={{ backgroundColor: 'black' }}
              />
            )}
            {item.checked == false && !item.select && !item.type && (
              <ListItem
                title={item.title}
                bottomDivider={{ color: 'white' }}
                containerStyle={{ backgroundColor: 'black' }}
                onPress={() => onItemSelected(item.title, i)}
                titleStyle={styles.titlemain}
              />
            )}
            {item.checked == true && (
              <ListItem
                title={item.title}
                bottomDivider
                checkmark={{ color: 'white', size: METRICS.fontSizeBigger }}
                containerStyle={{ backgroundColor: 'black' }}
                onPress={() => onItemSelected(item.title, i)}
                titleStyle={styles.titlemain}
              />
            )}
            {item.collapse == true && item.type == 'slider' && (
              <SliderShop
                min={item.min}
                max={item.max}
                data={{ lowPrice: item.min, highPrice: item.max }}
                onPriceChanged={onPriceChanged}
              />
            )}
            {item.collapse == true &&
              item.children.map((child, j) => (
                <View>
                  {child.select && child.checked == false && (
                    <ListItem
                      title={child.title}
                      rightTitle={child.select}
                      bottomDivider
                      onPress={() => onSubItemSelected(child.title, i, j)}
                      titleStyle={child.style ? child.style : styles.subitem}
                      chevron={{
                        color: 'white',
                        size: METRICS.fontSizeBig,
                        marginVertical: -METRICS.spacingSmall,
                      }}
                      containerStyle={{ backgroundColor: 'black' }}
                    />
                  )}
                  {child.checked == false && !child.select && (
                    <ListItem
                      title={child.title}
                      rightTitle={child.select}
                      bottomDivider={{ color: 'white' }}
                      containerStyle={{ backgroundColor: 'black' }}
                      onPress={() => onSubItemSelected(child.title, i, j)}
                      titleStyle={child.style ? child.style : styles.subitem}
                    />
                  )}
                  {child.checked == true && (
                    <ListItem
                      title={child.title}
                      rightTitle={child.select}
                      bottomDivider
                      checkmark={{ color: 'white', size: METRICS.fontSizeBigger }}
                      containerStyle={{ backgroundColor: 'black' }}
                      onPress={() => onSubItemSelected(child.title, i, j)}
                      titleStyle={child.style ? child.style : styles.subitem}
                    />
                  )}
                </View>
              ))}
          </>
        ))}
      </ScrollView>
    </>
  );
}

SearchMenu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
  onSubItemSelected: PropTypes.func.isRequired,
  onPriceChanged: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onClickReset: PropTypes.func.isRequired,
  onClickDone: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};
