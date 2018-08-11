<template>
	<tr>
		<td>{{rule.name}}</td>
		<td><hue-time :time="new Date(rule.lasttriggered)"/></td>
		<td>
			<ul>
				<li v-for="(cond, idx) in rule.conditions" :key="idx">
					{{cond.address}} {{cond.operator}} {{cond.value}}
				</li>
			</ul>
		</td>

		<td>
			<ul>
				<li v-for="(action,idx) in rule.actions" :key="idx">
					{{action.address}} =&gt; {{action.body}}
				</li>
			</ul>
		</td>
	</tr>
</template>

<script>
import HueTime from './HueTime.vue';

export default {
	components: {
		'hue-time': HueTime
	},
	props: {
		rule: {type: Object},
		hueId: {type: String}
	}
};
</script>

<style>

</style>
