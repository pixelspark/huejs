<template>
	<div class="hue-battery">
		<div :style="{'width': charge+'%'}"></div>
	</div>
</template>

<script>
export default {
	props: {
		charge: {type: Number}
	},

	methods: {
	}
};
</script>

<style scoped>

.hue-battery {
	display: inline-block;
	height: 10px;
	width: 30px;
	border: solid 1px #A0A0A0;
	padding: 1px;
	position: relative;
	overflow: hidden;
	border-radius: 2px;
}

.hue-battery > div {
	background-color: rgba(0,55,0,0.5);
	position: absolute;
	border: solid 1px white;
	left: 0px;
	top: 0px;
	height: 100%;
}
</style>
