<template>
	<div :class="{'hue-resource-link':true}">
		<h3>{{link.name}}</h3>
	</div>
</template>

<script>
export default {
	props: {
		link: {type: Object},
		hueId: {type: String}
	}
};
</script>

<style>

</style>
