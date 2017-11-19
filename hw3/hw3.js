
var context = new AudioContext()
var synth;

var synth_params = {
	lfoRate:1,
	lfoDepth: 4,
	filterCutoffFreq:4575,
	filterQ:1,
	filterEnvAttackTime: 3,
	filterEnvDecayTime: 1.36,
	filterEnvSustainLevel: 0.19,
	filterEnvReleaseTime: 1.65,
	ampEnvAttackTime: 3,
	ampEnvDecayTime: 1.93,
	ampEnvSustainLevel: 0.48,
	ampEnvReleaseTime: 0.66
};

var delay_params = {
	delayTime: 0.47,
	delayFeedbackGain: 0.51,
	delayWetDry: 0.74
}
var reverb_params = {
	reverbWetDry: 0.41
};

// default
var temp = context.createOscillator();

var synth = new Synth(context, synth_params);
var delay = new Delay(context, delay_params);
var reverb = new Reverb(context, reverb_params);

synth.connect(reverb);
reverb.connect(delay);
//synth.connect(delay);

// launch MIDI 	
if (navigator.requestMIDIAccess)
	navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
else
	alert("No MIDI support present in your browser.  You're gonna have a bad time.")


nx.onload = function() {

	// OSC

	//LFO
	gui_lfo_rate.min = 0;	
	gui_lfo_rate.max = 30;	
	gui_lfo_rate.set({ value: synth_params.lfoRate })
	gui_lfo_rate.on('*',function(data) {
		synth.updateParams('lfo_rate', data.value);
	});

	gui_lfo_depth.min = 0;	
	gui_lfo_depth.max = 50;	
	gui_lfo_depth.set({ value: synth_params.lfoDepth })
	gui_lfo_depth.on('*',function(data) {
		synth.updateParams('lfo_depth', data.value);
	});


	// Filter
	gui_filter_freq.min = 100;	
	gui_filter_freq.max = 10000;	
	gui_filter_freq.set({ value: synth_params.filterCutoffFreq })
	gui_filter_freq.on('*',function(data) {
		synth.updateParams('filter_freq', data.value);
	});

	gui_filter_env_attack.min = 0;	
	gui_filter_env_attack.max = 3;	
	gui_filter_env_attack.set({ value: synth_params.filterEnvAttackTime })
	gui_filter_env_attack.on('*',function(data) {
		synth.updateParams('filter_attack', data.value);
	});

	gui_filter_env_decay.min = 0;	
	gui_filter_env_decay.max = 3;	
	gui_filter_env_decay.set({ value: synth_params.filterEnvDecayTime })
	gui_filter_env_decay.on('*',function(data) {
		synth.updateParams('filter_decay', data.value);
	});

	gui_filter_env_sustain.min = 0;	
	gui_filter_env_sustain.max = 1;	
	gui_filter_env_sustain.set({ value: synth_params.filterEnvSustainLevel })
	gui_filter_env_sustain.on('*',function(data) {
		synth.updateParams('filter_sustain', data.value);
	});

	gui_filter_env_release.min = 0;	
	gui_filter_env_release.max = 3;	
	gui_filter_env_release.set({ value: synth_params.filterEnvReleaseTime })
	gui_filter_env_release.on('*',function(data) {
		synth.updateParams('filter_release', data.value);
	});


	// Amp ENV
	gui_amp_env_attack.min = 0;
	gui_amp_env_attack.max = 3;
	gui_amp_env_attack.set({ value: synth_params.ampEnvAttackTime })
	gui_amp_env_attack.on('*',function(data) {
		synth.updateParams('amp_attack_time', data.value);
	});
	gui_amp_env_decay.min = 0;
	gui_amp_env_decay.max = 3;
	gui_amp_env_decay.set({ value: synth_params.ampEnvDecayTime })
	gui_amp_env_decay.on('*',function(data) {
		synth.updateParams('amp_decay_time', data.value);
	});
	gui_amp_env_sustain.min = 0;
	gui_amp_env_sustain.max = 1;
	gui_amp_env_sustain.set({ value: synth_params.ampEnvSustainLevel })
	gui_amp_env_sustain.on('*',function(data) {
		synth.updateParams('amp_sustain_level', data.value);
	});
	gui_amp_env_release.min = 0;
	gui_amp_env_release.max = 3;
	gui_amp_env_release.set({ value: synth_params.ampEnvReleaseTime })
	gui_amp_env_release.on('*',function(data) {
		synth.updateParams('amp_release_time', data.value);
	});

	// delay
	gui_delay_time.min = 0;
	gui_delay_time.max = 1;
	gui_delay_time.set({ value: delay_params.delayTime })
	gui_delay_time.on('*',function(data) {
		delay.updateParams('delay_time', data.value);
	});
	gui_delay_gain.min = 0;
	gui_delay_gain.max = 0.9;
	gui_delay_gain.set({ value: delay_params.delayFeedbackGain })
	gui_delay_gain.on('*',function(data) {
		delay.updateParams('delay_feedback_gain', data.value);
	});
	gui_delay_wet_dry.min = 0;
	gui_delay_wet_dry.max = 1;
	gui_delay_wet_dry.set({ value: delay_params.delayWetDry })
	gui_delay_wet_dry.on('*',function(data) {
		delay.updateParams('delay_dry_wet', data.value);
	});

	//reverb
	gui_reverb_time.min = 0;
	gui_reverb_time.max = 1;
	gui_reverb_time.set({ value: reverb_params.reverbWetDry })
	gui_reverb_time.on('*',function(data) {
		reverb.updateParams('reverb_dry_wet', data.value);
	});

	// Keyboard 	
	gui_keyboard.octaves = 3;
	gui_keyboard.init();

	gui_keyboard.on('*',function(data) {

		if (data.on > 0 ) {
			synth.noteOn(data.note, 100);	
		}
		else {
			synth.noteOff(data.note, 100);	
		}

	});

}

function onMIDIInit(midi) {
	midiAccess = midi;

	var haveAtLeastOneDevice=false;
	var inputs=midiAccess.inputs.values();

	for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
		input.value.onmidimessage = MIDIMessageEventHandler;
		haveAtLeastOneDevice = true;
	}
      
	if (!haveAtLeastOneDevice)
		console.log("No MIDI input devices present.  You're gonna have a bad time.");
	}


function onMIDIReject(err) {
	console.log("The MIDI system failed to start.  You're gonna have a bad time.");
}


function MIDIMessageEventHandler(event) {
	// Mask off the lower nibble (MIDI channel, which we don't care about)
	switch (event.data[0] & 0xf0) {
		case 0x90:
		if (event.data[2]!=0)   // if velocity != 0, this is a note-on message
			synth.noteOn(event.data[1], event.data[2]);	
			return;
		
		// if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
        case 0x80:
			synth.noteOff(event.data[1], event.data[2]);
			return;
	}
}	