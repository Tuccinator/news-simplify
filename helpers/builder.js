const createHTML = require('create-html');
const fs = require('fs');

module.exports = (title, author, content, source, extras) => {
	extras = extras || {};

	console.log(author);

	let body = '<article>';

	if(title) {
		body += '<h1>' + title + '</h1>';
	}

	if(extras.subtitle) {
		body += '<p class="subtitle">' + extras.subtitle + '</p>';
	}

	if(author) {
		body += '<span class="author">By ' + author + '</span>';
	}

	if(content) {
		body += content;
	}

	body += '</article>';

	const html = createHTML({
		title: title,
		css: '../css/article.css',
		head: '<meta charset="utf-8">',
		body: body
	})

	fs.writeFile(`articles/${title} - ${source}.html`, html, (err) => {})
}