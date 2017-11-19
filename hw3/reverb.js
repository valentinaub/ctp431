var Reverb = function(context, parameters) {
	
	this.context = context;
	this.input = context.createGain();

	this.impulseResponseBuffer = null;

	// create nodes
	convolver = context.createConvolver(); //reverbLine
	this.wetGain = context.createGain(); 
	this.dryGain = context.createGain();

	getSound = new XMLHttpRequest();
	getSound.open("GET", "slinky_ir.ogg", true);
	getSound.responseType = 'arraybuffer';

	getSound.onload = function() {
		var audioData = getSound.response;
		context.decodeAudioData(audioData, function(buffer) {
      		this.impulseResponseBuffer = buffer;
      		convolver.buffer = this.impulseResponseBuffer;
    	}, function(e){"Error with decoding audio data" + e.err});

	}

	getSound.send();

	// connect 
	this.input.connect(convolver);
	convolver.connect(this.wetGain);

	this.input.connect(this.dryGain);

	this.dryGain.connect(this.context.destination);
	this.wetGain.connect(this.context.destination);

	this.wetGain.gain.value = parameters.reverbWetDry;
	this.dryGain.gain.value = (1-parameters.reverbWetDry);

	this.parameters = parameters;

}



Reverb.prototype.updateParams = function (params, value) {

	switch (params) {
		case 'reverb_dry_wet':
			this.parameters.reverbWetDry = value;
			this.wetGain.gain.value = value;
			this.dryGain.gain.value = 1 - value;
			break;		
	}
}


Reverb.prototype.connect = function(node) {
	this.fx_input = node.input;
	this.dryGain.connect(this.fx_input);
	this.wetGain.connect(this.fx_input);
}
