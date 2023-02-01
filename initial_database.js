db = db.getSiblingDB("abascal");

// Create collection items
db.createCollection("items");

// Adding documents to items
db.items.insert( {"item": "Perla negra", "type": "TE", "consumible": false, "cost": 3600, "key": true} );
db.items.insert( {"item": "Jabón de la abuela", "type": "PB", "consumible": true, "cost": 50, "key": true} );
db.items.insert( {"item": "Cola de furro", "type": "BU", "consumible": true, "cost": 9999, "key": false} );
db.items.insert( {"item": "Examen reprobado", "type": "PU", "consumible": false, "cost": 0, "key": true} );

// Create collection weapons
db.createCollection("weapons");

// Adding documents to weapons
db.weapons.insert( {"weapon": "Brazo de bebé", "type": "ME", "grip": 1, "durability": 100, "distance": 0.5} );
db.weapons.insert( {"weapon": "Pantalón de pana mojado", "type": "ME", "grip": 2, "durability": 200, "distance": 1} );
db.weapons.insert( {"weapon": "Chancla de la mama", "type": "RA", "grip": 1, "durability": 1000, "distance": 10000} );
