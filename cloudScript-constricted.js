function checkCarDataValidity(c,f){if(void 0==c.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a});for(var e=0,d=0;d<f.Catalog.length;d++)if(f.Catalog[d].ItemId==c.ItemId){var g=
JSON.parse(f.Catalog[d].CustomData),e=parseInt(g.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:a})}catch(h){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:e}}return"OK"}function generateFailObj(c){return{Result:"Failed",Message:c}}
function generateErrObj(c){return{Result:"Error",Message:c}}function generateInventoryChange(c,f){return{Result:"OK",Message:c,InventoryChange:f}}function checkBalance(c,f,a,e){if("SC"==c){if(a<f)return generateFailObj("NotEnoughSC")}else if(e<f)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(c){var f=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==f.Data.LeagueSubdivisions||void 0==f.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(f.Data.LeagueSubdivisions).leagues,f=JSON.parse(f.Data.SubdivisionTrophyRanges).subdivisions,e=0;e<a.length;e++)if(!(Number(c)>Number(f[a[e]])))return e}
function recalculateCarPr(c,f,a,e){var d=0,g;g=void 0===a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<g.Catalog.length;a++)if(g.Catalog[a].ItemId==f){d=JSON.parse(g.Catalog[a].CustomData);d=parseInt(d.basePr)+getObjectValueFromLevel(d,"prPerLvl",c.CarLvl);break}e=void 0===e?server.GetCatalogItems({CatalogVersion:"PartCards"}):e;c={Exhaust:c.ExhaustLvl,Engine:c.EngineLvl,Gearbox:c.GearboxLvl,Suspension:c.SuspensionLvl,Tires:c.TiresLvl,Turbo:c.TurboLvl};for(a=0;a<e.Catalog.length;a++)f=
JSON.parse(e.Catalog[a].CustomData),d+=getObjectValueFromLevel(f,"prPerLvl",Number(c[e.Catalog[a].ItemId]));return d}
function GenerateBlackMarket(c){var f=1,a=server.GetPlayerStatistics({PlayFabId:c,StatisticNames:["League"]});0!=a.Statistics.length&&(f=a.Statistics[0].Value.toString());var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var d=Math.floor(Math.random()*e.Catalog.length),g=JSON.parse(e.Catalog[d].CustomData);if(void 0==g)return generateErrObj("Part card "+e.Catalog[b].ItemId+" has no custom data.");a.BMItem0=e.Catalog[d].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+
"_0_"+g.BMpriceIncrPerBuy;var h=Math.floor(Math.random()*e.Catalog.length);h==d&&(h=e.Catalog.length-d-1);g=JSON.parse(e.Catalog[h].CustomData);if(void 0==g)return generateErrObj("Part card "+e.Catalog[b].ItemId+" has no custom data.");a.BMItem1=e.Catalog[h].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+"_0_"+g.BMpriceIncrPerBuy;for(var e=server.GetCatalogItems({CatalogVersion:"CarCards"}),g=[],h=[],b=0;b<e.Catalog.length;b++){d=JSON.parse(e.Catalog[b].CustomData);if(void 0==d)return generateErrObj("Car card "+
e.Catalog[b].ItemId+" has no custom data.");d.unlockedAtRank>f+1||("false"==d.rareCar?g.push(e.Catalog[b].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy):h.push(e.Catalog[b].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy))}0>=g.length?(a.BMItem2=h[Math.floor(Math.random()*h.length)],a.BMItem3=h[Math.floor(Math.random()*h.length)]):0>=h.length?(a.BMItem2=g[Math.floor(Math.random()*g.length)],a.BMItem3=g[Math.floor(Math.random()*g.length)]):(a.BMItem2=g[Math.floor(Math.random()*
g.length)],a.BMItem3=h[Math.floor(Math.random()*h.length)]);server.UpdateUserInternalData({PlayFabId:c,Data:a});f=[];f.push("BlackMarketResetMinutes");c=server.GetTitleData({PlayFabId:c,Keys:f});a.BMTime=60*parseInt(c.Data.BlackMarketResetMinutes);return a}
function GetCurrentBlackMarket(c,f){var a={},e=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:c,Keys:d});a.BMTime=60*parseInt(d.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-f.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)a["BMItem"+e]=f.Data["BMItem"+e].Value;return a}function GetValueFromStatistics(c,f,a){for(var e,d=0;d<c.length;d++)c[d].StatisticName===f&&(e=c[d]);return void 0===e?void 0!==a?a:0:Number(e.Value)}
function getCatalogItem(c,f){for(var a=server.GetCatalogItems({CatalogVersion:c}),e=0;e<a.Catalog.length;e++)if(a.Catalog[e].ItemId===f)return a.Catalog[e]}function getObjectValueFromLevel(c,f,a,e){e||(e=0);if(!c[f]||!c[f].length)return e;var d=Number(c[f].length);a>=d&&(a=d-1);return Number(c[f][a])||e}
handlers.buyChest=function(c,f){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(c.curr,c.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<c.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.cost}),e={};e[a.VirtualCurrency]=a.Balance;return generateInventoryChange("ChestBought",{VirtualCurrency:e})}return generateInventoryChange("ChestBought",{})};
handlers.endGame=function(c,f){var a="01",e,d="0";"rWin"==c.outcome&&(d="1");var g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=g.Statistics.length&&(e=g.Statistics[0].Value.toString(),a=Number(e).toString(2));var g=0,h;h=Array(a.length);for(var b=0;b<h.length-1;b++)h[b]=a[b];h[h.length-1]=d;a=h;d=a.length;for(b=0;b<a.length;b++)"1"==a[b]&&g++;h=Math.round(g/d*100);var k=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),d=0,l,g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});0!=g.Statistics.length&&(d=g.Statistics[0].Value,log.debug("getting trophy count "+g.Statistics[0].Value));l=d=Number(d);g=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});g=void 0==g.Data.trophyLose||void 0==g.Data.trophyWin?45:Number(g.Data.trophyLose.Value)+Number(g.Data.trophyWin.Value);"rWin"==c.outcome&&(d+=g);log.debug("trophies change: "+l+" => "+d);g=calculateLeague(d);for(b=e=0;b<a.length;b++)"1"==a[b]&&(e+=Math.pow(2,
b));b=[];b.push({StatisticName:"WinLoss",Version:"0",Value:e});a={StatisticName:"TrophyCount",Version:"0",Value:d};b.push(a);a={StatisticName:"League",Version:"0",Value:g};b.push(a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});if("rOot"==c.outcome){var p={TrophyCount:d,League:g};return{Result:p}}b=JSON.parse(c.recordingHeader);log.debug("score: "+b.Score);a=JSON.parse(k.Data.SubdivisionTrophyRanges);for(b=0;b<a.subdivisions.length;b++)if(l<a.subdivisions[b]){p=b;break}b=
[];b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecPos",Value:c.recordingPos});b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecRot",Value:c.recordingRot});b.push({Key:c.envIndex+"_"+c.courseIndex+"_RecHeader",Value:c.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:b});b=server.GetTitleInternalData({Key:"RecSubDivision"+p}).Data["RecSubDivision"+p];if(void 0==b)a=[],h={wl:h,e:c.envIndex,c:c.courseIndex,uId:currentPlayerId},a.push(h);else{a=JSON.parse(b);h={wl:h,e:c.envIndex,
c:c.courseIndex,uId:currentPlayerId};k=!1;for(b=l=0;b<a.length;b++)a[b].uId==currentPlayerId&&l++;if(2<l)return p={TrophyCount:d,League:g},{Result:p};for(b=0;b<a.length;b++)if(a[b].e==c.envIndex&&a[b].c==c.courseIndex){k=!0;a[b]=h;if(1==a.length)break;if(0<b)if(a[b].wl>a[b-1].wl){if(b==a.length-1)break;for(l=b+1;l<a.length;l++)if(a[l-1].wl>a[l].wl)e=a[l],a[l]=a[l-1],a[l-1]=e;else break}else for(l=b-1;0<=l;l--)if(a[l+1].wl<a[l].wl)e=a[l],a[l]=a[l+1],a[l+1]=e;else break;else for(l=b+1;l<a.length;l++)if(a[l-
1].wl>a[l].wl)e=a[l],a[l]=a[l-1],a[l-1]=e;else break}0==k&&a.push(h)}b=JSON.stringify(a);server.SetTitleInternalData({Key:"RecSubDivision"+p,Value:b});p={TrophyCount:d,League:g};return{Result:p}};
function UpdateExperience(c,f,a,e,d,g){c=JSON.parse(getCatalogItem(c,f).CustomData)[a];f=JSON.parse(getCatalogItem("Balancing","BalancingItem").CustomData).LevelThresholds;f=f[f.length-1];g=g||server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["Experience"]}).Statistics;g=GetValueFromStatistics(g,"Experience",0);if(g>=f)return f;if(isNaN(Number(c)))a=Number(c.length),e>=a&&(e=a-1),e=Number(c[e]);else if(e=Number(c),0===e)return g;g=Math.min(g+e,f);if(!d)return g;server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,
Statistics:[{StatisticName:"Experience",Version:"0",Value:g}]});return g}handlers.getServerTime=function(c,f){return{time:new Date}};handlers.giveMoney=function(c){c=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.curr,Amount:c.amount});var f={};f[c.VirtualCurrency]=c.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:f}}};
handlers.grantItems=function(c){for(var f=server.GetUserInventory({PlayFabId:currentPlayerId}),a,e=!1,d=0;d<f.Inventory.length;d++)if(f.Inventory[d].ItemId==c.itemId&&f.Inventory[d].CatalogVersion==c.catalogId){a=void 0==f.Inventory[d].CustomData?c.amount:void 0==f.Inventory[d].CustomData.Amount?c.amount:isNaN(Number(f.Inventory[d].CustomData.Amount))?c.amount:Number(f.Inventory[d].CustomData.Amount)+c.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.Inventory[d].ItemInstanceId,
Data:a});e=!0;break}0==e&&(f=[],f.push(c.itemId),f=server.GrantItemsToUser({CatalogVersion:c.catalogId,PlayFabId:currentPlayerId,ItemIds:f}),a={Amount:c.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:c.itemId,CatalogVersion:c.catalogId,CustomData:a}]}}};
handlers.initServerData=function(c){c=[];var f={StatisticName:"TrophyCount",Version:"0",Value:"0"};c.push(f);f={StatisticName:"League",Version:"0",Value:"0"};c.push(f);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var f={0:"Owned"},a=0;a<c.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[a].ItemInstanceId,Data:f});c=[];c.push("FordFocus");c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c});f={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f});f={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f});f={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f});f=[];f.push("Engine");f=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:f});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});f={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f})};
handlers.openChest=function(c,f){if(0<=Number(c.level)){var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["LastLevelReward"]}),e={};e.LastLevelReward=c.level;if(void 0==a.Data)server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:e}),a=""+c.level,e="000",a=e.substring(0,e.length-a.length)+a,server.GrantItemsToUser({CatalogVersion:"LevelUpRewards",PlayFabId:currentPlayerId,ItemIds:a});else if(Number(a.Data.Value)<Number(c.level))server.UpdateUserInternalData({PlayFabId:currentPlayerId,
Data:e}),a=""+c.level,e="000",a=e.substring(0,e.length-a.length)+a,server.GrantItemsToUser({CatalogVersion:"LevelUpRewards",PlayFabId:currentPlayerId,ItemIds:a});else return generateFailObj("already got reward for level: "+c.level)}a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<c.currCost){if("OK"!=checkBalance(c.currType,c.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c.currType,
Amount:c.currCost})}for(var d in c.currencyReq)0<c.currencyReq[d]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:d,Amount:c.currencyReq[d]});var g;for(d in c.carCardsRequest)if(c.carCardsRequest.hasOwnProperty(d)){g=!1;for(e=0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==d&&"CarCards"==a.Inventory[e].CatalogVersion){g=void 0==a.Inventory[e].CustomData?Number(c.carCardsRequest[d]):void 0==a.Inventory[e].CustomData.Amount?Number(c.carCardsRequest[d]):isNaN(Number(a.Inventory[e].CustomData.Amount))?
Number(c.carCardsRequest[d]):Number(a.Inventory[e].CustomData.Amount)+Number(c.carCardsRequest[d]);g={Amount:g};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[e].ItemInstanceId,Data:g});g=!0;break}0==g&&(e=[d],e=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:e}),g={Amount:c.carCardsRequest[d]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,
Data:g}))}for(d in c.partCardsRequest)if(c.partCardsRequest.hasOwnProperty(d)){g=!1;for(e=0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==d&&"PartCards"==a.Inventory[e].CatalogVersion){g=void 0==a.Inventory[e].CustomData?Number(c.partCardsRequest[d]):void 0==a.Inventory[e].CustomData.Amount?Number(c.partCardsRequest[d]):isNaN(Number(a.Inventory[e].CustomData.Amount))?Number(c.partCardsRequest[d]):Number(a.Inventory[e].CustomData.Amount)+Number(c.partCardsRequest[d]);g={Amount:g};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[e].ItemInstanceId,Data:g});g=!0;break}0==g&&(e=[d],e=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:e}),g={Amount:c.partCardsRequest[d]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,Data:g}))}d=server.GetUserInventory({PlayFabId:currentPlayerId});c.chestId&&0>Number(c.level)&&(a=UpdateExperience("Chests",c.chestId,"xpGain",0,!0),d.Experience=a);return generateInventoryChange("InventoryUpdated",
d)};
handlers.purchaseBMItem=function(c,f){if(0>c.itemId||3<c.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+c.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),e=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+c.itemId].Value.split("_"),d=e.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");var g;g=2>c.itemId?"PartCards":"CarCards";var h=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),d=
checkBalance(a[1],h,d,d);if("OK"!=d)return d;for(var b,k,d=0;d<e.Inventory.length;d++)if(e.Inventory[d].ItemId==a[0]&&e.Inventory[d].CatalogVersion==g){b=e.Inventory[d].ItemInstanceId;void 0===e.Inventory[d].CustomData?k={Amount:1}:void 0===e.Inventory[d].CustomData.Amount?k={Amount:1}:(k=Number(e.Inventory[d].CustomData.Amount)+1,isNaN(k)&&(k=1),k={Amount:k});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b,Data:k});break}void 0===b&&(b=[],b.push(a[0]),b=server.GrantItemsToUser({CatalogVersion:g,
PlayFabId:currentPlayerId,ItemIds:b}).ItemGrantResults[0].ItemInstanceId,void 0===b?generateErrObj("grantRequest denied"):(k={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b,Data:k})));b=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:h});h=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];e={};e["BMItem"+c.itemId]=h;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:e});k=[{ItemId:a[0],CatalogVersion:g,
CustomData:k}];g={};g[b.VirtualCurrency]=b.Balance;a=c.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];d={Inventory:k,VirtualCurrency:g};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:d,BMItemChange:a}};
handlers.purchaseItems=function(c,f){var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=a.VirtualCurrency.SC,d=a.VirtualCurrency.HC;switch(c.purchaseType){case "carUpgrade":return upgradeCar(c,a,e,d);case "partUpgrade":return upgradePart(c,a,e,d);case "custPurchase":for(var g=server.GetCatalogItems({CatalogVersion:"Customization"}),h,b=0,k="SC",l=0;l<g.Catalog.length;l++)if(g.Catalog[l].ItemId==c.custId){h=g.Catalog[l];cardInfo=JSON.parse(g.Catalog[l].CustomData);b=c.custVal+",Cost";k=cardInfo[c.custVal+
",Curr"];b=cardInfo[b];d=checkBalance(k,b,e,d);if("OK"!=d)return d;break}if(void 0==h)return generateErrObj("Customization does not exist in catalog.");for(var p,n,l=0;l<a.Inventory.length;l++)if(a.Inventory[l].ItemId==c.custId){p=a.Inventory[l];n=a.Inventory[l].ItemInstanceId;if(void 0!=p.CustomData&&String(c.custVal)in p.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==p){log.info("user doesn't have customization category. Granting ... ");d=[];d.push(c.custId);
d=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:d});if(0==d.ItemGrantResults[0].Result)return generateErrObj("something went wrong while granting user customization class object.");n=d.ItemGrantResults[0].ItemInstanceId}d={};d[String(c.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:n,Data:d});d=[{ItemId:c.custId,CatalogVersion:"Customization",CustomData:d}];0<b?(k=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:k,Amount:b}),b={},b[k.VirtualCurrency]=k.Balance,l={Inventory:d,VirtualCurrency:b}):l={Inventory:d};return generateInventoryChange("InventoryUpdateNewCustomization",l);case "softCurrencyPurchase":k=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});b=!1;for(l=n=0;l<k.Catalog.length;l++)if(k.Catalog[l].ItemId==c.packId){n=k.Catalog[l].VirtualCurrencyPrices.HC;cardInfo=JSON.parse(k.Catalog[l].CustomData);b=!0;break}if(0==b)return generateErrObj("pack with ID: "+c.packId+" not found in catalog.");
if(0>=n)return generateErrObj("pack with ID: "+c.packId+" shouldn't have negative cost.");if(n>d)return generateFailObj("Not enough HC.");k=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:n});d=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:cardInfo.quantity});b={};b[d.VirtualCurrency]=d.Balance;b[k.VirtualCurrency]=k.Balance;return generateInventoryChange("SoftCurrencyPurchased",{VirtualCurrency:b});default:log.debug("invalid purchase parameter")}};
handlers.requestCurrency=function(c){return{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(c){c=server.GetUserInventory({PlayFabId:currentPlayerId});for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),e=!1,d=0;d<c.Inventory.length;d++)if("CarsProgress"==c.Inventory[d].CatalogVersion){var e=!0,g=checkCarDataValidity(c.Inventory[d],f);if("PlayFabError"==g||void 0===g)return generateErrObj("PlayfabError");"OK"==g?log.debug("Data for "+c.Inventory[d].ItemId+" OK"):c.Inventory[d].CustomData=g;
c.Inventory[d].CustomData.Pr=recalculateCarPr(c.Inventory[d].CustomData,c.Inventory[d].ItemId,f,a);g={};g.Pr=c.Inventory[d].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.Inventory[d].ItemInstanceId,Data:g})}return!1===e?(c=[],c.push("FordFocus"),c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c}),f={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f}),f={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f}),f={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:f}),generateErrObj("UserHasNoCars ... reiniting")):c};
handlers.retrieveBlackMarket=function(c,f){var a=[];a.push("BMTime");for(var e=0;4>e;e++)a.push("BMItem"+e);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0===a.Data.BMTime)return GenerateBlackMarket(currentPlayerId);var e=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:currentPlayerId,Keys:d});if(!0===c.reset){a="HC";e=200;d=server.GetTitleData({Keys:["BlackMarketResetCost"]});void 0!==d.Data.BlackMarketResetCost&&(e=d.Data.BlackMarketResetCost.split("_"),
a=e[0],e=Number(e[1]));if(0<e){d=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,e,d.VirtualCurrency.SC,d.VirtualCurrency.HC))return generateFailObj("not enough money");e=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:e});a=GenerateBlackMarket(currentPlayerId);d={};d[e.VirtualCurrency]=e.Balance;e={VirtualCurrency:d};a.InventoryChange=e;return a}return GenerateBlackMarket(currentPlayerId)}return e.getTime()-parseInt(a.Data.BMTime.Value)>
6E4*parseInt(d.Data.BlackMarketResetMinutes)?GenerateBlackMarket(currentPlayerId):GetCurrentBlackMarket(currentPlayerId,a)};
handlers.startGame=function(c,f){var a="10",e,d=50,g,h=0;g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=g.Statistics.length){e=g.Statistics[0].Value.toString();a=Number(e).toString(2);g=a.length;for(var b=0;b<a.length;b++)"1"==a[b]&&h++;d=Math.round(h/g*100)}a+="0";20<a.length&&(a=a.slice(1));var k=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges","TrophyGainRange","TrophyLoseRange"]});g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});h=0;0!=g.Statistics.length&&(h=g.Statistics[0].Value);var h=Number(h),l=JSON.parse(k.Data.SubdivisionTrophyRanges),p=JSON.parse(k.Data.LeagueSubdivisions),n=43,m=43,u;g=k.Data.TrophyGainRange.split("_");u=k.Data.TrophyLoseRange.split("_");e=Number(g[0]);g=Number(g[1]);for(var k=Number(u[0]),z=Number(u[1]),b=0;b<l.subdivisions.length;b++)if(h<Number(l.subdivisions[b])){n=b;b<l.subdivisions.length-1&&(m=b+1);break}u=Number(l.subdivisions[m])-Number(l.subdivisions[n]);
log.debug("nextSubDivision "+m+" subDivision "+n);log.debug(" sdvalParsed.subdivisions[nextSubDivision] "+l.subdivisions[m]+" sdvalParsed.subdivisions[subDivision] "+l.subdivisions[n]);0>=u&&(u=400);log.debug("subDivisionRange "+u);var r=server.GetTitleInternalData({Keys:"RecSubDivision"+n}).Data["RecSubDivision"+n],m=!1;void 0==r&&(m=!0);var v,q=n="noop",w,b=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["lastOpp"]});if(void 0==b.Data||void 0==b.Data.lastOpp)q=n="noop";else for(w=b.Data.lastOpp.Value.split(","),
b=0;b<w.length;b++)0==b&&(n=w[b]),1==b&&(q=w[b]);v=0==m?JSON.parse(r):[];var C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];15>v.length&&(m=!0);var D=Array(v.length),B=0,r=Array(v.length);w=0;for(var A=Array(v.length),x=0,b=0;b<v.length;b++)1==m&&(C[5*Number(v[b].e)+Number(v[b].c)]=1),v[b].uId!=currentPlayerId&&(D[B]=v[b],B++,v[b].uId!=n&&(r[w]=v[b],w++,v[b].uId!=q&&(A[x]=v[b],x++)));if(1==m){for(b=q=m=0;b<C.length;b++)if(0==C[b]){m=Math.floor(b/5);q=b%5;break}b=server.GetTitleData({Keys:"MasterUser"});if(void 0!=
b.Data.MasterUser&&(b=server.GetUserReadOnlyData({PlayFabId:b.Data.MasterUser,Keys:[m+"_"+q+"_RecPos",m+"_"+q+"_RecRot",m+"_"+q+"_RecHeader"]}),void 0!=b.Data&&void 0!=b.Data[m+"_"+q+"_RecPos"]&&void 0!=b.Data[m+"_"+q+"_RecRot"]&&void 0!=b.Data[m+"_"+q+"_RecHeader"])){n=!0;0==h?(h=g,n=!1):h-=k;1>=h&&(h=1);e=parseInt(a,2);var a=[],y={StatisticName:"WinLoss",Version:"0",Value:e};a.push(y);h={StatisticName:"TrophyCount",Version:"0",Value:h};a.push(h);h={StatisticName:"League",Version:"0",Value:t};a.push(h);
server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:g,trophyLose:k};0==n&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:"Default",PosData:b.Data[m+"_"+q+"_RecPos"].Value,RotData:b.Data[m+"_"+q+"_RecRot"].Value,HeaderData:b.Data[m+"_"+q+"_RecHeader"].Value,TrophyLose:k,TrophyWin:g,Opp:"Mniezo"}}}if(0==B)return generateErrObj("no valid recording found for this subdivision");t=D;m=B;0<w&&(m=
w,t=r);0<x&&(m=x,t=A);r=m-1;for(b=0;b<m;b++)if(t[b].wl>d){r=b;break}d=Math.min(m,3);q=Array(d);for(b=0;b<d;b++)q[b]=0>=r?t[b]:r>=m-1?t[m-1-b]:t[r-Math.floor(d/2)+b];t=Math.floor(Math.random()*d);b=q[t].uId;d=q[t].e;m=q[t].c;q=server.GetUserReadOnlyData({PlayFabId:b,Keys:[d+"_"+m+"_RecPos",d+"_"+m+"_RecRot",d+"_"+m+"_RecHeader"]});if(void 0==q)return generateErrObj("Did not find recording for this user: "+b);var r=server.GetPlayerCombinedInfo({PlayFabId:b,InfoRequestParameters:{GetUserAccountInfo:!0,
GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),A=h,t=Number(calculateLeague(h));w="UserGenerated";x=0<t?Number(l.subdivisions[p.leagues[t-1]]):0;p=t>=p.leagues.length-1?2*x:Number(l.subdivisions[p.leagues[t]]);l=JSON.parse(q.Data[d+"_"+m+"_RecHeader"].Value);void 0!=l&&(y=l.Trophies);y=Number(y);0>=p-x?l=g:Number(Math.abs(A-y))>Number(u)?(l=Math.floor((k+z)/2),k=Math.floor((g+
e)/2),w="Default"):(l=k+Math.floor((z-k)/2*((A-y)/(p-x)+1)),k=e+Math.floor((g-e)/2*((y-A)/(p-x)+1)));p=!0;0==h?(p=!1,h=g):(h-=Number(l),1>=h&&(h=1));e=parseInt(a,2);a=[];y={StatisticName:"WinLoss",Version:"0",Value:e};a.push(y);h={StatisticName:"TrophyCount",Version:"0",Value:h};a.push(h);h={StatisticName:"League",Version:"0",Value:t};a.push(h);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:k,trophyLose:l,lastOpp:b+","+n};0==p&&(a.trophyWin=0,a.trophyLose=0);
server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:w,PosData:q.Data[d+"_"+m+"_RecPos"].Value,RotData:q.Data[d+"_"+m+"_RecRot"].Value,HeaderData:q.Data[d+"_"+m+"_RecHeader"].Value,TrophyLose:l,TrophyWin:k,Opp:r.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateCarCust=function(c,f){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],d="-1",g={},h={PaintJobs:{itemOwned:"no",itemCustData:c.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:c.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:c.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:c.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:c.wsId,carItemId:"WindshieldId"}},b=0;b<a.Inventory.length;b++)a.Inventory[b].ItemId==
c.carId&&"CarsProgress"==a.Inventory[b].CatalogVersion&&(d=a.Inventory[b].ItemInstanceId),a.Inventory[b].ItemId in h&&(h[a.Inventory[b].ItemId].itemOwned="yes",h[a.Inventory[b].ItemId].itemCustData in a.Inventory[b].CustomData?g[h[a.Inventory[b].ItemId].carItemId]=h[a.Inventory[b].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[b].ItemId+" "+h[a.Inventory[b].ItemId].itemCustData));if("-1"==d)return generateFailObj("User does not own car with id: "+c.carId);for(var k in h)h.hasOwnProperty(k)&&
"no"==h[k].itemOwned&&e.push(k);if(g=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:g});a=[{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:g}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),d={0:"Owned"},b=0;b<e.ItemGrantResults.length;b++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[b].ItemInstanceId,Data:d});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.updateTrophyCount=function(c,f){var a=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!==e.Statistics.length&&(a=e.Statistics[0].Value);"rStart"==c.val&&(a-=30);0>a&&(a=0);"rWin"==c.val&&(a+=60);if("rLose"==c.val)return{val:a};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==c.val)return{val:a}};
function upgradeCar(c,f,a,e){for(var d=server.GetCatalogItems({CatalogVersion:"CarCards"}),g=!1,h,b=0;b<f.Inventory.length;b++)if(f.Inventory[b].ItemId==c.carId&&"CarsProgress"==f.Inventory[b].CatalogVersion){g=!0;h=f.Inventory[b];break}for(var k,b=0;b<d.Catalog.length;b++)if(d.Catalog[b].ItemId==c.carId){k=JSON.parse(d.Catalog[b].CustomData);break}if(void 0===k)return generateErrObj("CardNotFoundForCarwithID: "+c.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data.");
if(!0===g){var l=parseInt(h.CustomData.CarLvl)+1;if(l>=Number(k.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var p=getObjectValueFromLevel(k,"currCostPerLvl",l),b=checkBalance(k.currType,p,a,e);if("OK"!=b)return b;a=getObjectValueFromLevel(k,"cardCostPerLvl",l);h.CustomData.CarLvl=l;for(var g=!1,n,b=0;b<f.Inventory.length;b++)if(f.Inventory[b].ItemId==c.carId&&"CarCards"==f.Inventory[b].CatalogVersion){g=!0;try{if(void 0===f.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");
if(void 0===f.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(f.Inventory[b].CustomData.Amount)>=a)f.Inventory[b].CustomData.Amount-=a,n={Amount:f.Inventory[b].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.Inventory[b].ItemInstanceId,Data:n});else return generateFailObj("Insufficient cards for real: "+f.Inventory[b].CustomData.Amount+" vs "+a)}catch(u){return generateFailObj("Insufficient cards")}break}if(!1===
g)return generateFailObj("No cards found");f=recalculateCarPr(h.CustomData,h.ItemId,d,void 0);b={CarLvl:l,Pr:f};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemInstanceId,Data:b});var m;0<p&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:p}));c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:b}];n={};b={Inventory:c};void 0!=m&&(n[m.VirtualCurrency]=
m.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,l,!0);return generateInventoryChange("InventoryUpdate",b)}g=!1;for(b=0;b<f.Inventory.length;b++)if(f.Inventory[b].ItemId==c.carId&&"CarCards"==f.Inventory[b].CatalogVersion){g=!0;try{if(void 0===f.Inventory[b].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0===f.Inventory[b].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");
if(Number(f.Inventory[b].CustomData.Amount)>=Number(k.cardCostPerLvl[1]))p=f.Inventory[b].ItemInstanceId,f.Inventory[b].CustomData.Amount-=k.cardCostPerLvl[1],n={Amount:f.Inventory[b].CustomData.Amount};else return generateFailObj("Insufficient cards: "+f.Inventory[b].CustomData.Amount+" vs "+k.cardCostPerLvl[1]+".")}catch(u){return generateFailObj("Insufficient cards: "+u)}break}if(0==g)return generateFailObj("No cards found");b=checkBalance(k.currType,k.currCostPerLvl[1],a,e);if("OK"!=b)return b;
h=[];h.push(c.carId);h=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:h});if(!1===h.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:p,Data:n});0<k.currCostPerLvl[1]&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:k.currType,Amount:k.currCostPerLvl[1]}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});b={TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});b={PlatesId:"0",WindshieldId:"0",
Pr:Number(k.basePr)+k.prPerLvl[1]};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h.ItemGrantResults[0].ItemInstanceId,Data:b});d=h=!1;for(b=0;b<f.Inventory.length;b++)if("PaintJobs"==f.Inventory[b].ItemId){d=!0;void 0!=f.Inventory[b].CustomData?k.defaultPaintID in f.Inventory[b].CustomData?h=!0:(l={},l[k.defaultPaintID]="Owned"):(l={},l[k.defaultPaintID]="Owned");void 0!=l&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.Inventory[b].ItemInstanceId,
Data:l});break}0==d&&(paintToGive=[],paintToGive.push("PaintJobs"),f=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),l={},l[k.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:l}));b={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:Number(k.basePr)+k.prPerLvl[1]};c=[{ItemId:c.carId,CatalogVersion:"CarCards",CustomData:n},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:b}];0==h&&(n={},n[k.defaultPaintID]="Owned",c.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:n}));n={};b={Inventory:c};void 0!=m&&(n[m.VirtualCurrency]=m.Balance,b.VirtualCurrency=n);b.Experience=UpdateExperience("Balancing","BalancingItem","Car_"+k.rarity,1,!0);return generateInventoryChange("InventoryUpdateNewCar",b)}
function upgradePart(c,f,a,e){for(var d=server.GetCatalogItems({CatalogVersion:"CarsProgress"}),g=!1,h=0;h<d.Catalog.length;h++)if(d.Catalog[h].ItemId==c.carId){g=!0;break}if(!1===g)return generateErrObj("car with ID: "+c.carId+" not found in catalog.");for(var d=server.GetCatalogItems({CatalogVersion:"PartCards"}),g=!1,b,h=0;h<d.Catalog.length;h++)if(d.Catalog[h].ItemId==c.partId){b=JSON.parse(d.Catalog[h].CustomData);g=!0;break}if(0==g)return generateErrObj("part with ID: "+c.partId+" not found in catalog.");
for(var g=!1,k,h=0;h<f.Inventory.length;h++)if(f.Inventory[h].ItemId==c.carId&&"CarsProgress"==f.Inventory[h].CatalogVersion){g=!0;k=f.Inventory[h];break}if(!1===g)return generateFailObj("car with ID: "+c.carId+" not found in user inventory.");for(var l=!1,g=0,p={},h=0;h<f.Inventory.length;h++)if(f.Inventory[h].ItemId==c.partId&&"PartCards"==f.Inventory[h].CatalogVersion){var l=!0,n={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"},
g=parseInt(k.CustomData[n[c.partId]])+1;if(g>=Number(b.prPerLvl.length))return generateFailObj("Maximum pr level was reached!");var m=getObjectValueFromLevel(b,"cardCostPerLvl",g),u=getObjectValueFromLevel(b,"currCostPerLvl",g);p[n[c.partId]]=g;k.CustomData[n[c.partId]]=g;var z;a=checkBalance(b.currType,u,a,e);if("OK"!=a)return a;try{if(void 0!==f.Inventory[h].CustomData&&void 0!==f.Inventory[h].CustomData.Amount&&f.Inventory[h].CustomData.Amount>=m)f.Inventory[h].CustomData.Amount-=m,z={Amount:f.Inventory[h].CustomData.Amount},
server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.Inventory[h].ItemInstanceId,Data:z});else return generateFailObj("Insufficient cards")}catch(v){return generateFailObj("Insufficient cards")}break}if(0==l)return generateFailObj("Part not found");var r;0<u&&(r=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:u}));h=recalculateCarPr(k.CustomData,k.ItemId,void 0,d);p.Pr=h;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:k.ItemInstanceId,Data:p});k={};h={Inventory:[{ItemId:c.partId,CatalogVersion:"PartCards",CustomData:z},{ItemId:c.carId,CatalogVersion:"CarsProgress",CustomData:p}]};void 0!==r&&(k[r.VirtualCurrency]=r.Balance,h.VirtualCurrency=k);h.Experience=UpdateExperience("Balancing","BalancingItem","Parts_"+b.rarity,g,!0);return generateInventoryChange("InventoryUpdatePart",h)};
