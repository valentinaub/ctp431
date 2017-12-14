//Initialization

var selectfilter = new Nexus.Select('#selectfilter',{
  'size': [100,30],
  'options': ['LowPass','BandPass', 'HighPass', 'Lowshelf', 'Highshelf', 'Notch']
});

var selectosc = new Nexus.Select('#selectosc',{
  'size': [100,30],
  'options': ['sine','square', 'triangle', 'saw']
});

var bpm = new Nexus.Number('#bpm',{
  'size': [60,30],
  'value': 120,
  'min': 0,
  'max': 200,
  'step': 1
});

//Gate
var sequencer = new Nexus.Sequencer('#sequencer',{
 'size': [400,50],
 'mode': 'toggle',
 'rows': 1,
 'columns': 8
})

var toggleGate = new Nexus.Toggle('#toggleGate',{
    'size': [40,20],
    'state': false
})

var gatetime;

var interval = new Nexus.Interval(1000*60/(4*bpm), function() {
  sequencer.next();
})


var delayFeed = new Nexus.Dial('#delayFeed');
delayFeed.value = 0.5;
delayFeed.colorize("fill","#333");

var delayWet = new Nexus.Dial('#delayWet');
delayWet.value = 0.5;
delayWet.colorize("fill","#333");

var phaserFreq = new Nexus.Dial('#phaserFreq');
phaserFreq.value = 0.5;
phaserFreq.colorize("fill","#333");

var phaserWet = new Nexus.Dial('#phaserWet');
phaserWet.value = 0.5;
phaserWet.colorize("fill","#333");


var position = new Nexus.Position('#position',{
  'size': [400,400],
  'mode': 'absolute',  // "absolute" or "relative"
  'x': 0.5,  // initial x value
  'minX': 0,
  'maxX': 1500,
  'stepX': 0,
  'y': 1000,  // initial y value
  'minY': 0,
  'maxY': 1000,
  'stepY': 0
});
    
position.colorize("fill","#333");


var slider = new Nexus.Slider('#slider',{
  min: -40,
  max: 0,
  step: 1,
  mode: 'absolute'
});

var button = new Nexus.Button('#button',{
  'size': [80,80],
  'mode': 'aftertouch',
  'state': false
})
    

var toggle = new Nexus.Toggle('#toggle',{
    'size': [40,20],
    'state': false
})




//Oscillator
var osc = new Tone.Oscillator(200, "sine");

var ampEnv = new Tone.AmplitudeEnvelope({
  "attack": 0.1,
  "decay": 0.2,
  "sustain": 1.0,
  "release": 0.8
});

//Filter
var filter = new Tone.Filter(200, "lowpass");


//Effect
var pingpong = new Tone.PingPongDelay({
      "delayTime" : "8n",
      "feedback" : 0.6,
      "wet" : 0.5
    })

var phaser = new Tone.Phaser({
  "frequency" : 15, 
  "octaves" : 5, 
  "baseFrequency" : 1000
})

osc.connect(ampEnv);
osc.connect(filter);
ampEnv.connect(filter);
filter.connect(phaser);
phaser.connect(pingpong);
pingpong.toMaster();




selectfilter.on('change',function(v) {
  if(v.index == 0){
    filter.type = "lowpass";
  }
  if(v.index == 1){
    filter.type = "bandpass";
  }
  if(v.index == 2){
    filter.type = "highpass";
  }
  if(v.index == 3){
    filter.type = "lowshelf";
  }
  if(v.index == 4){
    filter.type = "highshelf";
  }
  if(v.index == 5){
    filter.type = "notch";
  }
});

selectosc.on('change',function(v) {
  if(v.index == 0){
    osc.type = "sine";
  }
  if(v.index == 1){
    osc.type = "square";
  }
  if(v.index == 2){
    osc.type = "triangle";
  }
  if(v.index == 3){
    osc.type = "sawtooth";
  }
});

bpm.on('change',function(v) {
  sequencer.stop();
  interval.stop();
  interval.ms(2*1000*60/(v));
  bpm = 2*1000*60/(v);
  console.log(2*1000*60/(v));
  interval.start();
  sequencer.start();
});

toggle.on('change',function(v) {
  if (v) 
    osc.start();
  else  
    osc.stop();
});


delayFeed.on('change', function(v){
    pingpong.feedback.value = v;

})

delayWet.on('change', function(v){
  pingpong.wet.value = v;
})

phaserFreq.on('change', function(v){
    phaser.frequency.value = v*25;
})

phaserWet.on('change', function(v){
    phaser.wet.value = v;
})

toggleGate.on('change',function(v) {
  if (v) {
    osc.disconnect(filter);
    sequencer.start();
    interval.start();
  }
  else{
    osc.connect(filter);
    sequencer.stop();
    osc.volume.value = 0;
  }
    
    interval.stop();
});


sequencer.on('step',function(v) {
  if(v[0]){
    ampEnv.sustain.value = 0.1;
    ampEnv.attack = 0;
    osc.volume.value = 0;
    ampEnv.triggerAttack(0.1);
    

    //console.log(0);
  }
  else{
    osc.volume.value = -400;
    //console.log(-100);
  }
})


position.on('change',function(v) {
    osc.frequency.value = v.x;
    filter.frequency.value = v.y;
})


slider.on('change',function(v) {
  osc.volume.value = v;
});

button.on('change',function(v) {
  if (v.state){
    position.x = Math.random() * (position.maxX - position.minX) + position.minX;
    position.y = Math.random() * (position.maxY - position.minY) + position.minY;
  }
});







