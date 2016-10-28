function checkCarDataValidity(b,k){if(void 0==b.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a});for(var e=0,c=0;c<k.Catalog.length;c++)if(k.Catalog[c].ItemId==b.ItemId){var g=
JSON.parse(k.Catalog[c].CustomData),e=parseInt(g.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a})}catch(l){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:e}}return"OK"}function generateFailObj(b){return{Result:"Failed",Message:b}}
function generateErrObj(b){return{Result:"Error",Message:b}}function generateInventoryChange(b,k){return{Result:"OK",Message:b,InventoryChange:k}}function checkBalance(b,k,a,e){if("SC"==b){if(a<k)return generateFailObj("NotEnoughSC")}else if(e<k)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(b){var k=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==k.Data.LeagueSubdivisions||void 0==k.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(k.Data.LeagueSubdivisions).leagues,k=JSON.parse(k.Data.SubdivisionTrophyRanges).subdivisions,e=0;e<a.length;e++)if(!(Number(b)>Number(k[a[e]])))return e}
function recalculateCarPr(b,k,a,e){var c=0,g;g=void 0==a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<g.Catalog.length;a++)if(g.Catalog[a].ItemId==k){a=JSON.parse(g.Catalog[a].CustomData);c+=parseInt(a.basePr)+parseInt(a.prPerLvl)*(parseInt(b.CarLvl)-1);break}e=void 0==e?server.GetCatalogItems({CatalogVersion:"PartCards"}):e;b={Exhaust:b.ExhaustLvl,Engine:b.EngineLvl,Gearbox:b.GearboxLvl,Suspension:b.SuspensionLvl,Tires:b.TiresLvl,Turbo:b.TurboLvl};for(a=0;a<e.Catalog.length;a++)k=
JSON.parse(e.Catalog[a].CustomData),c+=parseInt(k.basePr)+parseInt(k.prPerLvl)*b[e.Catalog[a].ItemId];return c}
function GenerateBlackMarket(b){var k=1,a=server.GetPlayerStatistics({PlayFabId:b,StatisticNames:["League"]});0!=a.Statistics.length&&(k=a.Statistics[0].Value.toString());var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var c=Math.floor(Math.random()*e.Catalog.length),g=JSON.parse(e.Catalog[c].CustomData);if(void 0==g)return generateErrObj("Part card "+e.Catalog[d].ItemId+" has no custom data.");a.BMItem0=e.Catalog[c].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+
"_0_"+g.BMpriceIncrPerBuy;var l=Math.floor(Math.random()*e.Catalog.length);l==c&&(l=e.Catalog.length-c-1);g=JSON.parse(e.Catalog[l].CustomData);if(void 0==g)return generateErrObj("Part card "+e.Catalog[d].ItemId+" has no custom data.");a.BMItem1=e.Catalog[l].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+"_0_"+g.BMpriceIncrPerBuy;for(var e=server.GetCatalogItems({CatalogVersion:"CarCards"}),g=[],l=[],d=0;d<e.Catalog.length;d++){c=JSON.parse(e.Catalog[d].CustomData);if(void 0==c)return generateErrObj("Car card "+
e.Catalog[d].ItemId+" has no custom data.");c.unlockedAtRank>k+1||("false"==c.rareCar?g.push(e.Catalog[d].ItemId+"_"+c.BMCurrType+"_"+c.BMbasePrice+"_0_"+c.BMpriceIncrPerBuy):l.push(e.Catalog[d].ItemId+"_"+c.BMCurrType+"_"+c.BMbasePrice+"_0_"+c.BMpriceIncrPerBuy))}0>=g.length?(a.BMItem2=l[Math.floor(Math.random()*l.length)],a.BMItem3=l[Math.floor(Math.random()*l.length)]):0>=l.length?(a.BMItem2=g[Math.floor(Math.random()*g.length)],a.BMItem3=g[Math.floor(Math.random()*g.length)]):(a.BMItem2=g[Math.floor(Math.random()*
g.length)],a.BMItem3=l[Math.floor(Math.random()*l.length)]);server.UpdateUserInternalData({PlayFabId:b,Data:a});k=[];k.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:b,Keys:k});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes);return a}
function GetCurrentBlackMarket(b,k){var a={},e=new Date,c=[];c.push("BlackMarketResetMinutes");c=server.GetTitleData({PlayFabId:b,Keys:c});a.BMTime=60*parseInt(c.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-k.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)a["BMItem"+e]=k.Data["BMItem"+e].Value;return a}function GetValueFromStatistics(b,k,a){for(var e,c=0;c<b.length;c++)b[c].StatisticName===k&&(e=b[c]);return void 0===e?void 0!==a?a:0:Number(e.Value)}
function getCatalogItem(b,k){for(var a=server.GetCatalogItems({CatalogVersion:b}),e=0;e<a.Catalog.length;e++)if(a.Catalog[e].ItemId===ItemId)return a.Catalog[e]}
handlers.buyChest=function(b,k){log.debug("Chest ID"+b.chestId);var a=getCatalogItem("Chests",b.chestId);if(!a)return generateFailObj("Invalid chest id: "+b.chestId);log.debug("Chest ID 2"+a.ItemId);a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(b.curr,b.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<b.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.cost}),e={};
e[a.VirtualCurrency]=a.Balance;return generateInventoryChange("ChestBought",{VirtualCurrency:e})}return generateInventoryChange("ChestBought",{})};
handlers.endGame=function(b,k){var a="01",e,c="0";"rWin"==b.outcome&&(c="1");var g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=g.Statistics.length&&(e=g.Statistics[0].Value.toString(),a=Number(e).toString(2));var g=0,l;l=Array(a.length);for(var d=0;d<l.length-1;d++)l[d]=a[d];l[l.length-1]=c;a=l;c=a.length;for(d=0;d<a.length;d++)"1"==a[d]&&g++;l=Math.round(g/c*100);var f=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),c=0,h,g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});0!=g.Statistics.length&&(c=g.Statistics[0].Value,log.debug("getting trophy count "+g.Statistics[0].Value));h=c=Number(c);g=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});log.debug("pDat.Data[trophyLose] "+g.Data.trophyLose.Value);log.debug("pDat.Data[trophyWin] "+g.Data.trophyWin.Value);g=void 0==g.Data.trophyLose||void 0==g.Data.trophyWin?45:Number(g.Data.trophyLose.Value)+Number(g.Data.trophyWin.Value);"rWin"==b.outcome&&
(c+=g);log.debug("trophies change: "+h+" => "+c);g=calculateLeague(c);for(d=e=0;d<a.length;d++)"1"==a[d]&&(e+=Math.pow(2,d));d=[];d.push({StatisticName:"WinLoss",Version:"0",Value:e});a={StatisticName:"TrophyCount",Version:"0",Value:c};d.push(a);a={StatisticName:"League",Version:"0",Value:g};d.push(a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:d});if("rOot"==b.outcome){var r={TrophyCount:c,League:g};return{Result:r}}a=JSON.parse(f.Data.SubdivisionTrophyRanges);for(d=0;d<a.subdivisions.length;d++)if(h<
a.subdivisions[d]){r=d;break}d=[];d.push({Key:b.envIndex+"_"+b.courseIndex+"_RecPos",Value:b.recordingPos});d.push({Key:b.envIndex+"_"+b.courseIndex+"_RecRot",Value:b.recordingRot});d.push({Key:b.envIndex+"_"+b.courseIndex+"_RecHeader",Value:b.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:d});d=server.GetTitleInternalData({Key:"RecSubDivision"+r}).Data["RecSubDivision"+r];if(void 0==d)a=[],l={wl:l,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId},a.push(l);else{a=
JSON.parse(d);l={wl:l,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId};f=!1;for(d=h=0;d<a.length;d++)a[d].uId==currentPlayerId&&h++;if(2<h)return r={TrophyCount:c,League:g},{Result:r};for(d=0;d<a.length;d++)if(a[d].e==b.envIndex&&a[d].c==b.courseIndex){f=!0;a[d]=l;if(1==a.length)break;if(0<d)if(a[d].wl>a[d-1].wl){if(d==a.length-1)break;for(h=d+1;h<a.length;h++)if(a[h-1].wl>a[h].wl)e=a[h],a[h]=a[h-1],a[h-1]=e;else break}else for(h=d-1;0<=h;h--)if(a[h+1].wl<a[h].wl)e=a[h],a[h]=a[h+1],a[h+1]=e;else break;
else for(h=d+1;h<a.length;h++)if(a[h-1].wl>a[h].wl)e=a[h],a[h]=a[h-1],a[h-1]=e;else break}0==f&&a.push(l)}d=JSON.stringify(a);server.SetTitleInternalData({Key:"RecSubDivision"+r,Value:d});r={TrophyCount:c,League:g};return{Result:r}};
function UpdateExperience(b,k,a,e,c,g){b=server.GetCatalogItems({CatalogVersion:b});k=JSON.parse(b.Catalog[k].CustomData)[a];if(isNaN(Number(k)))a=Number(k.length),e>=a&&(e=a-1),e=Number(k[e]);else if(e=Number(k),0===e)return 0;g=g||server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience"]}).Statistics;g=GetValueFromStatistics(g,"Experience",0)+e;if(!c)return g;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:[{StatisticName:"Experience",Version:"0",Value:g}]})}
handlers.getServerTime=function(b,k){return{time:new Date}};handlers.giveMoney=function(b){b=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.amount});var k={};k[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:k}}};
handlers.grantItems=function(b){for(var k=server.GetUserInventory({PlayFabId:currentPlayerId}),a,e=!1,c=0;c<k.Inventory.length;c++)if(k.Inventory[c].ItemId==b.itemId&&k.Inventory[c].CatalogVersion==b.catalogId){a=void 0==k.Inventory[c].CustomData?b.amount:void 0==k.Inventory[c].CustomData.Amount?b.amount:isNaN(Number(k.Inventory[c].CustomData.Amount))?b.amount:Number(k.Inventory[c].CustomData.Amount)+b.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.Inventory[c].ItemInstanceId,
Data:a});e=!0;break}0==e&&(k=[],k.push(b.itemId),k=server.GrantItemsToUser({CatalogVersion:b.catalogId,PlayFabId:currentPlayerId,ItemIds:k}),a={Amount:b.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:b.itemId,CatalogVersion:b.catalogId,CustomData:a}]}}};
handlers.initServerData=function(b){b=[];var k={StatisticName:"TrophyCount",Version:"0",Value:"0"};b.push(k);k={StatisticName:"League",Version:"0",Value:"0"};b.push(k);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var k={0:"Owned"},a=0;a<b.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[a].ItemInstanceId,Data:k});b=[];b.push("FordFocus");b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b});k={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k});k={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k});k={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k});k=[];k.push("Engine");k=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:k});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});k={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k})};
handlers.openChest=function(b,k){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<b.currCost){if("OK"!=checkBalance(b.currType,b.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:b.currCost})}for(var e in b.currencyReq)0<b.currencyReq[e]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:e,Amount:b.currencyReq[e]});var c;
for(e in b.carCardsRequest)if(b.carCardsRequest.hasOwnProperty(e)){c=!1;for(var g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==e&&"CarCards"==a.Inventory[g].CatalogVersion){c=void 0==a.Inventory[g].CustomData?Number(b.carCardsRequest[e]):void 0==a.Inventory[g].CustomData.Amount?Number(b.carCardsRequest[e]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.carCardsRequest[e]):Number(a.Inventory[g].CustomData.Amount)+Number(b.carCardsRequest[e]);c={Amount:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:c});c=!0;break}0==c&&(g=[e],g=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:g}),c={Amount:b.carCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:c}))}for(e in b.partCardsRequest)if(b.partCardsRequest.hasOwnProperty(e)){c=!1;for(g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==e&&"PartCards"==a.Inventory[g].CatalogVersion){c=
void 0==a.Inventory[g].CustomData?Number(b.partCardsRequest[e]):void 0==a.Inventory[g].CustomData.Amount?Number(b.partCardsRequest[e]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.partCardsRequest[e]):Number(a.Inventory[g].CustomData.Amount)+Number(b.partCardsRequest[e]);c={Amount:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:c});c=!0;break}0==c&&(g=[e],g=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,
ItemIds:g}),c={Amount:b.partCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:c}))}return{Result:"OK",Message:"InventoryUpdated",InventoryChange:server.GetUserInventory({PlayFabId:currentPlayerId})}};
handlers.purchaseBMItem=function(b,k){if(0>b.itemId||3<b.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+b.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),e=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+b.itemId].Value.split("_"),c=e.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");var g;g=2>b.itemId?"PartCards":"CarCards";var l=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),
c=checkBalance(a[1],l,c,c);if("OK"!=c)return c;for(var d,f,c=0;c<e.Inventory.length;c++)if(e.Inventory[c].ItemId==a[0]&&e.Inventory[c].CatalogVersion==g){d=e.Inventory[c].ItemInstanceId;void 0===e.Inventory[c].CustomData?f={Amount:1}:void 0===e.Inventory[c].CustomData.Amount?f={Amount:1}:(f=Number(e.Inventory[c].CustomData.Amount)+1,isNaN(f)&&(f=1),f={Amount:f});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:f});break}void 0===d&&(d=[],d.push(a[0]),d=server.GrantItemsToUser({CatalogVersion:g,
PlayFabId:currentPlayerId,ItemIds:d}).ItemGrantResults[0].ItemInstanceId,void 0===d?generateErrObj("grantRequest denied"):(f={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:f})));d=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:l});l=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];e={};e["BMItem"+b.itemId]=l;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:e});f=[{ItemId:a[0],CatalogVersion:g,
CustomData:f}];g={};g[d.VirtualCurrency]=d.Balance;a=b.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];c={Inventory:f,VirtualCurrency:g};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:c,BMItemChange:a}};
handlers.purchaseItems=function(b,k){var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=a.VirtualCurrency.SC,c=a.VirtualCurrency.HC;switch(b.purchaseType){case "carUpgrade":for(var g=server.GetCatalogItems({CatalogVersion:"CarCards"}),l=!1,d,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarsProgress"==a.Inventory[f].CatalogVersion){l=!0;d=a.Inventory[f];break}for(var h,f=0;f<g.Catalog.length;f++)if(g.Catalog[f].ItemId==b.carId){h=JSON.parse(g.Catalog[f].CustomData);break}if(void 0===
h)return log.error("cardInfo undefined!"),h={Result:"Error",Message:"CardNotFoundForCarwithID: "+b.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(!0===l){var r=parseInt(d.CustomData.CarLvl)+1,t=parseInt(h.baseCurrCost)+parseInt(d.CustomData.CarLvl)*parseInt(h.currCostPerLvl),c=checkBalance(h.currType,t,e,c);if("OK"!=c)return c;c=parseInt(h.baseCardCost)+parseInt(d.CustomData.CarLvl)*parseInt(h.cardCostPerLvl);d.CustomData.CarLvl=r;for(var l=
!1,m,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarCards"==a.Inventory[f].CatalogVersion){l=!0;try{if(void 0===a.Inventory[f].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");if(void 0===a.Inventory[f].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(a.Inventory[f].CustomData.Amount)>=c)a.Inventory[f].CustomData.Amount-=c,m={Amount:a.Inventory[f].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:m});else return generateFailObj("Insufficient cards for real: "+a.Inventory[f].CustomData.Amount+" vs "+c)}catch(w){return generateFailObj("Insufficient cards")}break}if(!1===l)return generateFailObj("No cards found");a=recalculateCarPr(d.CustomData,d.ItemId,g,void 0);f={CarLvl:r,Pr:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemInstanceId,Data:f});var n;0<t&&(n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:h.currType,Amount:t}));a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:m},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:f}];c={};f={Inventory:a};void 0!=n&&(c[n.VirtualCurrency]=n.Balance,f.VirtualCurrency=c);UpdateExperience("Balancing",0,"Car_"+h.rarity,r,!0);h={Result:"OK",Message:"InventoryUpdate",InventoryChange:f}}else{for(var l=!1,z,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarCards"==a.Inventory[f].CatalogVersion){l=!0;try{if(void 0==
a.Inventory[f].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0==a.Inventory[f].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");if(Number(a.Inventory[f].CustomData.Amount)>=Number(h.baseCardCost))z=a.Inventory[f].ItemInstanceId,a.Inventory[f].CustomData.Amount-=h.baseCardCost,m={Amount:a.Inventory[f].CustomData.Amount};else return generateFailObj("Insufficient cards: "+a.Inventory[f].CustomData.Amount+" vs "+h.baseCardCost+".")}catch(w){return generateFailObj("Insufficient cards: "+
w)}break}if(0==l)return generateFailObj("No cards found");c=checkBalance(h.currType,h.baseCurrCost,e,c);if("OK"!=c)return c;f=[];f.push(b.carId);c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:f});if(0==c.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:z,Data:m});0<h.baseCurrCost&&(n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:h.baseCurrCost}));f={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f});f={TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f});f={PlatesId:"0",WindshieldId:"0",Pr:h.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f});for(var e=c=!1,p,f=0;f<a.Inventory.length;f++)if("PaintJobs"==a.Inventory[f].ItemId){e=!0;void 0!=a.Inventory[f].CustomData?h.defaultPaintID in a.Inventory[f].CustomData?c=!0:(p={},p[h.defaultPaintID]="Owned"):(p={},p[h.defaultPaintID]="Owned");void 0!=p&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:p});break}0==e&&(paintToGive=[],paintToGive.push("PaintJobs"),a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),p={},p[h.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:p}));f={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,
DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:h.basePr};a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:m},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:f}];0==c&&(f={},f[h.defaultPaintID]="Owned",a.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:f}));c={};f={Inventory:a};void 0!=n&&(c[n.VirtualCurrency]=n.Balance,f.VirtualCurrency=c);UpdateExperience("Balancing",0,"Car_"+h.rarity,1,!0);h={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:f}}return h;
case "partUpgrade":m=server.GetCatalogItems({CatalogVersion:"CarsProgress"});p=!1;for(f=0;f<m.Catalog.length;f++)if(m.Catalog[f].ItemId==b.carId){p=!0;break}if(0==p)return log.error("invalid car ID"),h={Result:"Error",Message:"car with ID: "+b.carId+" not found in catalog."};p=server.GetCatalogItems({CatalogVersion:"PartCards"});m=!1;for(f=0;f<p.Catalog.length;f++)if(p.Catalog[f].ItemId==b.partId){h=JSON.parse(p.Catalog[f].CustomData);m=!0;break}if(0==m)return log.error("invalid part ID"),h={Result:"Error",
Message:"part with ID: "+b.partId+" not found in catalog."};l=!1;for(f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarsProgress"==a.Inventory[f].CatalogVersion){l=!0;d=a.Inventory[f];break}if(0==l)return generateFailObj("car with ID: "+b.carId+" not found in user inventory.");z=!1;for(f=m=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.partId&&"PartCards"==a.Inventory[f].CatalogVersion){z=!0;var r={},u={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",
Tires:"TiresLvl",Turbo:"TurboLvl"},l=parseInt(h.baseCardCost,10)+parseInt(d.CustomData[u[b.partId]],10)*parseInt(h.cardCostPerLvl,10);m=parseInt(d.CustomData[u[b.partId]])+1;t=Number(h.baseCurrCost)+parseInt(d.CustomData[u[b.partId]])*Number(h.currCostPerLvl);r[u[b.partId]]=m;d.CustomData[u[b.partId]]=m;c=checkBalance(h.currType,t,e,c);if("OK"!=c)return c;try{if(void 0!=a.Inventory[f].CustomData&&void 0!=a.Inventory[f].CustomData.Amount&&a.Inventory[f].CustomData.Amount>=l)a.Inventory[f].CustomData.Amount-=
l,g={Amount:a.Inventory[f].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:g});else return generateFailObj("Insufficient cards")}catch(w){return generateFailObj("Insufficient cards")}break}if(0==z)return generateFailObj("Part not found");0<t&&(n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:t}));a=recalculateCarPr(d.CustomData,d.ItemId,void 0,p);r.Pr=a;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:d.ItemInstanceId,Data:r});a=[{ItemId:b.partId,CatalogVersion:"PartCards",CustomData:g},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:r}];c={};f={Inventory:a};void 0!=n&&(c[n.VirtualCurrency]=n.Balance,f.VirtualCurrency=c);UpdateExperience("Balancing",0,"Parts_"+h.rarity,m,!0);return h={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:f};case "custPurchase":d=server.GetCatalogItems({CatalogVersion:"Customization"});h=0;n="SC";for(f=0;f<d.Catalog.length;f++)if(d.Catalog[f].ItemId==
b.custId){u=d.Catalog[f];h=JSON.parse(d.Catalog[f].CustomData);f=b.custVal+",Cost";n=h[b.custVal+",Curr"];h=h[f];c=checkBalance(n,h,e,c);if("OK"!=c)return c;break}if(void 0==u)return log.error("Customization does not exist in catalog"),h={Result:"Error",Message:"Customization does not exist in catalog."};for(var q,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.custId){q=a.Inventory[f];l=a.Inventory[f].ItemInstanceId;if(void 0!=q.CustomData&&String(b.custVal)in q.CustomData)return generateFailObj("User already has this customization.");
break}if(void 0==q){log.info("user doesn't have customization category. Granting ... ");f=[];f.push(b.custId);a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:f});if(0==a.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),h={Result:"Error",Message:"something went wrong while granting user customization class object."};l=a.ItemGrantResults[0].ItemInstanceId}a={};a[String(b.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:l,Data:a});a=[{ItemId:b.custId,CatalogVersion:"Customization",CustomData:a}];0<h?(n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:n,Amount:h}),c={},c[n.VirtualCurrency]=n.Balance,f={Inventory:a,VirtualCurrency:c}):f={Inventory:a};return h={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:f};case "softCurrencyPurchase":n=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});a=!1;for(f=e=0;f<n.Catalog.length;f++)if(n.Catalog[f].ItemId==
b.packId){e=n.Catalog[f].VirtualCurrencyPrices.HC;h=JSON.parse(n.Catalog[f].CustomData);a=!0;break}if(0==a)return h={Result:"Error",Message:"pack with ID: "+b.packId+" not found in catalog."};if(0>=e)return h={Result:"Error",Message:"pack with ID: "+b.packId+" shouldn't have negative cost."};if(e>c)return generateFailObj("Not enough HC.");n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:e});h=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",
Amount:h.quantity});c={};c[h.VirtualCurrency]=h.Balance;c[n.VirtualCurrency]=n.Balance;return h={Result:"OK",Message:"SoftCurrencyPurchased",InventoryChange:{VirtualCurrency:c}};default:log.debug("invalid purchase parameter")}};handlers.requestCurrency=function(b){return{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(b){b=server.GetUserInventory({PlayFabId:currentPlayerId});for(var k=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),e=!1,c=0;c<b.Inventory.length;c++)if("CarsProgress"==b.Inventory[c].CatalogVersion){var e=!0,g=checkCarDataValidity(b.Inventory[c],k);if("PlayFabError"==g||void 0===g)return generateErrObj("PlayfabError");"OK"==g?log.debug("Data for "+b.Inventory[c].ItemId+" OK"):b.Inventory[c].CustomData=g;
b.Inventory[c].CustomData.Pr=recalculateCarPr(b.Inventory[c].CustomData,b.Inventory[c].ItemId,k,a);g={};g.Pr=b.Inventory[c].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[c].ItemInstanceId,Data:g})}return!1===e?(b=[],b.push("FordFocus"),b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b}),k={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k}),k={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k}),k={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k}),generateErrObj("UserHasNoCars ... reiniting")):b};
handlers.retrieveBlackMarket=function(b,k){var a=[];a.push("BMTime");for(var e=0;4>e;e++)a.push("BMItem"+e);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0===a.Data.BMTime)return GenerateBlackMarket(currentPlayerId);var e=new Date,c=[];c.push("BlackMarketResetMinutes");c=server.GetTitleData({PlayFabId:currentPlayerId,Keys:c});if(!0===b.reset){a="HC";e=200;c=server.GetTitleData({Keys:["BlackMarketResetCost"]});void 0!==c.Data.BlackMarketResetCost&&(e=c.Data.BlackMarketResetCost.split("_"),
a=e[0],e=Number(e[1]));if(0<e){c=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,e,c.VirtualCurrency.SC,c.VirtualCurrency.HC))return generateFailObj("not enough money");e=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:e});a=GenerateBlackMarket(currentPlayerId);c={};c[e.VirtualCurrency]=e.Balance;e={VirtualCurrency:c};a.InventoryChange=e;return a}return GenerateBlackMarket(currentPlayerId)}return e.getTime()-parseInt(a.Data.BMTime.Value)>
6E4*parseInt(c.Data.BlackMarketResetMinutes)?GenerateBlackMarket(currentPlayerId):GetCurrentBlackMarket(currentPlayerId,a)};
handlers.startGame=function(b,k){var a="10",e,c=50,g,l=0;g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=g.Statistics.length){e=g.Statistics[0].Value.toString();a=Number(e).toString(2);g=a.length;for(var d=0;d<a.length;d++)"1"==a[d]&&l++;c=Math.round(l/g*100)}a+="0";20<a.length&&(a=a.slice(1));var f=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges","TrophyGainRange","TrophyLoseRange"]});g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});l=0;0!=g.Statistics.length&&(l=g.Statistics[0].Value);var l=Number(l),h=JSON.parse(f.Data.SubdivisionTrophyRanges),r=JSON.parse(f.Data.LeagueSubdivisions),t=43,m=43,n;g=f.Data.TrophyGainRange.split("_");n=f.Data.TrophyLoseRange.split("_");e=Number(g[0]);g=Number(g[1]);for(var f=Number(n[0]),z=Number(n[1]),d=0;d<h.subdivisions.length;d++)if(l<Number(h.subdivisions[d])){t=d;d<h.subdivisions.length-1&&(m=d+1);break}n=Number(h.subdivisions[m])-Number(h.subdivisions[t]);
log.debug("nextSubDivision "+m+" subDivision "+t);log.debug(" sdvalParsed.subdivisions[nextSubDivision] "+h.subdivisions[m]+" sdvalParsed.subdivisions[subDivision] "+h.subdivisions[t]);0>=n&&(n=400);log.debug("subDivisionRange "+n);var p=server.GetTitleInternalData({Keys:"RecSubDivision"+t}).Data["RecSubDivision"+t],m=!1;void 0==p&&(m=!0);var u,q=t="noop",w,d=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["lastOpp"]});if(void 0==d.Data||void 0==d.Data.lastOpp)q=t="noop";else for(w=d.Data.lastOpp.Value.split(","),
d=0;d<w.length;d++)0==d&&(t=w[d]),1==d&&(q=w[d]);u=0==m?JSON.parse(p):[];var C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];15>u.length&&(m=!0);var D=Array(u.length),B=0,p=Array(u.length);w=0;for(var A=Array(u.length),x=0,d=0;d<u.length;d++)1==m&&(C[5*Number(u[d].e)+Number(u[d].c)]=1),u[d].uId!=currentPlayerId&&(D[B]=u[d],B++,u[d].uId!=t&&(p[w]=u[d],w++,u[d].uId!=q&&(A[x]=u[d],x++)));if(1==m){for(d=q=m=0;d<C.length;d++)if(0==C[d]){m=Math.floor(d/5);q=d%5;break}d=server.GetTitleData({Keys:"MasterUser"});if(void 0!=
d.Data.MasterUser&&(d=server.GetUserReadOnlyData({PlayFabId:d.Data.MasterUser,Keys:[m+"_"+q+"_RecPos",m+"_"+q+"_RecRot",m+"_"+q+"_RecHeader"]}),void 0!=d.Data&&void 0!=d.Data[m+"_"+q+"_RecPos"]&&void 0!=d.Data[m+"_"+q+"_RecRot"]&&void 0!=d.Data[m+"_"+q+"_RecHeader"])){t=!0;0==l?(l=g,t=!1):l-=f;1>=l&&(l=1);e=parseInt(a,2);var a=[],y={StatisticName:"WinLoss",Version:"0",Value:e};a.push(y);l={StatisticName:"TrophyCount",Version:"0",Value:l};a.push(l);l={StatisticName:"League",Version:"0",Value:v};a.push(l);
server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:g,trophyLose:f};0==t&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:"Default",PosData:d.Data[m+"_"+q+"_RecPos"].Value,RotData:d.Data[m+"_"+q+"_RecRot"].Value,HeaderData:d.Data[m+"_"+q+"_RecHeader"].Value,TrophyLose:f,TrophyWin:g,Opp:"Mniezo"}}}if(0==B)return generateErrObj("no valid recording found for this subdivision");v=D;m=B;0<w&&(m=
w,v=p);0<x&&(m=x,v=A);p=m-1;for(d=0;d<m;d++)if(v[d].wl>c){p=d;break}c=Math.min(m,3);q=Array(c);for(d=0;d<c;d++)q[d]=0>=p?v[d]:p>=m-1?v[m-1-d]:v[p-Math.floor(c/2)+d];v=Math.floor(Math.random()*c);d=q[v].uId;c=q[v].e;m=q[v].c;q=server.GetUserReadOnlyData({PlayFabId:d,Keys:[c+"_"+m+"_RecPos",c+"_"+m+"_RecRot",c+"_"+m+"_RecHeader"]});if(void 0==q)return generateErrObj("Did not find recording for this user: "+d);var p=server.GetPlayerCombinedInfo({PlayFabId:d,InfoRequestParameters:{GetUserAccountInfo:!0,
GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),A=l,v=Number(calculateLeague(l));w="UserGenerated";x=0<v?Number(h.subdivisions[r.leagues[v-1]]):0;r=v>=r.leagues.length-1?2*x:Number(h.subdivisions[r.leagues[v]]);h=JSON.parse(q.Data[c+"_"+m+"_RecHeader"].Value);void 0!=h&&(y=h.Trophies);y=Number(y);0>=r-x?h=g:Number(Math.abs(A-y))>Number(n)?(h=Math.floor((f+z)/2),f=Math.floor((g+
e)/2),w="Default"):(h=f+Math.floor((z-f)/2*((A-y)/(r-x)+1)),f=e+Math.floor((g-e)/2*((y-A)/(r-x)+1)));r=!0;0==l?(r=!1,l=g):(l-=Number(h),1>=l&&(l=1));e=parseInt(a,2);a=[];y={StatisticName:"WinLoss",Version:"0",Value:e};a.push(y);l={StatisticName:"TrophyCount",Version:"0",Value:l};a.push(l);l={StatisticName:"League",Version:"0",Value:v};a.push(l);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:f,trophyLose:h,lastOpp:d+","+t};0==r&&(a.trophyWin=0,a.trophyLose=0);
server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:w,PosData:q.Data[c+"_"+m+"_RecPos"].Value,RotData:q.Data[c+"_"+m+"_RecRot"].Value,HeaderData:q.Data[c+"_"+m+"_RecHeader"].Value,TrophyLose:h,TrophyWin:f,Opp:p.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateCarCust=function(b,k){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],c="-1",g={},l={PaintJobs:{itemOwned:"no",itemCustData:b.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:b.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:b.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:b.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:b.wsId,carItemId:"WindshieldId"}},d=0;d<a.Inventory.length;d++)a.Inventory[d].ItemId==
b.carId&&"CarsProgress"==a.Inventory[d].CatalogVersion&&(c=a.Inventory[d].ItemInstanceId),a.Inventory[d].ItemId in l&&(l[a.Inventory[d].ItemId].itemOwned="yes",l[a.Inventory[d].ItemId].itemCustData in a.Inventory[d].CustomData?g[l[a.Inventory[d].ItemId].carItemId]=l[a.Inventory[d].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[d].ItemId+" "+l[a.Inventory[d].ItemId].itemCustData));if("-1"==c)return generateFailObj("User does not own car with id: "+b.carId);for(var f in l)l.hasOwnProperty(f)&&
"no"==l[f].itemOwned&&e.push(f);if(g=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c,Data:g});a=[{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:g}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),c={0:"Owned"},d=0;d<e.ItemGrantResults.length;d++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[d].ItemInstanceId,Data:c});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.updateTrophyCount=function(b,k){var a=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!==e.Statistics.length&&(a=e.Statistics[0].Value);"rStart"==b.val&&(a-=30);0>a&&(a=0);"rWin"==b.val&&(a+=60);if("rLose"==b.val)return{val:a};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==b.val)return{val:a}};
