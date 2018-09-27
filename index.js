const puppeteer = require('puppeteer');

const NYTimes = require('./sites/NYTimes');
const Economist = require('./sites/Economist');
const builder = require('./helpers/builder');


(async () => {
	const browser = await puppeteer.launch({args: ['--no-sandbox']});
	
	const times = new NYTimes(browser, builder);
	const economist = new Economist(browser, builder);

	economist.run();
})()
