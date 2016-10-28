function checkCarDataValidity(b,l){if(void 0==b.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a});for(var f=0,d=0;d<l.Catalog.length;d++)if(l.Catalog[d].ItemId==b.ItemId){var g=
JSON.parse(l.Catalog[d].CustomData),f=parseInt(g.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:f};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a})}catch(k){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:f}}return"OK"}function generateFailObj(b){return{Result:"Failed",Message:b}}
function generateErrObj(b){return{Result:"Error",Message:b}}function checkBalance(b,l,a,f){if("SC"==b){if(a<l)return generateFailObj("NotEnoughSC")}else if(f<l)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(b){var l=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==l.Data.LeagueSubdivisions||void 0==l.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(l.Data.LeagueSubdivisions).leagues,l=JSON.parse(l.Data.SubdivisionTrophyRanges).subdivisions,f=0;f<a.length;f++)if(!(Number(b)>Number(l[a[f]])))return f}
function recalculateCarPr(b,l,a,f){var d=0,g;g=void 0==a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<g.Catalog.length;a++)if(g.Catalog[a].ItemId==l){a=JSON.parse(g.Catalog[a].CustomData);d+=parseInt(a.basePr)+parseInt(a.prPerLvl)*(parseInt(b.CarLvl)-1);break}f=void 0==f?server.GetCatalogItems({CatalogVersion:"PartCards"}):f;b={Exhaust:b.ExhaustLvl,Engine:b.EngineLvl,Gearbox:b.GearboxLvl,Suspension:b.SuspensionLvl,Tires:b.TiresLvl,Turbo:b.TurboLvl};for(a=0;a<f.Catalog.length;a++)l=
JSON.parse(f.Catalog[a].CustomData),d+=parseInt(l.basePr)+parseInt(l.prPerLvl)*b[f.Catalog[a].ItemId];return d}
function GenerateBlackMarket(b){var l=1,a=server.GetPlayerStatistics({PlayFabId:b,StatisticNames:["League"]});0!=a.Statistics.length&&(l=a.Statistics[0].Value.toString());var f=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var d=Math.floor(Math.random()*f.Catalog.length),g=JSON.parse(f.Catalog[d].CustomData);if(void 0==g)return generateErrObj("Part card "+f.Catalog[c].ItemId+" has no custom data.");a.BMItem0=f.Catalog[d].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+
"_0_"+g.BMpriceIncrPerBuy;var k=Math.floor(Math.random()*f.Catalog.length);k==d&&(k=f.Catalog.length-d-1);g=JSON.parse(f.Catalog[k].CustomData);if(void 0==g)return generateErrObj("Part card "+f.Catalog[c].ItemId+" has no custom data.");a.BMItem1=f.Catalog[k].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+"_0_"+g.BMpriceIncrPerBuy;for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),g=[],k=[],c=0;c<f.Catalog.length;c++){d=JSON.parse(f.Catalog[c].CustomData);if(void 0==d)return generateErrObj("Car card "+
f.Catalog[c].ItemId+" has no custom data.");d.unlockedAtRank>l+1||("false"==d.rareCar?g.push(f.Catalog[c].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy):k.push(f.Catalog[c].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy))}0>=g.length?(a.BMItem2=k[Math.floor(Math.random()*k.length)],a.BMItem3=k[Math.floor(Math.random()*k.length)]):0>=k.length?(a.BMItem2=g[Math.floor(Math.random()*g.length)],a.BMItem3=g[Math.floor(Math.random()*g.length)]):(a.BMItem2=g[Math.floor(Math.random()*
g.length)],a.BMItem3=k[Math.floor(Math.random()*k.length)]);server.UpdateUserInternalData({PlayFabId:b,Data:a});l=[];l.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:b,Keys:l});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes);return a}
function GetCurrentBlackMarket(b,l){var a={},f=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:b,Keys:d});a.BMTime=60*parseInt(d.Data.BlackMarketResetMinutes)-Math.floor((f.getTime()-l.Data.BMTime.Value)/1E3);for(f=0;4>f;f++)a["BMItem"+f]=l.Data["BMItem"+f].Value;return a}
handlers.buyChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(b.curr,b.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<b.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.cost}),f={};f[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:f}}}return{Result:"OK",Message:"ChestBought",InventoryChange:{}}};
handlers.endGame=function(b,l){var a="01",f,d="0";"rWin"==b.outcome&&(d="1");var g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=g.Statistics.length&&(f=g.Statistics[0].Value.toString(),a=Number(f).toString(2));var g=0,k;k=Array(a.length);for(var c=0;c<k.length-1;c++)k[c]=a[c];k[k.length-1]=d;a=k;d=a.length;for(c=0;c<a.length;c++)"1"==a[c]&&g++;k=Math.round(g/d*100);var e=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),d=0,h,g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});0!=g.Statistics.length&&(d=g.Statistics[0].Value,log.debug("getting trophy count "+g.Statistics[0].Value));h=d=Number(d);g=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});log.debug("pDat.Data[trophyLose] "+g.Data.trophyLose.Value);log.debug("pDat.Data[trophyWin] "+g.Data.trophyWin.Value);g=void 0==g.Data.trophyLose||void 0==g.Data.trophyWin?45:Number(g.Data.trophyLose.Value)+Number(g.Data.trophyWin.Value);"rWin"==b.outcome&&
(d+=g);log.debug("trophies change: "+h+" => "+d);g=calculateLeague(d);for(c=f=0;c<a.length;c++)"1"==a[c]&&(f+=Math.pow(2,c));c=[];c.push({StatisticName:"WinLoss",Version:"0",Value:f});a={StatisticName:"TrophyCount",Version:"0",Value:d};c.push(a);a={StatisticName:"League",Version:"0",Value:g};c.push(a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});if("rOot"==b.outcome){var r={TrophyCount:d,League:g};return{Result:r}}a=JSON.parse(e.Data.SubdivisionTrophyRanges);for(c=0;c<a.subdivisions.length;c++)if(h<
a.subdivisions[c]){r=c;break}c=[];c.push({Key:b.envIndex+"_"+b.courseIndex+"_RecPos",Value:b.recordingPos});c.push({Key:b.envIndex+"_"+b.courseIndex+"_RecRot",Value:b.recordingRot});c.push({Key:b.envIndex+"_"+b.courseIndex+"_RecHeader",Value:b.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:c});c=server.GetTitleInternalData({Key:"RecSubDivision"+r}).Data["RecSubDivision"+r];if(void 0==c)a=[],k={wl:k,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId},a.push(k);else{a=
JSON.parse(c);k={wl:k,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId};e=!1;for(c=h=0;c<a.length;c++)a[c].uId==currentPlayerId&&h++;if(2<h)return r={TrophyCount:d,League:g},{Result:r};for(c=0;c<a.length;c++)if(a[c].e==b.envIndex&&a[c].c==b.courseIndex){e=!0;a[c]=k;if(1==a.length)break;if(0<c)if(a[c].wl>a[c-1].wl){if(c==a.length-1)break;for(h=c+1;h<a.length;h++)if(a[h-1].wl>a[h].wl)f=a[h],a[h]=a[h-1],a[h-1]=f;else break}else for(h=c-1;0<=h;h--)if(a[h+1].wl<a[h].wl)f=a[h],a[h]=a[h+1],a[h+1]=f;else break;
else for(h=c+1;h<a.length;h++)if(a[h-1].wl>a[h].wl)f=a[h],a[h]=a[h-1],a[h-1]=f;else break}0==e&&a.push(k)}c=JSON.stringify(a);server.SetTitleInternalData({Key:"RecSubDivision"+r,Value:c});r={TrophyCount:d,League:g};return{Result:r}};function UpdateExperience(b,l,a,f){b=server.GetCatalogItems({CatalogVersion:b});log.debug(b.Catalog[l].CustomData+"  "+b.Catalog[l].CustomData[a]);l=b.Catalog[l].CustomData[a];l=isNaN(Number(l))?l[Number(l.length)]:Number(l);log.debug("Received exp:"+l)}
handlers.getServerTime=function(b,l){return{time:new Date}};handlers.giveMoney=function(b){b=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.amount});var l={};l[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:l}}};
handlers.grantItems=function(b){for(var l=server.GetUserInventory({PlayFabId:currentPlayerId}),a,f=!1,d=0;d<l.Inventory.length;d++)if(l.Inventory[d].ItemId==b.itemId&&l.Inventory[d].CatalogVersion==b.catalogId){a=void 0==l.Inventory[d].CustomData?b.amount:void 0==l.Inventory[d].CustomData.Amount?b.amount:isNaN(Number(l.Inventory[d].CustomData.Amount))?b.amount:Number(l.Inventory[d].CustomData.Amount)+b.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.Inventory[d].ItemInstanceId,
Data:a});f=!0;break}0==f&&(l=[],l.push(b.itemId),l=server.GrantItemsToUser({CatalogVersion:b.catalogId,PlayFabId:currentPlayerId,ItemIds:l}),a={Amount:b.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:b.itemId,CatalogVersion:b.catalogId,CustomData:a}]}}};
handlers.initServerData=function(b){b=[];var l={StatisticName:"TrophyCount",Version:"0",Value:"0"};b.push(l);l={StatisticName:"League",Version:"0",Value:"0"};b.push(l);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var l={0:"Owned"},a=0;a<b.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[a].ItemInstanceId,Data:l});b=[];b.push("FordFocus");b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b});l={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l=[];l.push("Engine");l=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:l});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});l={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l})};
handlers.openChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<b.currCost){if("OK"!=checkBalance(b.currType,b.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:b.currCost})}for(var f in b.currencyReq)0<b.currencyReq[f]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:f,Amount:b.currencyReq[f]});var d;
for(f in b.carCardsRequest)if(b.carCardsRequest.hasOwnProperty(f)){d=!1;for(var g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==f&&"CarCards"==a.Inventory[g].CatalogVersion){d=void 0==a.Inventory[g].CustomData?Number(b.carCardsRequest[f]):void 0==a.Inventory[g].CustomData.Amount?Number(b.carCardsRequest[f]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.carCardsRequest[f]):Number(a.Inventory[g].CustomData.Amount)+Number(b.carCardsRequest[f]);d={Amount:d};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:d});d=!0;break}0==d&&(g=[f],g=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:g}),d={Amount:b.carCardsRequest[f]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:d}))}for(f in b.partCardsRequest)if(b.partCardsRequest.hasOwnProperty(f)){d=!1;for(g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==f&&"PartCards"==a.Inventory[g].CatalogVersion){d=
void 0==a.Inventory[g].CustomData?Number(b.partCardsRequest[f]):void 0==a.Inventory[g].CustomData.Amount?Number(b.partCardsRequest[f]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.partCardsRequest[f]):Number(a.Inventory[g].CustomData.Amount)+Number(b.partCardsRequest[f]);d={Amount:d};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:d});d=!0;break}0==d&&(g=[f],g=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,
ItemIds:g}),d={Amount:b.partCardsRequest[f]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:d}))}return{Result:"OK",Message:"InventoryUpdated",InventoryChange:server.GetUserInventory({PlayFabId:currentPlayerId})}};
handlers.purchaseBMItem=function(b,l){if(0>b.itemId||3<b.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+b.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),f=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+b.itemId].Value.split("_"),d=f.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");var g;g=2>b.itemId?"PartCards":"CarCards";var k=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),
d=checkBalance(a[1],k,d,d);if("OK"!=d)return d;for(var c,e,d=0;d<f.Inventory.length;d++)if(f.Inventory[d].ItemId==a[0]&&f.Inventory[d].CatalogVersion==g){c=f.Inventory[d].ItemInstanceId;void 0===f.Inventory[d].CustomData?e={Amount:1}:void 0===f.Inventory[d].CustomData.Amount?e={Amount:1}:(e=Number(f.Inventory[d].CustomData.Amount)+1,isNaN(e)&&(e=1),e={Amount:e});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c,Data:e});break}void 0===c&&(c=[],c.push(a[0]),c=server.GrantItemsToUser({CatalogVersion:g,
PlayFabId:currentPlayerId,ItemIds:c}).ItemGrantResults[0].ItemInstanceId,void 0===c?generateErrObj("grantRequest denied"):(e={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c,Data:e})));c=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:k});k=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];f={};f["BMItem"+b.itemId]=k;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:f});e=[{ItemId:a[0],CatalogVersion:g,
CustomData:e}];g={};g[c.VirtualCurrency]=c.Balance;a=b.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];d={Inventory:e,VirtualCurrency:g};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:d,BMItemChange:a}};
handlers.purchaseItems=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId}),f=a.VirtualCurrency.SC,d=a.VirtualCurrency.HC;switch(b.purchaseType){case "carUpgrade":for(var g=server.GetCatalogItems({CatalogVersion:"CarCards"}),k=!1,c,e=0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==b.carId&&"CarsProgress"==a.Inventory[e].CatalogVersion){k=!0;c=a.Inventory[e];break}for(var h,e=0;e<g.Catalog.length;e++)if(g.Catalog[e].ItemId==b.carId){h=JSON.parse(g.Catalog[e].CustomData);break}if(void 0===
h)return log.error("cardInfo undefined!"),h={Result:"Error",Message:"CardNotFoundForCarwithID: "+b.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(!0===k){var r=parseInt(c.CustomData.CarLvl)+1,t=parseInt(h.baseCurrCost)+parseInt(c.CustomData.CarLvl)*parseInt(h.currCostPerLvl),d=checkBalance(h.currType,t,f,d);if("OK"!=d)return d;d=parseInt(h.baseCardCost)+parseInt(c.CustomData.CarLvl)*parseInt(h.cardCostPerLvl);c.CustomData.CarLvl=r;for(var k=
!1,m,e=0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==b.carId&&"CarCards"==a.Inventory[e].CatalogVersion){k=!0;try{if(void 0===a.Inventory[e].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");if(void 0===a.Inventory[e].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(a.Inventory[e].CustomData.Amount)>=d)a.Inventory[e].CustomData.Amount-=d,m={Amount:a.Inventory[e].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[e].ItemInstanceId,Data:m});else return generateFailObj("Insufficient cards for real: "+a.Inventory[e].CustomData.Amount+" vs "+d)}catch(w){return generateFailObj("Insufficient cards")}break}if(!1===k)return generateFailObj("No cards found");a=recalculateCarPr(c.CustomData,c.ItemId,g,void 0);e={CarLvl:r,Pr:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemInstanceId,Data:e});var n;0<t&&(n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:h.currType,Amount:t}));a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:m},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:e}];h={};e={Inventory:a};void 0!=n&&(h[n.VirtualCurrency]=n.Balance,e.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdate",InventoryChange:e}}else{for(var k=!1,z,e=0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==b.carId&&"CarCards"==a.Inventory[e].CatalogVersion){k=!0;try{if(void 0==a.Inventory[e].CustomData)return generateFailObj("Insufficient cards, CustomData null");
if(void 0==a.Inventory[e].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");if(Number(a.Inventory[e].CustomData.Amount)>=Number(h.baseCardCost))z=a.Inventory[e].ItemInstanceId,a.Inventory[e].CustomData.Amount-=h.baseCardCost,m={Amount:a.Inventory[e].CustomData.Amount};else return generateFailObj("Insufficient cards: "+a.Inventory[e].CustomData.Amount+" vs "+h.baseCardCost+".")}catch(w){return generateFailObj("Insufficient cards: "+w)}break}if(0==k)return generateFailObj("No cards found");
d=checkBalance(h.currType,h.baseCurrCost,f,d);if("OK"!=d)return d;e=[];e.push(b.carId);d=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:e});if(0==d.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:z,Data:m});0<h.baseCurrCost&&(n=
server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:h.baseCurrCost}));e={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:e});e={TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,
Data:e});e={PlatesId:"0",WindshieldId:"0",Pr:h.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:e});for(var f=d=!1,p,e=0;e<a.Inventory.length;e++)if("PaintJobs"==a.Inventory[e].ItemId){f=!0;void 0!=a.Inventory[e].CustomData?h.defaultPaintID in a.Inventory[e].CustomData?d=!0:(p={},p[h.defaultPaintID]="Owned"):(p={},p[h.defaultPaintID]="Owned");void 0!=p&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:a.Inventory[e].ItemInstanceId,Data:p});break}0==f&&(paintToGive=[],paintToGive.push("PaintJobs"),a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),p={},p[h.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:p}));e={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,
DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:h.basePr};a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:m},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:e}];0==d&&(e={},e[h.defaultPaintID]="Owned",a.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:e}));h={};e={Inventory:a};void 0!=n&&(h[n.VirtualCurrency]=n.Balance,e.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:e}}return h;case "partUpgrade":m=server.GetCatalogItems({CatalogVersion:"CarsProgress"});
p=!1;for(e=0;e<m.Catalog.length;e++)if(m.Catalog[e].ItemId==b.carId){p=!0;break}if(0==p)return log.error("invalid car ID"),h={Result:"Error",Message:"car with ID: "+b.carId+" not found in catalog."};m=server.GetCatalogItems({CatalogVersion:"PartCards"});p=!1;for(e=0;e<m.Catalog.length;e++)if(m.Catalog[e].ItemId==b.partId){h=JSON.parse(m.Catalog[e].CustomData);p=!0;break}if(0==p)return log.error("invalid part ID"),h={Result:"Error",Message:"part with ID: "+b.partId+" not found in catalog."};k=!1;for(e=
0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==b.carId&&"CarsProgress"==a.Inventory[e].CatalogVersion){k=!0;c=a.Inventory[e];break}if(0==k)return generateFailObj("car with ID: "+b.carId+" not found in user inventory.");p=!1;for(e=0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==b.partId&&"PartCards"==a.Inventory[e].CatalogVersion){p=!0;g={};k={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"};z=parseInt(h.baseCardCost,
10)+parseInt(c.CustomData[k[b.partId]],10)*parseInt(h.cardCostPerLvl,10);var u=parseInt(c.CustomData[k[b.partId]])+1,t=Number(h.baseCurrCost)+parseInt(c.CustomData[k[b.partId]])*Number(h.currCostPerLvl);g[k[b.partId]]=u;c.CustomData[k[b.partId]]=u;d=checkBalance(h.currType,t,f,d);if("OK"!=d)return d;try{if(void 0!=a.Inventory[e].CustomData&&void 0!=a.Inventory[e].CustomData.Amount&&a.Inventory[e].CustomData.Amount>=z)a.Inventory[e].CustomData.Amount-=z,r={Amount:a.Inventory[e].CustomData.Amount},
server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[e].ItemInstanceId,Data:r});else return generateFailObj("Insufficient cards")}catch(w){return generateFailObj("Insufficient cards")}break}if(0==p)return generateFailObj("Part not found");0<t&&(n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:t}));a=recalculateCarPr(c.CustomData,c.ItemId,void 0,m);g.Pr=a;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemInstanceId,Data:g});a=[{ItemId:b.partId,CatalogVersion:"PartCards",CustomData:r},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:g}];h={};e={Inventory:a};void 0!=n&&(h[n.VirtualCurrency]=n.Balance,e.VirtualCurrency=h);log.debug("HEY THERE MUCHACHOS!");UpdateExperience("Balancing",0,"Parts_0",1);return h={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:e};case "custPurchase":c=server.GetCatalogItems({CatalogVersion:"Customization"});h=0;n="SC";for(e=0;e<c.Catalog.length;e++)if(c.Catalog[e].ItemId==
b.custId){u=c.Catalog[e];h=JSON.parse(c.Catalog[e].CustomData);e=b.custVal+",Cost";n=h[b.custVal+",Curr"];h=h[e];d=checkBalance(n,h,f,d);if("OK"!=d)return d;break}if(void 0==u)return log.error("Customization does not exist in catalog"),h={Result:"Error",Message:"Customization does not exist in catalog."};for(var q,e=0;e<a.Inventory.length;e++)if(a.Inventory[e].ItemId==b.custId){q=a.Inventory[e];k=a.Inventory[e].ItemInstanceId;if(void 0!=q.CustomData&&String(b.custVal)in q.CustomData)return generateFailObj("User already has this customization.");
break}if(void 0==q){log.info("user doesn't have customization category. Granting ... ");e=[];e.push(b.custId);a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e});if(0==a.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),h={Result:"Error",Message:"something went wrong while granting user customization class object."};k=a.ItemGrantResults[0].ItemInstanceId}a={};a[String(b.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:k,Data:a});a=[{ItemId:b.custId,CatalogVersion:"Customization",CustomData:a}];0<h?(n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:n,Amount:h}),h={},h[n.VirtualCurrency]=n.Balance,e={Inventory:a,VirtualCurrency:h}):e={Inventory:a};return h={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:e};case "softCurrencyPurchase":n=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});a=!1;for(e=f=0;e<n.Catalog.length;e++)if(n.Catalog[e].ItemId==
b.packId){f=n.Catalog[e].VirtualCurrencyPrices.HC;h=JSON.parse(n.Catalog[e].CustomData);a=!0;break}if(0==a)return h={Result:"Error",Message:"pack with ID: "+b.packId+" not found in catalog."};if(0>=f)return h={Result:"Error",Message:"pack with ID: "+b.packId+" shouldn't have negative cost."};if(f>d)return generateFailObj("Not enough HC.");n=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:f});a=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",
Amount:h.quantity});h={};h[a.VirtualCurrency]=a.Balance;h[n.VirtualCurrency]=n.Balance;return h={Result:"OK",Message:"SoftCurrencyPurchased",InventoryChange:{VirtualCurrency:h}};default:log.debug("invalid purchase parameter")}};handlers.requestCurrency=function(b){return{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(b){b=server.GetUserInventory({PlayFabId:currentPlayerId});for(var l=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),f=!1,d=0;d<b.Inventory.length;d++)if("CarsProgress"==b.Inventory[d].CatalogVersion){var f=!0,g=checkCarDataValidity(b.Inventory[d],l);if("PlayFabError"==g||void 0===g)return generateErrObj("PlayfabError");"OK"==g?log.debug("Data for "+b.Inventory[d].ItemId+" OK"):b.Inventory[d].CustomData=g;
b.Inventory[d].CustomData.Pr=recalculateCarPr(b.Inventory[d].CustomData,b.Inventory[d].ItemId,l,a);g={};g.Pr=b.Inventory[d].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[d].ItemInstanceId,Data:g})}return!1===f?(b=[],b.push("FordFocus"),b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b}),l={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l}),l={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l}),l={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l}),generateErrObj("UserHasNoCars ... reiniting")):b};
handlers.retrieveBlackMarket=function(b,l){var a=[];a.push("BMTime");for(var f=0;4>f;f++)a.push("BMItem"+f);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0===a.Data.BMTime)return GenerateBlackMarket(currentPlayerId);var f=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:currentPlayerId,Keys:d});if(!0===b.reset){a="HC";f=200;d=server.GetTitleData({Keys:["BlackMarketResetCost"]});void 0!==d.Data.BlackMarketResetCost&&(f=d.Data.BlackMarketResetCost.split("_"),
a=f[0],f=Number(f[1]));if(0<f){d=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,f,d.VirtualCurrency.SC,d.VirtualCurrency.HC))return generateFailObj("not enough money");f=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:f});a=GenerateBlackMarket(currentPlayerId);d={};d[f.VirtualCurrency]=f.Balance;f={VirtualCurrency:d};a.InventoryChange=f;return a}return GenerateBlackMarket(currentPlayerId)}return f.getTime()-parseInt(a.Data.BMTime.Value)>
6E4*parseInt(d.Data.BlackMarketResetMinutes)?GenerateBlackMarket(currentPlayerId):GetCurrentBlackMarket(currentPlayerId,a)};
handlers.startGame=function(b,l){var a="10",f,d=50,g,k=0;g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=g.Statistics.length){f=g.Statistics[0].Value.toString();a=Number(f).toString(2);g=a.length;for(var c=0;c<a.length;c++)"1"==a[c]&&k++;d=Math.round(k/g*100)}a+="0";20<a.length&&(a=a.slice(1));var e=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges","TrophyGainRange","TrophyLoseRange"]});g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,
StatisticNames:["TrophyCount"]});k=0;0!=g.Statistics.length&&(k=g.Statistics[0].Value);var k=Number(k),h=JSON.parse(e.Data.SubdivisionTrophyRanges),r=JSON.parse(e.Data.LeagueSubdivisions),t=43,m=43,n;g=e.Data.TrophyGainRange.split("_");n=e.Data.TrophyLoseRange.split("_");f=Number(g[0]);g=Number(g[1]);for(var e=Number(n[0]),z=Number(n[1]),c=0;c<h.subdivisions.length;c++)if(k<Number(h.subdivisions[c])){t=c;c<h.subdivisions.length-1&&(m=c+1);break}n=Number(h.subdivisions[m])-Number(h.subdivisions[t]);
log.debug("nextSubDivision "+m+" subDivision "+t);log.debug(" sdvalParsed.subdivisions[nextSubDivision] "+h.subdivisions[m]+" sdvalParsed.subdivisions[subDivision] "+h.subdivisions[t]);0>=n&&(n=400);log.debug("subDivisionRange "+n);var p=server.GetTitleInternalData({Keys:"RecSubDivision"+t}).Data["RecSubDivision"+t],m=!1;void 0==p&&(m=!0);var u,q=t="noop",w,c=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["lastOpp"]});if(void 0==c.Data||void 0==c.Data.lastOpp)q=t="noop";else for(w=c.Data.lastOpp.Value.split(","),
c=0;c<w.length;c++)0==c&&(t=w[c]),1==c&&(q=w[c]);u=0==m?JSON.parse(p):[];var C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];15>u.length&&(m=!0);var D=Array(u.length),B=0,p=Array(u.length);w=0;for(var A=Array(u.length),x=0,c=0;c<u.length;c++)1==m&&(C[5*Number(u[c].e)+Number(u[c].c)]=1),u[c].uId!=currentPlayerId&&(D[B]=u[c],B++,u[c].uId!=t&&(p[w]=u[c],w++,u[c].uId!=q&&(A[x]=u[c],x++)));if(1==m){for(c=q=m=0;c<C.length;c++)if(0==C[c]){m=Math.floor(c/5);q=c%5;break}c=server.GetTitleData({Keys:"MasterUser"});if(void 0!=
c.Data.MasterUser&&(c=server.GetUserReadOnlyData({PlayFabId:c.Data.MasterUser,Keys:[m+"_"+q+"_RecPos",m+"_"+q+"_RecRot",m+"_"+q+"_RecHeader"]}),void 0!=c.Data&&void 0!=c.Data[m+"_"+q+"_RecPos"]&&void 0!=c.Data[m+"_"+q+"_RecRot"]&&void 0!=c.Data[m+"_"+q+"_RecHeader"])){t=!0;0==k?(k=g,t=!1):k-=e;1>=k&&(k=1);f=parseInt(a,2);var a=[],y={StatisticName:"WinLoss",Version:"0",Value:f};a.push(y);k={StatisticName:"TrophyCount",Version:"0",Value:k};a.push(k);k={StatisticName:"League",Version:"0",Value:v};a.push(k);
server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:g,trophyLose:e};0==t&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:"Default",PosData:c.Data[m+"_"+q+"_RecPos"].Value,RotData:c.Data[m+"_"+q+"_RecRot"].Value,HeaderData:c.Data[m+"_"+q+"_RecHeader"].Value,TrophyLose:e,TrophyWin:g,Opp:"Mniezo"}}}if(0==B)return generateErrObj("no valid recording found for this subdivision");v=D;m=B;0<w&&(m=
w,v=p);0<x&&(m=x,v=A);p=m-1;for(c=0;c<m;c++)if(v[c].wl>d){p=c;break}d=Math.min(m,3);q=Array(d);for(c=0;c<d;c++)q[c]=0>=p?v[c]:p>=m-1?v[m-1-c]:v[p-Math.floor(d/2)+c];v=Math.floor(Math.random()*d);c=q[v].uId;d=q[v].e;m=q[v].c;q=server.GetUserReadOnlyData({PlayFabId:c,Keys:[d+"_"+m+"_RecPos",d+"_"+m+"_RecRot",d+"_"+m+"_RecHeader"]});if(void 0==q)return generateErrObj("Did not find recording for this user: "+c);var p=server.GetPlayerCombinedInfo({PlayFabId:c,InfoRequestParameters:{GetUserAccountInfo:!0,
GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),A=k,v=Number(calculateLeague(k));w="UserGenerated";x=0<v?Number(h.subdivisions[r.leagues[v-1]]):0;r=v>=r.leagues.length-1?2*x:Number(h.subdivisions[r.leagues[v]]);h=JSON.parse(q.Data[d+"_"+m+"_RecHeader"].Value);void 0!=h&&(y=h.Trophies);y=Number(y);0>=r-x?h=g:Number(Math.abs(A-y))>Number(n)?(h=Math.floor((e+z)/2),e=Math.floor((g+
f)/2),w="Default"):(h=e+Math.floor((z-e)/2*((A-y)/(r-x)+1)),e=f+Math.floor((g-f)/2*((y-A)/(r-x)+1)));r=!0;0==k?(r=!1,k=g):(k-=Number(h),1>=k&&(k=1));f=parseInt(a,2);a=[];y={StatisticName:"WinLoss",Version:"0",Value:f};a.push(y);k={StatisticName:"TrophyCount",Version:"0",Value:k};a.push(k);k={StatisticName:"League",Version:"0",Value:v};a.push(k);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:e,trophyLose:h,lastOpp:c+","+t};0==r&&(a.trophyWin=0,a.trophyLose=0);
server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:w,PosData:q.Data[d+"_"+m+"_RecPos"].Value,RotData:q.Data[d+"_"+m+"_RecRot"].Value,HeaderData:q.Data[d+"_"+m+"_RecHeader"].Value,TrophyLose:h,TrophyWin:e,Opp:p.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateCarCust=function(b,l){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),f=[],d="-1",g={},k={PaintJobs:{itemOwned:"no",itemCustData:b.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:b.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:b.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:b.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:b.wsId,carItemId:"WindshieldId"}},c=0;c<a.Inventory.length;c++)a.Inventory[c].ItemId==
b.carId&&"CarsProgress"==a.Inventory[c].CatalogVersion&&(d=a.Inventory[c].ItemInstanceId),a.Inventory[c].ItemId in k&&(k[a.Inventory[c].ItemId].itemOwned="yes",k[a.Inventory[c].ItemId].itemCustData in a.Inventory[c].CustomData?g[k[a.Inventory[c].ItemId].carItemId]=k[a.Inventory[c].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[c].ItemId+" "+k[a.Inventory[c].ItemId].itemCustData));if("-1"==d)return generateFailObj("User does not own car with id: "+b.carId);for(var e in k)k.hasOwnProperty(e)&&
"no"==k[e].itemOwned&&f.push(e);if(g=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:g});a=[{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:g}];if(0<f.length)for(f=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:f}),d={0:"Owned"},c=0;c<f.ItemGrantResults.length;c++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:f.ItemGrantResults[c].ItemInstanceId,Data:d});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.updateTrophyCount=function(b,l){var a=0,f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!==f.Statistics.length&&(a=f.Statistics[0].Value);"rStart"==b.val&&(a-=30);0>a&&(a=0);"rWin"==b.val&&(a+=60);if("rLose"==b.val)return{val:a};f=[];f.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:f});if("rWin"==b.val)return{val:a}};
