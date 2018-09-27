class NYTimes {
	constructor(browser, builder) {
		this.browser = browser;
		this.builder = builder;
		this.titleSelector = 'h1';
		this.authorSelector = "span[itemprop='name']";
		this.contentSelector = '.StoryBodyCompanionColumn > div > p, .StoryBodyCompanionColumn > div > h2, #story > figure';
	}

	async run() {
		const page = await this.browser.newPage();

		await page.goto('https://www.nytimes.com/2018/09/09/technology/pinterest-growth.html');

		const article = await page.evaluate((authorSelector, titleSelector, contentSelector) => {
			const article = {};

			article.author = document.querySelector(authorSelector).innerText;
			article.title = document.querySelector(titleSelector).innerText;

			const paragraphNodes = document.querySelectorAll(contentSelector);
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
						content = '<p class="paragraph">' + node.innerText + '</p>';
						break;
				}

				paragraphs.push(content);
			}

			article.paragraphs = paragraphs;

			return article;
		}, this.authorSelector, this.titleSelector, this.contentSelector);

		this.builder(article.title, article.author, article.paragraphs.join(''), 'NYTimes');

		await this.browser.close();
	}
}

module.exports = NYTimes;