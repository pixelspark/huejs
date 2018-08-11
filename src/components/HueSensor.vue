<template>
	<div 
		:class="{'hue-sensor':true, 'on': (sensor.state.presence || sensor.state.daylight || sensor.state.dark)}" 
		style="position: relative;"
		v-if="['ZLLSwitch','ZLLTemperature','ZLLLightLevel', 'ZLLPresence'].indexOf(sensor.type) >= 0"
	>
		<hue-battery v-if="sensor.config.battery" :charge="sensor.config.battery" style="position: absolute; bottom: 7px; right: 7px;"></hue-battery>
		<h3>{{sensor.name}}</h3> 

		<template v-if="sensor.type == 'ZLLTemperature' ">
				Temperature: {{Math.round(sensor.state.temperature/10)/10}}˚
		</template>

		<template v-if="sensor.type == 'ZLLSwitch' ">
				Last event: {{button}} {{buttonPressType}}
		</template>

		<template v-if="sensor.type == 'ZLLLightLevel' ">
				<abbr :title="this.lux + ' lux' ">{{luxExplanation}}</abbr>
				<template v-if="sensor.state.daylight">(daylight)</template>
				<template v-if="sensor.state.dark">(dark)</template>
		</template>

		<template v-if="sensor.type == 'ZLLPresence'">
			<template v-if="sensor.state.presence">Presence detected</template>
			<template v-else>Nothing detected</template>
		</template>
	</div>
</template>

<script>
import HueBattery from './HueBattery.vue';

export default {
	components: {
		'hue-battery': HueBattery
	},

	props: {
		sensor: {type: Object},
		hueId: {type: String}
	},

	methods: {
	},

	computed: {
		button: function() {
			let btnId = Math.floor(this.sensor.state.buttonevent / 1000);
			switch(btnId) {
				case 1: return "on button";
				case 2: return "up button";
				case 3: return "down button";
				case 4: return "off button";
				default: return "unknown button";
			}
		},

		buttonPressType: function() {
			let type = this.sensor.state.buttonevent % 1000;
			switch(type) {
				case 0: return "pressed";
				case 1: return "hold";
				case 2: return "released (short)";
				case 3: return "released (long)";
				default: return "unknown " + type;
			}
		},

		lux: function() {
			return Math.round(Math.pow(10, (this.sensor.state.lightlevel - 1) / 10000));
		},

		luxExplanation: function() {
			let lux = this.lux;

			if(lux <= 1) {
 return "bright moonlight";
}
			if(lux <= 2) {
 return "nightlight";
}
			if(lux <= 10) {
 return "dimmed light";
}
			if(lux <= 50) {
 return "cosy living room";
}
			if(lux <= 150) {
 return "normal";
}
			if(lux <= 350) {
 return "working/reading light";
}
			if(lux <= 700) {
 return "inside daylight";
}
			if(lux <= 2000) {
 return "very bright";
}
			else {
 return "outside light / direct sunlight";
}
		}
	}
};
</script>