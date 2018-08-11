<template>
	<div class="hue-scene" @click="set">
		<h3>{{scene.name}}</h3>
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

<style scoped>
.hue-scene {
	display: inline-block;
	padding: 10px;
	margin: 5px;
	border-radius: 10px;
	width: 150px;
	height: 75px;
	background-color: rgba(0,0,0,0.1);
	overflow: hidden;
	text-overflow: ellipsis;
	vertical-align: top;
	cursor: pointer;
}

.hue-scene:hover {
	background-color: rgba(0,0,0,0.2);
}

.hue-scene.on {
	background-color: rgba(0,155,0,0.3);
}
</style>