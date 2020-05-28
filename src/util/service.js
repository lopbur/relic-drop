/* eslint-disable */

const crypto = require('crypto');
let relicMap = null;

String.prototype.contains = function(str) {
	return this.toLowerCase().includes(str.toLowerCase());
}

String.prototype.isJSON = function() {
	try {
		JSON.parse(this);
	} catch (e) {
		return false;
	}
	return true;
}

const INFO_DEFAULT = { 'hash': 'default' };

function validateData() {
	let oldInfo = localStorage.getItem('_info');
	let oldData = localStorage.getItem('_data');

	if(!oldInfo || !oldInfo.isJSON()) {
		localStorage.setItem('_info', JSON.stringify(INFO_DEFAULT, null, 0));
	}

	if(!oldData || !oldData.isJSON()){
		localStorage.removeItem('_data');
		console.info('_data cleared');
	}
}

module.exports = {
	relicMap,
	init: async function() {
		validateData();
		let info = await fetch('./data/info.json')
			.then(res => {
				if(res.ok) return res.json();
				throw new Error(res.statusText);
			});
		
		return new Promise((resolve, reject) => {
			if(info.hash !== JSON.parse(localStorage.getItem('_info')).hash || !localStorage.getItem('_data')) {
				console.log("new data found of missing data. download new one.");
				localStorage.setItem('_info', JSON.stringify(info));
				fetch('./data/relics.json')
					.then(res => {
						if(res.ok) return res.json();
						reject(Error(res.statusText));
					})
					.then(json => {
						this.relicMap = json.map(e => e.relicName);
						localStorage.setItem('_data', JSON.stringify(json));
						resolve(true);
					})
			} else {
				this.relicMap = JSON.parse(localStorage.getItem('_data')).map(e => e.relicName);
				resolve(true);
			}
		})
	},
	retrieveRelic(value) {
		return JSON.parse(localStorage.getItem('_data')).filter(e => e.relicName.contains(value));
	},
	getRelicDetail(value) {
		let idx = this.relicMap.indexOf(value);
		return JSON.parse(localStorage.getItem('_data'))[idx];
	}
}