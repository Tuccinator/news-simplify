const puppeteer = require('puppeteer');

const NYTimes = require('./sites/NYTimes');
const builder = require('./helpers/builder');


(async () => {
	const browser = await puppeteer.launch({args: ['--no-sandbox']});
	
	const times = new NYTimes(browser, builder);
	
	times.run();
})()
