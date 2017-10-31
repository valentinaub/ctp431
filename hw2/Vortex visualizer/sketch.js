//Homework 2
//Sound Visualizer

//Vortex sound visualizer
//Made by : Valentin Aubier - 20176495



var file ='./Shine on your crazy diamond.mp3'

var sound; // sound file

var x,y;
var ang;
var r;

var sizeSlider, sensSlider, freqSlider;

var color_index = 1;


function preload(){
   sound = loadSound(file); // preload the sound
}

function setup(){
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(togglePlay);

  textSize(15);

  //create sliders
  sizeSlider = createSlider(100, 600, 250);
  sizeSlider.position(20, 20);
  sensSlider = createSlider(0, 225, 100);
  sensSlider.position(20, 50);
  freqSlider = createSlider(4000, 16000, 8000);
  freqSlider.position(20, 80);

  button = createButton('Color');
  button.position(20, 110);
  button.mousePressed(changeColor);



  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(sound);

  //create fft object
  fft = new p5.FFT();

  //initialize variables
  x = windowWidth/2;
  y = windowHeight/2;
  rms=0;
  ang = 0; 
  r = 190; //maximum radius
  i =0;

  //create particle object (see function below)
  particle = new Particle(x, y, 0, 0, 0, 0);
  
}

function draw(){
  background(0);

    //attribuate value to the sliders
  var size = sizeSlider.value();   //Control the Size factor of the particles
  var sens = 255 - sensSlider.value();        //Control the sensibility of the high frequencies
  var freq = freqSlider.value();            //Control the bandwidth of the high-frequencies 

  fill(255,0,0);
  text("size", sizeSlider.x * 2 + sizeSlider.width, 35);
  fill(255,0,0);
  text("sensibility", sensSlider.x * 2 + sensSlider.width, 65);
  fill(255,0,0);
  text("frequency threshold", freqSlider.x * 2 + freqSlider.width, 95);

  var spectrum = fft.analyze();     //perform the fft of the song
  var treble = fft.getEnergy(freq, 16000);   //Get the energy of the high frequencies (You can change the minimum frequency to adapt to a low pitch song)


  //Draw a circular pattern
  ang = ang+1.5;    //rotation speed
  if (ang == 360){
    ang=0;
  }
  rad = ang * Math.PI/180;        // convert the angle in radian


  //convert polar coordoninates into cartesian
  x= windowWidth/2 + r*sin(rad);        
  y= windowHeight/2 + r*cos(rad);
  

  // Get the average (root mean square) amplitude
  rms = analyzer.getLevel();

  //Change the color of the pattern when button is pressed
  if(color_index == 0){
    start = color(255, 0, 0);
    finnish = color(0, 255, 0);
  }
  else if(color_index == 1){
    start = color(255, 0, 0);
    finnish = color(0, 0, 255);
  }
  else if(color_index == 2){
    start = color(0, 255, 0);
    finnish = color(0, 0, 255);
  }

  //Linear interpolation between 2 colors
  var lerpvalue = map(treble, 0, sens, 0, 1);  
  var c1 = lerpColor(start, finnish, lerpvalue);

  //Particles Gestion, Store and Display the particles history
  particle.update(x, y, rms*size, c1, treble);  
  particle.show();

  //Display the first particle
  ellipse(x, y, rms*size, rms*size);

  stroke(0);

}


//Store the differents caracteristics of the particles and display them
function Particle(x, y, rms, color, treble){
  this.x=x;
  this.y=y;
  this.rms = rms;
  this.color = color;
  this.treble = treble;


  this.history = [] ;             //position history of the particles
  this.rmshistory = [];           //size history of the particles
  this.colorhistory = [];         //color history of the particle
  this.treblehistory = [];        //treble density history of the particles

  var alt=0;


  this.update = function(x, y, rms, color, treble){
    this.x = x;
    this.y = y;
    this.rms = rms;
    this.color = color;
    this.treble = treble;
    
//Store only one over two particles into different Arrays
    if (alt%2 == 0) {
      var v = createVector(this.x, this.y);
      this.history.push(v);
      this.rmshistory.push(this.rms);
      this.colorhistory.push(this.color);
      this.treblehistory.push(this.treble);
    } 
    //Circular buffer
    if(this.history.length == 300){
      this.history.splice(0,1);
      this.rmshistory.splice(0,1);
      this.colorhistory.splice(0,1);
      this.treblehistory.splice(0,1);
    }
    alt++;
  }

  //Display the history
  this.show = function(){
    stroke(0);
    
    for (var i = 0; i < this.history.length; i++) {
      var size = map(i, 0, this.history.length, 0, 1);  
      var pos = this.history[i];
      var color = this.colorhistory[i];

      fill(size*color.levels[0], size*color.levels[1], size*color.levels[2]);
      ellipse(pos.x*size + width*(1-size)/2, pos.y*size + height*(1-size)/2, this.rmshistory[i]*size, this.rmshistory[i]*size);

    }
  }
}


function changeColor(){
  color_index = (color_index+1)%3;
}

  

// Play sound when click on the canvas
function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}