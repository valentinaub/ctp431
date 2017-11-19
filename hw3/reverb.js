	
	



	//this.impulseResponseBuffer = sourceNode.buffer;


var Reverb = function(context, parameters) {
	
	this.context = context;
	this.input = context.createGain();

	this.impulseResponseBuffer = null;

	// create nodes
	convolver = context.createConvolver(); //reverbLine
	this.wetGain = context.createGain(); 
	this.dryGain = context.createGain();
	



	//slinky_ir = new reverbObject('slinky_ir.wav');
	// grab audio track via XHR for convolver node

	//var sourceNode, impulseResponseBuffer;
	//sourceNode = context.createBufferSource();

	getSound = new XMLHttpRequest();
	getSound.open("GET", "slinky_ir.ogg", true);
	getSound.responseType = 'arraybuffer';

	getSound.onload = function() {
		var audioData = getSound.response;
		context.decodeAudioData(audioData, function(buffer) {
      		this.impulseResponseBuffer = buffer;
      		convolver.buffer = this.impulseResponseBuffer;
      		//convolver.loop = true;
      		//convolver.connect(this.wetGain);
      		console.log("File has been loaded.")
      		console.log(convolver.buffer);
      		console.log(this.impulseResponseBuffer);
      		//sourceNode.connect(this.wetGain);
  			
  			//sourceNode.start();
  			//callback(sourceNode.buffer);

    	}, function(e){"Error with decoding audio data" + e.err});

	}


	getSound.send();
	//this.convolver.buffer = impulseResponseBuffer;
	

	//console.log(this.impulseResponseBuffer);
	
	
	

	// connect 
	this.input.connect(convolver);
	convolver.connect(this.wetGain);

	this.input.connect(this.dryGain);

	this.dryGain.connect(this.context.destination);
	this.wetGain.connect(this.context.destination);

	this.wetGain.gain.value = parameters.reverbWetDry;
	this.dryGain.gain.value = (1-parameters.reverbWetDry);

	this.parameters = parameters;

	//this.convolver.start();

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
