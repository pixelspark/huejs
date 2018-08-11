<template>
	<div :class="{'hue-scene':true}">
		<h3>{{scene.name}}</h3>
		<button v-on:click="set">Set</button>
	</div>
</template>

<script>
export default {
	props: {
		scene: {type: Object},
		hueId: {type: String}
	},

	methods: {
		set: function() {
			this.$emit('call', "/groups/0/action", {scene: this.hueId});
		}
	}
};
</script>