import React from 'react';
import { Collapse, CollapseHeader, CollapseBody } from 'accordion-collapse-react-native';
import { StyleSheet, Text, View } from 'react-native';
import CustomIcon from './CustomIcon';
import { METRICS, STYLES, COLORS } from '../global';

class CustomAccordion extends React.Component {
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

  handleDelete = () => {
    //
  };

  handleOpenStudio = () => {
    //
  };

  render() {
    const { isCollapsed } = this.state;
    const { title, primary, children } = this.props;

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
            <View style={STYLES.horizontalAlign}>
              <Text
                style={{
                  ...STYLES.mediumText,
                  marginRight: METRICS.marginTiny,
                  color: primary ? COLORS.primaryColor : COLORS.lightGrey,
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
          </View>
        </CollapseHeader>
        <CollapseBody>{children}</CollapseBody>
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
});

export default CustomAccordion;
