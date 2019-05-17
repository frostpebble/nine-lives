//--------------------------------------------- resources -----------------------------------------------------------

function increaseResource(resource, amount) {
	resources[resource] += amount;
	if (resources[resource] > resourceCaps[resource])
		resources[resource] = resourceCaps[resource];
	var id= "#"+resource;
	$(id).html(resources[resource]);
	updateResources();
	checkResourceTriggers(resource);
};

//check if acquiring for the first time triggers event
function checkResourceTriggers(resource) {
	if (resourceTriggers[resource] == 0) {
		resourceTriggers[resource] = 1;
		unlockWithTrigger(resource);
	}
}

/*function increasePerTick(resource, amount) {
	perTick[resource] += amount;
};*/

function hasAllResources(costlist, showAlert) {
	var alerttext = "";
	var flag = false;
	for (var required in costlist) {
		if (costlist[required] > resources[required]) {
			alerttext += "Not enough " + required + "! You need " + (costlist[required]-resources[required]) + " more. \n";
			flag= true;
		}
	}
	if (flag) {
		if (showAlert) {
			alert(alerttext);
		}
		return false;
	}
	else return true;
}

function updateResources() {  //make visiable or update cap
	for (var item in resources) {
		if (resources[item] > 0) {
			$("#"+item).parent().removeClass("hidden");
			$("#max"+item).html(resourceCaps[item]);
			$("#"+item).html(resources[item]);
		}
	}
}

//--------------------------------------------- food -----------------------------------------------------------

function increaseFood(amount) {
	food += amount;
	if (food > maxfood)
		food = maxfood;
	$("#food").html(food);
};

//--------------------------------------------- cats -----------------------------------------------------------

function randomCatName() {
	var i = Math.floor(Math.random() * catNames.length);
	return catNames[i];	
}

/*function addCat() {
	population++;
	$("#cats").html(population);
	$("#freeCats").html(population-busy);
	var name= randomCatName();
	newCat(name);
	$("#catList").append("<div class='catInfo bordered' id='cat"+population+"'><b>" + catList[population].name + 
		"</b><button type='button' class='btn btn-default rightFloat' data-toggle='modal' data-target='#equipModal'>Change Tool/Equipment</button>" +
		"<br>Level: <span class='catLv'>" + catList[population].lv + "</span> 	XP: <span class='catXp'>" + catList[population].xp + "</span>" +
		"<br>Task assigned: <span class='catStatus'>" + catList[population].task + "</span>" +"</div>");
	fillCatDropdown();
}*/

function addCat(id) {
	$("#catList").append("<div class='catInfo bordered' id='cat"+id+"'>" + 
		"<img src='img/"+catList[id].icon+"'>"+
		"<b>" + catList[id].name + 
		"</b><button type='button' class='btn btn-default rightFloat' data-toggle='modal' data-target='#equipModal' onClick='loadEquipScreen()'>Change Tool/Equipment</button>" +
		"<br>Level: <span class='catLv'>" + catList[id].lv + "</span> 	XP: <span class='catXp'>" + catList[id].xp + "</span>" +
		"<br>Task assigned: <span class='catStatus'>" + catList[id].task + "</span>" +"</div>");
}

function newCat(name) {
	catList[population] = { 
		name: name, lv: 1, xp: 0, busy: false, task: "none",
		tool: "none", head: "none", body: "none", arms: "none", legs: "none", feet: "none", other: "none",
		avatar: "avatar_placeholder.png", icon: "icon_placeholder.png",
		atk: 1, def: 1, 
		bonus: {
			axe: 1,
			mine: 1
		}
	};
}

function fillCatDropdown() {
	var dropdown = $(".catdropdown");
	dropdown.empty();
	$.each(catList, function(key) {
		if (catList[key].busy === false) {
		dropdown.append($("<option />").val(key).text(catList[key].name)); }
	});
}

function loadCatList(filter) {
	$("#catList").html("");
	switch (filter) {
		case "all":
			for (var id in catList) {
				addCat(id);
			}
			break;
		case "busy":
			for (var id in catList) {
				if(catList[id].busy==true) {
					addCat(id);
				}	
			}
			break;
		case "free":
			for (var id in catList) {
				if(catList[id].busy==false) {
					addCat(id);
				}	
			}
			break;
	}
}

//--------------------------------------------- exploring -----------------------------------------------------------

function fillAreaDropdown() {
	var dropdown = $(".areadropdown");
	dropdown.empty();
	$.each(areaList, function(key) {
		dropdown.append($("<option />").val(key).text(areas[key].name));
	});
}

//activeExplorers holds zone, assigned cat
function sendExplorer(zone, catID) {
	if (population > busy && food>0) {
		activeExplorers[explorerID] = {zone : zone, cat : catID};
		$("#tasklist").append("<div class='task bordered' id='expl"+explorerID+"'>Explore - " + catList[catID].name + 
			"<button class='btn btn-default rightFloat' type='submit' onClick='endExplore()')>Return home</button><br>" +
			"Zone " + activeExplorers[explorerID].zone + "</div>");
		busy++;
		catList[catID].busy = true;
		catList[catID].task= "Explore- Zone " + activeExplorers[explorerID].zone;
		explorerID++;
		increaseFood(-1);
		$("#freeCats").html(population-busy);
		fillCatDropdown();
	}	
	else if (population<=busy){
		alert("All cats are busy!");
	}
	else if (food<1){
		alert("Not enough food!");
	}		
}

function explore(id) {
	var cat= activeExplorers[id].cat;
	var zone= activeExplorers[id].zone;
	var  num = Math.floor((Math.random() * 10) + 1); //test 1 in 10
	//var  num = Math.floor((Math.random() * (10*population) + 1); //more cats -> rare to find new cats
	//new cat found
	if (num === 1 && population<maxpop) {
		population++;
		$("#cats").html(population);
		$("#freeCats").html(population-busy);
		var name= randomCatName();
		newCat(name);
		addCat(population);
		updateLog("A wandering cat joined you!<br>");
		fillCatDropdown();		
	}
	num = Math.floor((Math.random() * 10) + 1); //test 1 in 10
	//num= Math.floor((Math.random() * (300*(filledZone[zone]+1) + 1); //each area in zone harder to find
	//new area found (only if space free in that zone)
	if (num === 1 && filledZone[zone]<areasPerZone[zone]) {
		//list of appropriate areas (level <= zone and not a duplicate)
		var possibleAreas = [];
		for (var ar in areas) {
			if (areas[ar].level <= zone && !(ar in areaList)) {
				possibleAreas.push(ar);
			}
		}
		var i = Math.floor((Math.random() * possibleAreas.length));
		newArea= possibleAreas[i];
		areaList[newArea] = zone;
		filledZone[zone]++;
		newAreaInfo(newArea);
		updateLog(catList[cat].name + " discovered a " + areas[newArea].name + " in Zone " + zone + "!<br>");
		fillAreaDropdown();

	}
}

function endExplore () {
	var parentdiv = $(event.target).parent("div");  //div belonging to button clicked
	var id = parentdiv.attr("id").substring(4); //div id is always "expl###" and we need the ###
	catList[activeExplorers[id].cat].busy = false;
	catList[activeExplorers[id].cat].task = "none";
	busy--;
	$("#freeCats").html(population-busy);
	delete activeExplorers[id];
	$(parentdiv).remove();
	fillCatDropdown();
}

//--------------------------------------------- tasks -----------------------------------------------------------

//task stores: area, assigned cat, travel status, main resource, total items collected, inventory size, items collected w/ amounts, repeats remaining
//traveling: 1= going, 0= not traveling, -1= leaving
function newTask(maparea, catID, repeat, foodUsed) {
	if (population > busy && food>=foodUsed) {
		increaseFood(-foodUsed);
		if ("mainResource" in areas[maparea]) {
			var mr = areas[maparea].mainResource;
			//eventually: check for hidden main resource & unlock conditions
		} else {
			var mr = 0;
		}
		activeTasks[taskID] = {place : maparea, cat : catID, traveling: 1, travelTicks: 0, mainResource : mr, collected : 0, max : bagSize, inventory : {}, repeat: repeat};
		$("#tasklist").append("<div class='task bordered' id='task"+taskID+"'>"+ areas[maparea].name + " - " + catList[catID].name +
			"<button class='btn btn-default rightFloat' type='submit' onClick='endTask()'>Traveling....</button><br>" +
			"Inventory: <span class='amt'>" + activeTasks[taskID].collected +"</span>/" + bagSize + " (<span class='found'></span>)</div>");
		$("#task"+taskID).find("button").prop('disabled', true);
		//add cancel link if repeating task
		if (repeat > 1) {  
			$("#task"+taskID).append("<br><a href='#' onClick='cancelTask()'>Cancel task (" + repeat + " trips remaining)</a>");
		}
		taskID++;
		busy++;
		catList[catID].busy = true;
		catList[catID].task= "Mine/Gather- " + areas[maparea].name;
		$("#freeCats").html(population-busy);
		fillCatDropdown();		
	}
	else if (population<=busy){
		alert("All cats are busy!");
	}
	else if (food<foodUsed){
		alert("Not enough food!");
	}	
}

//increase resource by amount collected, cat becomes not busy, remove task from activeTasks and DOM
function endTask() {
	var parentdiv = $(event.target).parent("div");  //div belonging to button clicked
	var id = parentdiv.attr("id").substring(4); //div id is always "task###" and we need the ###

	activeTasks[id].traveling = -1;
	activeTasks[id].repeat--;
	$(parentdiv).find("button").html("Returning home...."); 
	$(parentdiv).find("button").prop('disabled', true);
}

//stop repetitions and come home
function cancelTask() {
	var parentdiv = $(event.target).parent("div");  //div belonging to button clicked
	var id = parentdiv.attr("id").substring(4); //div id is always "task###" and we need the ###

	activeTasks[id].traveling = -1;
	activeTasks[id].repeat=0;
	$(parentdiv).find("button").html("Returning home...."); 
	$(parentdiv).find("button").prop('disabled', true);
}

//when cat is done traveling home
function catReturns(id) {
	for (item in activeTasks[id].inventory) {
		increaseResource(item, activeTasks[id].inventory[item]);
	}
	if (activeTasks[id].repeat > 0) {
		activeTasks[id].traveling = 1;
		updateLog(catList[activeTasks[id].cat].name + " dropped off their items and returned to gathering.<br>");
		activeTasks[id].inventory = {};
		activeTasks[id].collected = 0;
		$("#task"+id).find("a").text("Cancel task (" + activeTasks[id].repeat + " trips remaining)");
	}
	else {
		catList[activeTasks[id].cat].busy = false;
		catList[activeTasks[id].cat].task = "none";
		busy--;
		$("#freeCats").html(population-busy);
		delete activeTasks[id];
		$("#task"+id).remove();
		fillCatDropdown();
	}

}

//--------------------------------------------- research -----------------------------------------------------------

function newResearch(lvl, catID) {
		if (population > busy) {
		activeResearchers[researcherID] = {level : lvl, cat : catID};
		$("#tasklist").append("<div class='task bordered' id='res"+researcherID+"'>Research - " + catList[catID].name + 
			"<button class='btn btn-default rightFloat' type='submit' onClick='endResearch()')>Stop researching</button><br>" +
			"Knowledge Level " + activeResearchers[researcherID].level + "</div>");
		busy++;
		catList[catID].busy = true;
		catList[catID].task = "Research- Lv. " + activeResearchers[researcherID].level;
		researcherID++;
		$("#freeCats").html(population-busy);
		fillCatDropdown();
		
		sciencePerTick += baseScience * parseInt(catList[catID].lv); //high lvl cat earns more
	}	
	else {
		alert("All cats are busy!");
	}	
}

function doResearch() {
	//chance to unlock things
}

function endResearch () {
	var parentdiv = $(event.target).parent("div");  //div belonging to button clicked
	var id = parentdiv.attr("id").substring(3); //div id is always "res###" and we need the ###
	
	sciencePerTick -= baseScience * parseInt(catList[activeResearchers[id].cat].lv);
	
	catList[activeResearchers[id].cat].busy = false;
	catList[activeResearchers[id].cat].task = "none";
	busy--;
	$("#freeCats").html(population-busy);
	delete activeResearchers[id];
	$(parentdiv).remove();
	fillCatDropdown();
}


function loadResearch() {
	$("#researchList").html(""); //clear first
	for (var res in researchList) {
		var r = research[res];
		if (researchList[res] == 0) { //0=unlearned
			$("#researchList").append(
			"<div class='research bordered' id='res" + res + "'><b>" + r.name + "</b>" +
					"<button class='btn btn-primary rightFloat' type='submit' id='btn" + res + "' onClick='scienceLearned()'>Discover</button><br>" +
					"Cost: <span class='resCost'>" + r.cost + "</span> Science<br>" +
					"Effect: <span class='resDesc'>" + r.desc + "</span></div>");
		}
		
	}
}

function scienceLearned() {
	var parentdiv = $(event.target).parent("div");  //div belonging to button clicked
	var id = parentdiv.attr("id").substring(3); //div id is always "resName" and we need the Name
	
	if (science >= research[id].cost) {
		research[id].activate();
		science -= research[id].cost;
		$("#science").html(science);
		parentdiv.remove();
		researchList[id]=1; //set to 1 when learned
	}
	else {
		alert("Not enough science! You need " + (research[id].cost - science) + " points more. \n");
	}
	
}

//--------------------------------------------- projects -----------------------------------------------------------

//add all projects in projectList to DOM
function loadProjects() {
	for (var proj in projectList) {
		$("#projectList").append(
			"<div class='project bordered' id='proj" + proj + "'><b>" + proj + "</b><span class='rightFloat'>Level <span class='projLvl'>" + projectList[proj].level + "</span></span><br>" +
					"<button class='btn btn-primary rightFloat' type='submit' id='btn" + proj + "' onClick='buildProject()'>Build</button>" +
					"Cost: <span class='projCost'>" + printListItems(projectList[proj].cost) + "</span><br>" +
					"Effect: <span class='projEffect'>" + projects[proj].effectText + "</span></div>"
		);
	}
}

//add project with base cost to projectList
function makeProjectAvailable(projName) {
	projectList[projName] = {
		level: 0,
		cost: projects[projName].baseCost
	};
}

//start or upgrade a project
function buildProject() {
	var parentdiv = $(event.target).parent("div");  //div belonging to button clicked
	var id = parentdiv.attr("id").substring(4); //div id is always "projName" and we need the Name
	
	addProjectEffect(id);
	$(parentdiv).find(".projCost").html(printListItems(projectList[id].cost)); 
	$(parentdiv).find(".projLvl").html(projectList[id].level); 
}
              
function addProjectEffect(projName) {
	p = projectList[projName];

	if (hasAllResources(p.cost, true)) {
		p.level++;
		for (var r in p.cost) {
			increaseResource(r, -p.cost[r]);
			p.cost[r] = projects[projName].baseCost[r] * projects[projName].costRatio * p.level;  
		}
		projects[projName].effect();
		updateLog(projName + " was constructed!<br>");	
	}
}

function filterProjects(category) {
	if (category == "all") {
		$("#projectList > .project").each(function() {
			$(this).removeClass("hidden");
		})
	}
	else {
		$("#projectList > .project").each(function() {
			$(this).addClass("hidden");
			var id = $(this).attr("id").substring(4); //div id is always "projName" and we need the Name
			if (projects[id].category == category) {
				$(this).removeClass("hidden");
			}
		})
	}

}

//--------------------------------------------- crafting -----------------------------------------------------------

//add all craftables in craftingList to DOM
function loadCraftables() {
	for (var i=0;i<craftingList.length;i++) {
		var c = crafting[craftingList[i]];
		$("#craftingList").append(
			"<div class='craftable bordered' id='craft" + craftingList[i] + "'><b>" + c.name + "</b>" +
					"<div class='btn-group rightFloat' role='group'><button class='btn btn-default' type='submit' id='btn" + craftingList[i] + "' onClick='craft(1)'>Craft 1</button>" +
					"<button class='btn btn-default' type='submit' id='btn10" + craftingList[i] + "' onClick='craft(10)'>Craft 10</button>" +
					"<button class='btn btn-default' type='submit' id='btnAll" + craftingList[i] + "' onClick='craft(-1)'>Craft All</button></div><br>" +
					"Cost: <span class='craftCost'>" + printListItems(c.cost) + "</span><br>"
		)
	}
}

//add craftable to craftingList
function makeCraftingAvailable(craftName) {
	craftingList.push(craftName);
	var c = crafting[craftName];
		$("#craftingList").append(
			"<div class='craftable bordered' id='craft" + craftName + "'><b>" + c.name + "</b>" +
					"<div class='btn-group rightFloat' role='group'><button class='btn btn-default' type='submit' id='btn" + craftName + "' onClick='craft(1)'>Craft 1</button>" +
					"<button class='btn btn-default' type='submit' id='btn10" + craftName + "' onClick='craft(10)'>Craft 10</button>" +
					"<button class='btn btn-default' type='submit' id='btnAll" + craftName + "' onClick='craft(-1)'>Craft All</button></div><br>" +
					"Cost: <span class='craftCost'>" + printListItems(c.cost) + "</span><br>"
		)
}

//craft the given amount of an item
function craft(amt) {
	var parentdiv = $(event.target).parents(".craftable");  //div belonging to button clicked
	var item = parentdiv.attr("id").substring(5); //div id is always "craftName" and we need the Name
	
	//create item as often as given or until materials run out
	var created=0;
	
	if (amt==-1) {  //craft as many as possible
		while (hasAllResources(crafting[item].cost, false)) {
				createCraftable(item);
				created++;
			}
	}
	else { //craft given amount
		for (var i=0;i<amt;i++)
		{
			if (hasAllResources(crafting[item].cost, true)) {
				createCraftable(item);
				created++;
			}
			else {
				break;
			}
		}
	}

	if (created>0) {
		updateLog("Created " + created + " " + crafting[item].result + "!<br>");
	}


}

function createCraftable(item) {
	var type = crafting[item].category;
	switch (type) {
		case "materials": {
			resources[item]++;
			$("#"+item).html(resources[item]);
			for (var r in crafting[item].cost) {
				increaseResource(r, -crafting[item].cost[r]);
			}
			break;
		}
		case "food": {
			food++;
			$("#food").html(food);
			for (var r in crafting[item].cost) {
				increaseResource(r, -crafting[item].cost[r]);
			}
			break;
		}
		case "tools": {
			if (item in toolList) {
				toolList[item][0]++; //increase amount of tool owned
			}
			else{
				toolList[item]=[1,0]; //add tool to list
			}
			for (var r in crafting[item].cost) {
				increaseResource(r, -crafting[item].cost[r]);
			}
			break;
		}
		case "equipment": {
			if (item in equipmentList) {
				equipmentList[item][0]++; //increase amount of eqipment owned
			}
			else{
				equipmentList[item]=[1,0,equipment[item].type]; //add equipment to list
			}
			for (var r in crafting[item].cost) {
				increaseResource(r, -crafting[item].cost[r]);
			}
			break;
		}
		default:
			break;
	}
	updateResources();
}
              

function filterCrafting(category) {
	if (category == "all") {
		$("#craftingList > .craftable").each(function() {
			$(this).removeClass("hidden");
		})
	}
	else {
		$("#craftingList > .craftable").each(function() {
			$(this).addClass("hidden");
			var id = $(this).attr("id").substring(5); //div id is always "craftName" and we need the Name
			if (crafting[id].category == category) {
				$(this).removeClass("hidden");
			}
		})
	}

}

//--------------------------------------------- events -----------------------------------------------------------

//acquiring a resource for the first time, etc unlocks crafting/projects/research
function unlockWithTrigger(trigger) {
	switch(trigger) {
		case "reeds":
			researchList["writing"]=0;
			updateLog("You acquired reeds! Writing can now be researched!<br>");
			loadResearch();
			break;
		case "leather":
			researchList["leatherworking"]=0;
			updateLog("You acquired leather! Leatherworking can now be researched!<br>");
			loadResearch();
			break;
		case "coal":
			researchList["fire"]=0;
			updateLog("You acquired coal! Fire can now be researched!<br>");
			loadResearch();
			break;
	}
}

//--------------------------------------------- tools/equipment -----------------------------------------------------------

function loadToolList() {
	$("#inventory").html("");
	var tableString="";
	for (var item in toolList) {
		if (toolList[item][0] > 0) {
			tableString+=("<tr><td>"+crafting[item].name+"</td><td>"+toolList[item][0]+"</td><td>"+(toolList[item][0]-toolList[item][1])+"</td></tr>");
		}
	}
	$("#inventory").append("<table id='item-table'><thead><tr><th>Tool</th><th>Owned</th><th>Available</th></tr></thead><tbody>"
		+ tableString + "</tbody></table><br>");
}

function loadEquipList(type) {
	$("#inventory").html("");
	var tableString="";
	if (type=="all") {
		for (var item in equipmentList) {
			if (equipmentList[item][0] > 0) {
				tableString+=("<tr><td>"+crafting[item].name+"</td><td>"+equipmentList[item][0]+"</td><td>"+(equipmentList[item][0]-equipmentList[item][1])+"</td></tr>");
			}
		}
	}
	else {
		for (var item in equipmentList) {
			if (equipmentList[item][0] > 0 && equipmentList[item][2]==type) { //also compare types
				tableString+=("<tr><td>"+crafting[item].name+"</td><td>"+equipmentList[item][0]+"</td><td>"+(equipmentList[item][0]-equipmentList[item][1])+"</td></tr>");
			}
		}
	}
	$("#inventory").append("<table id='item-table'><thead><tr><th>Equipment</th><th>Owned</th><th>Available</th></tr></thead><tbody>"
	+ tableString + "</tbody></table><br>");
}

function loadEquipScreen() {
	var parentdiv = $(event.target).parents(".catInfo");  //div belonging to button clicked
	var id = parentdiv.attr("id").substring(3); //div id is always "catNum" and we need the Num
	$("#cat-id").val(id);  //hidden id that other functions can use
	
	//load cat stats
	$("#tempAvatar").attr("src", "img/"+catList[id].avatar);
	$("#cat-info").html("Name: <input type='text' id='catName' value='" +catList[id].name +"'>    Level: " + catList[id].lv +
		"<br>Attack: <span id='temp-atk'>" + catList[id].atk + "</span>    Defense: <span id='temp-def'>" + catList[id].def + "</span><hr>");
	
	//clear atk/def values
	$(".atk").each(function() {
		$(this).text("");
	});
	$(".def").each(function() {
		$(this).text("");
	});
	
	//fill dropdowns with inventory	
	var equips = ["tool", "head", "body", "arms", "legs", "feet", "other"];
	for (var i=0;i<7;i++) {
		var dropdown = $("#sel-"+equips[i]);
		var currentEquip = catList[id][equips[i]];  //currently equiped thing
		dropdown.empty();
		dropdown.append($("<option />").val("none").text("None"));
		if (currentEquip != "none") {
			dropdown.append($("<option />").val(currentEquip).text(crafting[currentEquip].name));  //always add current tool first
		}
		if (equips[i]=="tool") {
			$.each(toolList, function(key) {
				if (key!=currentEquip && (toolList[key][0]-toolList[key][1] > 0)) {  //check if available
					dropdown.append($("<option />").val(key).text(crafting[key].name));				
				}
			});
			dropdown.val(currentEquip);  //select current tool and show its stats
			if (currentEquip != "none") {
				dropdown.parents("tr").find("td").eq(2).html(tools[currentEquip].atk); 
				dropdown.parents("tr").find("td").eq(3).html(tools[currentEquip].def);
				toolList[currentEquip][1]--;  //temporarily set as not equipped
			}
		}
		else {
			$.each(equipmentList, function(key) {
				if (equipmentList[key][2] == equips[i] && key!=currentEquip && (equipmentList[key][0]-equipmentList[key][1] > 0)) {  //match type & check availability
					dropdown.append($("<option />").val(key).text(crafting[key].name));
				}
			});
			dropdown.val(currentEquip);
			if (currentEquip != "none") {
				dropdown.parents("tr").find("td").eq(2).html(equipment[currentEquip].atk); 
				dropdown.parents("tr").find("td").eq(3).html(equipment[currentEquip].def);
				equipmentList[currentEquip][1]--;  //temporarily set as not equipped
			}
		}
	}
}

//show equip values when a new one is selected
function updateEquipStats() {
	var type = $(event.target).attr("id").substring(4); //div id is always "sel-type" and we need the type
	var newEquip = $(event.target).val();
	if (newEquip=="none") {
		$(event.target).parents("tr").find("td").eq(2).html("");  //tool atk
		$(event.target).parents("tr").find("td").eq(3).html("");  //tool def
	}
	else {
		if(type=="tool") {
			$(event.target).parents("tr").find("td").eq(2).html(tools[newEquip].atk);  //tool atk
			$(event.target).parents("tr").find("td").eq(3).html(tools[newEquip].def);  //tool def
		} else {
			$(event.target).parents("tr").find("td").eq(2).html(equipment[newEquip].atk);  //tool atk
			$(event.target).parents("tr").find("td").eq(3).html(equipment[newEquip].def);  //tool def
		}
	}
	updateTempStats();
}

//atk and def on the equip screen updates as new items are selected
function updateTempStats() {
	var catID = $("#cat-id").val();
	var newAtk= Math.pow(parseInt(catList[catID].lv),2);  //base stats based on cat level, equipment added on top
	var newDef= Math.pow(parseInt(catList[catID].lv),2);

	$(".atk").each(function() {
		if ($(this).text() != "") {
			newAtk+=parseInt($(this).text());
		}
		
	});
	$(".def").each(function() {
		if ($(this).text() != "") {
			newDef+=parseInt($(this).text());
		}
	});
	
	$("#temp-atk").text(newAtk);
	$("#temp-def").text(newDef);
}

//save changes to cat and update tool list with equipped amount
function saveEquips() {
	var cat = catList[$("#cat-id").val()];
	var equips = ["tool", "head", "body", "arms", "legs", "feet", "other"];
	for (var i=0;i<7;i++) {
		var type = equips[i];
		var item = $("#sel-"+type).val();
		cat[type]= item;  //save selected item to cat
		if (type=="tool" && item!="none") {
			toolList[item][1]++; //incease "equipped" number
		}
		else if (item !="none") {
			equipmentList[item][1]++; //incease "equipped" number
		}
		
	}
	cat["atk"] = parseInt($("#temp-atk").text());
	cat["def"] = parseInt($("#temp-def").text());
	cat["name"] = $("#catName").val();
	loadCatList("all");
	fillCatDropdown();
}

//set original equipment back to "equipped" in list
function resetEquips() {
	var equips = ["tool", "head", "body", "arms", "legs", "feet", "other"];
	var cat = catList[$("#cat-id").val()];
	for (var i=0;i<7;i++) {
		var type = equips[i];
		if (type=="tool") {
			toolList[cat[type]]++;
		}
		else {
			equipmentList[cat[type]]++;
		}
	}
}

//--------------------------------------------- reference -----------------------------------------------------------

function loadAreaInfo() {
	for (var ar in areaList) {
		newAreaInfo(ar);
	}
}

function newAreaInfo(ar) {
	var zone = areaList[ar];
	$("#zone"+zone).removeClass("hidden");
	$("#zone"+zone).append(
		"<div class='bordered'><b>" + areas[ar].name + "</b><br>" +
		"Abundant resource: " + areas[ar].mainResource + " (amount: " + areas[ar].perTick + ")<br>" +
		"Rare resources: " + printSimpleList(areas[ar].rareResources) + "</div>"
	);
}

//--------------------------------------------- general -----------------------------------------------------------

function printListItems(list) {
	var string = "";
	for (var key in list) {
		string += key + ": " + list[key] + ", ";
	}
	string = string.substring(0,string.length - 2);
	return string;
}

function printSimpleList(list) {
	var string = "";
	for (var key in list) {
		string += key + ", ";
	}
	string = string.substring(0,string.length - 2);
	return string;
}


//pass list of items (item, weight), return item
// from http://stackoverflow.com/questions/3153534/i-need-random-algorithm-with-weighing-options-in-net/3153764
function getRandomEvent(possibleList) {
	var S = 0;
	for (var key in possibleList) {
		S += possibleList[key];
	}
	var R = Math.floor(Math.random() * S); 
	var T = 0;
	for (var key in possibleList) {
		T += possibleList[key];
		if (T > R) {
			return key;
		}
	}
}

function updateLog(newtext) {
	$("#log").append(newtext);
	$("#log").scrollTop($("#log")[0].scrollHeight);
}

