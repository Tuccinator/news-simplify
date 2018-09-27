class Economist {

	constructor(browser, builder) {
		this.browser = browser;
		this.builder = builder;
		this.titleSelector = 'h1 .flytitle-and-title__title';
		this.subtitleSelector = "p[itemprop='description']";
		this.contentSelector = '.blog-post__text > p, .blog-post__image';
	}

	async run() {
		const page = await this.browser.newPage();

		await page.goto('https://www.economist.com/business/2018/09/29/a-ride-hailing-battle-in-south-east-asia');

		const article = await page.evaluate((subtitleSelector, titleSelector, contentSelector) => {
			const article = {};

			article.title = document.querySelector(titleSelector).innerText;
			article.subTitle = document.querySelector(subtitleSelector).innerText;
			article.author = null;

			const paragraphNodes = document.querySelectorAll(contentSelector);
			let paragraphs = [];

			for(const node of paragraphNodes) {
				let content = '';

				switch(node.className) {
					case 'component-image blog-post__image':
						const image = node.querySelector('img');

						if(image) {
							const srcsets = image.srcset.split(',');
							content = `<figure><img src="https://www.economist.com${srcsets[3].split(' ')[0].trim()}" /></figure>`;
						}

						break;
					case 'xhead':
						content = '<h2>' + node.innerText + '</h2>';
						break;
					default:
						content = '<p class="paragraph">' + node.innerText + '</p>';
						break;
				}

				paragraphs.push(content);
			}

			article.paragraphs = paragraphs;

			return article;
		}, this.subtitleSelector, this.titleSelector, this.contentSelector);

		this.builder(article.title, article.author, article.paragraphs.join(''), 'Economist', {subtitle: article.subTitle});

		await this.browser.close();
	}
}

module.exports = Economist;