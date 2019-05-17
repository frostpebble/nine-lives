//----------------------------------------- player-specific data -------------------------------------
var mainAvatar = "normal_silvertabby.png"

var resources = {
	//---------- gathering --------
	wood: 0,
	reeds: 0,
	cotton: 0,
	leather: 0,
	fish: 0,
	//---------- mining -----------
	stone: 0,
	coal: 0,
	iron: 0,
	gold: 0,
	emerald: 0,
	//---------- crafting -----------
	paper: 0,
	book: 0
}

var resourceCaps = {
	//---------- gathering --------
	wood: 100,
	reeds: 100,
	cotton: 100,
	leather: 50,
	fish: 200,
	//---------- mining --------
	stone: 100,
	coal: 50,
	iron: 50,
	gold: 25,
	emerald: 10,
}

//basically flags
var resourceTriggers = {
	reeds: 0, //unlocks writing
	leather: 0, //unlocks leatherwork
	coal: 0, //unlocks fire
}

//the "resources" on the left
var craftables = {

}

//name: [owned, equipped]
var toolList = {

}

//name: [owned, equipped, type]
var equipmentList = {
	helm_iron: [1,0,"head"],
	boots_iron: [2,0,"feet"],
	greaves_iron: [1,0,"legs"],
	gauntlets_iron: [2,0,"arms"],
	breastplate_iron: [1,0,"body"],
}

var science = 1000;
var maxscience = 100;
var baseScience = 1; //how much science a researcher generates per tick
var sciencePerTick = 0;

var food = 100;
var maxfood = 100;


var day = 1;
var tick = 0;

var activeTasks = {};
var taskID = 1;

var bagSize = 50;

var population = 1; 
var maxpop = 5;
var busy=0;

var activeExplorers = {};  //properties: zone, cat
var explorerID = 1;

var activeResearchers = {};  //properties: level, cat
var researcherID = 1;

var catList = {};  //index number; properties: name, lv, xp, busy, task, tool, head, body, arms, legs, feet, other, atk, def, bonus{}
//possible bonuses chop, mine, rareRate, rareAmt
//saved atk/def values are with tool/equipment. base is level^2 (1,4,9,16,25)
var xpPerTick = 1;

//properties: level, current cost
var projectList = {};

//what's listed can be crafted (constant cost)
var craftingList = [];

//0= not researched (visible), 1=researched (invisible)
var researchList = {
	"woodTools": 0
}

//name: zone
var areaList = {
	forest: 0
}

var filledZone = [1,0,0,0,0,0];