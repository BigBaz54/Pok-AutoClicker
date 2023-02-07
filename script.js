// ==UserScript==
// @name         PokéAutoClicker
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  try to take over the world!
// @author       BigBaz
// @match        https://www.pokeclicker.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokeclicker.com
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // var notifsCont = document.getElementById('toaster');
    // notifsCont.style.width = '200px';

    /********************************************* NOTIFICATIONS REMOVER *********************************************/
    Mine.checkItemsRevealed = function() {
        for (let i = 0; i < Mine.rewardNumbers.length; i++) {
            if (Mine.checkItemRevealed(Mine.rewardNumbers[i])) {
                let amount = 1;
                const itemName = Underground.getMineItemById(Mine.rewardNumbers[i]).name;
                if (App.game.oakItems.isActive(OakItemType.Treasure_Scanner)) {
                    const giveDouble = App.game.oakItems.calculateBonus(OakItemType.Treasure_Scanner) / 100;
                    if (Rand.chance(giveDouble)) {
                        amount++;
                        if (Rand.chance(giveDouble)) {
                            amount++;
                            if (Rand.chance(giveDouble)) {
                                amount++;
                            }
                        }
                    }
                }
                App.game.oakItems.use(OakItemType.Treasure_Scanner);
                Underground.gainMineItem(Mine.rewardNumbers[i], amount);
                GameHelper.incrementObservable(Mine.itemsFound);
                GameHelper.incrementObservable(App.game.statistics.undergroundItemsFound, amount);
                Mine.rewardNumbers.splice(i, 1);
                i--;
                Mine.checkCompleted();
            }
        }
    }

    Mine.completed = function() {
        ko.cleanNode(document.getElementById('mineBody'));
        App.game.oakItems.use(OakItemType.Explosive_Charge);
        Mine.loadMine();
        ko.applyBindings(null, document.getElementById('mineBody'));
    }

    /********************************************* AUTOCLICKER *********************************************/
    var toggleStop = 0;
    var toggleBattle = 0;
    var toggleGym = 0;
    var toggleDungeon = 0;
    var battleInterval;
    var gymInterval;
    var dungeonInterval;

    var container = document.getElementById('left-column');
    var menu = document.createElement('div');
    menu.setAttribute('id', 'autoClicker');
    menu.classList.add('card');
    menu.classList.add('sortable');
    menu.classList.add('border-secondary');
    menu.classList.add('mb-3');
    container.prepend(menu);

    var titre = document.createElement('div');
    titre.style.fontWeight = '900';
    var contenu = document.createElement('div');
    titre.classList.add('card-header');
    titre.classList.add('p-0');
    titre.innerText = 'AutoClicker';
    contenu.classList.add('card-body');
    contenu.classList.add('p-0');
    contenu.classList.add('show');
    contenu.classList.add('table-responsive');
    menu.appendChild(titre);
    menu.appendChild(contenu);
    // console.log(menu);

    var table = document.createElement('table')
    table.classList.add('table');
    table.classList.add('table-sm');
    table.classList.add('m-0');
    var battle = document.createElement('td');
    battle.innerText = 'Battle';
    battle.setAttribute('id', 'battle');
    battle.setAttribute('onClick', 'toggleMode(this)');
    var gym = document.createElement('td');
    gym.innerText = 'Gym';
    gym.setAttribute('id', 'gym');
    gym.setAttribute('onClick', 'toggleMode(this)');
    var dungeon = document.createElement('td');
    dungeon.setAttribute('id', 'dungeon');
    dungeon.innerText = 'Donjon';
    dungeon.setAttribute('onClick', 'toggleMode(this)');
    var stop = document.createElement('td');
    stop.setAttribute('id', 'stop');
    stop.innerText = 'STOP';
    stop.setAttribute('onClick', 'toggleMode(this)');
    table.append(battle);
    table.append(gym);
    table.append(dungeon);
    table.append(stop);
    contenu.appendChild(table);

    unsafeWindow.toggleMode = (el) => {
        if (el.id=='battle') {
            toggleBattle = 1;
            battle.style.backgroundColor = 'lightgrey';
            toggleGym = 0;
            gym.style.backgroundColor = 'white';
            toggleDungeon = 0;
            dungeon.style.backgroundColor = 'white';
            toggleStop = 0;
            stop.style.backgroundColor = 'white';
            clearInterval(gymInterval);
            clearInterval(dungeonInterval);
            battleInterval = setInterval(unsafeWindow.battleClick, 50);
        }
        if (el.id=='gym') {
            toggleBattle = 0;
            battle.style.backgroundColor = 'white';
            toggleGym = 1;
            gym.style.backgroundColor = 'lightgrey';
            toggleDungeon = 0;
            dungeon.style.backgroundColor = 'white';
            toggleStop = 0;
            stop.style.backgroundColor = 'white';
            clearInterval(battleInterval);
            clearInterval(dungeonInterval);
            gymInterval = setInterval(unsafeWindow.gymClick, 50);
        }
        if (el.id=='dungeon') {
            toggleBattle = 0;
            battle.style.backgroundColor = 'white';
            toggleGym = 0;
            gym.style.backgroundColor = 'white';
            toggleDungeon = 1;
            dungeon.style.backgroundColor = 'lightgrey';
            toggleStop = 0;
            stop.style.backgroundColor = 'white';
            clearInterval(battleInterval);
            clearInterval(gymInterval);
            dungeonInterval = setInterval(unsafeWindow.dungeonClick, 50);
        }
        if (el.id=='stop') {
            toggleBattle = 0;
            battle.style.backgroundColor = 'white';
            toggleGym = 0;
            gym.style.backgroundColor = 'white';
            toggleDungeon = 0;
            dungeon.style.backgroundColor = 'white';
            toggleStop = 1;
            stop.style.backgroundColor = 'lightgrey';
            clearInterval(battleInterval);
            clearInterval(gymInterval);
            clearInterval(dungeonInterval);
        }
    }

    unsafeWindow.battleClick = () => {
        Battle.clickAttack();
    }

    unsafeWindow.gymClick = () => {
        GymBattle.clickAttack();
    }

    unsafeWindow.dungeonClick = () => {
    }

    /********************************************* FARM *********************************************/
    var menu2 = document.createElement('div');
    menu2.setAttribute('id', 'farming');
    menu2.classList.add('card');
    menu2.classList.add('sortable');
    menu2.classList.add('border-secondary');
    menu2.classList.add('mb-3');
    container.prepend(menu2);

    var titre2 = document.createElement('div');
    titre2.style.fontWeight = '900';
    var contenu2 = document.createElement('div');
    titre2.classList.add('card-header');
    titre2.classList.add('p-0');
    titre2.innerText = 'Farming';
    contenu2.classList.add('card-body');
    contenu2.classList.add('p-0');
    contenu2.classList.add('show');
    contenu2.classList.add('table-responsive');
    contenu2.setAttribute('onClick', 'toggleFarm()');
    menu2.appendChild(titre2);
    menu2.appendChild(contenu2);
    var farmText = "OFF"
    contenu2.innerText = farmText;

    var farmInterval;
    var harvestInterval;
    var toggleFarm = 0;
    unsafeWindow.toggleFarm = () => {
        toggleFarm = !toggleFarm;
        contenu2.innerText = (contenu2.innerText == "OFF") ? "ON" : "OFF";
        if (toggleFarm) {
            unsafeWindow.farmRoutine();
            farmInterval = setInterval(unsafeWindow.farmRoutine, 30100/*46000*/);
            /*harvestInterval = setInterval(unsafeWindow.autoHarvest, 120000);*/
        }
        else {
            clearInterval(farmInterval);
            clearInterval(harvestInterval);
        }
    }

     unsafeWindow.farmRoutine = () => {
        // App.game.farming.harvestAll();
        // App.game.farming.plantAll(FarmController.selectedBerry());

        App.game.farming.harvestAll();
        App.game.farming.plant(0 , 22); App.game.farming.plant(1 , 22); App.game.farming.plant(2 , 22); App.game.farming.plant(3 , 22); App.game.farming.plant(4 , 22);
        App.game.farming.plant(5 , 22); App.game.farming.plant(6 , 22); App.game.farming.plant(7 , 22); App.game.farming.plant(8 , 22); App.game.farming.plant(9 , 22);
        App.game.farming.plant(10, 22); App.game.farming.plant(11, 22); /*App.game.farming.plant(12, 22)*/; App.game.farming.plant(13, 22); App.game.farming.plant(14, 22);
        App.game.farming.plant(15, 22); App.game.farming.plant(16, 22); App.game.farming.plant(17, 22); App.game.farming.plant(18, 22); App.game.farming.plant(19, 22);
        App.game.farming.plant(20, 22); App.game.farming.plant(21, 22); App.game.farming.plant(22, 22); App.game.farming.plant(23, 22); App.game.farming.plant(24, 22);
    }

    unsafeWindow.autoHarvest = () => {

        App.game.farming.harvestAll();
    }

    /* unsafeWindow.farmRoutine = async () => {
        App.game.farming.plant(6 , 7);
        await new Promise(r => setTimeout(r, 206900));
        App.game.farming.plant(7, 6);
        await new Promise(r => setTimeout(r, 41400));
        App.game.farming.plant(11, 5);
        await new Promise(r => setTimeout(r, 82800));
        App.game.farming.plant(8, 4);
        await new Promise(r => setTimeout(r, 27600));
        App.game.farming.plant(16, 3);
        await new Promise(r => setTimeout(r, 13800));
        App.game.farming.plant(13, 2);
        await new Promise(r => setTimeout(r, 13800));
        App.game.farming.plant(17, 1);
        await new Promise(r => setTimeout(r, 6900));
        App.game.farming.plant(18, 0);
        await new Promise(r => setTimeout(r, 60000));
        App.game.farming.harvestAll();
    }*/

    /********************************************* EGGS *********************************************/
    var menu3 = document.createElement('div');
    menu3.setAttribute('id', 'hatching');
    menu3.classList.add('card');
    menu3.classList.add('sortable');
    menu3.classList.add('border-secondary');
    menu3.classList.add('mb-3');
    container.prepend(menu3);

    var titre3 = document.createElement('div');
    titre3.style.fontWeight = '900';
    var contenu3 = document.createElement('div');
    titre3.classList.add('card-header');
    titre3.classList.add('p-0');
    titre3.innerText = 'Hatching';
    contenu3.classList.add('card-body');
    contenu3.classList.add('p-0');
    contenu3.classList.add('show');
    contenu3.classList.add('table-responsive');
    contenu3.setAttribute('onClick', 'toggleEgg()');
    menu3.appendChild(titre3);
    menu3.appendChild(contenu3);
    var eggText = "OFF"
    contenu3.innerText = eggText;

    var eggInterval;
    var toggleEgg = 0;
    unsafeWindow.toggleEgg = () => {
        toggleEgg = !toggleEgg;
        contenu3.innerText = (contenu3.innerText == "OFF") ? "ON" : "OFF";
        if (toggleEgg) {
            eggInterval = setInterval(unsafeWindow.eggRoutine, 8100);
        }
        else {
            clearInterval(eggInterval);
        }
    }
    unsafeWindow.eggRoutine = () => {
        App.game.breeding.hatchPokemonEgg(0);
        App.game.breeding.hatchPokemonEgg(0);
        App.game.breeding.hatchPokemonEgg(0);
        App.game.breeding.hatchPokemonEgg(0);

        /*********************** NOTIF REMOVER ***********************/
        App.game.breeding.addPokemonToHatchery = function(pokemon) {
            // If they have a free eggslot, add the pokemon to the egg now
            if (this.hasFreeEggSlot()) {
                return this.gainPokemonEgg(pokemon);
            }
            // If they have a free queue, add the pokemon to the queue now
            if (this.hasFreeQueueSlot()) {
                return this.addToQueue(pokemon);
            }
            let message = 'You don\'t have any free egg slots';
            if (this.queueSlots()) {
                message += '<br/>Your queue is full';
            }
            return false;
        }
        /*************************************************************/

        App.game.breeding.addPokemonToHatchery(App.game.party.getPokemon(130));
        App.game.breeding.addPokemonToHatchery(App.game.party.getPokemon(26));
        App.game.breeding.addPokemonToHatchery(App.game.party.getPokemon(26));
        App.game.breeding.addPokemonToHatchery(App.game.party.getPokemon(26));
    }

    /********************************************* MINE *********************************************/
    var menu4 = document.createElement('div');
    menu4.setAttribute('id', 'mining');
    menu4.classList.add('card');
    menu4.classList.add('sortable');
    menu4.classList.add('border-secondary');
    menu4.classList.add('mb-3');
    container.prepend(menu4);

    var titre4 = document.createElement('div');
    titre4.style.fontWeight = '900';
    var contenu4 = document.createElement('div');
    titre4.classList.add('card-header');
    titre4.classList.add('p-0');
    titre4.innerText = 'Mining';
    contenu4.classList.add('card-body');
    contenu4.classList.add('p-0');
    contenu4.classList.add('show');
    contenu4.classList.add('table-responsive');
    contenu4.setAttribute('onClick', 'toggleMine()');
    menu4.appendChild(titre4);
    menu4.appendChild(contenu4);
    var mineText = "OFF"
    contenu4.innerText = mineText;

    var mineInterval;
    var toggleMine = 0;
    unsafeWindow.toggleMine = () => {
        toggleMine = !toggleMine;
        contenu4.innerText = (contenu4.innerText == "OFF") ? "ON" : "OFF";
        if (toggleMine) {
            mineInterval = setInterval(unsafeWindow.mineRoutine, 1);
        }
        else {
            clearInterval(mineInterval);
        }
    }
    unsafeWindow.mineRoutine = () => {
        App.game.underground.energy=50
        Mine.bomb();
    }

    /********************************************* QUESTS *********************************************/
    var qMenu = document.getElementById("questDisplayContainer");
    var boutonClone = qMenu.querySelectorAll(".btn-sm")[0].cloneNode(true);
    boutonClone.innerText = "Accept All";
    boutonClone.setAttribute('onClick', 'acceptAllQuests()');
    boutonClone.setAttribute('data-bind', "");
    boutonClone.style.right = "";
    boutonClone.style.left = "0px";
    qMenu.appendChild(boutonClone);

    unsafeWindow.acceptAllQuests = () => {
        App.game.quests.sortedQuestList()[0].begin();
        App.game.quests.sortedQuestList()[1].begin();
        App.game.quests.sortedQuestList()[2].begin();
        App.game.quests.sortedQuestList()[3].begin();
        App.game.quests.sortedQuestList()[4].begin();
        App.game.quests.sortedQuestList()[5].begin();
        App.game.quests.sortedQuestList()[6].begin();
        App.game.quests.sortedQuestList()[7].begin();
        App.game.quests.sortedQuestList()[8].begin();
        App.game.quests.sortedQuestList()[9].begin();
    }

    boutonClone = qMenu.querySelectorAll(".btn-sm")[0].cloneNode(true);
    boutonClone.innerText = "Auto";
    boutonClone.setAttribute('onClick', 'toggleQuest()');
    boutonClone.setAttribute('data-bind', "");
    boutonClone.style.right = "40px";
    boutonClone.style.fontSize = "10px";
    boutonClone.style.color = "black";
    boutonClone.style.backgroundColor = 'white';
    var qBtn = boutonClone;
    qMenu.appendChild(qBtn);

    var questInterval;
    var toggleQuest = 0;
    unsafeWindow.toggleQuest = () => {
        toggleQuest = !toggleQuest;
        if (toggleQuest) {
            questInterval = setInterval(unsafeWindow.questRoutine, 8000);
            qBtn.style.backgroundColor = 'lightgrey';
        }
        else {
            clearInterval(questInterval);
            qBtn.style.backgroundColor = 'white';
        }
    }
    unsafeWindow.questRoutine = () => {
        unsafeWindow.claimAllQuests();
        App.game.quests.refreshQuests(true, false);
        unsafeWindow.acceptAllQuests();
    }

    unsafeWindow.claimAllQuests = () => {
        App.game.quests.sortedQuestList()[0].claim();
        App.game.quests.sortedQuestList()[1].claim();
        App.game.quests.sortedQuestList()[2].claim();
        App.game.quests.sortedQuestList()[3].claim();
        App.game.quests.sortedQuestList()[4].claim();
        App.game.quests.sortedQuestList()[5].claim();
        App.game.quests.sortedQuestList()[6].claim();
        App.game.quests.sortedQuestList()[7].claim();
        App.game.quests.sortedQuestList()[8].claim();
        App.game.quests.sortedQuestList()[9].claim();
    }

    /********************************************* OAKITEMS *********************************************/
    var oMenu = document.getElementById("oakItemsContainer");
    boutonClone = oMenu.querySelectorAll(".btn-sm")[0].cloneNode(true);
    boutonClone.innerText = "Equip All";
    boutonClone.setAttribute('onClick', 'equipAllItems()');
    boutonClone.setAttribute('data-bind', "");
    boutonClone.setAttribute('data-toggle', "");
    boutonClone.style.right = "";
    boutonClone.style.left = "0px";
    oMenu.appendChild(boutonClone);

    unsafeWindow.equipAllItems = () => {
        App.game.oakItems['itemList'][0].isActive = true;
        App.game.oakItems['itemList'][1].isActive = true;
        App.game.oakItems['itemList'][2].isActive = true;
        App.game.oakItems['itemList'][3].isActive = true;
        App.game.oakItems['itemList'][4].isActive = true;
        App.game.oakItems['itemList'][5].isActive = true;
        App.game.oakItems['itemList'][6].isActive = true;
        App.game.oakItems['itemList'][7].isActive = true;
        App.game.oakItems['itemList'][8].isActive = true;
        App.game.oakItems['itemList'][9].isActive = true;
        App.game.oakItems['itemList'][10].isActive = true;
        App.game.oakItems['itemList'][11].isActive = true;
    }

}
)();