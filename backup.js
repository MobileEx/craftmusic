<View style={[STYLES.horizontalAlign, styles.userItem]}>
<View style={styles.avatarWrap}>
  {avatar && (
    <TouchableOpacity onPress={() => this.goToProfile(userid)}>
      <Image
        source={avatarImage ? { uri: avatarImage } : user}
        style={styles.avatar}
      />
    </TouchableOpacity>
  )}
</View>
<View style={styles.content}>
  <Text style={styles.text}>{arr[0]}<Text style={styles.name}>{username}</Text>{arr[1]}</Text>
  <Text style={styles.time}>{time}</Text>
</View>
{renderRight && (
  <View style={styles.rightWrapper}>{renderRight}</View>
)}
</View>