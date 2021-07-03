import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, FlatList, Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import MasonryList from 'react-native-masonry-list';
import CustomIcon from './CustomIcon';
import { COLORS, METRICS } from '../global';
import { GIF_TYPES } from '../utils/chat';

const Giphy = ({ attachGif, close }) => {
  const [gifs, setGifs] = useState([]);
  const [term, updateTerm] = useState('');
  // there are two types of search  : gifs or stickers
  const [type, setType] = useState('gifs');
  const inputRef = useRef(null);

  useEffect(() => {
    fetchGifs(term);
    inputRef.current.focus();
  }, [type]);

  async function fetchGifs() {
    if (term.trim().length === 0) {
      try {
        const API_KEY = 'EMVSt57F2A0KqK1xqbcFuCHbHlhOTufG';
        const BASE_URL = 'http://api.giphy.com/v1/';
        const uri = `${BASE_URL}${type}/trending?api_key=${API_KEY}`;
        const resJson = await fetch(uri);
        const res = await resJson.json();

        setGifs(
          res.data.map((item) => {
            const { height } = item.images.preview_gif;
            const { width } = item.images.preview_gif;
            const originalUrl = item.images.original.url;
            const gifHeight = height && Number(height);
            const gifWidth = width && Number(width);
            const { url } = item.images.preview_gif;
            const { id, title, is_sticker } = item;
            return {
              id,
              title,
              is_sticker,
              uri: url,
              width: gifWidth,
              height: gifHeight,
              originalUrl,
            };
          })
        );
      } catch (error) {
        console.warn(error);
      }
    } else {
      try {
        const API_KEY = 'EMVSt57F2A0KqK1xqbcFuCHbHlhOTufG';
        const BASE_URL = 'http://api.giphy.com/v1/';
        const uri = `${BASE_URL}${type}/search?api_key=${API_KEY}&q=${term}`;
        const resJson = await fetch(uri);
        const res = await resJson.json();

        setGifs(
          res.data.map((item) => {
            const { height } = item.images.preview_gif;
            const { width } = item.images.preview_gif;
            const originalUrl = item.images.original.url;
            const gifHeight = height && Number(height);
            const gifWidth = width && Number(width);
            const { url } = item.images.preview_gif;
            const { id, title, is_sticker } = item;
            return {
              id,
              title,
              is_sticker,
              uri: url,
              width: gifWidth,
              height: gifHeight,
              originalUrl,
            };
          })
        );
      } catch (error) {
        console.warn(error);
      }
    }
  } // / add facebook fresco

  function onEdit(newTerm) {
    updateTerm(newTerm);
    fetchGifs();
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CustomIcon name="search" size={METRICS.fontSizeMedium} style={styles.searchIcon} />
        <TextInput
          selectionColor={COLORS.primaryColor}
          keyboardAppearance="dark"
          autoCapitalize="none"
          returnKeyType="search"
          autoCorrect={false}
          placeholder="Search Giphy"
          placeholderTextColor={COLORS.inActive}
          value={term}
          style={styles.textInput}
          onChangeText={(text) => onEdit(text)}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.removeButton} onPress={() => onEdit('')}>
          <CustomIcon name="close" size={METRICS.fontSizeSmall} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
      {type === GIF_TYPES.STICKERS && (
        <FlatList
          data={gifs}
          extraData={gifs}
          keyboardShouldPersistTaps="handled"
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ width: METRICS.screenWidth * 0.98 }}
          renderItem={({ item }) => {
            const { uri } = item;
            return (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  attachGif(item);
                  return close();
                }}
                style={{
                  marginVertical: 5,
                  flex: 1,
                  flexDirection: 'row',
                }}
              >
                <FastImage resizeMode="contain" style={styles.stickerimage} source={{ uri }} />
              </TouchableOpacity>
            );
          }}
        />
      )}

      {type === GIF_TYPES.GIFS && (
        <MasonryList
          images={gifs}
          rerender
          columns={2}
          listContainerStyle={{
            backgroundColor: COLORS.editingGrey,
            marginHorizontal: METRICS.marginSmall,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          imageContainerStyle={{
            backgroundColor: COLORS.editingGrey,
            borderRadius: METRICS.craftborder,
            justifyContent: 'center',
            alignSelf: 'center',
          }}
          containerWidth={METRICS.screenWidth * 0.98}
          backgroundColor={COLORS.editingGrey}
          customImageComponent={FastImage}
          customImageProps={styles.gifimage}
          masonryFlatListColProps={{
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
            keyboardShouldPersistTaps: 'handled',
          }}
          onPressImage={(gif) => {
            Keyboard.dismiss();
            attachGif(gif);
            return close();
          }}
        />
      )}

      <View style={styles.iconsContainer}>
        <CustomIcon
          name="gif-1"
          size={METRICS.attachmentIconSize}
          style={{ paddingHorizontal: 30 * METRICS.ratioX }}
          color={type === GIF_TYPES.GIFS ? COLORS.primaryColor : 'white'}
          onPress={async () => {
            try {
              setType('gifs');
            } catch (err) {
              throw new Error(err);
            }
          }}
        />
        <CustomIcon
          name="smile-1"
          size={0.9 * METRICS.attachmentIconSize}
          style={{ paddingHorizontal: 30 * METRICS.ratioX }}
          onPress={async () => {
            try {
              await setType('stickers');
            } catch (err) {
              throw new Error(err);
            }
          }}
          color={type === GIF_TYPES.STICKERS ? COLORS.primaryColor : 'white'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    backgroundColor: COLORS.editingGrey,
  },
  gifimage: {
    borderRadius: METRICS.craftborder,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 1 * METRICS.ratioX,
  },
  stickerimage: {
    width: 90 * METRICS.ratioX,
    height: 90 * METRICS.ratioX,
    justifyContent: 'center',
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    borderColor: COLORS.btnGrey,
    borderWidth: 1 * METRICS.ratioX,
    borderRadius: 5 * METRICS.ratioX,
    height: 40 * METRICS.ratioX,
    alignItems: 'center',
    marginHorizontal: METRICS.spacingNormal,
    marginTop: METRICS.spacingSmall,
    marginBottom: METRICS.spacingSmall,
    backgroundColor: COLORS.editingGrey,
  },
  textInput: {
    flex: 1,
    color: COLORS.whiteColor,
    fontSize: METRICS.fontSizeNormal,
    fontFamily: 'Lato-Regular',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    color: COLORS.btnGrey,
    paddingHorizontal: METRICS.spacingNormal,
  },
  closeIcon: {
    color: COLORS.btnGrey,
    paddingLeft: METRICS.spacingHuge,
    paddingRight: METRICS.spacingSmall,
  },
  gridView: {
    marginTop: METRICS.spacingSmall,
    flex: 1,
  },
  iconsContainer: {
    height: 1.3 * METRICS.rowHeightMedium,
    paddingVertical: METRICS.spacingSmall,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.blackColor,
  },
});

export default Giphy;
