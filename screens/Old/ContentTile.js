import React from "react";
import { ImageBackground, View, StyleSheet, Text } from "react-native";
import UsersLine from './UsersLine'

const styles = StyleSheet.create({
    ContentTile: {
        backgroundColor: "#151625",
        borderRadius: 13.8,
        flexDirection: 'column',
        overflow: "hidden"
    },
    contentTitle: {
        color: "#fff"
    },
    tileBody: {
        flexDirection: 'column',
        color: '#fff'
    },
    mediaWrapper: {
        width: '100%',
        minHeight: 300,
        paddingTop: 6
    },
    innerMediaWrap: {
        paddingHorizontal: 10,
        paddingTop: 6
    },
    tagsContainer: {
        marginTop: 5,
        flexDirection: 'row'
    },
    tagWrap: {
        fontSize: 12,
        marginRight: 8,
        lineHeight: 20
    },
    roundedWrap: {
        borderRadius: 13,
        backgroundColor: '#1F2130'
    },
    playStatWrap: {
        paddingLeft: 9,
        paddingRight: 4
    },
    reactionStatWrap: {
        paddingLeft: 6,
        paddingRight: 12
    },
    statsContainer: {
        flexDirection: 'row',
        paddingVertical: 14,
        justifyContent: 'space-between',
        borderBottomColor: '#2C343D',
        borderBottomWidth: 0.55
    },
    textAltColor: {
        color: '#969696',
        fontSize: 12,
        lineHeight: 20,
        marginVertical: 3,
        fontWeight: '500'
    },
    player: {
        height: 200,
        width: 200
    }
});

let users = [
    {
        key: 1,
        img: require("./../assets/images/face1.png"),
        rank: 'alpha'
    },
    {   
        key: 2,
        img: require("./../assets/images/face2.png"),
        rank: 'beta'
    },
    {
        key: 3,
        img: require("../assets/images/face3.png")
    }
]

let hashtags = ['TheCraftChallenge', 'All2019', 'RapChallenge']
let tagColors = ['#7ED321', '#8D4DE8', '#E92C81']
let colorIterator = 0
let i = 0
hashtags = hashtags.map(tag => {
    i++
    if(colorIterator >= (tagColors.length)){
        colorIterator = 0
    }
    let output = <Text key={i} style={[styles.tagWrap, { color: tagColors[colorIterator]}]}>{`#${tag}`}</Text>
    colorIterator++
    return output
})

const ContentTile = props => {
    let onBuffer = () => {
        // console.log('onbuffer callback')
    }
    let videoError = () => {
    //     console.log('ayyyy')
    }
    let player
    // console.log('show this onbuffer', onBuffer)
    return (
        <View {...props} style={styles.ContentTile}>
            <UsersLine users={users}></UsersLine>
            {/* <Video source={{uri: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}}
            ref={(ref) => {
                player = ref
              }} 
            onBuffer={onBuffer}
            onError={videoError} 
            style={styles.player}/> */}
            <View style={styles.tileBody}>
                <ImageBackground
                    source={require("../assets/images/dogpetal.png")}
                    style={styles.mediaWrapper}
                    imageStyle={{resizeMode: 'cover'}}
                >
                    <View style={styles.innerMediaWrap}>
                        <Text style={styles.contentTitle}>WSupernova (Remixes)</Text>
                        <Text style={styles.contentTitle}>Meklit</Text>
                        <Text>testLOST DUDE WOT</Text>
                    </View>
                </ImageBackground>
            </View>
            <View style={{paddingHorizontal: 10, paddingVertical: 11}}>
                <Text style={{lineHeight: 20, color: '#fff', fontSize: 14}}>⚡️WHEN A QUEEN GRINDS, WE NOTICE⚡️</Text>
                <View style={styles.tagsContainer}>{hashtags}</View>
                <View style={styles.statsContainer}>
                    <View style={[styles.roundedWrap, styles.playStatWrap]}>
                        <Text style={styles.textAltColor}>354 Plays</Text>
                    </View>
                    <View style={[styles.roundedWrap, styles.reactionStatWrap]}>
                        <Text style={styles.textAltColor}>237</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ContentTile;
