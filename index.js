const puppeteer = require('puppeteer');
const fs = require('fs');
const createHTML = require('create-html');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto('https://www.nytimes.com/2018/09/09/technology/pinterest-growth.html?rref=collection%2Fsectioncollection%2Ftechnology&action=click&contentCollection=technology&region=rank&module=package&version=highlights&contentPlacement=1&pgtype=sectionfront');

	const article = await page.evaluate(() => {
		const article = {};

		article.author = document.querySelector("span[itemprop='name']").innerText;
		article.title = document.querySelector('h1').innerText;

		const paragraphNodes = document.querySelectorAll('.StoryBodyCompanionColumn > div > p, .StoryBodyCompanionColumn > div > h2, figure');
		let paragraphs = [];

		for(const node of paragraphNodes) {
			let content = '';
			switch(node.nodeName) {
				case 'H2':
					content = '<h2>' + node.innerText + '</h2>';
					break;
				case 'FIGURE':
					const image = node.querySelector('img');

					if(image) {
						const srcsets = image.srcset.split(',');
						const caption = node.querySelector('figcaption').outerHTML;
						content = `<figure><img src="${srcsets[1]}" />${caption}</figure>`;
					}
					break;
				case 'P':
				default:
					content = '<p>' + node.innerText + '</p>';
					break;
			}

			paragraphs.push(content);
		}

		article.paragraphs = paragraphs;

		return article;
	});

	const html = createHTML({
		title: article.title,
		css: 'css/article.css',
		head: '<meta charset="utf-8">',
		body: `<article><h1>${article.title}</h1><span class="author">By ${article.author}</span>${article.paragraphs.join('')}</article>`
	})

	fs.writeFile('article.html', html, (err) => {})

	await browser.close();
})()