const createHTML = require('create-html');
const fs = require('fs');

module.exports = (title, author, content, source) => {
	const html = createHTML({
		title: title,
		css: '../css/article.css',
		head: '<meta charset="utf-8">',
		body: `<article><h1>${title}</h1><span class="author">By ${author}</span>${content}</article>`
	})

	fs.writeFile(`articles/${title} - ${source}.html`, html, (err) => {})
}