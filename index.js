#!/usr/bin/env node
//#!/bin/node

const http = require('http');
const { MongoClient } = require('mongodb');
const fs = require('fs');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'abascal';
let db;
let collection;

async function dbConnect() {
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);

  return 'Connected to MongoDB database';
}

dbConnect()
  .then(console.log)
  .catch(console.error);

function sendCharacters (response) {
	collection = db.collection('characters');
	
	collection.find({}).toArray()
		.then(characters => {
			console.log(characters);

			let charactersName = [];

			for (let i = 0; i < characters.length; i++) {
					charactersName.push(characters[i].name);
			}

			response.write(JSON.stringify(charactersName));
			response.end();
		});

}

function sendAge (response, url) {

	if (url.length < 3) {
		response.write(" [!] ERROR: Edad errónea!");
		response.end();
		return;
	}

	collection = db.collection('characters');
	
	collection.find({ "name": url[2] }).project({ _id: 0, age: 1}).toArray()
		.then(character => {

			console.log(character);

			if (character.length == 0) {
				response.write("ERROR: Edad errónea!");
				response.end();
				return;
			}
			
			response.write(JSON.stringify(character[0]));
			response.end();
		});

}

function sendCharacterItems (response, url) {

	let name = url[2].trim();

	if (name == "") {
		response.write(" [!] ERROR: URL mal formada!");
		response.end();
		return;
	}

	let collection = db.collection("characters");
	collection.find({ "name": name }).project({ _id: 0, id_character: 1}).toArray()
		.then(characterID => {
			console.log(characterID);
			
			if (characterID.length != 1) {
				response.write(" [!] ERROR: El personaje " + name  +  " no existe");
				response.end();
				return;
			}

			let collection = db.collection("charactersItems");
			collection.find( {"id_character": characterID[0].id_character} ).project( {_id: 0, id_item: 1} ).toArray()
				.then(itemsID => {
					console.log(itemsID);

					if (itemsID.length == 0) {
						response.write("[]");
						response.end();
						return;
					}

					let collection = db.collection("items");
					let ids = [];

					itemsID.forEach(element => ids.push(element.id_item));

					collection.find({ "id_item": {$in: ids} }).project( {_id: 0, item: 1} ).toArray()
						.then( itemsNames => {
							
							let names = [];

							itemsNames.forEach( item => names.push(item.item));

							response.write(JSON.stringify(names));
							response.end();

							return;
						});
				});
		});
}

function sendItems (response, url) {

	if (url.length >= 3) {

		sendCharacterItems(response, url);
		return;
	}

	collection = db.collection('items');

	collection.find({}).toArray()
		.then(items => {
			console.log(items);
			
			let itemsName = [];

			for (let i = 0; i < items.length; i++) {
				itemsName.push(items[i].item);
			}

			response.write(JSON.stringify(itemsName));
			response.end();
		});
}

function sendWeapons (response) {

	collection = db.collection('weapons');

	collection.find({}).toArray()
		.then(weapons => {
			console.log(weapons);
			
			let weaponsName = [];

			for (let i = 0; i < weapons.length; i++) {
				weaponsName.push(weapons[i].weapon);
			}

			response.write(JSON.stringify(weaponsName));
			response.end();
		});
}

http.createServer(function(request, response) {

	if (request.url == "/favicon.ico") {
		return;
	}

	console.log("Alguien se conecta");

	let url = request.url.split("/");
	
	switch (url[1]) {

	case "age":
		sendAge(response, url);
		break;

	case "characters":
		sendCharacters(response);
		break;
	
	case "items":
		
		sendItems(response, url);
		break;
	
	case "weapons":
		
		sendWeapons(response);
		break;
	
	default:
		fs.readFile("index.html", function (err, data) {
			if (err) {
				console.error(err);
				response.writeHead(404, {"Content-Type": "text/html"});
				response.write("Error 404: El archivo no se encuentra en este castillo");
				response.end();
				return;
			}

			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(data);
			response.end();
		});
	}

}).listen(8080);

