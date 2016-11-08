/*  interstellar.js
    Author: Brian Mansfield

    This file provides functions to create WAV audio files in javascript.
    The recommeded entry point for creating a file given a note is
    the function createWaveFromNote().

*/

function createWaveFromNote(note){
    var waveSamples = makeSamplesFromNote(note);
    var audio = makeAudioFromSamples(waveSamples);
    audio.play();
}

function makeSamplesFromNote(note){
    var samples = makeNoteSample(frequencyEnum[note], 1);
    return samples;
}

function makeNoteSample(frequency, time){
    var samples = [];
    var sample_time = 14400 * time;
    for (var i = 0; i < sample_time; i++) {
      var t = i / 14400;
      samples[i] = Math.sin(frequency * 2 * Math.PI * t);
    }
    return samples;
}

function makeClippedNoteSample(frequency, time){
    var pos_clip_thresh = 0.50;
    var neg_clip_thresh = -1 * pos_clip_thresh;

    var samples = [];
    var sample_time = 14400 * time;
    for (var i = 0; i < sample_time ; i++) {
      var t = i / 14400;

      samples[i] = Math.sin(frequency * 2 * Math.PI * t);
      if (samples[i] > pos_clip_thresh){
          samples[i] = pos_clip_thresh;
      } else if (samples[i] < neg_clip_thresh){
          samples[i] = neg_clip_thresh;
      }
      //console.log(samples[i]);
    }
    return samples;
}

function makeChordSample(frequencyList, time){
    var samples = [];
    var sample_time = 14400 * time;
    for (var i = 0; i < sample_time ; i++) {
      var t = i / 14400;
      for (var j = 0; j < frequencyList.length; j++){
          freq_math += frequencyList[j] * 2 * Math.PI * t;
      }
      samples[i] = Math.sin( freq_math / frequencyList.length );
    }
    return samples;
}

function makeAudioFromSamples(samples){
    var wave = new RIFFWAVE();
    wave.header.sampleRate = 14400; // standard sample rate
    wave.header.numChannels = 1;
    var audio = new Audio();
    var samples_255 = convertTo255(samples);
    wave.Make(samples_255);
    audio.src = wave.dataURI;
    return audio;
}

function convertTo255(data) {
    var data_255 = [];
    for (var i = 0; i < data.length; i++) {
        data_255[i] = 128 + Math.round(127 * data[i]);
    }
    return data_255;
}
