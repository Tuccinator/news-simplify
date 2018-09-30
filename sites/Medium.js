class Medium {

	constructor(browser, builder) {
		this.browser = browser;
		this.builder = builder;
		this.titleSelector = 'h1';
		this.authorSelector = "a.ds-link";
		this.contentSelector = '.section-inner p.graf, .section-inner img, .section-inner blockquote';
	}

	async run() {
		const page = await this.browser.newPage();

		await page.goto('https://medium.com/@marcusbergh/why-i-quit-being-a-startup-dad-778b55b71706');

		const article = await page.evaluate((authorSelector, titleSelector, contentSelector) => {
			const article = {};

			article.title = document.querySelector(titleSelector).innerText;
			article.author = document.querySelector(authorSelector).innerText;

			const paragraphNodes = document.querySelectorAll(contentSelector);
			let paragraphs = [];

			for(const node of paragraphNodes) {
				let content = '';

				switch(node.nodeName) {
					case 'IMG':
						content = '<img src="' + node.src + '"/>';

						break;
					case 'BLOCKQUOTE':
						content = '<blockquote>' + node.innerText + '</blockquote>';

						break;
					default:
						let text = '';

						if(node.childElementCount > 0) {
							if(node.children[0].nodeName == 'STRONG') {
								text = '<strong>' + node.innerText + '</strong>';
							}

							if(node.children[0].nodeName == 'A') {
								text = node.innerHTML;
							}
						} else {
							text = node.innerText;
						}

						content = '<p class="paragraph">' + text + '</p>';
						break;
				}

				paragraphs.push(content);
			}

			article.paragraphs = paragraphs;

			return article;
		}, this.authorSelector, this.titleSelector, this.contentSelector);

		this.builder(article.title, article.author, article.paragraphs.join(''), 'Medium');

		await this.browser.close();
	}
}

module.exports = Medium;