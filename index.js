var app = new Vue({
	el: '#app',
	data: {
		message: "hello vue!",
	}
})

async function init() {
	let raw = await fetch("https://api.warframestat.us/ko")
		.then(res => {
			if(res.ok) return res.json();
		})
		.then(json => {
			return json.languages;
		})
	
	let rawKey = Object.keys(raw), rawValue = Object.values(raw);

	let data = rawKey.reduce((acc, cur, idx) => {
		let keyHash = crypto.createHash("md5").update(cur).digest("hex");
		acc.push({
			[keyHash]: rawValue[idx],
		})
		return acc;
	}, []);

	console.log(data);
}

init();