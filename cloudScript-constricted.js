function checkCarDataValidity(c,h){if(void 0==c.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});for(var b=0,f=0;f<h.Catalog.length;f++)if(h.Catalog[f].ItemId==c.ItemId){var g=
JSON.parse(h.Catalog[f].CustomData),b=parseInt(g.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:b};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a})}catch(k){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:b}}return"OK"}function generateFailObj(c){return{Result:"Failed",Message:c}}
function generateErrObj(c){return{Result:"Error",Message:c}}
function CheckMaintenanceAndVersion(c){var h=!1,a="A.0.0.1";void 0!=c&&(h=c.debug,a=c.cVersion);if(void 0==a)return"update";c=server.GetTitleData({Key:["Maintenance","MinimumGameVersionActual_IOS","MinimumGameVersionActual"]});var b=c.Data.MinimumGameVersionActual,a=a.split(".");if(4!=a.length)return"maintenance";"ios"==a[0]&&(b=c.Data.MinimumGameVersionActual_IOS);if(void 0==b)return"maintenance";for(var f=!1,b=b.split("."),g=0;3>g;g++){var k=0;a.length>g+1&&(k=Number(a[g+1]));var d=0;b.length>g&&
(d=Number(b[g]));if(k<d){f=!0;break}}return 1==f?"update":1==h?"OK":c.Data.Maintenance?"false"==c.Data.Maintenance?"OK":"maintenance":"maintenance"}function generateMaintenanceOrUpdateObj(c){return"maintenance"==c?{Result:"Maintenance",Message:"Servers are temporarily offline"}:{Result:"Update",Message:"Game needs to be updated"}}function generateInventoryChange(c,h){return{Result:"OK",Message:c,InventoryChange:h}}
function checkBalance(c,h,a,b){if("SC"==c){if(a<h)return generateFailObj("NotEnoughSC")}else if(b<h)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(c){var h=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==h.Data.LeagueSubdivisions||void 0==h.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(h.Data.LeagueSubdivisions).leagues,h=JSON.parse(h.Data.SubdivisionTrophyRanges).subdivisions,b=0;b<a.length;b++)if(!(Number(c)>Number(h[a[b]])))return b}
function recalculateCarPr(c,h,a,b){var f=0,g;g=void 0===a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<g.Catalog.length;a++)if(g.Catalog[a].ItemId==h){f=JSON.parse(g.Catalog[a].CustomData);f=parseInt(f.basePr)+getObjectValueFromLevel(f,"prPerLvl",c.CarLvl);break}b=void 0===b?server.GetCatalogItems({CatalogVersion:"PartCards"}):b;c={Exhaust:c.ExhaustLvl,Engine:c.EngineLvl,Gearbox:c.GearboxLvl,Suspension:c.SuspensionLvl,Tires:c.TiresLvl,Turbo:c.TurboLvl};for(a=0;a<b.Catalog.length;a++)h=
JSON.parse(b.Catalog[a].CustomData),f+=getObjectValueFromLevel(h,"prPerLvl",Number(c[b.Catalog[a].ItemId]));return f}
function GenerateBlackMarket(c){var h=1,a=server.GetPlayerStatistics({PlayFabId:c,StatisticNames:["League"]});0!=a.Statistics.length&&(h=a.Statistics[0].Value.toString());0>=Number(h)&&(h=1);for(var b=server.GetCatalogItems({CatalogVersion:"PartCards"}),a=server.GetTitleData({PlayFabId:c,Keys:["BlackMarketResetMinutes","BlackMarketRarityBias"]}),f=JSON.parse(a.Data.BlackMarketRarityBias),g,k=[],d=[],e=[],l=0;l<b.Catalog.length;l++){g=JSON.parse(b.Catalog[l].CustomData);if(void 0==g)return generateErrObj("Part card "+
b.Catalog[l].ItemId+" has no custom data.");0==g.rarity&&k.push(b.Catalog[l].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+"_0_"+g.BMpriceIncrPerBuy);1==g.rarity&&d.push(b.Catalog[l].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+"_0_"+g.BMpriceIncrPerBuy);2==g.rarity&&e.push(b.Catalog[l].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+"_0_"+g.BMpriceIncrPerBuy)}b={};b.BMTime=(new Date).getTime();l=Math.floor(Math.random()*k.length);b.BMItem0=k[l];2<=k.length&&k.splice(l,1);Math.floor(100*Math.random())<Number(f.parts[2])?
k=e:(l=Number(f.parts[0])+Number(f.parts[1]),Math.floor(Math.random()*l)>=Number(f.parts[0])&&(k=d));b.BMItem1=k[Math.floor(Math.random()*k.length)];g=server.GetCatalogItems({CatalogVersion:"CarCards"});for(var m,k=[],d=[],e=[],l=0;l<g.Catalog.length;l++){m=JSON.parse(g.Catalog[l].CustomData);if(void 0==m)return generateErrObj("Car card "+g.Catalog[l].ItemId+" has no custom data.");Number(m.unlockedAtRank)>=Number(h)+1||("0"==m.rarity&&k.push(g.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+
"_0_"+m.BMpriceIncrPerBuy),"1"==m.rarity&&d.push(g.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+"_0_"+m.BMpriceIncrPerBuy),"2"==m.rarity&&e.push(g.Catalog[l].ItemId+"_"+m.BMCurrType+"_"+m.BMbasePrice+"_0_"+m.BMpriceIncrPerBuy))}h=Math.floor(Math.random()*k.length);b.BMItem2=k[h];2<=k.length&&k.splice(h,1);0>=d.length&&(0>=e.length?e=d=k:d=e);0>=e.length&&(e=d);Math.floor(100*Math.random())<Number(f.cars[2])?k=e:(l=Number(f.cars[0])+Number(f.cars[1]),Math.floor(Math.random()*l)>=Number(f.cars[0])&&
(k=d));h=Math.floor(Math.random()*k.length);b.BMItem3=k[h];server.UpdateUserInternalData({PlayFabId:c,Data:b});b.BMTime=60*parseInt(a.Data.BlackMarketResetMinutes);return b}function GetCurrentBlackMarket(c,h){var a={},b=new Date,f=[];f.push("BlackMarketResetMinutes");f=server.GetTitleData({PlayFabId:c,Keys:f});a.BMTime=60*parseInt(f.Data.BlackMarketResetMinutes)-Math.floor((b.getTime()-h.Data.BMTime.Value)/1E3);for(b=0;4>b;b++)a["BMItem"+b]=h.Data["BMItem"+b].Value;return a}
function GetValueFromStatistics(c,h,a){for(var b,f=0;f<c.length;f++)c[f].StatisticName===h&&(b=c[f]);log.debug("Stat with name statisticsName: "+h+" is "+b);return void 0===b?void 0!==a?a:0:Number(b.Value)}function getCatalogItem(c,h){for(var a=server.GetCatalogItems({CatalogVersion:c}),b=0;b<a.Catalog.length;b++)if(a.Catalog[b].ItemId===h)return a.Catalog[b]}
function getObjectValueFromLevel(c,h,a,b){b||(b=0);if(!c[h]||!c[h].length)return b;var f=Number(c[h].length);a>=f&&(a=f-1);return Number(c[h][a])||b}
handlers.buyChest=function(c,h){var a=CheckMaintenanceAndVersion(c);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(c.curr,c.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<c.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.cost}),b={};b[a.VirtualCurrency]=a.Balance;return generateInventoryChange("ChestBought",{VirtualCurrency:b})}return generateInventoryChange("ChestBought",
{})};
handlers.endGame=function(c,h){var a=CheckMaintenanceAndVersion(c);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);var b="01",f,g="0";"rWin"==c.outcome&&(g="1");a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=a.Statistics.length&&(f=a.Statistics[0].Value.toString(),b=Number(f).toString(2));var a=0,k,d;d=Array(b.length);for(var e=0;e<d.length-1;e++)d[e]=b[e];d[d.length-1]=g;b=d;k=b.length;for(e=d=g=0;e<b.length;e++)"1"==b[e]?(a++,d++):(d>g&&(g=d),d=0);d=
Math.round(a/k*100);var l=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),a=0,m,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=e.Statistics.length&&(a=e.Statistics[0].Value,log.debug("getting trophy count "+e.Statistics[0].Value));m=a=Number(a);e=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});e=void 0==e.Data.trophyLose||void 0==e.Data.trophyWin?45:Number(e.Data.trophyLose.Value)+Number(e.Data.trophyWin.Value);
"rWin"==c.outcome&&(a+=e);var n=JSON.parse(c.recordingHeader),e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Wins","TotalGamesCompleted","LongestWinStreak","BestDriftScore"]}).Statistics;k=GetValueFromStatistics(e,"TotalGamesCompleted",0);k=Number(k)+1;var p=GetValueFromStatistics(e,"Wins",0);"rWin"==c.outcome&&(p=Number(p)+1);var y=GetValueFromStatistics(e,"LongestWinStreak",0);g>y&&(y=g);var v=GetValueFromStatistics(e,"BestDriftScore",0);Number(n.Score)>v&&(v=Number(n.Score));
g=calculateLeague(a);for(e=f=0;e<b.length;e++)"1"==b[e]&&(f+=Math.pow(2,e));e=[];e.push({StatisticName:"WinLoss",Version:"0",Value:f});b={StatisticName:"TrophyCount",Version:"0",Value:a};e.push(b);b={StatisticName:"League",Version:"0",Value:g};e.push(b);b={StatisticName:"Wins",Version:"0",Value:p};e.push(b);b={StatisticName:"TotalGamesCompleted",Version:"0",Value:k};e.push(b);b={StatisticName:"LongestWinStreak",Version:"0",Value:y};e.push(b);b={StatisticName:"BestDriftScore",Version:"0",Value:v};
e.push(b);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if(10>=Number(n.Score)){var r={TrophyCount:a,League:g};return{Result:r}}b=JSON.parse(l.Data.SubdivisionTrophyRanges);for(e=0;e<b.subdivisions.length;e++)if(m<b.subdivisions[e]){r=e;break}e=[];e.push({Key:c.envIndex+"_"+c.courseIndex+"_RecPos",Value:c.recordingPos});e.push({Key:c.envIndex+"_"+c.courseIndex+"_RecRot",Value:c.recordingRot});e.push({Key:c.envIndex+"_"+c.courseIndex+"_RecHeader",Value:c.recordingHeader});
server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:e});e=server.GetTitleInternalData({Key:"RecSubDivision"+r}).Data["RecSubDivision"+r];if(void 0==e)b=[],d={wl:d,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId},b.push(d);else{b=JSON.parse(e);d={wl:d,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId};l=!1;for(e=m=0;e<b.length;e++)b[e].uId==currentPlayerId&&m++;if(2<m)return r={TrophyCount:a,League:g},{Result:r};for(e=0;e<b.length;e++)if(b[e].e==c.envIndex&&b[e].c==c.courseIndex){l=!0;b[e]=
d;if(1==b.length)break;if(0<e)if(b[e].wl>b[e-1].wl){if(e==b.length-1)break;for(m=e+1;m<b.length;m++)if(b[m-1].wl>b[m].wl)k=b[m],b[m]=b[m-1],b[m-1]=k;else break}else for(m=e-1;0<=m;m--)if(b[m+1].wl<b[m].wl)k=b[m],b[m]=b[m+1],b[m+1]=k;else break;else for(m=e+1;m<b.length;m++)if(b[m-1].wl>b[m].wl)k=b[m],b[m]=b[m-1],b[m-1]=k;else break}0==l&&b.push(d)}e=JSON.stringify(b);server.SetTitleInternalData({Key:"RecSubDivision"+r,Value:e});r={TrophyCount:a,League:g};return{Result:r}};
function UpdateExperience(c,h,a,b,f,g){c=JSON.parse(getCatalogItem(c,h).CustomData)[a];h=JSON.parse(getCatalogItem("Balancing","BalancingItem").CustomData).LevelThresholds;h=h[h.length-1];g=g||server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience"]}).Statistics;g=GetValueFromStatistics(g,"Experience",0);if(g>=h)return h;if(isNaN(Number(c)))a=Number(c.length),b>=a&&(b=a-1),b=Number(c[b]);else if(b=Number(c),0===b)return g;g=Math.min(g+b,h);if(!f)return g;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,
Statistics:[{StatisticName:"Experience",Version:"0",Value:g}]});return g}handlers.getServerTime=function(c,h){return{time:new Date}};
handlers.initServerData=function(c){c=[];var h={StatisticName:"TrophyCount",Version:"0",Value:"0"};c.push(h);h={StatisticName:"League",Version:"0",Value:"0"};c.push(h);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var h={0:"Owned"},a=0;a<c.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[a].ItemInstanceId,Data:h});c=[];c.push("FordFocus");c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c});h={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:h});h={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:h});h={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:h});h=[];h.push("Engine");h=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:h});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});h={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:h})};
handlers.openChest=function(c,h){var a=CheckMaintenanceAndVersion(c);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);if(0<c.levelUpRewardIndex){var b=0,a=server.GetUserReadOnlyData({PlayFabId:currentPlayerId,Keys:["LastLevelReward"]}),f={LastLevelReward:0};void 0==a.Data.LastLevelReward?server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:f}):b=a.Data.LastLevelReward.Value;var g=JSON.parse(getCatalogItem("Balancing","BalancingItem").CustomData).LevelThresholds,a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["Experience"]}).Statistics,k=GetValueFromStatistics(a,"Experience",0);0==k&&(a=[],a.push({StatisticName:"Experience",Version:"0",Value:0}),server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a}));for(var d=g.length,a=0;a<g.length;a++)if(!(k>=g[a])){d=a;break}if(Number(c.levelUpRewardIndex)<=Number(d))b=Number(c.levelUpRewardIndex),f.LastLevelReward=b,server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:f}),a=""+b,a="000".substring(0,3-a.length)+a,server.GrantItemsToUser({CatalogVersion:"LevelUpRewards",
PlayFabId:currentPlayerId,ItemIds:a});else return generateFailObj("already got reward for level: "+b)}b=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<c.currCost){if("OK"!=checkBalance(c.currType,c.currCost,b.VirtualCurrency.SC,b.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.currType,Amount:c.currCost})}for(var e in c.currencyReq)0<c.currencyReq[e]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:e,Amount:c.currencyReq[e]});for(e in c.carCardsRequest)if(c.carCardsRequest.hasOwnProperty(e)){f=!1;for(a=0;a<b.Inventory.length;a++)if(b.Inventory[a].ItemId==e&&"CarCards"==b.Inventory[a].CatalogVersion){f=void 0==b.Inventory[a].CustomData?Number(c.carCardsRequest[e]):void 0==b.Inventory[a].CustomData.Amount?Number(c.carCardsRequest[e]):isNaN(Number(b.Inventory[a].CustomData.Amount))?Number(c.carCardsRequest[e]):Number(b.Inventory[a].CustomData.Amount)+Number(c.carCardsRequest[e]);
f={Amount:f};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[a].ItemInstanceId,Data:f});f=!0;break}0==f&&(a=[e],a=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:a}),f={Amount:c.carCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:f}))}for(e in c.partCardsRequest)if(c.partCardsRequest.hasOwnProperty(e)){f=!1;for(a=0;a<b.Inventory.length;a++)if(b.Inventory[a].ItemId==
e&&"PartCards"==b.Inventory[a].CatalogVersion){f=void 0==b.Inventory[a].CustomData?Number(c.partCardsRequest[e]):void 0==b.Inventory[a].CustomData.Amount?Number(c.partCardsRequest[e]):isNaN(Number(b.Inventory[a].CustomData.Amount))?Number(c.partCardsRequest[e]):Number(b.Inventory[a].CustomData.Amount)+Number(c.partCardsRequest[e]);f={Amount:f};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[a].ItemInstanceId,Data:f});f=!0;break}0==f&&(a=[e],a=server.GrantItemsToUser({CatalogVersion:"PartCards",
PlayFabId:currentPlayerId,ItemIds:a}),f={Amount:c.partCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:f}))}e=server.GetUserInventory({PlayFabId:currentPlayerId});c.chestId&&0>=c.levelUpRewardIndex&&(a=UpdateExperience("Chests",c.chestId,"xpGain",0,!0),e.Experience=a);return generateInventoryChange("InventoryUpdated",e)};
handlers.purchaseBMItem=function(c,h){var a=CheckMaintenanceAndVersion(c);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);if(0>c.itemId||3<c.itemId)return generateFailObj("invalid item index");a=[];a.push("BMItem"+c.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),b=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+c.itemId].Value.split("_"),f=b.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var g;g=2>c.itemId?"PartCards":"CarCards";var k=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),f=checkBalance(a[1],k,f,f);if("OK"!=f)return f;for(var d,e,f=0;f<b.Inventory.length;f++)if(b.Inventory[f].ItemId==a[0]&&b.Inventory[f].CatalogVersion==g){d=b.Inventory[f].ItemInstanceId;void 0===b.Inventory[f].CustomData?e={Amount:1}:void 0===b.Inventory[f].CustomData.Amount?e={Amount:1}:(e=Number(b.Inventory[f].CustomData.Amount)+1,isNaN(e)&&(e=1),e={Amount:e});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:d,Data:e});break}void 0===d&&(d=[],d.push(a[0]),d=server.GrantItemsToUser({CatalogVersion:g,PlayFabId:currentPlayerId,ItemIds:d}).ItemGrantResults[0].ItemInstanceId,void 0===d?generateErrObj("grantRequest denied"):(e={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:e})));d=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:k});k=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];b={};b["BMItem"+
c.itemId]=k;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:b});e=[{ItemId:a[0],CatalogVersion:g,CustomData:e}];g={};g[d.VirtualCurrency]=d.Balance;a=c.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];f={Inventory:e,VirtualCurrency:g};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:f,BMItemChange:a}};
handlers.purchaseItems=function(c,h){var a=CheckMaintenanceAndVersion(c);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);var b=server.GetUserInventory({PlayFabId:currentPlayerId}),f=b.VirtualCurrency.SC,g=b.VirtualCurrency.HC;switch(c.purchaseType){case "carUpgrade":return upgradeCar(c,b,f,g);case "partUpgrade":return upgradePart(c,b,f,g);case "custPurchase":for(var k=server.GetCatalogItems({CatalogVersion:"Customization"}),d,e=0,a="SC",l=0;l<k.Catalog.length;l++)if(k.Catalog[l].ItemId==c.custId){d=
k.Catalog[l];cardInfo=JSON.parse(k.Catalog[l].CustomData);e=c.custVal+",Cost";a=cardInfo[c.custVal+",Curr"];e=cardInfo[e];g=checkBalance(a,e,f,g);if("OK"!=g)return g;break}if(void 0==d)return generateErrObj("Customization does not exist in catalog.");for(var m,n,l=0;l<b.Inventory.length;l++)if(b.Inventory[l].ItemId==c.custId){m=b.Inventory[l];n=b.Inventory[l].ItemInstanceId;if(void 0!=m.CustomData&&String(c.custVal)in m.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==
m){log.info("user doesn't have customization category. Granting ... ");g=[];g.push(c.custId);g=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:g});if(0==g.ItemGrantResults[0].Result)return generateErrObj("something went wrong while granting user customization class object.");n=g.ItemGrantResults[0].ItemInstanceId}g={};g[String(c.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:n,Data:g});g=[{ItemId:c.custId,
CatalogVersion:"Customization",CustomData:g}];0<e?(a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:e}),e={},e[a.VirtualCurrency]=a.Balance,l={Inventory:g,VirtualCurrency:e}):l={Inventory:g};return generateInventoryChange("InventoryUpdateNewCustomization",l);case "softCurrencyPurchase":a=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});e=!1;for(l=n=0;l<a.Catalog.length;l++)if(a.Catalog[l].ItemId==c.packId){n=a.Catalog[l].VirtualCurrencyPrices.HC;
cardInfo=JSON.parse(a.Catalog[l].CustomData);e=!0;break}if(0==e)return generateErrObj("pack with ID: "+c.packId+" not found in catalog.");if(0>=n)return generateErrObj("pack with ID: "+c.packId+" shouldn't have negative cost.");if(n>g)return generateFailObj("Not enough HC.");a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:n});g=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:cardInfo.quantity});e={};e[g.VirtualCurrency]=
g.Balance;e[a.VirtualCurrency]=a.Balance;return generateInventoryChange("SoftCurrencyPurchased",{VirtualCurrency:e});default:log.debug("invalid purchase parameter")}};handlers.requestCurrency=function(c){c=CheckMaintenanceAndVersion(c);return"OK"!=c?generateMaintenanceOrUpdateObj(c):{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(c){c=server.GetUserInventory({PlayFabId:currentPlayerId});for(var h=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),b=!1,f=0;f<c.Inventory.length;f++)if("CarsProgress"==c.Inventory[f].CatalogVersion){var b=!0,g=checkCarDataValidity(c.Inventory[f],h);if("PlayFabError"==g||void 0===g)return generateErrObj("PlayfabError");"OK"==g?log.debug("Data for "+c.Inventory[f].ItemId+" OK"):c.Inventory[f].CustomData=g;
c.Inventory[f].CustomData.Pr=recalculateCarPr(c.Inventory[f].CustomData,c.Inventory[f].ItemId,h,a);g={};g.Pr=c.Inventory[f].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.Inventory[f].ItemInstanceId,Data:g})}return!1===b?(c=[],c.push("FordFocus"),c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c}),h={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:h}),h={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:h}),h={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:h}),generateErrObj("UserHasNoCars ... reiniting")):c};
handlers.retrieveBlackMarket=function(c,h){var a=CheckMaintenanceAndVersion(c);if(!0===c.reset&&"OK"!=a)return generateMaintenanceOrUpdateObj(a);var b=[];b.push("BMTime");for(var f=0;4>f;f++)b.push("BMItem"+f);f=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:b});if(void 0===f.Data.BMTime)return GenerateBlackMarket(currentPlayerId);var b=new Date,g=[];g.push("BlackMarketResetMinutes");g=server.GetTitleData({PlayFabId:currentPlayerId,Keys:g});if(!0===c.reset){a="HC";f=200;b=server.GetTitleData({Keys:["BlackMarketResetCost"]});
void 0!==b.Data.BlackMarketResetCost&&(f=b.Data.BlackMarketResetCost.split("_"),a=f[0],f=Number(f[1]));if(0<f){b=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,f,b.VirtualCurrency.SC,b.VirtualCurrency.HC))return generateFailObj("not enough money");f=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:f});a=GenerateBlackMarket(currentPlayerId);b={};b[f.VirtualCurrency]=f.Balance;f={VirtualCurrency:b};a.InventoryChange=f;return a}return GenerateBlackMarket(currentPlayerId)}return b.getTime()-
parseInt(f.Data.BMTime.Value)>6E4*parseInt(g.Data.BlackMarketResetMinutes)?("OK"!=a&&GetCurrentBlackMarket(currentPlayerId,f),GenerateBlackMarket(currentPlayerId)):GetCurrentBlackMarket(currentPlayerId,f)};
handlers.rewardUsers=function(c,h){var a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience","TrophyCount"]}).Statistics,b=GetValueFromStatistics(a,"Experience",0),a=GetValueFromStatistics(a,"TrophyCount",0),f=0;0>=b&&(a=Number(a)/3E3,f=Number(Math.floor(800*a)));b=Number(b)+f;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:[{StatisticName:"Experience",Version:"0",Value:b}]});return b};
handlers.startGame=function(c,h){var a=CheckMaintenanceAndVersion(c);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);var b="10",f,g=50,k=0,a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=a.Statistics.length){f=a.Statistics[0].Value.toString();for(var b=Number(f).toString(2),a=b.length,d=0;d<b.length;d++)"1"==b[d]&&k++;g=Math.round(k/a*100)}b+="0";20<b.length&&(b=b.slice(1));var e=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges",
"TrophyGainRange","TrophyLoseRange","SubdivisionPrRanges"]}),a=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TotalGames"]}).Statistics,a=GetValueFromStatistics(a,"TotalGames",0),a=Number(a)+1,l=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]}),k=0;0!=l.Statistics.length&&(k=l.Statistics[0].Value);var k=Number(k),m=JSON.parse(e.Data.SubdivisionTrophyRanges);f=JSON.parse(e.Data.LeagueSubdivisions);for(var n=JSON.parse(e.Data.SubdivisionPrRanges),
p=43,y=43,v=e.Data.TrophyGainRange.split("_"),r=e.Data.TrophyLoseRange.split("_"),l=Number(v[0]),e=Number(v[1]),v=Number(r[0]),r=Number(r[1]),d=0;d<m.subdivisions.length;d++)if(k<Number(m.subdivisions[d])){p=d;d<m.subdivisions.length-1&&(y=d+1);break}y=Number(m.subdivisions[y])-Number(m.subdivisions[p]);0>=y&&(y=400);var u=server.GetTitleInternalData({Keys:"RecSubDivision"+p}).Data["RecSubDivision"+p],q=!1;void 0==u&&(q=!0);var z,w=p="noop",t,d=server.GetUserInternalData({PlayFabId:currentPlayerId,
Keys:["lastOpp"]});if(void 0==d.Data||void 0==d.Data.lastOpp)w=p="noop";else for(t=d.Data.lastOpp.Value.split(","),d=0;d<t.length;d++)0==d&&(p=t[d]),1==d&&(w=t[d]);z=0==q?JSON.parse(u):[];var F=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];15>z.length&&(q=!0);var D=Array(z.length),A=0,u=Array(z.length);t=0;for(var E=Array(z.length),C=0,d=0;d<z.length;d++)1==q&&(F[5*Number(z[d].e)+Number(z[d].c)]=1),z[d].uId!=currentPlayerId&&(D[A]=z[d],A++,z[d].uId!=p&&(u[t]=z[d],t++,z[d].uId!=w&&(E[C]=z[d],C++)));if(1==q){q=[];
for(d=0;d<F.length;d++)0==F[d]&&q.push(d);q=q[Math.floor(Math.random()*q.length)];d=Math.floor(q/5);q%=5;w=server.GetTitleData({Keys:"MasterUser"});if(void 0!=w.Data.MasterUser&&(w=server.GetUserReadOnlyData({PlayFabId:w.Data.MasterUser,Keys:[d+"_"+q+"_RecPos",d+"_"+q+"_RecRot",d+"_"+q+"_RecHeader"]}),void 0!=w.Data&&void 0!=w.Data[d+"_"+q+"_RecPos"]&&void 0!=w.Data[d+"_"+q+"_RecRot"]&&void 0!=w.Data[d+"_"+q+"_RecHeader"])){var B=!0;0==k?(k=e,B=!1):k-=v;1>=k&&(k=1);f=parseInt(b,2);b=[];f={StatisticName:"WinLoss",
Version:"0",Value:f};b.push(f);k={StatisticName:"TrophyCount",Version:"0",Value:k};b.push(k);k={StatisticName:"League",Version:"0",Value:x};b.push(k);k={StatisticName:"TotalGames",Version:"0",Value:a};b.push(k);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});a={trophyWin:Math.floor((Number(e)+Number(l))/2),trophyLose:Math.floor((Number(r)+Number(v))/2)};0==B&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",
RecType:"TheStig",PosData:w.Data[d+"_"+q+"_RecPos"].Value,RotData:w.Data[d+"_"+q+"_RecRot"].Value,HeaderData:w.Data[d+"_"+q+"_RecHeader"].Value,TrophyLose:v,TrophyWin:e,Opp:"Mniezo"}}}if(0==A)return generateErrObj("no valid recording found for this subdivision");x=D;0<t&&(A=t,x=u);0<C&&(A=C,x=E);t=A-1;for(d=0;d<A;d++)if(x[d].wl>g){t=d;break}g=Math.min(A,3);u=Array(g);for(d=0;d<g;d++)u[d]=0>=t?x[d]:t>=A-1?x[A-1-d]:x[t-Math.floor(g/2)+d];x=Math.floor(Math.random()*g);d=u[x].uId;g=u[x].e;u=u[x].c;t=
server.GetUserReadOnlyData({PlayFabId:d,Keys:[g+"_"+u+"_RecPos",g+"_"+u+"_RecRot",g+"_"+u+"_RecHeader"]});if(void 0==t)return generateErrObj("Did not find recording for this user: "+d);var E=server.GetPlayerCombinedInfo({PlayFabId:d,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),A=k,x=Number(calculateLeague(k)),C="UserGenerated",
D=0<x?Number(m.subdivisions[f.leagues[x-1]]):0,w=x>=f.leagues.length-1?2*D:Number(m.subdivisions[f.leagues[x]]),q=JSON.parse(t.Data[g+"_"+u+"_RecHeader"].Value);void 0!=q&&(B=q.Trophies);B=Number(B);0>=w-D?(m=r,B=l):Number(Math.abs(A-B))>Number(y)?(m=Math.floor((v+r)/2)-1+Math.floor(3*Math.random()),B=Math.floor((e+l)/2)-1+Math.floor(3*Math.random()),C="MobyDick"):(m=v+Math.floor((r-v)/2*((A-B)/(w-D)+1)),B=l+Math.floor((e-l)/2*((B-A)/(w-D)+1)));q.Pr>Number(n.subdivisions[f.leagues[x-1]])&&(m=Math.floor((v+
r)/2)-1+Math.floor(3*Math.random()),B=Math.floor((e+l)/2)-1+Math.floor(3*Math.random()),C="MobyDick");l=!0;0==k?(l=!1,k=e):(k-=Number(m),1>=k&&(k=1));f=parseInt(b,2);b=[];f={StatisticName:"WinLoss",Version:"0",Value:f};b.push(f);k={StatisticName:"TrophyCount",Version:"0",Value:k};b.push(k);k={StatisticName:"League",Version:"0",Value:x};b.push(k);k={StatisticName:"TotalGames",Version:"0",Value:a};b.push(k);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});a={trophyWin:B,trophyLose:m,
lastOpp:d+","+p};0==l&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:C,PosData:t.Data[g+"_"+u+"_RecPos"].Value,RotData:t.Data[g+"_"+u+"_RecRot"].Value,HeaderData:t.Data[g+"_"+u+"_RecHeader"].Value,TrophyLose:m,TrophyWin:B,Opp:E.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateCarCust=function(c,h){var a=CheckMaintenanceAndVersion(c);if("OK"!=a)return generateMaintenanceOrUpdateObj(a);for(var b=server.GetUserInventory({PlayFabId:currentPlayerId}),f=[],g="-1",k={},d={PaintJobs:{itemOwned:"no",itemCustData:c.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:c.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:c.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:c.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",
itemCustData:c.wsId,carItemId:"WindshieldId"}},a=0;a<b.Inventory.length;a++)b.Inventory[a].ItemId==c.carId&&"CarsProgress"==b.Inventory[a].CatalogVersion&&(g=b.Inventory[a].ItemInstanceId),b.Inventory[a].ItemId in d&&(d[b.Inventory[a].ItemId].itemOwned="yes",d[b.Inventory[a].ItemId].itemCustData in b.Inventory[a].CustomData?k[d[b.Inventory[a].ItemId].carItemId]=d[b.Inventory[a].ItemId].itemCustData:log.debug("user doesn't own: "+b.Inventory[a].ItemId+" "+d[b.Inventory[a].ItemId].itemCustData));if("-1"==
g)return generateFailObj("User does not own car with id: "+c.carId);for(var e in d)d.hasOwnProperty(e)&&"no"==d[e].itemOwned&&f.push(e);if(k=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g,Data:k});e=[{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:k}];if(0<f.length)for(f=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:f}),b={0:"Owned"},
a=0;a<f.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[a].ItemInstanceId,Data:b});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:e}}};
function upgradeCar(c,h,a,b){for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),g=!1,k,d=0;d<h.Inventory.length;d++)if(h.Inventory[d].ItemId==c.carId&&"CarsProgress"==h.Inventory[d].CatalogVersion){g=!0;k=h.Inventory[d];break}for(var e,d=0;d<f.Catalog.length;d++)if(f.Catalog[d].ItemId==c.carId){e=JSON.parse(f.Catalog[d].CustomData);break}if(void 0===e)return generateErrObj("CardNotFoundForCarwithID: "+c.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data.");
if(!0===g){var l=parseInt(k.CustomData.CarLvl)+1;if(l>=Number(e.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var m=getObjectValueFromLevel(e,"currCostPerLvl",l),d=checkBalance(e.currType,m,a,b);if("OK"!=d)return d;a=getObjectValueFromLevel(e,"cardCostPerLvl",l);k.CustomData.CarLvl=l;for(var g=!1,n,d=0;d<h.Inventory.length;d++)if(h.Inventory[d].ItemId==c.carId&&"CarCards"==h.Inventory[d].CatalogVersion){g=!0;try{if(void 0===h.Inventory[d].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");
if(void 0===h.Inventory[d].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(h.Inventory[d].CustomData.Amount)>=a)h.Inventory[d].CustomData.Amount-=a,n={Amount:h.Inventory[d].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.Inventory[d].ItemInstanceId,Data:n});else return generateFailObj("Insufficient cards for real: "+h.Inventory[d].CustomData.Amount+" vs "+a)}catch(y){return generateFailObj("Insufficient cards")}break}if(!1===
g)return generateFailObj("No cards found");h=recalculateCarPr(k.CustomData,k.ItemId,f,void 0);d={CarLvl:l,Pr:h};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemInstanceId,Data:d});var p;0<m&&(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:e.currType,Amount:m}));c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:d}];n={};d={Inventory:c};void 0!=p&&(n[p.VirtualCurrency]=
p.Balance,d.VirtualCurrency=n);d.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+e.rarity,l,!0);return generateInventoryChange("InventoryUpdate",d)}g=!1;for(d=0;d<h.Inventory.length;d++)if(h.Inventory[d].ItemId==c.carId&&"CarCards"==h.Inventory[d].CatalogVersion){g=!0;try{if(void 0===h.Inventory[d].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0===h.Inventory[d].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");
if(Number(h.Inventory[d].CustomData.Amount)>=Number(e.cardCostPerLvl[1]))m=h.Inventory[d].ItemInstanceId,h.Inventory[d].CustomData.Amount-=e.cardCostPerLvl[1],n={Amount:h.Inventory[d].CustomData.Amount};else return generateFailObj("Insufficient cards: "+h.Inventory[d].CustomData.Amount+" vs "+e.cardCostPerLvl[1]+".")}catch(y){return generateFailObj("Insufficient cards: "+y)}break}if(0==g)return generateFailObj("No cards found");d=checkBalance(e.currType,e.currCostPerLvl[1],a,b);if("OK"!=d)return d;
k=[];k.push(c.carId);k=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:k});if(!1===k.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:m,Data:n});0<e.currCostPerLvl[1]&&(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:e.currType,Amount:e.currCostPerLvl[1]}));d={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemGrantResults[0].ItemInstanceId,Data:d});d={TiresLvl:"0",TurboLvl:"0",PaintId:e.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemGrantResults[0].ItemInstanceId,Data:d});d={PlatesId:"0",WindshieldId:"0",
Pr:Number(e.basePr)+e.prPerLvl[1]};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemGrantResults[0].ItemInstanceId,Data:d});f=k=!1;for(d=0;d<h.Inventory.length;d++)if("PaintJobs"==h.Inventory[d].ItemId){f=!0;void 0!=h.Inventory[d].CustomData?e.defaultPaintID in h.Inventory[d].CustomData?k=!0:(l={},l[e.defaultPaintID]="Owned"):(l={},l[e.defaultPaintID]="Owned");void 0!=l&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.Inventory[d].ItemInstanceId,
Data:l});break}0==f&&(paintToGive=[],paintToGive.push("PaintJobs"),h=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),l={},l[e.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:l}));d={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:e.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:Number(e.basePr)+e.prPerLvl[1]};c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:d}];0==k&&(n={},n[e.defaultPaintID]="Owned",c.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:n}));n={};d={Inventory:c};void 0!=p&&(n[p.VirtualCurrency]=p.Balance,d.VirtualCurrency=n);d.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+e.rarity,1,!0);return generateInventoryChange("InventoryUpdateNewCar",d)}
function upgradePart(c,h,a,b){for(var f=server.GetCatalogItems({CatalogVersion:"CarsProgress"}),g=!1,k=0;k<f.Catalog.length;k++)if(f.Catalog[k].ItemId==c.carId){g=!0;break}if(!1===g)return generateErrObj("car with ID: "+c.carId+" not found in catalog.");for(var f=server.GetCatalogItems({CatalogVersion:"PartCards"}),g=!1,d,k=0;k<f.Catalog.length;k++)if(f.Catalog[k].ItemId==c.partId){d=JSON.parse(f.Catalog[k].CustomData);g=!0;break}if(0==g)return generateErrObj("part with ID: "+c.partId+" not found in catalog.");
for(var g=!1,e,k=0;k<h.Inventory.length;k++)if(h.Inventory[k].ItemId==c.carId&&"CarsProgress"==h.Inventory[k].CatalogVersion){g=!0;e=h.Inventory[k];break}if(!1===g)return generateFailObj("car with ID: "+c.carId+" not found in user inventory.");for(var l=!1,g=0,m={},k=0;k<h.Inventory.length;k++)if(h.Inventory[k].ItemId==c.partId&&"PartCards"==h.Inventory[k].CatalogVersion){var l=!0,n={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"},
g=parseInt(e.CustomData[n[c.partId]])+1;if(g>=Number(d.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var p=getObjectValueFromLevel(d,"cardCostPerLvl",g),y=getObjectValueFromLevel(d,"currCostPerLvl",g);m[n[c.partId]]=g;e.CustomData[n[c.partId]]=g;var v;a=checkBalance(d.currType,y,a,b);if("OK"!=a)return a;try{if(void 0!==h.Inventory[k].CustomData&&void 0!==h.Inventory[k].CustomData.Amount&&h.Inventory[k].CustomData.Amount>=p)h.Inventory[k].CustomData.Amount-=p,v={Amount:h.Inventory[k].CustomData.Amount},
server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.Inventory[k].ItemInstanceId,Data:v});else return generateFailObj("Insufficient cards")}catch(u){return generateFailObj("Insufficient cards")}break}if(0==l)return generateFailObj("Part not found");var r;0<y&&(r=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:d.currType,Amount:y}));k=recalculateCarPr(e.CustomData,e.ItemId,void 0,f);m.Pr=k;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemInstanceId,Data:m});e={};k={Inventory:[{ItemId:c.partId,CatalogVersion:"PartCards",CustomData:v},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:m}]};void 0!==r&&(e[r.VirtualCurrency]=r.Balance,k.VirtualCurrency=e);k.Experience=UpdateExperience("Balancing","BalancingItem","Parts_"+d.rarity,g,!0);return generateInventoryChange("InventoryUpdatePart",k)};
