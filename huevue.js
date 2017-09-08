Vue.component('hue-battery', {
	template: '#hue-battery',
	props: {
		charge: {type: Number}
	},

	methods: {
	}
});

Vue.component('hue-time', {
	template: '#hue-time',
	props: {
		time: {type: Date}
	}
});

Vue.component('hue-rule-tr', {
	template: '#hue-rule-tr',
	props: {
		rule: {type: Object},
		hueId: {type: String}
	}
});

Vue.component('hue-group', {
	template: '#hue-group',
	props: {
		group: {type: Object},
		hueId: {type: String}
	}
});

Vue.component('hue-schedule', {
	template: '#hue-schedule',
	props: {
		schedule: {type: Object},
		hueId: {type: String}
	}
});

Vue.component('hue-resource-link', {
	template: '#hue-resource-link',
	props: {
		link: {type: Object},
		hueId: {type: String}
	}
});

Vue.component('hue-light', {
	template: '#hue-light',
	props: {
		light: {type: Object},
		hueId: {type: String}
	},

	methods: {
		toggle: function(on) {
			this.$emit('call', "/lights/" + this.hueId + "/state", {on: on});
		},
		colour: function(e) {
			
			// See https://developers.meethue.com/documentation/color-conversions-rgb-xy

			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e.target.value);

			const red = parseInt(result[1], 16) / 255
			const green = parseInt(result[2], 16) / 255
			const blue = parseInt(result[3], 16) / 255

			const red2 = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
			const green2 = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
			const blue2 = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

			const X = red2 * 0.664511 + green2 * 0.154324 + blue2 * 0.162028;
			const Y = red2 * 0.283881 + green2 * 0.668433 + blue2 * 0.047685;
			const Z = red2 * 0.000088 + green2 * 0.072310 + blue2 * 0.986039;

			const x = X / (X + Y + Z);
			const y = Y / (X + Y + Z);

			const colour = [x, y]

			console.log("Set colour", colour)
			this.$emit('call', "/lights/" + this.hueId + "/state", {on: true, xy: colour, bri: 254});
		},
		toHex: function(state) {

			const x = state.xy[0]; // the given x value
			const y = state.xy[1]; // the given y value
			const z = 1.0 - x - y;
			const Y = state.bri; // The given brightness value
			const X = (Y / y) * x;
			const Z = (Y / y) * z;

			const red1 =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
			const green1 = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
			const blue1 =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;

			const red2 = (red1 <= 0.0031308 ? 12.92 * red1 : (1.0 + 0.055) * Math.pow(red1, (1.0 / 2.4)) - 0.055);
			const green2 = (green1 <= 0.0031308 ? 12.92 * green1 : (1.0 + 0.055) * Math.pow(green1, (1.0 / 2.4)) - 0.055);
			const blue2 = (blue1 <= 0.0031308 ? 12.92 * blue1 : (1.0 + 0.055) * Math.pow(blue1, (1.0 / 2.4)) - 0.055);

			const correction = Math.max(red2, green2, blue2)

			const red = Math.floor(Math.max(red2 / correction, 0) * 255)
			const green = Math.floor(Math.max(green2 / correction, 0) * 255)
			const blue = Math.floor(Math.max(blue2 / correction, 0) * 255)



			const colourHex = "#" +
					red.toString(16).padStart(2, "0") +
					green.toString(16).padStart(2, "0") +
					blue.toString(16).padStart(2, "0");

			console.log("Current colour is", {r: red, g: green, b: blue})
			console.log("Current colour is", colourHex)

			return colourHex
		}
	}
});

Vue.component('hue-scene', {
	template: '#hue-scene',
	props: {
		scene: {type: Object},
		hueId: {type: String}
	},

	methods: {
		set: function(on) {
			this.$emit('call', "/groups/0/action", {scene: this.hueId});
		}
	}
});

Vue.component('hue-sensor', {
	template: '#hue-sensor',
	props: {
		sensor: {type: Object},
		hueId: {type: String}
	},

	methods: {
	},

	computed: {
		button: function() {
			let btnId = Math.floor(this.sensor.state.buttonevent / 1000);
			switch(btnId) {
				case 1: return "on button";
				case 2: return "up button";
				case 3: return "down button";
				case 4: return "off button";
				default: return "unknown button";
			}
		},

		buttonPressType: function() {
			let type = this.sensor.state.buttonevent % 1000;
			switch(type) {
				case 0: return "pressed";
				case 1: return "hold";
				case 2: return "released (short)";
				case 3: return "released (long)";
				default: return "unknown " + type;
			}
		},

		lux: function() {
			return Math.round(Math.pow(10, (this.sensor.state.lightlevel-1)/10000));
		},

		luxExplanation: function() {
			var lux = this.lux;

			if(lux <= 1) { return "bright moonlight"; }
			if(lux <= 2) { return "nightlight"; }
			if(lux <= 10) { return "dimmed light"; }
			if(lux <= 50) { return "cosy living room"; }
			if(lux <= 150) { return "normal"; }
			if(lux <= 350) { return "working/reading light"; }
			if(lux <= 700) { return "inside daylight"; }
			if(lux <= 2000) { return "very bright"; }
			else { return "outside light / direct sunlight"; }
		}
	}
});

var app = new Vue({
	el: '#app',
	data: function() {
		var initial = {
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
			rules: {},
		};

		try {
			if("hue" in window.localStorage) {
				var saved = JSON.parse(window.localStorage.hue);
				for(var k in saved) {
					if(saved.hasOwnProperty(k)) {
							initial[k] = saved[k];
						}
				}
			}
		}
		catch(e) {}

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
			var persistedAttributes = ["user", "bridge"];
			this[attr] = value;
			var data = {};
			var self = this;
			persistedAttributes.forEach(function(k) {
				data[k] = self[k];
			});
			window.localStorage.hue = JSON.stringify(data);
		},

		refresh: function() {
			var self = this;

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
			alert("Please go and press the link button on your hub now, then click OK.");

			var self = this;
			var user = "huevue#huevue";
			var msg = {devicetype: user};
			this._post("", msg, function(response) {
				self.user = response.username;
				self.refresh();
			});
		},

		call: function(path, data) {
			var self = this;
			this._put("/" + this.user + path, data, function(response) {
				console.log('got response', response);
				self.refresh();
			});
		},

		_put: function(call, data, callback) {
			this.$http.put(this.apiURL+call, data).then(function(response) {
				var message = response.data[0];
				if("error" in message) {
					alert(message.error.description);
					return;
				}
				return callback(message.success);
			}, function(response) {
				alert(response);
			});
		},

		_post: function(call, data, callback) {
			this.$http.post(this.apiURL+call, data).then(function(response) {
				var message = response.data[0];
				if("error" in message) {
					alert(message.error.description);
					return;
				}
				return callback(message.success);
			}, function(response) {
				alert(response);
			});
		},

		_get: function(call, callback) {
			this.$http.get(this.apiURL+call).then(function(response) {
				var message = response.data;
				if("error" in message) {
					alert(message.error.description);
					return;
				}
				return callback(message);
			}, function(response) {
				alert(response);
			});
		}
	}
});
