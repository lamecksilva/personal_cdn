const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
var ip = require('ip');

const ipAddress = ip.address();

app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root
app.use(express.static('public'));

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
	},
});

const upload = multer({ storage: storage });

//app.use(express.static(__dirname)); // Current directory is root
app.use(express.urlencoded({ extended: true }));

// app.get('/public', express.static('public'));

app.post('/upload', upload.any(), (req, res) => {
	console.log(req.file);
	console.log(req.files);

	return res.json(req.files);
});

app.get('/', (req, res) => {
	const files = listarArquivosRecursivamente('public');

	console.log(files);

	let html = '<html><head><title>Arquivos</title></head><body>';

	files.forEach((item) => {
		html += `<a href="${item}">${item}</a></br>`;
	});

	html += '</body></html>';

	return res.send(html);
});

function listarArquivosRecursivamente(pasta) {
	const arquivos = fs.readdirSync(pasta);
	let lista = [];

	arquivos.forEach((arquivo) => {
		const caminhoArquivo = path.join(pasta, arquivo);

		if (fs.statSync(caminhoArquivo).isDirectory()) {
			lista = lista.concat(listarArquivosRecursivamente(caminhoArquivo));
		} else {
			lista.push(
				`http://${ipAddress}:${PORT}/${caminhoArquivo.replace('public/', '')}`
			);
		}
	});

	return lista;
}

const PORT = 80;

app.listen(PORT, () => {
	console.log(`Listing on http://${ipAddress}:${PORT}`);
});
