import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { COLORS, METRICS, STYLES } from '../../global';

import { CustomIcon, CustomCheck, CustomAccordion, CustomSwitch } from '..';

class Art extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artTypes: [],
      subject: [],
      moods: [],
      colorOptions: [],
      explicit: true,
    };
  }

  setArtTypes = (artType) => {
    this.props.setFilter('art_type', artType);
  };

  setSubject = (value) => {
    this.props.setFilter('art_subject', value);
  };

  setMoods = (mood) => {
    this.props.setFilter('art_mood', mood);
  };

  setColorOptions = (option) => {
    this.props.setFilter('art_color', option);
  };

  onExplicit = () => {
    this.props.setFilter('art_explicit', !this.props.data.explicit);
  };

  render() {
    const { onPress } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.part} onPress={() => onPress()}>
            <CustomIcon name="back" style={styles.iconHeader} />
          </TouchableOpacity>
          <Text style={styles.title}>Art</Text>
          <View style={styles.part} />
        </View>

        <View style={styles.section}>
          <CustomAccordion primary isOpen title="Art Type">
            <View style={styles.collapseBody}>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.type.includes('Video')}
                  clickHandler={() => this.setArtTypes('Video')}
                />
                <TouchableOpacity onPress={() => this.setArtTypes('Video')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Video</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.type.includes('Photo')}
                  clickHandler={() => this.setArtTypes('Photo')}
                />
                <TouchableOpacity onPress={() => this.setArtTypes('Photo')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomAccordion>
          <CustomAccordion primary isOpen title="Subject">
            <View style={styles.collapseBody}>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.subject.includes('People')}
                  clickHandler={() => this.setSubject('People')}
                />
                <TouchableOpacity onPress={() => this.setSubject('People')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>People</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.subject.includes('Animals')}
                  clickHandler={() => this.setSubject('Animals')}
                />
                <TouchableOpacity onPress={() => this.setSubject('Animals')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Animals</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.subject.includes('Objects')}
                  clickHandler={() => this.setSubject('Objects')}
                />
                <TouchableOpacity onPress={() => this.setSubject('Objects')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Objects</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.subject.includes('Nature')}
                  clickHandler={() => this.setSubject('Nature')}
                />
                <TouchableOpacity onPress={() => this.setSubject('Nature')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Nature</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.subject.includes('Abstract')}
                  clickHandler={() => this.setSubject('Abstract')}
                />
                <TouchableOpacity onPress={() => this.setSubject('Abstract')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Abstract</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomAccordion>
          <CustomAccordion primary isOpen title="Colors">
            <View style={styles.collapseBody}>
              <View style={styles.swatchRow}>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('red')}
                    clickHandler={() => this.setColorOptions('red')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('red')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.redColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('teal')}
                    clickHandler={() => this.setColorOptions('teal')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('teal')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.tealColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('black')}
                    clickHandler={() => this.setColorOptions('black')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('black')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.blackColor }]} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swatchRow}>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('orange')}
                    clickHandler={() => this.setColorOptions('orange')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('orange')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.orangeColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('blue')}
                    clickHandler={() => this.setColorOptions('blue')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('blue')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.blueColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('grey')}
                    clickHandler={() => this.setColorOptions('grey')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('grey')}>
                    <View
                      style={[styles.swatchCircle, { backgroundColor: COLORS.greygreyColor }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swatchRow}>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('yellow')}
                    clickHandler={() => this.setColorOptions('yellow')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('yellow')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.yellowColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('violet')}
                    clickHandler={() => this.setColorOptions('violet')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('violet')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.violetColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('white')}
                    clickHandler={() => this.setColorOptions('white')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('white')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.whiteColor }]} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swatchRow}>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('green')}
                    clickHandler={() => this.setColorOptions('green')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('green')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.greenColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('pink')}
                    clickHandler={() => this.setColorOptions('pink')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('pink')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.pinkColor }]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swatchItem}>
                  <CustomCheck
                    value={this.props.data.color.includes('brown')}
                    clickHandler={() => this.setColorOptions('brown')}
                  />
                  <TouchableOpacity onPress={() => this.setColorOptions('brown')}>
                    <View style={[styles.swatchCircle, { backgroundColor: COLORS.brownColor }]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CustomAccordion>
          <CustomAccordion primary isOpen title="Mood">
            <View style={styles.collapseBody}>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Happy')}
                  clickHandler={() => this.setMoods('Happy')}
                />
                <TouchableOpacity onPress={() => this.setMoods('Happy')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Happy</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Sad')}
                  clickHandler={() => this.setMoods('Sad')}
                />
                <TouchableOpacity onPress={() => this.setMoods('Sad')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Sad</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Angry')}
                  clickHandler={() => this.setMoods('Angry')}
                />
                <TouchableOpacity onPress={() => this.setMoods('Angry')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Angry</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Upbeat')}
                  clickHandler={() => this.setMoods('Upbeat')}
                />
                <TouchableOpacity onPress={() => this.setMoods('Upbeat')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Upbeat</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.checkItem}>
                <CustomCheck
                  value={this.props.data.mood.includes('Calm')}
                  clickHandler={() => this.setMoods('Calm')}
                />
                <TouchableOpacity onPress={() => this.setMoods('Calm')}>
                  <Text style={{ ...STYLES.normalText, ...styles.checkTitle }}>Calm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomAccordion>
          <View style={STYLES.horizontalAlign}>
            <CustomSwitch
              primary
              value={this.props.data.explicit}
              title="Explicit"
              fieldName="explicit"
              swipeHandler={() => this.onExplicit()}
            />
          </View>
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
    marginBottom: 30 * METRICS.ratioY,
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
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: METRICS.spacingSmall,
  },
  swatchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70 * METRICS.ratioX,
  },
  swatchCircle: {
    width: 32 * METRICS.ratioX,
    height: 32 * METRICS.ratioX,
    borderRadius: 16 * METRICS.ratioX,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: COLORS.whiteColor,
    overflow: 'hidden',
    position: 'relative',
  },
});

export default Art;
