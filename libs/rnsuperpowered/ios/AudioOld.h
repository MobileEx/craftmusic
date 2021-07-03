#ifndef Audio_h
#define Audio_h

#import <Foundation/Foundation.h>

@interface Audio : NSObject
{
    NSString *loadedFile;

    unsigned int sampleRate;
    int pitchShift;
    float echoMix;
}

+ (instancetype)createInstance:(unsigned int)sampleRate;
+ (instancetype)getInstance;

- (instancetype)init;
- (instancetype)initPrivate:(unsigned int)sampleRate;

- (NSDictionary *)addAudioPlayer:(NSString *)trackId filePath:(NSString *)filePath;
- (void)loadFile:(NSString *)filePath;

- (void)detectBpm:(NSString *)filePath;
- (void)getWaveform:(NSString *)fileRoute;

- (void)play:(NSInteger)position;
- (void)playProject:(NSDictionary *)positions;
- (void)pauseProject;
- (void)pause;

- (int)getPosition;

- (void)setBpm:(float)bpm;
- (void)setEcho:(float)mix;
- (void)setPitchShift:(int)pitchShift;
- (void)setTempo:(double)tempo masterTempo:(bool)masterTempo;
- (NSString *)process:(NSString *)fileName;

@end

#endif /* Audio_h */
