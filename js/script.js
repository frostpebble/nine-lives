$(document).ready(function() {
	
	//panel height
	$(".main-panel").height($("#container").height() -30);
	$("#stats-body").css("max-height", $(".main-panel").height() -93); //stats panel size (account for header/footer)
	$(window).resize(function(){
        $(".main-panel").height($("#container").height() -30);
		$("#stats-body").css("max-height", $(".main-panel").height() -93);
    });	
	
	//avatar
	$("#mainAvatar").attr("src", "img/"+mainAvatar);
	
	//log panel size, change w/ avatar collapse
	$("#log").height($(".main-panel").height() -340);
	$("#catimg").on('hidden.bs.collapse', function () {
		$("#log").height($("#log").height() +230);
	});
	$("#catimg").on('shown.bs.collapse', function () {
		$("#log").height($("#log").height() -230);
	});
	
	//clear log
	$("#clear-log").click(function() {
		$("#log").html("");
	});

	//tabbing
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	});
	
	//collapsable elements
	$(document).on('hidden.bs.collapse', function () {
		$("this > .togglearrow").removeClass("glyphicon-chevron-up");
		$("this > .togglearrow").addClass("glyphicon-chevron-down");
	});
	$(document).on('shown.bs.collapse', function () {
		$("this > .togglearrow").removeClass("glyphicon-chevron-down");
		$("this > .togglearrow").addClass("glyphicon-chevron-up");
	});
	
	//equipment screen events
	//$("#sel-tool").change(function() {updateToolStats();});
	$(".selEquip").change(function() {updateEquipStats();});
	
	//create first cat
	newCat(randomCatName());
	catList[1].avatar=mainAvatar;
	addCat(1);
	fillCatDropdown();
	
	//catList[1].tool="axe_wood";
	//catList[1].head="helm_iron";
	
	//areas
	fillAreaDropdown();
	loadAreaInfo();
	
	//available reasearch
	loadResearch();
	
	//available projects
	for (var p in projects) {  //show all projects for testing
		makeProjectAvailable(p);
	}
	loadProjects();
	
	//avavilable crafting
	/*for (var c in crafting) {  //show all craftables for testing
		makeCraftingAvailable(c);
	}*/
	loadCraftables();
	
//----------------------------------------------game loop (1000 ms)-------------------------------------------
	window.setInterval(function(){
	
	
	//make explorers do their thing	 
		for (var expID in activeExplorers) {
			explore(expID);
		}
		
	//make researchers do their thing	 
		for (var i = 0;i<Object.keys(activeResearchers).length;i++) {
			doResearch();
		}
		science += sciencePerTick;
		if (science > maxscience) 
			science = maxscience;
		$("#science").html(science);
		
	//increase inventory with main resource and roll for chance of rare resource		
		for (var i in activeTasks) {
			var here = activeTasks[i].place;
			var catname = catList[activeTasks[i].cat].name;
			
			//autimatically return if inventory full
			if (activeTasks[i].traveling == 0 && activeTasks[i].collected >= activeTasks[i].max) {
				activeTasks[i].traveling=-1;
				activeTasks[i].repeat--; //one round finished
			}

			//non-traveling cats: increase inventory
			if (activeTasks[i].traveling == 0 && activeTasks[i].collected < activeTasks[i].max) {
				if (activeTasks[i].mainResource != 0) {
					activeTasks[i].collected += areas[here].perTick;  
					if (activeTasks[i].mainResource in activeTasks[i].inventory)  {
						activeTasks[i].inventory[activeTasks[i].mainResource]+= areas[here].perTick;
					} else {
						activeTasks[i].inventory[activeTasks[i].mainResource] = areas[here].perTick;
					}
				}

				var  num = Math.floor((Math.random() * 10) + 1); 
				if (num === 9) {  //10% chance of rare item
					var item = getRandomEvent(areas[here].rareResources);
					//TODO: add number of thing found?
					activeTasks[i].collected ++;
					if (item in activeTasks[i].inventory) {
						activeTasks[i].inventory[item]++;
					} else {
						activeTasks[i].inventory[item] = 1;
					}
					//updateLog(catname + " found " + item + "!<br>");	
				}
				var inventory = printListItems(activeTasks[i].inventory);
				$("#task"+i).find(".found").html(inventory);	
				$("#task"+i).find(".amt").html(activeTasks[i].collected); 
				}
			
			//traveling cats: tick++, compare with needed time 
			else if (activeTasks[i].traveling == 1) {
				activeTasks[i].travelTicks++;
				if (activeTasks[i].travelTicks >= travelTime[areas[activeTasks[i].place].level]) {
					activeTasks[i].traveling = 0;
					//activeTasks[i].travelTicks = 0;
					$("#task"+i).find("button").html("Return home"); 
					$("#task"+i).find("button").prop('disabled', false);
				}
			}
			
			//returning cats: tick--, when 0, add inventory to resources
			//todo: chance of being attacked?
			else if (activeTasks[i].traveling == -1) {
				activeTasks[i].travelTicks--;
				if (activeTasks[i].travelTicks <= 0) {
					catReturns(i);
				}
			}
		}
		

		//update cats
		for (var id in catList) {
			if (catList[id].busy) { //xp only for cats with tasks
				catList[id].xp += xpPerTick; }
			var divid = "#cat"+id;
			$(divid).find(".catStatus").html(catList[id].task);
			$(divid).find(".catLv").html(catList[id].lv);
			$(divid).find(".catXp").html(catList[id].xp);
		}
		
		//update time
		tick++;
		if (tick===60) {
			tick=0;
			day++;
			$("#day").html(day);
		}

	}, 1000);

});

