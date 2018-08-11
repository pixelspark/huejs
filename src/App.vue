<template>
	<div id="app" v-cloak>
			<article>
				<h1>HueJS <template v-if="connected">: {{config.name}}</template></h1>
				Bridge: <input :value="bridge" placholder="Bridge IP" type="text" v-on:keyup="set('bridge', $event.target.value)">
				Username: <input :value="user" placeholder="User" type="text" v-on:keyup="set('user', $event.target.value)">

				<button v-on:click="refresh" v-if="this.user != ''">Refresh</button>
				<button v-on:click="register" v-if="this.user == ''">Register</button>
			</article>

			<article>
				<h2>Lights</h2>
				<ul>
					<hue-light :light="light" :hue-id="lightid" v-for="(light, lightid) in lights" :key="lightid" v-on:call="call"/>
				</ul>
			</article>

			<article>
				<h2>Sensors</h2>
				<ul>
					<hue-sensor :sensor="sensor" :hue-id="sensorId" v-for="(sensor, sensorId) in sensors" :key="sensorId" v-on:call="call"/>
				</ul>
			</article>

			<article>
				<h2>Scenes</h2>
				<ul>
					<hue-scene :scene="scene" :hue-id="sceneId" v-for="(scene, sceneId) in scenes" :key="sceneId" v-on:call="call"/>
				</ul>
			</article>

			<article>
				<details>
					<summary><h2>Schedules</h2></summary>
					<ul>
						<hue-schedule :schedule="schedule" :hue-id="scheduleId" v-for="(schedule, scheduleId) in schedules" :key="scheduleId" v-on:call="call"/>
					</ul>
				</details>

				<details>
					<summary><h2>Resource links</h2></summary>
					<ul>
						<hue-resource-link :link="link" :hue-id="linkId" v-for="(link, linkId) in resourcelinks" :key="linkId" v-on:call="call"/>
					</ul>
				</details>

				<details>
					<summary><h2>Groups</h2></summary>
					<ul>
						<hue-group :group="group" :hue-id="groupId" v-for="(group, groupId) in groups" :key="groupId" v-on:call="call"/>
					</ul>
				</details>

				<details>
					<summary><h2>Rules</h2></summary>
					<table>
						<thead>
							<tr>
								<th>Rule name</th>
								<th>Last triggered</th>
								<th>Conditions</th>
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							<tr is="hue-rule-tr" :rule="rule" :hue-id="ruleId" v-for="(rule, ruleId) in rules" :key="ruleId" v-on:call="call"></tr>
						</tbody>
					</table>
				</details>
			</article>
		</div>
</template>

<script>
import HueBattery from './components/HueBattery.vue';
import HueSensor from './components/HueSensor.vue';
import HueScene from './components/HueScene.vue';
import HueRuleRow from './components/HueRuleRow.vue';
import HueGroup from './components/HueGroup.vue';
import HueTime from './components/HueTime.vue';
import HueResourceLink from './components/HueResourceLink.vue';
import HueSchedule from './components/HueSchedule.vue';
import HueLight from './components/HueLight.vue';

export default {
	components: {
		'hue-battery': HueBattery,
		'hue-sensor': HueSensor,
		'hue-scene': HueScene,
		'hue-rule-tr': HueRuleRow,
		'hue-time': HueTime,
		'hue-group': HueGroup,
		'hue-resource-link': HueResourceLink,
		'hue-schedule': HueSchedule,
		'hue-light': HueLight
	},

	data: function() {
		let initial = {
			bridge: '',
			user: '',
			connected: false,

			// Hue state data
			lights: {},
			sensors: {},
			schedules: {},
			resourcelinks: {},
			scenes: {},
			groups: {},
			config: {},
			rules: {}
		};

		try {
			if("hue" in window.localStorage) {
				let saved = JSON.parse(window.localStorage.hue);
				for(let k in saved) {
					if(saved.hasOwnProperty(k)) {
							initial[k] = saved[k];
						}
				}
			}
		}
		catch(e) {
			console.error(e);
		}

		return initial;
	},

	computed: {
		apiURL: function() {
			return "http://" + this.bridge + "/api";
		}
	},

	created: function() {
		this.refresh();
	},

	methods: {
		set: function(attr, value) {
			let persistedAttributes = ["user", "bridge"];
			this[attr] = value;
			let data = {};
			let self = this;
			persistedAttributes.forEach(function(k) {
				data[k] = self[k];
			});
			window.localStorage.hue = JSON.stringify(data);
		},

		refresh: function() {
			let self = this;

			this._get("/" + this.user, function(msg) {
				self.connected = true;
				self.lights = msg.lights;
				self.sensors = msg.sensors;
				self.schedules = msg.schedules;
				self.resourcelinks = msg.resourcelinks;
				self.groups = msg.groups;
				self.scenes = msg.scenes;
				self.config = msg.config;
				self.rules = msg.rules;
			});
		},

		register: function() {
			window.alert("Please go and press the link button on your hub now, then click OK.");

			let self = this;
			let user = "huevue#huevue";
			let msg = {devicetype: user};
			this._post("", msg, function(response) {
				self.user = response.username;
				self.refresh();
			});
		},

		call: function(path, data) {
			let self = this;
			this._put("/" + this.user + path, data, function() {
				self.refresh();
			});
		},

		_put: function(call, data, callback) {
			window.fetch(this.apiURL + call, {method: 'PUT', body: JSON.stringify(data)}).then(function(response) {
				response.json().then(function(data) {
					let message = data[0];
					if("error" in message) {
						window.alert(message.error.description);
						return;
					}
					return callback(message.success);
				});
			}, function(response) {
				window.alert(response);
			});
		},

		_post: function(call, data, callback) {
			window.fetch(this.apiURL + call, {method: 'POST'}, data).then(function(response) {
				response.json().then(function(data) {
					let message = data[0];
					if("error" in message) {
						window.alert(message.error.description);
						return;
					}
					return callback(message.success);
				});
			}, function(response) {
				window.alert(response);
			});
		},

		_get: function(call, callback) {
			window.fetch(this.apiURL + call).then(function(response) {
				response.json().then(function(data) {
					let message = data;
					if("error" in message) {
						window.alert(message.error.description);
						return;
					}
					return callback(message);
				});
			}, function(response) {
				window.alert(response);
			});
		}
	}
};
</script>

<style>
* {
	margin: 0px;
	padding: 0px;
	box-sizing: border-box;
	font-family: verdana, arial, sans-serif;
	font-size: 9pt;
	color: rgb(77,77,77);
	line-height: 1.2em;
}

button {
	padding: 3px;
}

[v-cloak] {
	display: none;
}

li {
	list-style-type: disc;
	margin-left: 20px;
}

article {
	padding: 10px;
	padding-left: 15px;
}

article:nth-child(2n+1) {
	background-color: #EFEFEF;
}

h1 {
	font-size: 13pt;
	padding: 10px;
	padding-left: 0px;
}

h2 {
	font-size: 11pt;
	margin-bottom: 10px;
	margin-top: 10px;
	display: inline-block;
}

h3 {
	font-size: 9pt;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
	overflow: hidden;
}

.hue-sensor, .hue-group, .hue-resource-link, .hue-schedule {
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
}

.hue-sensor.on {
	background-color: rgba(0,155,0,0.3);
}

table {
	border-collapse: collapse;
	border: none;
}

table th {
	font-weight: bold;
	background-color: rgba(0,55,100,1.0);
	color: white;
}

table tr td, table tr th {
	padding: 5px;
	vertical-align: top;
	text-align: left;
}

table tr {
	padding: 5px;
	border: none;
	border-collapse: collapse;
}

table tr:nth-child(2n+1) {
	background-color: #EFEFEF;
}

abbr {
	border-bottom: dotted 1px #A0A0A0;
}

details summary {
	outline: none;
	cursor: pointer;
}

details {
	margin-top: 5px;
	margin-bottom: 5px;
}

input[type='text'] {
	width: 250px;
}
</style>
