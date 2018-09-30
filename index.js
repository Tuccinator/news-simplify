const puppeteer = require('puppeteer');

const NYTimes = require('./sites/NYTimes');
const Economist = require('./sites/Economist');
const Medium = require('./sites/Medium');
const builder = require('./helpers/builder');


(async () => {
	const browser = await puppeteer.launch({args: ['--no-sandbox']});
	
	const times = new NYTimes(browser, builder);
	const economist = new Economist(browser, builder);
	const medium = new Medium(browser, builder);

	medium.run();
})()
