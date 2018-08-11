<template>
	<div :class="{'hue-light':true, 'on': light.state.on}">
		<h3>{{light.name}}</h3>
		<template v-if="!isNaN(light.state.bri)">
			{{Math.round(light.state.bri/255*100)}} % <br/>
		</template>
		<button v-on:click="toggle(!light.state.on)">Toggle</button>
		<input type="color" v-on:change="colour" v-if="light.state.hue">
	</div>
</template>

<script>
export default {
	props: {
		light: {type: Object},
		hueId: {type: String}
	},

	methods: {
		toggle: function(on) {
			this.$emit('call', "/lights/" + this.hueId + "/state", {on: on});
		},

		colour: function(e) {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e.target.value);

			const red = parseInt(result[1], 16) / 255;
			const green = parseInt(result[2], 16) / 255;
			const blue = parseInt(result[3], 16) / 255;

			const red2 = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
			const green2 = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
			const blue2 = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

			const X = red2 * 0.664511 + green2 * 0.154324 + blue2 * 0.162028;
			const Y = red2 * 0.283881 + green2 * 0.668433 + blue2 * 0.047685;
			const Z = red2 * 0.000088 + green2 * 0.072310 + blue2 * 0.986039;

			const x = X / (X + Y + Z);
			const y = Y / (X + Y + Z);

			const colour = [x, y];
			this.$emit('call', "/lights/" + this.hueId + "/state", {on: true, xy: colour});
		}
	}
};
</script>

<style>
</style>
