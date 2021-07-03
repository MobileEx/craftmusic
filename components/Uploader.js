import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS, METRICS, STYLES } from '../global';
import { CustomIcon, Button } from '.';
import { craft } from '../global/Images';

const Uploader = ({
  onClose,
  status,
  onCloseRequest,
  storeType,
  mainFile,
  uploadedItems,
  deleteItem,
  uploadedMusic,
  deleteMusic,
  onUploadArt,
  onUploadMusic,
  onFilePress,
  uploadingProgress,
  renderUploadingItem,
  uploadedGlobal,
}) => {
  const [selections, setSelections] = useState([]);

  return (
    <Modal
      animationType="fade"
      transparent
      modalDidClose={onClose}
      visible={status}
      onRequestClose={() => onCloseRequest(false)}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.wrapper}>
          <View style={styles.background}>
            <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
              <Text style={styles.iconStyle}>X</Text>
            </TouchableOpacity>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Choose Files</Text>
            </View>

            <View style={styles.itemWrapper}>
              <TouchableOpacity style={styles.uploadWrapper1}>
                <CustomIcon name="add" size={METRICS.fontSizeBig} style={styles.icon} />
                <Text style={styles.label}>Studio</Text>
              </TouchableOpacity>

              {storeType === 'Art' ? (
                <>
                  <TouchableOpacity style={styles.uploadWrapper1} onPress={() => onUploadArt()}>
                    <CustomIcon name="brush" size={METRICS.fontSizeBig} style={styles.icon} />
                    <Text style={styles.label}>Add In-App Artwork</Text>
                  </TouchableOpacity>

                  <ScrollView style={styles.scroll}>
                    {[...uploadedGlobal.filter(item=>item.uploadingArt), ...uploadedItems].map((item, index) => {
                      const isSelected = selections.findIndex((select) => select.id === item.id);
                      return (
                        <View key={index} style={STYLES.horizontalAlign}>
                          <TouchableOpacity
                            style={styles.uploadWrapper}
                            onPress={() => {
                              if (mainFile) onFilePress([item]);
                              else if (isSelected < 0) setSelections([...selections, item]);
                              else {
                                selections.splice(isSelected, 1);
                                setSelections([...selections]);
                              }
                            }}
                          >
                            <FastImage source={item.filetype==='image' ? {uri: item.url} : craft} style={mainFile || isSelected < 0 ? styles.thumbimage : styles.thumbactive} />
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={
                                mainFile || isSelected < 0 ? styles.label2 : styles.labelactive
                              }
                            >
                              {item.filename}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.cancelWrapper}
                            onPress={() => deleteItem(index, item.id)}
                          >
                            <CustomIcon
                              name="cancel-button"
                              size={METRICS.fontSizeBiggest}
                              style={styles.cancel}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                    {uploadingProgress.map(
                      (item, index) =>
                        item.uploadingArt &&
                        item.progress !== 100 &&
                        renderUploadingItem(item, index)
                    )}

                    {/* <View style={STYLES.horizontalAlign}> */}
                    {/*  <TouchableOpacity style={styles.uploadWrapper}> */}
                    {/*    <FastImage source={craft} style={styles.thumbimage} /> */}
                    {/*    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.label2}> */}
                    {/*      filename1asdfghjkhgfdsfgvhjhgfdghjkhgfdsfghjkhgfdghjkhbgvfdghj.png */}
                    {/*    </Text> */}
                    {/*  </TouchableOpacity> */}
                    {/*  <TouchableOpacity style={styles.cancelWrapper}> */}
                    {/*    <CustomIcon */}
                    {/*      name="cancel-button" */}
                    {/*      size={METRICS.fontSizeBiggest} */}
                    {/*      style={styles.cancel} */}
                    {/*    /> */}
                    {/*  </TouchableOpacity> */}
                    {/* </View> */}

                    {/* <View style={STYLES.horizontalAlign}> */}
                    {/*  <TouchableOpacity style={styles.uploadWrapper}> */}
                    {/*    <FastImage source={craft} style={styles.thumbactive} /> */}
                    {/*    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.labelactive}> */}
                    {/*      CoverArtVideoFile.mp4 */}
                    {/*    </Text> */}
                    {/*  </TouchableOpacity> */}
                    {/*  <TouchableOpacity style={styles.cancelWrapper}> */}
                    {/*    <CustomIcon */}
                    {/*      name="cancel-button" */}
                    {/*      size={METRICS.fontSizeBiggest} */}
                    {/*      style={styles.cancel} */}
                    {/*    /> */}
                    {/*  </TouchableOpacity> */}
                    {/* </View> */}

                    {/* <View style={STYLES.horizontalAlign}> */}
                    {/*  <TouchableOpacity style={styles.uploadWrapper}> */}
                    {/*    <FastImage source={craft} style={styles.thumbimage} /> */}
                    {/*    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.label2}> */}
                    {/*      filename3.mp4 */}
                    {/*    </Text> */}
                    {/*  </TouchableOpacity> */}
                    {/*  <TouchableOpacity style={styles.cancelWrapper}> */}
                    {/*    <CustomIcon */}
                    {/*      name="cancel-button" */}
                    {/*      size={METRICS.fontSizeBiggest} */}
                    {/*      style={styles.cancel} */}
                    {/*    /> */}
                    {/*  </TouchableOpacity> */}
                    {/* </View> */}

                    {/* <View style={STYLES.horizontalAlign}> */}
                    {/*  <TouchableOpacity style={styles.uploadWrapper}> */}
                    {/*    <FastImage source={craft} style={styles.thumbimage} /> */}
                    {/*    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.label2}> */}
                    {/*      filename4.png */}
                    {/*    </Text> */}
                    {/*  </TouchableOpacity> */}
                    {/*  <TouchableOpacity style={styles.cancelWrapper}> */}
                    {/*    <CustomIcon */}
                    {/*      name="cancel-button" */}
                    {/*      size={METRICS.fontSizeBiggest} */}
                    {/*      style={styles.cancel} */}
                    {/*    /> */}
                    {/*  </TouchableOpacity> */}
                    {/* </View> */}

                    {/* <View style={STYLES.horizontalAlign}> */}
                    {/*  <TouchableOpacity style={styles.uploadWrapper}> */}
                    {/*    <FastImage source={craft} style={styles.thumbimage} /> */}
                    {/*    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.label2}> */}
                    {/*      filename5.png */}
                    {/*    </Text> */}
                    {/*  </TouchableOpacity> */}
                    {/*  <TouchableOpacity style={styles.cancelWrapper}> */}
                    {/*    <CustomIcon */}
                    {/*      name="cancel-button" */}
                    {/*      size={METRICS.fontSizeBiggest} */}
                    {/*      style={styles.cancel} */}
                    {/*    /> */}
                    {/*  </TouchableOpacity> */}
                    {/* </View> */}
                  </ScrollView>
                </>
              ) : null}

              <TouchableOpacity
                style={styles.uploadWrapper1}
                onPress={() => onUploadMusic()}
              >
                <CustomIcon
                  name="cloud-download"
                  size={METRICS.fontSizeBigger}
                  style={styles.icon}
                />
                <Text style={styles.label}>Add {storeType==='Music' ? 'Audio or ' : ''}Other Files</Text>
              </TouchableOpacity>

              {Array.isArray(uploadedMusic) &&
              <ScrollView style={styles.scroll}>
                {[...uploadedGlobal.filter(item=>!item.uploadingArt), ...uploadedMusic].map((item, index)=>{
                  let isSelected = selections.findIndex((select)=>select.id===item.id);
                  return (
                    <View key={index} style={STYLES.horizontalAlign}>
                      <TouchableOpacity style={styles.uploadWrapper} onPress={() => {
                        if (mainFile)
                          onFilePress([item]);
                        else {
                          if (isSelected < 0)
                            setSelections([...selections, item]);
                          else {
                            selections.splice(isSelected, 1);
                            setSelections([...selections])
                          }
                        }
                      }}>
                        <FastImage source={item.filetype==='image' ? {uri: item.url} : craft} style={mainFile || isSelected < 0 ? styles.thumbimage : styles.thumbactive} />
                        <Text numberOfLines={1} ellipsizeMode="tail"  style={mainFile || isSelected<0? styles.label2 : styles.labelactive}>
                          {item.filename}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelWrapper} onPress={()=>deleteMusic(index, item.id)}>
                        <CustomIcon
                          name="cancel-button"
                          size={METRICS.fontSizeBiggest}
                          style={styles.cancel}
                        />
                      </TouchableOpacity>
                    </View>
                  )
                })}

                {uploadingProgress.map((item, index)=>!item.uploadingArt && item.progress!==100 && renderUploadingItem(item, index))}

              </ScrollView>
              }
            </View>

            <TouchableOpacity
              style={{
                marginHorizontal: METRICS.spacingHuge,
                paddingTop: METRICS.spacingSmall,
                justifyContent: 'center',
              }}
              onPress={() => {
                if (!mainFile) {
                  onFilePress(selections);
                  setSelections([]);
                }
              }}
            >
              <Button
                style={styles.addbutton}
                title="Add"
                fontSize={METRICS.fontSizeNormal}
                status={1}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  background: {
    borderColor: COLORS.whiteColor,
    borderWidth: 1 * METRICS.ratioX,
    backgroundColor: COLORS.blackColor,
    position: 'relative',
    paddingTop: METRICS.spacingNormal,
    paddingBottom: METRICS.spacingBig,
    paddingLeft: METRICS.spacingBig,
    paddingRight: METRICS.spacingBig,
  },
  uploadWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: METRICS.followspacing,
    paddingRight: 4 * METRICS.spacingGiant,
  },
  uploadWrapper1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: METRICS.followspacing,
  },
  scroll: {
    maxHeight: 200 * METRICS.ratioY,
  },
  label: {
    color: COLORS.primaryColor,
    fontSize: METRICS.fontSizeMedium,
    textAlign: 'center',
    fontFamily: 'lato',
  },
  label2: {
    color: COLORS.whiteColor,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    textAlign: 'center',
    paddingVertical: METRICS.followspacing,
    marginLeft: METRICS.marginNormal,
    maxWidth: 0.7 * METRICS.screenWidth,
    opacity: 0.5,
  },
  labelactive: {
    color: COLORS.whiteColor,
    fontFamily: 'lato',
    fontSize: METRICS.fontSizeNormal,
    textAlign: 'center',
    paddingVertical: METRICS.followspacing,
    marginLeft: METRICS.marginNormal,
    maxWidth: 0.7 * METRICS.screenWidth,
    opacity: 1,
  },
  icon: {
    color: COLORS.primaryColor,
    marginRight: METRICS.marginNormal,
  },
  itemWrapper: {
    flexDirection: 'column',
    paddingHorizontal: METRICS.spacingNormal,
  },
  closeButton: {
    marginLeft: METRICS.marginBig,
    marginTop: METRICS.marginBig,
    position: 'absolute',
    top: -15,
    left: -20,
    zIndex: 100,
  },
  iconStyle: {
    marginLeft: METRICS.marginSmall,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
    paddingLeft: METRICS.spacingTiny,
    paddingTop: METRICS.spacingTiny,
    paddingBottom: METRICS.spacingHuge,
    paddingRight: METRICS.spacingHuge,
  },
  titleWrapper: {
    marginBottom: METRICS.spacingNormal,
  },
  title: {
    color: COLORS.whiteColor,
    textAlign: 'center',
    fontSize: METRICS.fontSizeBig,
    fontFamily: 'Lato-Bold',
  },
  cancelWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    position: 'absolute',
    right: METRICS.spacingNormal,
  },
  cancel: {
    color: COLORS.whiteColor,
    paddingVertical: METRICS.followspacing,
    paddingLeft: METRICS.spacingGiant,
  },
  addbutton: {
    width: METRICS.followbuttonwidth,
    height: METRICS.sendbuttonheight,
  },
  thumbimage: {
    width: 45 * METRICS.ratioX,
    height: 45 * METRICS.ratioX,
    opacity: 0.5,
  },
  thumbactive: {
    width: 45 * METRICS.ratioX,
    height: 45 * METRICS.ratioX,
    opacity: 1,
  },
});

Uploader.propTypes = {
  onClose: PropTypes.func,
  status: PropTypes.bool,
  onCloseRequest: PropTypes.func,
};

Uploader.defaultProps = {
  onClose: () => {},
  status: false,
  onCloseRequest: () => {},
};

export default Uploader;
