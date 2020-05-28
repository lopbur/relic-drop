const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const wf_item = require('warframe-items');
const request = require('request-promise-native');

String.prototype.contains = function (str) {
	return this.toLowerCase().includes(str.toLowerCase());
}

function parseRelicRewards(data) {
	return data.reduce((acc, cur) => {
		acc.push({
			itemName: cur.itemName,
			rarity: cur.rarity,
			chance: cur.chance,
		});
		return acc;
	}, [])
}

async function getAllDrop() {
	let wfAllDropSource = 'https://drops.warframestat.us/data/all.slim.json';
	let wfAllDrops = JSON.parse(await request(wfAllDropSource, (err, res, body) => {
		if(err) { console.error(err);	return }
		console.log(`method: getAllDrop(), Response: ${res.statusCode} - ${res.statusMessage}\n`);
		return body;
	}));

	return wfAllDrops;
}

async function getDrop() {
	let wfDropSource = 'https://drops.warframestat.us/data/relics.json';
	let wfDrops = JSON.parse(await request(wfDropSource, (err, res, body) => {
		if(err) { console.error(err);	return }
		console.log(`method: getDrop(), Response: ${res.statusCode} - ${res.statusMessage}\n`);
		return body;
	}))
	return wfDrops;
}

function getItem() {
	const wfItems = new wf_item({
		'category': ['Relics']
	});
	return wfItems;
}

function getRelicMap(wfDrop, wfItem) {
	const wfDropsMap = wfDrop.map(e => `${e.tier} ${e.relicName}`);
	const wfDropsUniqueMap = wfDropsMap.filter((v, i) => wfDropsMap.indexOf(v) === i);
	const wfItemsMap = wfItem.map(e => e.name.toLowerCase());
	const wfItemsUniqueMap = wfItemsMap.filter((v, i) => wfItemsMap.indexOf(v) === i);
	return {
		dropFull: wfDropsMap,
		dropUnique: wfDropsUniqueMap,
		itemFull: wfItemsMap,
		itemUnique: wfItemsUniqueMap,
	};
}

function getDropLocation(wfAllDrop) {
	let data, dataMap = [],
		dataMapIdx;

	data = wfAllDrop.reduce((acc, cur) => {
		if (cur.item.contains('relic')) {
			let relicName = cur.item.replace(/ relic| \(radiant\)/gi, "").toLowerCase();
			dataMapIdx = dataMap.indexOf(relicName);
			if (dataMapIdx !== -1) {
				acc[dataMapIdx].push({
					place: cur.place.replace(/ (\(\<b\>[\w+\s?]+\<\/b\>\))/gi, ''),
					rarity: cur.rarity,
					chance: cur.chance,
				})
			} else {
				dataMap.push(relicName);
				dataMapIdx = dataMap.length - 1;
				acc.push([{
					place: cur.place.replace(/ (\(\<b\>[\w+\s?]+\<\/b\>\))/gi, ''),
					rarity: cur.rarity,
					chance: cur.chance,
				}, ]);
			}
		}
		return acc;
	}, []);

	return {
		data: data,
		map: dataMap,
	};
}

function createDataForm(drops, items, dropLocation, maps) {
	let data, dataMap = [],
		dataMapIdx, dropLocationIdx;
	let relicItemFullMap = maps.itemFull;

	data = drops.reduce((acc, cur) => {
		let relicName = `${cur.tier} ${cur.relicName}`;
		let relicFullName = `${cur.tier} ${cur.relicName} ${cur.state}`;
		dataMapIdx = dataMap.indexOf(relicName);
		if (dataMapIdx !== -1) {
			acc[dataMapIdx][cur.state] = {
				rewards: parseRelicRewards(cur.rewards),
				imageName: items[relicItemFullMap.indexOf(relicFullName.toLowerCase())].imageName,
			}
		} else {
			dataMap.push(relicName);
			dataMapIdx = dataMap.indexOf(relicName);
			dropLocationIdx = dropLocation.map.indexOf(relicName.toLowerCase());
			acc.push({
				relicName: relicName,
				Intact: [],
				Exceptional: [],
				Flawless: [],
				Radiant: [],
				dropLocations: dropLocationIdx !== -1 ? dropLocation.data[dropLocationIdx] : [],
				description: items[relicItemFullMap.indexOf(relicFullName.toLowerCase())].description,
			});
			acc[dataMapIdx][cur.state] = {
				rewards: parseRelicRewards(cur.rewards),
				imageName: items[relicItemFullMap.indexOf(relicFullName.toLowerCase())].imageName,
			}

		}
		return acc;
	}, []);

	return data;
}

const dropUrl = "https://drops.warframestat.us/data/info.json";

request(dropUrl, async function(err, res, body) {
	if(err) { console.error(err); return }
	console.log(`Response: ${res.statusCode} - ${res.statusMessage}\n`)

	let oldHash = null;
	let hash = JSON.parse(body).hash;
	console.log(`Response hash: ${hash}`);
	
	if(fs.existsSync("./public/data/info.json")) {
		let info = require("./public/data/info.json");
		oldHash = info.dropHash;
		console.log("Old hash found: ", oldHash);
	}

	if(hash === oldHash) {
		console.log("Data is lastest. nothing changed.");
		process.exit(0);
	}

	let	wfDrop = 			await getDrop(),
			wfAllDrop = 	await getAllDrop(),
			wfItem = 			getItem(),
			relicMap = 		getRelicMap(wfDrop.relics, wfItem);

	let dropLoc = getDropLocation(wfAllDrop);
	let relicData = createDataForm(wfDrop.relics, wfItem, dropLoc, relicMap);

	let info = {
		formatHash: crypto.createHash('md5').update(JSON.stringify(relicData, null, '')).digest('hex'),
		dropHash: hash,
	}
	
	fs.writeFile(path.resolve(__dirname, "public", "data", "info.json"), JSON.stringify(info, null, ''), (err) => {
		if(err) throw new Error(`The error has been occured while saving info.json: ${err}`);
		console.log('Successfully saved info.json');
	});

	fs.writeFile(path.resolve(__dirname, "public", "data", "relics.json"), JSON.stringify(relicData, null, 2), (err) => {
		if(err) throw new Error(`The error has been occured while saving relic.json: ${err}`);
		console.log('Successfully saved relics.json');
	});
})