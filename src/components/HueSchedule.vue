<template>
	<div :class="{'hue-schedule':true}">
		<h3>{{schedule.name}}</h3>
	</div>
</template>

<script>
export default {
	props: {
		schedule: {type: Object},
		hueId: {type: String}
	}
};
</script>

<style>

</style>
