const request = require('request-promise-native');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getKeywords(value, acc) {
	acc = acc || [];
	if (typeof value === "string") {
		value = value.toLowerCase();
		if(acc.indexOf(value) === -1) {
			acc.push(value);
		}
	} else if(typeof value === "object") {
		if (Array.isArray(value)) {
			value.map(e => getKeywords(e, acc));
			return acc;
		} else {
			return Object.values(value).map(e => getKeywords(e, acc));
		}
	}
}

async function init() {
	let rawData = JSON.parse(fs.readFileSync("./data/data.json", { encoding: "utf-8"}));

	let uniqueKey = getKeywords(rawData, []);
	fs.writeFileSync(path.resolve(__dirname, "data", "key.json"), JSON.stringify(uniqueKey, null, 2));

	let raw = JSON.parse(await request("https://api.warframestat.us/ko", (err, res) => {
		if(err) { console.error(err);	return }
		console.log(`Response: ${res.statusCode} - ${res.statusMessage}\n`);
	})).languages;
	
	let rawKey = Object.keys(raw), rawValue = Object.values(raw);

	let data = rawKey.reduce((acc, cur, idx) => {
		let keyHash = crypto.createHash("md5").update(cur, "utf8").digest("hex");
		acc.push({
			[keyHash]: rawValue[idx],
		})
		return acc;
	}, []);

	fs.writeFileSync(path.resolve(__dirname, "data", "ko.json"), JSON.stringify(data, null, 2));
}

init();