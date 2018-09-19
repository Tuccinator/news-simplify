const puppeteer = require('puppeteer');

const NYTimes = require('./sites/NYTimes');
const builder = require('./helpers/builder');

const times = new NYTimes(puppeteer, builder);

times.run();