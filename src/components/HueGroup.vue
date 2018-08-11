<template>
	<div :class="{'hue-group':true}">
		<h3>{{group.name}}</h3>
	</div>
</template>

<script>
export default {
	props: {
		group: {type: Object},
		hueId: {type: String}
	}
};
</script>

<style>

</style>
