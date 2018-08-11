<template>
	<span>
		{{time.toLocaleString()}}
	</span>
</template>

<script>
export default {
	props: {
		time: {type: Date}
	}
};
</script>

<style>

</style>
