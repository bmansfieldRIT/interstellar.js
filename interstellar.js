var frequencyDict = [
    ['C1', 32.703],
    ['C2', 65.406],
    ['C3', 130.813],
    ['C4', 261.626],
    ['C5', 523.251],
    ['C6', 1046.502],

    ['C#1', 34.648],
    ['C#2', 69.296],
    ['C#3', 138.591],
    ['C#4', 277.183],
    ['C#5', 554.365],
    ['C#6', 1108.731],

    ['D1', 36.708],
    ['D2', 73.416],
    ['D3', 146.832],
    ['D4', 293.665],
    ['D5', 587.330],
    ['D6', 1174.659],

    ['D#1', 38.891],
    ['D#2', 77.782],
    ['D#3', 155.563],
    ['D#4', 311.127],
    ['D#5', 622.254],
    ['D#6', 1244.508],

    ['E1', 41.203],
    ['E2', 82.407],
    ['E3', 164.814],
    ['E4', 329.628],
    ['E5', 659.255],
    ['E6', 1318.51],

    ['F1', 43.654],
    ['F2', 87.307],
    ['F3', 174.614],
    ['F4', 349.228],
    ['F5', 698.456],
    ['F6', 1396.913],

    ['F#1', 46.249],
    ['F#2', 92.499],
    ['F#3', 184.997],
    ['F#4', 369.994],
    ['F#5', 739.989],
    ['F#6', 1479.978],

    ['G1', 48.999],
    ['G2', 97.999],
    ['G3', 195.998],
    ['G4', 391.995],
    ['G5', 783.991],
    ['G6', 1567.982],

    ['G#1', 51.913],
    ['G#2', 103.826],
    ['G#3', 207.652],
    ['G#4', 415.305],
    ['G#5', 830.609],
    ['G#6', 1661.219],

    ['A1', 55],
    ['A2', 110],
    ['A3', 220],
    ['A4', 440],
    ['A5', 880],
    ['A6', 1760],

    ['A#1', 58.270],
    ['A#2', 116.541],
    ['A#3', 233.082],
    ['A#4', 466.164],
    ['A#5', 932.328],
    ['A#6', 1864.655],

    ['B1', 61.735],
    ['B2', 123.471],
    ['B3', 246.942],
    ['B4', 493.883],
    ['B5', 987.767],
    ['B6', 1975.533],
];

function playNote(note){
    var audio = makeNoteFromString(note, 1, "");
    audio.play();
}

function playDistortedNote(note){
    var audio = makeNoteFromString(note, 1, "clip");
    audio.play();
}

function makeNoteFromString(note, time, filter){
    var found = false;
    var audio;
    for (var i = 0; i < frequencyDict.length; i++){
        if (frequencyDict[i][0] == note){
            found = true;
            var sample;
            if (filter == 'clip'){
                sample = makeClippedNoteSample(frequencyDict[i][1], time);
            } else {
                sample = makeNoteSample(frequencyDict[i][1], time);
            }

            audio = makeAudio(sample);
        }
    }
    if (found){
        return audio;
    }
}

function makeNoteSample(frequency, time){
    var samples = []
    var sample_time = 14400 * time;
    for (var i = 0; i < sample_time ; i++) {
      var t = i / 14400;
      samples[i] = Math.sin(frequency * 2 * Math.PI * t);
    }
    return samples;
}

function makeClippedNoteSample(frequency, time){
    var pos_clip_thresh = 0.50;
    var neg_clip_thresh = -1 * pos_clip_thresh;

    var samples = []
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
    var samples = []
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

function makeAudio(samples){
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
