import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import PlayerControls from './PlayerControls';
import { CONSTANTS, METRICS, COLORS, STYLES } from '../../global';
import EffectOption from './EffectOption';
import AudioEffectsConstants from '../../helpers/AudioEffectsConstants';
import { CustomIcon } from '..';

class TrackSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toolbarViewMode: CONSTANTS.studioTrackEditSetting,
      aspectRatio: false,
      exportButtons: false,
    };
  }

  onToggleAspectRatioPanel = () => {
    const { aspectRatio } = this.state;
    this.setState({ aspectRatio: !aspectRatio });
  };

  onToggleExportButtons = () => {
    const { exportButtons } = this.state;
    this.setState({ exportButtons: !exportButtons });
  };

  onHandleSettings = (action, data, complete) => {
    const { track, trackType, studioControlsCallback } = this.props;
    if (
      action === CONSTANTS.studioTrackEffectSetting ||
      action === CONSTANTS.studioTrackEditSetting
    ) {
      this.setState({ toolbarViewMode: action });
    }

    const studioPayload = {
      id: track.id,
      trackType,
      action,
      data,
      complete,
    };
    if (studioControlsCallback) {
      studioControlsCallback(studioPayload);
    }
  };

  renderEffect = () => {
    // show effect panel
    const { activeEffects, track } = this.props;
    const effects = AudioEffectsConstants;
    if (activeEffects) {
      activeEffects.forEach((effect) => {
        effects[effect.effectKey].value = effect.value;
      });
    }
    return (
      <ScrollView style={styles.effectsContainer}>
        {Object.entries(effects).map(([textButton, effect]) => {
          const max = effect.maximumValue;
          const min = effect.minimumValue;
          return (
            <EffectOption
              key={effect.id}
              effectKey={textButton}
              title={effect.title}
              maximumValue={max}
              minimumValue={min}
              step={effect.step}
              callback={this.onHandleSettings}
              initialValue={track[textButton]}
            />
          );
        })}
      </ScrollView>
    );
  };

  renderEditPanel = () => {
    // show edit panel
    const { childTracks, track, trackType, recording } = this.props;

    let isEnable = true;
    if (childTracks.length > 0) {
      isEnable = false;
    }

    let isCopy = false;
    if (this.props.isCopy || this.props.isAudioCopy) {
      isCopy = true;
    }

    let isRecordedTrack = false;
    if (track.durationSeconds === 0) {
      isRecordedTrack = true;
    }

    const isUnableSplit = isRecordedTrack || !isEnable;

    let extraComponents = null;
    if (trackType === CONSTANTS.studioTrackVideo) {
      extraComponents = (
        <TouchableOpacity style={styles.buttonItem} onPress={() => this.onToggleAspectRatioPanel()}>
          <CustomIcon name="frame" style={styles.iconButton} />
          <Text style={styles.textButton}>Aspect</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={STYLES.horizontalAlign}>
        {trackType === CONSTANTS.studioTrackAudio && (
          <TouchableOpacity
            style={styles.buttonItem}
            disabled={isUnableSplit}
            onPress={() => this.onHandleSettings('split')}
          >
            <CustomIcon
              name="split"
              style={[
                styles.iconButton,
                { color: isUnableSplit ? COLORS.btnGrey : COLORS.whiteColor },
              ]}
            />
            <Text style={styles.textButton}>Split</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.buttonItem}
          disabled={isRecordedTrack}
          onPress={() => this.onHandleSettings('copy')}
        >
          <CustomIcon
            name="copy-item"
            style={[
              styles.iconButton,
              { color: isRecordedTrack ? COLORS.btnGrey : COLORS.whiteColor },
            ]}
          />
          <Text style={styles.textButton}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonItem}
          disabled={!isCopy}
          onPress={() => this.onHandleSettings('paste')}
        >
          <CustomIcon
            name="paste"
            style={[styles.iconButton, { color: isCopy ? COLORS.whiteColor : COLORS.btnGrey }]}
          />
          <Text style={styles.textButton}>Paste</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonItem} onPress={() => this.onHandleSettings('delete')}>
          <CustomIcon name="delete1" style={styles.iconButton} />
          <Text style={styles.textButton}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonItem}>
          <CustomIcon name="undo1" style={styles.iconButton} />
          <Text style={styles.textButton}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonItem}>
          <CustomIcon name="redo" style={styles.iconButton} />
          <Text style={styles.textButton}>Redo</Text>
        </TouchableOpacity>

        {extraComponents}

        <TouchableOpacity style={styles.buttonItem} onPress={() => this.onToggleExportButtons()}>
          <CustomIcon name="export" style={styles.iconButton} />
          <Text style={styles.textButton}>Export</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderAspectPanel = () => {
    // show aspect ratio options panel
    return (
      <View style={STYLES.horizontalAlign}>
        <TouchableOpacity
          style={styles.buttonItem}
          onPress={() => this.onHandleSettings('aspectRatio', 'portrait')}
        >
          <CustomIcon name="portrait" style={styles.iconButton} />
          <Text style={styles.textButton}>Portrait</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonItem}
          onPress={() => this.onHandleSettings('aspectRatio', 'landscape')}
        >
          <CustomIcon name="landscape" style={styles.iconButton} />
          <Text style={styles.textButton}>Landscape</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonItem}
          onPress={() => this.onHandleSettings('aspectRatio', 'square')}
        >
          <CustomIcon name="square" style={styles.iconButton} />
          <Text style={styles.textButton}>Square</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonItem} onPress={() => this.onToggleAspectRatioPanel()}>
          <CustomIcon name="close" style={styles.iconButton} />
          <Text style={styles.textButton}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderExportButtons = () => {
    // show aspect ratio options panel
    return (
      <View style={STYLES.horizontalAlign}>
        <TouchableOpacity style={styles.buttonItem}>
          <CustomIcon name="camera-1" style={styles.iconButton} />
          <Text style={styles.textButton}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonItem}>
          <CustomIcon name="music" style={styles.iconButton} />
          <Text style={styles.textButton}>Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonItem}>
          <CustomIcon name="export" style={styles.iconButton} />
          <Text style={styles.textButton}>Track</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonItem}>
          <CustomIcon name="export" style={styles.iconButton} />
          <Text style={styles.textButton}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonItem} onPress={() => this.onToggleExportButtons()}>
          <CustomIcon name="close" style={styles.iconButton} />
          <Text style={styles.textButton}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderToolbar = () => {
    // shows settings
    const { aspectRatio, toolbarViewMode, exportButtons } = this.state;

    if (toolbarViewMode === 'effects') {
      return this.renderEffect();
    }
    // editing
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {aspectRatio ? this.renderAspectPanel() : null}
        {exportButtons ? this.renderExportButtons() : null}
        {!aspectRatio && !exportButtons ? this.renderEditPanel() : null}
      </ScrollView>
    );
  };

  render() {
    const { playerControlsData, scrollx, trackId, trackType, width } = this.props;
    const { toolbarViewMode } = this.state;
    return (
      <Animated.View
        style={{
          width,
          transform: [{ translateX: scrollx }],
        }}
      >
        <View
          style={{
            paddingTop: 6 * METRICS.ratioY,
            paddingBottom: 11 * METRICS.ratioY,
          }}
        >
          <PlayerControls
            trackControls
            playerControlsCallback={this.onHandleSettings}
            activeView={toolbarViewMode}
            trackId={trackId}
            trackType={trackType}
            {...playerControlsData}
          />
        </View>
        <View style={styles.settingsHeaderContainer}>
          <CustomIcon
            size={METRICS.fontSizeBig}
            name={toolbarViewMode === CONSTANTS.studioTrackEditSetting ? 'edit2' : 'magic-wand'}
            color="#fff"
            style={{ marginRight: 12 * METRICS.ratioX }}
          />
          <Text style={styles.textToolbarTitle}>
            {toolbarViewMode === CONSTANTS.studioTrackEditSetting ? 'Editing' : 'Effects'}
          </Text>
        </View>
        {this.renderToolbar()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  buttonItem: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24 * METRICS.ratioX,
  },
  textButton: {
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeLight,
    color: COLORS.inActive,
    textAlign: 'center',
    marginTop: METRICS.spacingSmall,
  },
  effectsContainer: {
    height: 230 * METRICS.ratioY,
    paddingHorizontal: 48 * METRICS.ratioX,
    paddingVertical: 11 * METRICS.ratioY,
    borderWidth: 1 * METRICS.ratioX,
    borderColor: 'rgba(32,32,32, 0.6)',
  },
  settingsHeaderContainer: {
    height: 36 * METRICS.ratioY,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.editingGrey,
  },
  textToolbarTitle: {
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeMedium,
    fontFamily: 'lato-bold',
  },
  iconButton: {
    color: COLORS.whiteColor,
    marginHorizontal: 24 * METRICS.ratioX,
    marginTop: 24 * METRICS.ratioX,
    fontSize: METRICS.fontSizeBiggest,
  },
});

TrackSettings.propTypes = {
  activeEffects: PropTypes.array,
  childTracks: PropTypes.array,
  playerControlsData: PropTypes.object,
  scrollx: PropTypes.object,
  trackId: PropTypes.string,
  trackType: PropTypes.string,
  width: PropTypes.number,
  track: PropTypes.object.isRequired,
  studioControlsCallback: PropTypes.func,
};

TrackSettings.defaultProps = {
  activeEffects: [],
  childTracks: [],
  playerControlsData: {},
  scrollx: 0,
  trackId: '',
  trackType: CONSTANTS.studioTrackAudio,
  width: 0,
  studioControlsCallback: () => {},
};

const mapStateToProps = (state) => {
  const { dimensions, studioControlsCallback, playing, recording, isCopy, isAudioCopy } = state;
  return {
    width: dimensions.width,
    studioControlsCallback,
    playing,
    recording,
    isCopy,
    isAudioCopy,
  };
};

export default connect(mapStateToProps)(TrackSettings);
