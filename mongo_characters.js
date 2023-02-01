// Connect to Database
let db = connect("mongodb://localhost/abascal");

// Get al documents from Character's collection
let characters = db.characters.find();

// Iterate the documents and get the character name and IDs
characters.forEach(function (character) {
	console.log(character.name);
	let id = db.characters.find({"name": character.name}, {id_character:1});
	printjson(id);
});
