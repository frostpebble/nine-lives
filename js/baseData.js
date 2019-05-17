//----------------------------------------- constant -------------------------------------

//index=area level, value=ticks
//var travelTime = [0,30,180,360,600,1800];
var travelTime = [0,0,0,0,0,0];
var areasPerZone = [1,4,6,6,6,6];

//----------------------------------------- areas -------------------------------------
var areas = {
	forest: {
		name: "Forest",
		level: 0,
		mainResource: "wood",
		perTick: 1,
		rareResources: { //num = relative chance
			leather: 30
		}
	},
	
	mountain: {
		name: "Mountain",
		level: 1, 
		mainResource: "stone",
		perTick: 1,
		rareResources: { 
			coal: 30,
			iron: 10,
		}
	},
	
	river: {
		name: "River",
		level: 1, 
		mainResource: "reeds",
		perTick: 1,
		rareResources: { 
			fish: 30
		}
	},
	
	plains: {
		name: "Plains",
		level: 1, 
		mainResource: "cotton",
		perTick: 1,
		rareResources: { 
			leather: 30
		}
	},
	
	cave: {
		name: "Cave",
		level: 1,
		rareResources: { 
			coal: 60,
			iron: 25,
			gold: 10,
			emerald: 5
		}
	}
}

//----------------------------------------- research -------------------------------------
var research = {
	//starting
	woodTools: {
		name: "Wooden Tools",
		cost: 50,
		desc: "Unlock Crafting: Wooden Axe, Wooden Pickaxe, Wooden Sword",
		activate: function() {
			makeCraftingAvailable("axe_wood");
			makeCraftingAvailable("pickaxe_wood");
			makeCraftingAvailable("sword_wood");
			updateLog("Wooden Tools were discovered!<br>");
		}
	},
	//writing tree
	writing: {
		name: "Writing",
		cost: 50,
		desc: "Unlock Crafting: Paper; Project: Library",
		activate: function() {
			makeCraftingAvailable("paper");
			makeProjectAvailable("Library");
			updateLog("Writing was discovered!<br>");
		}
	},
	leatherworking: {
		name: "Leatherworking",
		cost: 50,
		desc: "Unlock Crafting: Book; Project: Backpack",
		activate: function() {
			makeCraftingAvailable("book");
			makeProjectAvailable("Backpack");
			updateLog("Leatherworking was discovered!<br>");
		}
	},
	//fire tre
	fire: {
		name: "Fire",
		cost: 50,
		desc: "Unlock Crafting: Torch; Research: Metalworking",
		activate: function() {
			makeCraftingAvailable("torch");
			researchList.push("metalworking")
			updateLog("Fire was discovered!<br>");
		}
	},
	metalworking: {
		name: "Metalworking",
		cost: 100,
		desc: "Unlock Research: Iron Tools, Iron Armor; Project: Safe",
		activate: function() {
			researchList.push("ironTools");
			researchList.push("ironArmor");
			makeProjectAvailable("Safe");
			updateLog("Metalworking was discovered!<br>");
		}
	},
	ironTools: {
		name: "Iron Tools",
		cost: 150,
		desc: "Unlock Crafting: Iron Axe, Iron Pickaxe, Iron Sword",
		activate: function() {
			makeCraftingAvailable("axe_iron");
			makeCraftingAvailable("pickaxe_iron");
			makeCraftingAvailable("sword_iron");
			updateLog("Iron Tools were discovered!<br>");
		}
	},
	ironArmor: {
		name: "Iron Armor",
		cost: 150,
		desc: "Unlock Crafting: Iron Helm, Iron Breastplate, Iron Gauntlets, Iron Greaves, Iron Boots",
		activate: function() {
			makeCraftingAvailable("helm_iron");
			makeCraftingAvailable("breastplate_iron");
			makeCraftingAvailable("gauntlets_iron");
			makeCraftingAvailable("greaves_iron");
			makeCraftingAvailable("boots_iron");
			updateLog("Iron Armor was discovered!<br>");
		}
	},
}

//----------------------------------------- projects -------------------------------------
var projects = {
	//-------------------- housing -------------------------------
	Hut: {
		level: 0,
		maxlevel: 10,
		category: "housing",
		baseCost: {
			wood: 100
		},
		costRatio: 2,
		effectText: "Max population +1",
		effect: function() {
			maxpop++;
			$("#maxpop").html(maxpop);
		}
	},
	House: {
		level: 0,
		maxlevel: 10,
		category: "housing",
		baseCost: {
			wood: 25,
			stone: 75
		},
		costRatio: 2,
		effectText: "Max population +1",
		effect: function() {
			maxpop++;
			$("#maxpop").html(maxpop);
		}
	},
	//------------------- storage ----------------------------------
	Shed: {
		level: 0,
		maxlevel: 10,
		category: "storage",
		baseCost: {
			wood: 25
		},
		costRatio: 2,
		effectText: "Max wood +50, max stone +50, max leather +25",
		effect: function() {
			resourceCaps.wood +=50;
			resourceCaps.stone +=50;
			resourceCaps.leather +=25;
			updateResources();
		}
	},
	Basement: {
		level: 0,
		maxlevel: 10,
		category: "storage",
		baseCost: {
			stone: 100,
			coal: 10
		},
		costRatio: 2,
		effectText: "Max wood +500, max stone +500, max coal +100, max iron +100",
		effect: function() {
			resourceCaps.wood +=500;
			resourceCaps.stone +=500;
			resourceCaps.coal += 100;
			resourceCaps.iron += 100;
			updateResources();
		}
	},
	Safe: {
		level: 0,
		maxlevel: 10,
		category: "storage",
		baseCost: {
			iron: 25
		},
		costRatio: 2,
		effectText: "Max gold +25, max emerald +10",
		effect: function() {
			resourceCaps.gold +=25;
			resourceCaps.emerald +=10;
			updateResources();
		}
	},
	//------------------- inventory ----------------------------------
	Backpack: {
		level: 0,
		maxlevel: 10,
		category: "inventory",
		baseCost: {
			leather: 25
		},
		costRatio: 2,
		effectText: "Cats' inventory size +25",
		effect: function() {
			bagSize += 25;
		}
	},
	Cart: {
		level: 0,
		maxlevel: 10,
		category: "inventory",
		baseCost: {
			wood: 100,
			iron: 25
		},
		costRatio: 2,
		effectText: "Cats' inventory size +50",
		effect: function() {
			bagSize += 50;
		}
	},
	//------------------- science ----------------------------------
	Library: {
		level: 0,
		maxlevel: 10,
		category: "science",
		baseCost: {
			wood: 50,
			book: 5
		},
		costRatio: 2,
		effectText: "Max science +200, science/sec +1",
		effect: function() {
			maxscience +=100;
			baseScience +=1;
			for (var r in activeResearchers) {
				sciencePerTick++; //account for currently researching cats
			}
			$("#maxscience").html(maxscience);
		}
	},
	University: {
		level: 0,
		maxlevel: 10,
		category: "science",
		baseCost: {
			wood: 500,
			stone: 500,
			book: 20
		},
		costRatio: 2,
		effectText: "Max science +500, science/sec +2",
		effect: function() {
			maxscience +=500;
			baseScience +=2;
			for (var r in activeResearchers) {
				sciencePerTick+=2; //account for currently researching cats
			}
			$("#maxscience").html(maxscience);
		}
	},

}

//----------------------------------------- crafting -------------------------------------
var crafting = {
	//------------------- materials ----------------------------------
	paper: {
		name: "Paper",
		category: "materials",
		cost: {
			reeds: 3
		},
		result: "paper"
	},
	book: {
		name: "Book",
		category: "materials",
		cost: {
			paper: 5,
			leather: 1
		},
		result: "book"
	},
	torch: {
		name: "Torch",
		category: "materials",
		cost: {
			wood: 1,
			coal: 1
		},
		result: "torch"
	},
	
	//------------------- food ----------------------------------	
	food_fish: {
		name: "Food (from fish)",
		category: "food",
		cost: {
			fish: 1
		},
		result: "food"
	},
	//------------------- tools ----------------------------------
	axe_wood: {
		name: "Wooden Axe",
		category: "tools",
		cost: {
			wood: 5
		},
		result: "wooden axe"
	},
	pickaxe_wood: {
		name: "Wooden Pickaxe",
		category: "tools",
		cost: {
			wood: 5
		},
		result: "wooden pickaxe"
	},
	sword_wood: {
		name: "Wooden Sword",
		category: "tools",
		cost: {
			wood: 5
		},
		result: "wooden sword"
	},
	axe_iron: {
		name: "Iron Axe",
		category: "tools",
		cost: {
			iron: 5
		},
		result: "iron axe"
	},
	pickaxe_iron: {
		name: "Iron Pickaxe",
		category: "tools",
		cost: {
			iron: 5
		},
		result: "iron pickaxe"
	},
	sword_iron: {
		name: "Iron Sword",
		category: "tools",
		cost: {
			iron: 5
		},
		result: "iron pickaxe"
	},
	//------------------- equip ----------------------------------
	//------------------- head ------------
	helm_iron: {
		name: "Iron Helm",
		category: "equipment",
		cost: {
			iron: 5
		},
		result: "iron helm"
	},
	//------------------- body ------------
	breastplate_iron: {
		name: "Iron Breastplate",
		category: "equipment",
		cost: {
			iron: 10
		},
		result: "iron breastplate"
	},
	//------------------- arms ------------
	gauntlets_iron: {
		name: "Iron Gauntlets",
		category: "equipment",
		cost: {
			iron: 3
		},
		result: "iron gauntlets"
	},
	//------------------- legs ------------
	greaves_iron: {
		name: "Iron Greaves",
		category: "equipment",
		cost: {
			iron: 6
		},
		result: "iron greaves"
	},
	//------------------- feet ------------
	boots_iron: {
		name: "Iron Boots",
		category: "equipment",
		cost: {
			iron: 4
		},
		result: "iron boots"
	},
}

//----------------------------------------- eqipment stats -------------------------------------
var equipment = {
	//------------------- head ----------------------------------
	helm_iron: {
		type: "head",
		atk: 0,
		def: 4,
		set: "iron"
	},
	//------------------- body ----------------------------------
	breastplate_iron: {
		type: "body",
		atk: 0,
		def: 8,
		set: "iron"
	},
	
	//------------------- arms ----------------------------------
	gauntlets_iron: {
		type: "arms",
		atk: 0,
		def: 2,
		set: "iron"
	},
	
	//------------------- legs ----------------------------------
	greaves_iron: {
		type: "legs",
		atk: 0,
		def: 3,
		set: "iron"
	},
	
	//------------------- feet ----------------------------------
	boots_iron: {
		type: "feet",
		atk: 0,
		def: 3,
		set: "iron"
	},
}

//----------------------------------------- tool stats -------------------------------------
var tools= {
	axe_wood: {
		atk: 1,
		def: 0,
		bonus: {
			chop: 2
		}
	},
	pickaxe_wood: {
		atk: 1,
		def: 0,
		bonus: {
			mine: 2
		}
	},
	sword_wood: {
		atk: 3,
		def: 1,
		bonus: {
		}
	},
}


//----------------------------------------- names -------------------------------------
var catNames = [
	"Billy",
	"Butch",
	"Cassi",
	"Abby",
	"Jack",
	"Mauzi",
	"Sam",
	"Dean",
	"Tony",
	"Smokey",
	"Oreo",
	"Miko",
	"Tama",
	"Felix",
	"Sylvester",
	"Thomas",
	"Dutchess",
	"Marie",
	"Fireheart",
	"Graystripe",
	"Bluestar",
	"Brambleclaw",
	"Keith",
	"Shiro",
	"Pidge",
	"Hunk",
	"Lance",
	"Allura",
	"Coran"
];
