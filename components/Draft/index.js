import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import NavigationService from '../../navigation/NavigationService';
import CustomIcon from '../CustomIcon';
import { METRICS, STYLES, COLORS } from '../../global';
import { updateEditingCraftId, updateStudioOwnerId } from '../../store/actions';

class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
    };
  }

  handleDelete = () => {
    this.props.callBack(this.props.studio.id);
  };

  handleOpenStudio = () => {
    this.props.updateStudioOwnerId(this.props.studio.owner_id);
    this.props.updateEditingCraftId(this.props.studio.id);
    const navigateAction = NavigationActions.navigate({
      routeName: 'Studio',
      params: { id: this.props.studio.studio_id, isFromAddCover: 1, craftId: this.props.studio.id }, // in drafts response studio_id has the value, id has draft id
    });
    NavigationService.dispatch(navigateAction);
  };

  render() {
    const { isCollapsed } = this.state;
    const { title, username, lastEditedDate } = this.props;

    return (
      <Collapse
        isCollapsed={isCollapsed}
        onToggle={() =>
          this.setState((prevState) => {
            return { isCollapsed: !prevState.isCollapsed };
          })
        }
      >
        <CollapseHeader>
          <View style={styles.collapseHeader}>
            <View style={[STYLES.horizontalAlign, { width: '50%' }]}>
              <Text
                style={{
                  ...STYLES.mediumText,
                  marginRight: METRICS.marginTiny,
                  color: COLORS.lightGrey,
                  width: '75%',
                }}
              >
                {title}
              </Text>
              {isCollapsed ? (
                <CustomIcon
                  name="ionicons_svg_md-arrow-dropup"
                  size={METRICS.fontSizeHuge}
                  color={COLORS.lightGrey}
                />
              ) : (
                <CustomIcon
                  name="ionicons_svg_md-arrow-dropdown"
                  size={METRICS.fontSizeHuge}
                  color={COLORS.lightGrey}
                />
              )}
            </View>
            <Text style={STYLES.lightText}>{`${lastEditedDate} by ${username}`}</Text>
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.collapseBody}>
            <View style={styles.actionItem}>
              <TouchableOpacity
                style={STYLES.horizontalAlign}
                onPress={() => this.props.handleEdit(this.props.studio)}
              >
                <CustomIcon
                  style={styles.button}
                  name="edit2"
                  size={METRICS.fontSizeBiggest}
                  color={COLORS.primaryColor}
                />
                <Text style={{ ...STYLES.normalText, ...styles.actionTitle }}>Edit Details</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionItem}>
              <TouchableOpacity style={STYLES.horizontalAlign} onPress={this.handleOpenStudio}>
                <CustomIcon
                  style={styles.button}
                  name="add-plus-button"
                  size={METRICS.fontSizeBiggest}
                  color={COLORS.primaryColor}
                />
                <Text style={{ ...STYLES.normalText, ...styles.actionTitle }}>
                  Open Studio Editor
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionItem}>
              <TouchableOpacity style={STYLES.horizontalAlign} onPress={this.handleDelete}>
                <CustomIcon
                  style={styles.button}
                  name="cancel-button"
                  size={METRICS.fontSizeHuge}
                  color={COLORS.primaryColor}
                />
                <Text style={{ ...STYLES.normalText, ...styles.actionTitle }}>Delete draft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CollapseBody>
      </Collapse>
    );
  }
}

const styles = StyleSheet.create({
  collapseHeader: {
    height: METRICS.rowHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapseBody: {
    paddingVertical: METRICS.spacingNormal,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: METRICS.rowHeightMedium,
  },
  actionTitle: {
    color: COLORS.lightGrey,
  },
  button: {
    width: 42 * METRICS.ratioX,
    alignItems: 'flex-start',
  },
});

Draft.propTypes = {
  title: PropTypes.string,
};

Draft.defaultProps = {
  title: '',
};

function mapDispatchToProps(dispatch) {
  return {
    updateEditingCraftId: (data) => dispatch(updateEditingCraftId(data)),
    updateStudioOwnerId: (data) => dispatch(updateStudioOwnerId(data)),
  };
}

function mapStateToProps(state) {
  return {
    studioOwnerId: state.studioOwnerId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft);
