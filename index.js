#!/usr/bin/env node
//#!/bin/node

const http = require('http');
const { MongoClient } = require('mongodb');

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

http.createServer(function(request, response) {
	console.log("Alguien se conecta");

	if (request.url == "/favicon.ico") {
		return;
	}

	if (request.url == "/characters") {
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
	else {
		response.write("Página principal");
		response.end();
	}

}).listen(8080);

