#import "Audio.h"
#import "SuperpoweredAdvancedAudioPlayer.h"
#import "SuperpoweredIOSAudioIO.h"
#import "SuperpoweredEcho.h"
#import "SuperpoweredSimple.h"
#import "SuperpoweredDecoder.h"
#import "SuperpoweredRecorder.h"
#import "SuperpoweredAnalyzer.h"
#include <vector>
#include <string>
#include <mach/mach_time.h>

class ClientPayload {
public:
    __unsafe_unretained Audio *clientData;
    size_t position = 22;
    
    ClientPayload(void *clientD, size_t pos) {
        __unsafe_unretained Audio *self = (__bridge Audio *)clientD;
        clientData = self;
        position = pos;
    }
};

class AudioPlayerInstance {
public:
    SuperpoweredAdvancedAudioPlayer *player;
    size_t position;
    NSString *filePath;
    NSString *trackId;
    std::string str1 = "test";
    float *stereoBuffer;
    __unsafe_unretained Audio *audioContainer;
    float bpm, beatgridStartMs = 0;
    bool ready = false;
    
    AudioPlayerInstance(NSString *trackIdStr, size_t pos, NSString *fileRoute, void *clientData)
    {
        trackId = trackIdStr;
        position = pos;
        filePath = fileRoute;
        ClientPayload * payloadPtr = (ClientPayload *)clientData;
        audioContainer = payloadPtr->clientData;
    }
    
    NSDictionary* setup(void *clientData, void (*pecbPointer)(void *clientData, SuperpoweredAdvancedAudioPlayerEvent event, void *value), unsigned int sampleRate) {
        player = new SuperpoweredAdvancedAudioPlayer(clientData, *pecbPointer, sampleRate, 0);
        
        NSLog(@"Take a look at bpm %f, and beatgridStartMs %f and str1 %s.", bpm, beatgridStartMs, str1.c_str());
        NSDictionary* analysis = analyze(filePath);
        loadFile(filePath);
        return analysis;
    }
    
    NSDictionary * analyze(NSString *fileRoute) {
        float progress = 0.0f;
        // Open the input file.
        SuperpoweredDecoder *decoder = new SuperpoweredDecoder();
        const char *openError = decoder->open([fileRoute UTF8String], false, 0, 0);
        
        if (openError) {
            NSLog(@"triggered open error: %s", openError);
            delete decoder;
            return [NSDictionary dictionary];
        };
        
        double durationSeconds = decoder->durationSeconds;
        
        // Create the analyzer.
        SuperpoweredOfflineAnalyzer *analyzer = new SuperpoweredOfflineAnalyzer(decoder->samplerate, 0, decoder->durationSeconds);
        // Create a buffer for the 16-bit integer samples coming from the decoder.
        short int *intBuffer = (short int *)malloc(decoder->samplesPerFrame * 2 * sizeof(short int) + 32768);
        // Create a buffer for the 32-bit floating point samples required by the effect.
        float *floatBuffer = (float *)malloc(decoder->samplesPerFrame * 2 * sizeof(float) + 32768);
        
        // Processing.
        while (true) {
            // Decode one frame. samplesDecoded will be overwritten with the actual decoded number of samples.
            unsigned int samplesDecoded = decoder->samplesPerFrame;
            if (decoder->decode(intBuffer, &samplesDecoded) == SUPERPOWEREDDECODER_ERROR) break;
            if (samplesDecoded < 1) break;
            
            // Convert the decoded PCM samples from 16-bit integer to 32-bit floating point.
            SuperpoweredShortIntToFloat(intBuffer, floatBuffer, samplesDecoded);
            
            // Submit samples to the analyzer.
            analyzer->process(floatBuffer, samplesDecoded);
            
            // Update the progress indicator.
            progress = (double)decoder->samplePosition / (double)decoder->durationSamples;
        };
        
        // Get the result.
        unsigned char *averageWaveform = NULL, *lowWaveform = NULL, *midWaveform = NULL, *highWaveform = NULL, *peakWaveform = NULL, *notes = NULL;
        int waveformSize, overviewSize, keyIndex;
        char *overviewWaveform = NULL;
        float loudpartsAverageDecibel, peakDecibel, averageDecibel;
        analyzer->getresults(&averageWaveform, &peakWaveform, &lowWaveform, &midWaveform, &highWaveform, &notes, &waveformSize, &overviewWaveform, &overviewSize, &averageDecibel, &loudpartsAverageDecibel, &peakDecibel, &bpm, &beatgridStartMs, &keyIndex);
        // Do something with the result.
        NSLog(@"Bpm is %f, average loudness is %f db, peak volume is %f db.", bpm, loudpartsAverageDecibel, peakDecibel);
        // Cleanup.
        delete decoder;
        delete analyzer;
        free(intBuffer);
        free(floatBuffer);
        
        NSMutableArray *waveformPoints = [[NSMutableArray alloc]init];
        
        for (int i=0;i<waveformSize;i++) {
            // waveformPoint must be added as Number/float
            [waveformPoints addObject:[NSNumber numberWithFloat:averageWaveform[i]]];
        }
        // return BPM and waveform data
        NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys: [NSNumber numberWithFloat:bpm], @"bpm", waveformPoints, @"waveform", [NSNumber numberWithFloat:durationSeconds], @"durationSeconds", nil];
        
        // Done with the result, free memory.
        if (averageWaveform) free(averageWaveform);
        if (lowWaveform) free(lowWaveform);
        if (midWaveform) free(midWaveform);
        if (highWaveform) free(highWaveform);
        if (peakWaveform) free(peakWaveform);
        if (notes) free(notes);
        if (overviewWaveform) free(overviewWaveform);
        return dictionary;
    }
    
    void loadFile(NSString *filePath) {
        NSFileManager *fileManager = [NSFileManager defaultManager];
        
        if(![fileManager fileExistsAtPath:filePath]) {
            @throw [NSException exceptionWithName:@"Audio file not exists" reason: @"" userInfo: nil];
        }
        
        //        if(player) {
        //            delete player;
        //        }
        
        //        playerA = new SuperpoweredAdvancedAudioPlayer((__bridge void *)self, playerEventCallbackA, sampleRate, 0);
        player->open([filePath UTF8String]);
        
        //        loadedFile = filePath;
    }
    
};

@implementation Audio {
    SuperpoweredAdvancedAudioPlayer *playerA;
    SuperpoweredIOSAudioIO *output;
    SuperpoweredEcho *echo;
    std::vector<AudioPlayerInstance> audioPlayers;
    float *stereoBuffer;
    unsigned int lastSamplerate;
    uint64_t playbackStartTime;
    NSDictionary *positions;
}

static Audio *instance = nil;

+ (instancetype) createInstance:(unsigned int)sampleRate {
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        if(!instance) {
            instance = [[Audio alloc] initPrivate: sampleRate];
        }
    });
    
    return instance;
}

+ (instancetype) getInstance {
    return instance;
}

void playerEventCallback(void *clientData, SuperpoweredAdvancedAudioPlayerEvent event, void *value) {
    ClientPayload * payloadPtr = (ClientPayload *)clientData;
    ClientPayload payload = *payloadPtr;
    NSLog(@"bro show the val of position: %lu", payload.position);
    AudioPlayerInstance audioPlayerInstance = payload.clientData->audioPlayers[payload.position];
    //    Audio *self = (__bridge Audio *)audioPlayerInstance.audioContainer;
    //    AudioPlayerInstance aInstance = *audioPlayerInstancePtr;
    
    
    switch(event) {
        case SuperpoweredAdvancedAudioPlayerEvent_LoadSuccess:
            audioPlayerInstance.player->setBpm(audioPlayerInstance.bpm);
            audioPlayerInstance.player->setFirstBeatMs(audioPlayerInstance.beatgridStartMs);
            audioPlayerInstance.player->setPosition(audioPlayerInstance.player->firstBeatMs, false, false);
            payload.clientData->audioPlayers[payload.position].ready = true;
            //            audioPlayerInstance.player->setTempo(1.0f, false);
            //            audioPlayerInstance.player->setPitchShift(0);
            //            [payload.clientData play:payload.position];
            //            self.play(0);
            break;
        case SuperpoweredAdvancedAudioPlayerEvent_EOF:
            //            audioPlayerInstance->player->pause();
            break;
        default:
            break;
    }
}

void (*pecbPointer)(void *clientData, SuperpoweredAdvancedAudioPlayerEvent event, void *value) = playerEventCallback;

static bool audioProcessing(void *clientData, float **inputBuffers, unsigned int inputChannels, float **outputBuffers, unsigned int outputChannels, unsigned int numberOfSamples, unsigned int sampleRate, uint64_t hotTime) {
    __unsafe_unretained Audio *self = (__bridge Audio *)clientData;
    //    AudioPlayerInstance * audioPlayerInstancePtr = static_cast<AudioPlayerInstance*>(clientData);
    float lastSampleRate = self->lastSamplerate;
    if (sampleRate != lastSampleRate) { // Has samplerate changed?
        self->lastSamplerate = sampleRate;
        //        self->playerB->setSamplerate(sampleRate);
        //        self->roll->setSamplerate(sampleRate);
        //        self->filter->setSamplerate(sampleRate);
        //        self->flanger->setSamplerate(samplerate);
    };
    bool silence;
    
    float masterBpm;
    mach_timebase_info_data_t timebase;
    mach_timebase_info(&timebase);
    //    NSLog(@"Take a look at outputBuffer 1 %f", outputBuffers[0]);
    //    NSLog(@"Take a look at outputBuffer 2 %f", outputBuffers[1]);
    
    for(int i = 0; i < self->audioPlayers.size(); i++){
        NSDictionary *trackPos = self->positions[self->audioPlayers[i].trackId];
        NSNumber *start = trackPos[@"startPositionMs"];
        uint64_t currentMs = mach_absolute_time() - self->playbackStartTime;
        currentMs *= timebase.numer;
        currentMs /= timebase.denom;
        currentMs /= NSEC_PER_MSEC;
        NSNumber *currentMsNumber = [NSNumber numberWithUnsignedLongLong:currentMs];
        NSComparisonResult startCompare = [start compare:currentMsNumber];
        if (sampleRate != lastSampleRate) {
            self->audioPlayers[i].player->setSamplerate(sampleRate);
        }
        //        NSLog(@"current elapsed time %li", [currentMsNumber integerValue]);
        if(i == 0) {
            // init with disabled
            double nextPlayerElapsedSecondsSinceLastBeat = -1;
            masterBpm = self->audioPlayers[0].player->currentBpm;
            if(self->audioPlayers.size() > 1){
                nextPlayerElapsedSecondsSinceLastBeat = self->audioPlayers[1].player->msElapsedSinceLastBeat;
            }
            
            // check start time
            if(startCompare == NSOrderedAscending || startCompare == NSOrderedSame){
                silence = !self->audioPlayers[i].player->process(self->stereoBuffer, false, numberOfSamples, 1.0f, masterBpm, nextPlayerElapsedSecondsSinceLastBeat);
            }
            
            
        } else {
            if(self->audioPlayers[i].ready) {
                double msElapsedSinceLastBeatA = self->audioPlayers[0].player->msElapsedSinceLastBeat;
                // check start time
                if(startCompare == NSOrderedAscending|| startCompare == NSOrderedSame){
                    self->audioPlayers[i].player->process(self->stereoBuffer, !silence, numberOfSamples, 1.0f, masterBpm, msElapsedSinceLastBeatA);
                }
            }
        }
    }
    
    if(!silence) {
        //        self->echo->process(self->stereoBuffer, self->stereoBuffer, numberOfSamples);
        //        NSLog(@"Take a look at outputBuffer 1 %f", outputBuffers[0]);
        //        NSLog(@"Take a look at outputBuffer 2 %f", outputBuffers[1]);
        SuperpoweredDeInterleave(self->stereoBuffer, outputBuffers[0], outputBuffers[1], numberOfSamples);
        //        NSLog(@"Take a look at outputBuffer 1 %f", outputBuffers[0]);
        //        NSLog(@"Take a look at outputBuffer 2 %f", outputBuffers[1]);
        
    }
    
    return !silence;
}

- (instancetype) init {
    @throw [NSException exceptionWithName:@"Singleton Error" reason: @"" userInfo: nil];
}

- (instancetype) initPrivate:(unsigned int)sampleRate {
    if(posix_memalign((void **)&stereoBuffer, 16, 4096 + 128) != 0) abort();
    
    self = [super init];
    //
    self->sampleRate = sampleRate;
    
    //
    output = [[SuperpoweredIOSAudioIO alloc] initWithDelegate:(id<SuperpoweredIOSAudioIODelegate>)self preferredBufferSize:12 preferredSamplerate:sampleRate audioSessionCategory:AVAudioSessionCategoryPlayback channels:2 audioProcessingCallback:audioProcessing clientdata:(__bridge void *)self];
    
    self->echo = new SuperpoweredEcho(sampleRate);
    
    return self;
}

- (NSDictionary*) addAudioPlayer:(NSString *)trackId filePath:(NSString *)filePath {
    NSLog(@"receiving request addAudioPlayer: %@", filePath);
    //    SuperpoweredAdvancedAudioPlayer *newPlayer = new SuperpoweredAdvancedAudioPlayer((__bridge void *)self, *pecbPointer, sampleRate, 0);
    size_t position = audioPlayers.size();
    ClientPayload *payload = new ClientPayload((__bridge void *)self, position);
    
    audioPlayers.push_back(AudioPlayerInstance(trackId, position, filePath, payload));
    return audioPlayers[position].setup(payload, pecbPointer, sampleRate);
}


- (void) playProject:(NSDictionary *)positions {
    self->playbackStartTime = mach_absolute_time();
    self->positions = positions;
    [output start];
    for(int i = 0; i < self->audioPlayers.size(); i++){
        // access position values for this track
        NSLog(@"show the trackPos id: %@", audioPlayers[i].trackId);
        audioPlayers[i].player->togglePlayback();
    }
}

- (void) pauseProject {
    NSLog(@"take a look at stereoBuffer %f", self->stereoBuffer);
    [output stop];
    NSLog(@"take a look at stereoBuffer %f", self->stereoBuffer);
    for(int i = 0; i < self->audioPlayers.size(); i++){
        audioPlayers[i].player->togglePlayback();
    }
}


- (void) play:(NSInteger)position {
    [output start];
    NSLog(@" we triggered stating player playback %f", (float) position);
    audioPlayers[position].player->togglePlayback();
}

- (void) pause {
    [output stop];
    playerA->pause();
}

- (int) getPosition {
    return playerA->positionSeconds;
}

- (void) setEcho:(float)mix {
    if(mix) {
        if(!echoMix) {
            echo->enable(true);
        }
    } else {
        echo->enable(false);
    }
    
    echo->setMix(mix > 0 ? mix : 0);
    echoMix = mix;
}

- (void) setBpm:(float)bpm {
    playerA->setBpm(bpm);
}

- (void) setPitchShift:(int)pitchShift {
    playerA->setPitchShift(pitchShift);
}

- (void) setTempo:(double)tempo masterTempo:(bool)masterTempo {
    playerA->setTempo(tempo, masterTempo);
}

- (void) getWaveform:(NSString *)fileRoute {
    float progress = 0.0f;
    // Open the input file.
    SuperpoweredDecoder *decoder = new SuperpoweredDecoder();
    const char *openError = decoder->open([fileRoute UTF8String], false, 0, 0);
    if (openError) {
        NSLog(@"open error: %s", openError);
        delete decoder;
        return;
    };
    NSLog(@"show the length of song: %f and samplerate: %i", decoder->durationSeconds, decoder->samplerate);
    // Create the waveform analyzer.
    SuperpoweredWaveform *waveform = new SuperpoweredWaveform(decoder->samplerate, decoder->durationSeconds);
    // Create a buffer for the 16-bit integer samples coming from the decoder.
    short int *intBuffer = (short int *)malloc(decoder->samplesPerFrame * 2 * sizeof(short int) + 32768);
    // Create a buffer for the 32-bit floating point samples required by the effect.
    float *floatBuffer = (float *)malloc(decoder->samplesPerFrame * 2 * sizeof(float) + 32768);
    
    // Processing.
    while (true) {
        // Decode one frame. samplesDecoded will be overwritten with the actual decoded number of samples.
        unsigned int samplesDecoded = decoder->samplesPerFrame;
        if (decoder->decode(intBuffer, &samplesDecoded) == SUPERPOWEREDDECODER_ERROR) break;
        if (samplesDecoded < 1) break;
        
        // Convert the decoded PCM samples from 16-bit integer to 32-bit floating point.
        SuperpoweredShortIntToFloat(intBuffer, floatBuffer, samplesDecoded);
        
        // Submit samples to the analyzer.
        //        analyzer->process(floatBuffer, samplesDecoded);
        
        // Update the progress indicator.
        //        progress = (double)decoder->samplePosition / (double)decoder->durationSamples;
    };
    NSLog(@"Finished decoding floatBuffer for Waveform");
}

- (NSString *) process:(NSString *)fileName {
    SuperpoweredDecoder *decoder = new SuperpoweredDecoder();
    const char *openError = decoder->open([loadedFile UTF8String], false, 0, 0);
    
    float progress;
    
    if(openError) {
        delete decoder;
        @throw [NSException exceptionWithName:@"FAILED_OPEN_AUDIO_FILE" reason: @"Cannot open audio file" userInfo: nil];
    }
    
    NSString *filePath = [NSTemporaryDirectory() stringByAppendingPathComponent:[fileName stringByAppendingString:@".wav"]];
    
    [self deleteFileAtPath:filePath];
    FILE *fd = createWAV([filePath UTF8String], decoder->samplerate, 2);
    
    if (!fd) {
        delete decoder;
        @throw [NSException exceptionWithName:@"FAILED_CREATE_AUDIO_FILE" reason: @"Failed to create audio file" userInfo: nil];
    }
    
    short int *intBuffer = (short int *)malloc(decoder->samplesPerFrame * 2 * sizeof(short int) + 32768);
    float *floatBuffer = (float *)malloc(decoder->samplesPerFrame * 2 * sizeof(float) + 32768);
    
    while (true) {
        unsigned int samplesDecoded = decoder->samplesPerFrame;
        
        if (decoder->decode(intBuffer, &samplesDecoded) == SUPERPOWEREDDECODER_ERROR) break;
        if (samplesDecoded < 1) break;
        
        SuperpoweredShortIntToFloat(intBuffer, floatBuffer, samplesDecoded);
        
        if(echoMix) {
            echo->process(floatBuffer, floatBuffer, samplesDecoded);
        }
        
        SuperpoweredFloatToShortInt(floatBuffer, intBuffer, samplesDecoded);
        
        fwrite(intBuffer, 1, samplesDecoded * 4, fd);
        
        progress = (double)decoder->samplePosition / (double)decoder->durationSamples;
    }
    
    delete decoder;
    free(intBuffer);
    free(floatBuffer);
    
    return filePath;
}

- (void) deleteFileAtPath:(NSString *)path {
    NSFileManager *manager = [NSFileManager defaultManager];
    
    if([manager fileExistsAtPath:path]) {
        [manager removeItemAtPath:path error: nil];
    }
}

- (void) interruptionStarted {}
- (void) recordPermissionRefused {}
- (void) mapChannels:(multiOutputChannelMap *)outputMap inputMap:(multiInputChannelMap *)inputMap externalAudioDeviceName:(NSString *)externalAudioDeviceName outputsAndInputs:(NSString *)outputsAndInputs {}

@end
