# CTP431

Trippy pad

Introduction:

This XY Pad allows you to control the oscillator pitch and cutoff frequency of the chosen filter. In addition to different effects, it permits you to jam with some psychedelic music.

Description:

This is a simple synthesizer composed of an oscillator plugged to various effects. 

Oscillators: -sine
             -square
             -triangle
             -sawtooth
             
Filters: -Lowpass
         -Bandpass
         -Highpass
         -
         -
         
Effects: -Pingpong delay
         -Phaser
         -Gater: The gater allows you to play rythm thanks to a sequencer, by turning on the oscillator on the selected cases.
         -Randomizer: The randomizer is a simple button which chang the position of the XY Pad randomly to make famous psychedelic                             effect.
         
Difficulties/Limitations:

Oscillator activation: 
I initially wanted to turn on the oscillator when we click on the XY pad but this feature is not available with NexusUI position object. Instead whe need to turn the oscillator on and off with a toggle.

Gater: 
I tried different ways to implement the gater. The first one consisted of triggering attack and release of the oscillator enveloppe, but the time between 2 attacks was too short to ear it with full energy. Instead, I have simply change the volume with a constant oscillator playing a note. I initially wanted to play sixteenth notes with it, but, when the BPM was too high, there was a delay/shift on certain note, it somehow sound psychedelic but I have decided to play only eighteen notes and have it fixed.

Filters:
It is note possible with tone.js to change the resonance parameter of a filter, which was very surprising.
     
          
        
