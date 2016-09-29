handlers.endGame=function(b,l){var a="01",e="0";"rWin"==b.outcome&&(e="1");var d=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=d.Statistics.length&&(a=d.Statistics[0].Value.toString(),log.debug("wlStatInt "+a),a=Number(a).toString(2),log.debug("wlStat "+a));d=0;log.debug("wlStat.length "+a.length);var f=Array(a.length);log.debug("tempString.length "+f.length);for(var h=0;h<f.length-1;h++)f[h]=a[h];f[f.length-1]=e;log.debug("tempString "+f);a=f;log.debug("wlStat "+
a);e=a.length;for(h=0;h<a.length;h++)"1"==a[h]&&d++;log.debug("wlStatNew "+a);d=Math.round(d/e*100);log.debug("winRatio "+d);h=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});e=0;f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=f.Statistics.length&&(e=f.Statistics[0].Value);f=e;"rWin"==b.outcome&&(e=0>=e?30:e+60);log.debug("trophies change: "+f+" => "+e);var g=calculateLeague(e),a=parseInt(a,2),c=[];c.push({StatisticName:"WinLoss",
Version:"0",Value:a});a={StatisticName:"TrophyCount",Version:"0",Value:e};c.push(a);a={StatisticName:"League",Version:"0",Value:g};c.push(a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});if("rOot"==b.outcome){var k={TrophyCount:e};return{Result:k}}a=JSON.parse(h.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+a);for(h=0;h<a.subdivisions.length;h++)if(f<a.subdivisions[h]){k=h;break}log.debug("user is in subdivision "+k);h=[];h.push({Key:b.envIndex+"_"+b.courseIndex+
"_RecPos",Value:b.recordingPos});h.push({Key:b.envIndex+"_"+b.courseIndex+"_RecRot",Value:b.recordingRot});h.push({Key:b.envIndex+"_"+b.courseIndex+"_RecHeader",Value:b.recordingHeader});log.debug("updating user read only data ");h=server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:h});log.debug("updated user read only data for "+currentPlayerId+" "+h);h=server.GetTitleInternalData({Key:"RecSubDivision"+k}).Data["RecSubDivision"+k];log.debug("recPool: "+h);if(void 0==h)a=[],d={wl:d,e:b.envIndex,
c:b.courseIndex,uId:currentPlayerId},a.push(d),d=JSON.stringify(a),log.debug("recArray: "+d);else{a=JSON.parse(h);log.debug("recArray: "+a);d={wl:d,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId};f=!1;for(h=0;h<a.length;h++)if(a[h].e==b.envIndex&&a[h].c==b.courseIndex){f=!0;a[h]=d;if(1==a.length)break;if(0<h)if(a[h].wl>a[h-1].wl){if(h==a.length-1)break;for(g=h+1;g<a.length;g++)if(a[g-1].wl>a[g].wl)c=a[g],a[g]=a[g-1],a[g-1]=c;else break}else for(g=h-1;0<=g;g--)if(a[g+1].wl<a[g].wl)c=a[g],a[g]=a[g+
1],a[g+1]=c;else break;else for(g=h+1;g<a.length;g++)if(a[g-1].wl>a[g].wl)c=a[g],a[g]=a[g-1],a[g-1]=c;else break}0==f&&(log.debug("recArrayLNbefore: "+a.length),a.push(d),log.debug("recArrayLNafter: "+a.length));d=JSON.stringify(a);log.debug("titleKeyVal: "+d)}server.SetTitleInternalData({Key:"RecSubDivision"+k,Value:d});k={TrophyCount:e};return{Result:k}};
handlers.startGame=function(b,l){var a="01",e=50,d=0,f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=f.Statistics.length){for(var a=f.Statistics[0].Value.toString(),a=Number(a).toString(2),e=a.length,h=0;h<a.length;h++)"1"==a[h]&&d++;e=Math.round(d/e*100)}a+="0";20<a.length&&a.shift();log.debug("wlStat "+a);f=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});h=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});
d=0;0!=h.Statistics.length&&(d=h.Statistics[0].Value);f=JSON.parse(f.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+f);for(var g,h=0;h<f.subdivisions.length;h++)if(d<f.subdivisions[h]){g=h;break}log.debug("user is in subdivision "+g);g=server.GetTitleInternalData({Keys:"RecSubDivision"+g}).Data["RecSubDivision"+g];log.debug("recPool "+g);if(void 0==g)return generateErrObj("Recording pool for this subdivision is null");log.debug("parsing to json array");var c=JSON.parse(g),k=c[c.length-
1].uId;g=c[c.length-1].e;f=c[c.length-1].c;for(h=0;h<c.length;h++)if(e<c[h].wl){k=c[h].uId;g=c[h].e;f=c[h].c;break}e=[g+"_"+f+"_RecPos",g+"_"+f+"_RecRot",g+"_"+f+"_RecHeader"];log.debug("requesting "+e);e=server.GetUserReadOnlyData({PlayFabId:k,Keys:e});if(void 0==e)return generateErrObj("Did not find recording for this user: "+k);h=server.GetPlayerCombinedInfo({PlayFabId:k,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,
GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}});d-=30;0>=d&&(d=0);a=parseInt(a,2);k=calculateLeague(d);c=[];c.push({StatisticName:"WinLoss",Version:"0",Value:a});c.push({StatisticName:"TrophyCount",Version:"0",Value:d});c.push({StatisticName:"League",Version:"0",Value:k});log.debug("updatingStats: "+c);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});return{Result:"OK",PosData:e.Data[g+"_"+f+"_RecPos"].Value,RotData:e.Data[g+"_"+f+"_RecRot"].Value,
HeaderData:e.Data[g+"_"+f+"_RecHeader"].Value,Opp:h.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateTrophyCount=function(b,l){var a=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=e.Statistics.length&&(a=e.Statistics[0].Value);"rStart"==b.val&&(a-=30);0>a&&(a=0);"rWin"==b.val&&(a+=60);if("rLose"==b.val)return{val:a};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==b.val)return{val:a}};
handlers.initServerData=function(b){b=[];var l={StatisticName:"TrophyCount",Version:"0",Value:"0"};b.push(l);l={StatisticName:"League",Version:"0",Value:"0"};b.push(l);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=[];b.push("Decals");b.push("PaintJobs");b.push("Plates");b.push("Rims");b.push("WindshieldText");b=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:b});for(var l={0:"Owned"},a=0;a<b.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[a].ItemInstanceId,Data:l});b=[];b.push("FordFocus");b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b});l={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:3E3});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:200})};
handlers.requestInventory=function(b){b=server.GetUserInventory({PlayFabId:currentPlayerId});for(var l=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),e=0;e<b.Inventory.length;e++)if("CarsProgress"==b.Inventory[e].CatalogVersion){log.debug("found "+b.Inventory[e].ItemId);b.Inventory[e].CustomData.Pr=recalculateCarPr(b.Inventory[e].CustomData,b.Inventory[e].ItemId,l,a);var d={};d.Pr=b.Inventory[e].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.Inventory[e].ItemInstanceId,Data:d})}return b};function generateFailObj(b){return{Result:"Failed",Message:b}}function generateErrObj(b){return{Result:"Error",Message:b}}function checkBalance(b,l,a,e){if("SC"==b){if(a<l)return generateFailObj("NotEnoughSC")}else if(e<l)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(b){td=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==td.Data.LeagueSubdivisions||void 0==td.Data.SubdivisionTrophyRanges)return 1;for(var l=JSON.parse(td.Data.LeagueSubdivisions).leagues,a=JSON.parse(td.Data.SubdivisionTrophyRanges).subdivisions,e=0;e<l.length;e++)if(!(Number(b)<Number(a[l[e]])))return e}
function recalculateCarPr(b,l,a,e){var d=0,f;f=void 0==a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<f.Catalog.length;a++)if(f.Catalog[a].ItemId==l){a=JSON.parse(f.Catalog[a].CustomData);d+=parseInt(a.basePr)+parseInt(a.prPerLvl)*(parseInt(b.CarLvl)-1);break}e=void 0==e?server.GetCatalogItems({CatalogVersion:"PartCards"}):e;b={Exhaust:b.ExhaustLvl,Engine:b.EngineLvl,Gearbox:b.GearboxLvl,Suspension:b.SuspensionLvl,Tires:b.TiresLvl,Turbo:b.TurboLvl};for(a=0;a<e.Catalog.length;a++)l=
JSON.parse(e.Catalog[a].CustomData),d+=parseInt(l.basePr)+parseInt(l.prPerLvl)*b[e.Catalog[a].ItemId];return d}
function GenerateBlackMarket(b){var l=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var e=Math.floor(Math.random()*l.Catalog.length),d=JSON.parse(l.Catalog[e].CustomData);if(void 0==d)return generateErrObj("Part card "+l.Catalog[h].ItemId+" has no custom data.");a.BMItem0=l.Catalog[e].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy;var f=Math.floor(Math.random()*l.Catalog.length);f==e&&(f=l.Catalog.length-e-1);d=JSON.parse(l.Catalog[f].CustomData);
if(void 0==d)return generateErrObj("Part card "+l.Catalog[h].ItemId+" has no custom data.");a.BMItem1=l.Catalog[f].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy;for(var l=server.GetCatalogItems({CatalogVersion:"CarCards"}),d=[],f=[],h=0;h<l.Catalog.length;h++){e=JSON.parse(l.Catalog[h].CustomData);if(void 0==e)return generateErrObj("Car card "+l.Catalog[h].ItemId+" has no custom data.");"false"==e.rareCar?d.push(l.Catalog[h].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy):
f.push(l.Catalog[h].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy)}0>=d.length?(a.BMItem2=f[Math.floor(Math.random()*f.length)],a.BMItem3=f[Math.floor(Math.random()*f.length)]):0>=f.length?(a.BMItem2=d[Math.floor(Math.random()*d.length)],a.BMItem3=d[Math.floor(Math.random()*d.length)]):(a.BMItem2=d[Math.floor(Math.random()*d.length)],a.BMItem3=f[Math.floor(Math.random()*f.length)]);server.UpdateUserInternalData({PlayFabId:b,Data:a});h=[];h.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:b,
Keys:h});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes);return a}function GetCurrentBlackMarket(b,l){var a={},e=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:b,Keys:d});a.BMTime=60*parseInt(d.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-l.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)a["BMItem"+e]=l.Data["BMItem"+e].Value;return a}
handlers.purchaseBMItem=function(b,l){log.debug("purchasing item "+b.itemId+" from black market");if(0>b.itemId||3<b.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+b.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),e=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+b.itemId].Value.split("_");log.debug("userArray: "+a);var d=e.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var f;f=2>b.itemId?"PartCards":"CarCards";var h=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),d=checkBalance(a[1],h,d,d);if("OK"!=d)return d;var g,c;log.debug("searching for: "+a[0]+" in "+f);for(d=0;d<e.Inventory.length;d++)if(e.Inventory[d].ItemId==a[0]&&e.Inventory[d].CatalogVersion==f){log.debug("found it!");g=e.Inventory[d].ItemInstanceId;void 0==e.Inventory[d].CustomData?(log.debug("no custom data. creating ..."),c={Amount:1}):void 0==e.Inventory[d].CustomData.Amount?c={Amount:1}:(c=Number(e.Inventory[d].CustomData.Amount)+
1,isNaN(c)&&(c=1),c={Amount:c});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g,Data:c});break}void 0==g&&(log.debug("cardInstance is undefined"),g=[],g.push(a[0]),g=server.GrantItemsToUser({CatalogVersion:f,PlayFabId:currentPlayerId,ItemIds:g}).ItemGrantResults[0].ItemInstanceId,void 0==g?generateErrObj("grantRequest denied"):(c={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g,Data:c})));g=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:a[1],Amount:h});h=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];log.debug("generatedArray: "+h);e={};e["BMItem"+b.itemId]=h;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:e});c=[{ItemId:a[0],CatalogVersion:f,CustomData:c}];f={};f[g.VirtualCurrency]=g.Balance;a=b.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];d={Inventory:c,VirtualCurrency:f};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:d,BMItemChange:a}};
handlers.retrieveBlackMarket=function(b,l){var a=[];a.push("BMTime");for(var e=0;4>e;e++)a.push("BMItem"+e);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0==a.Data.BMTime)return log.debug("No user BM data detected; generating ..."),GenerateBlackMarket(currentPlayerId);e=new Date;log.debug("milliseconds passed: "+e.getTime());log.debug("BMTime: "+a.Data.BMTime.Value);var d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:currentPlayerId,Keys:d});if(e.getTime()-
parseInt(a.Data.BMTime.Value)>6E4*parseInt(d.Data.BlackMarketResetMinutes))return log.debug("regenerating market"),GenerateBlackMarket(currentPlayerId);log.debug("get current market");return GetCurrentBlackMarket(currentPlayerId,a)};
handlers.updateCarCust=function(b,l){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],d="-1",f={},h={PaintJobs:{itemOwned:"no",itemCustData:b.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:b.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:b.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:b.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:b.wsId,carItemId:"WindshieldId"}},g=0;g<a.Inventory.length;g++)a.Inventory[g].ItemId==
b.carId&&"CarsProgress"==a.Inventory[g].CatalogVersion&&(d=a.Inventory[g].ItemInstanceId),a.Inventory[g].ItemId in h&&(h[a.Inventory[g].ItemId].itemOwned="yes",h[a.Inventory[g].ItemId].itemCustData in a.Inventory[g].CustomData?f[h[a.Inventory[g].ItemId].carItemId]=h[a.Inventory[g].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[g].ItemId+" "+h[a.Inventory[g].ItemId].itemCustData));if("-1"==d)return generateFailObj("User does not own car with id: "+b.carId);for(var c in h)h.hasOwnProperty(c)&&
"no"==h[c].itemOwned&&e.push(c);if(f=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:f});a=[{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:f}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),d={0:"Owned"},g=0;g<e.ItemGrantResults.length;g++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[g].ItemInstanceId,Data:d});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.purchaseItems=function(b,l){log.debug("RETRIEVING USER INVENTORY");var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=a.VirtualCurrency.SC,d=a.VirtualCurrency.HC;log.debug("user currency: SC: "+e+" HC: "+d);switch(b.purchaseType){case "carUpgrade":log.debug("== carUpgrade request: carId: "+b.carId);log.debug("RETRIEVING CARDS CATALOGUE");for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),h=!1,g,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarsProgress"==
a.Inventory[c].CatalogVersion){h=!0;log.debug("car is in user's inventory!");g=a.Inventory[c];break}for(var k,c=0;c<f.Catalog.length;c++)if(f.Catalog[c].ItemId==b.carId){k=JSON.parse(f.Catalog[c].CustomData);log.debug("cardInfo found!");break}if(void 0==k)return log.error("cardInfo undefined!"),k={Result:"Error",Message:"CardNotFoundForCarwithID: "+b.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(1==h){log.debug("user has car: "+b.carId+
"... upgrading");var r=parseInt(k.baseCurrCost)+parseInt(g.CustomData.CarLvl)*parseInt(k.currCostPerLvl),d=checkBalance(k.currType,r,e,d);if("OK"!=d)return d;log.debug("user has enough currency. Let's check for card balance");d=parseInt(k.baseCardCost)+parseInt(g.CustomData.CarLvl)*parseInt(k.cardCostPerLvl);log.debug("cardCost: "+d);for(var q=!1,p,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarCards"==a.Inventory[c].CatalogVersion){log.debug("consuming: "+a.Inventory[c].ItemInstanceId);
q=!0;try{if(void 0==a.Inventory[c].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");if(void 0==a.Inventory[c].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(a.Inventory[c].CustomData.Amount)>=d)a.Inventory[c].CustomData.Amount-=d,p={Amount:a.Inventory[c].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,Data:p});else return generateFailObj("Insufficient cards for real: "+
a.Inventory[c].CustomData.Amount+" vs "+d)}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase upgrade!");c=parseInt(g.CustomData.CarLvl)+1;a=recalculateCarPr(g.CustomData,g.ItemId,f,void 0);log.debug("upgrading to car lvl: "+c+" and pr: "+a);c={CarLvl:c,Pr:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemInstanceId,
Data:c});var m;0<r&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:r}));log.debug("Upgrade Complete!");a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:p},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:c}];k={};c={Inventory:a};void 0!=m&&(k[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=k);k={Result:"OK",Message:"InventoryUpdate",InventoryChange:c}}else{log.debug("user doesn't have car: "+b.carId+"... looking for card");for(var q=
!1,t,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarCards"==a.Inventory[c].CatalogVersion){log.debug("consuming: "+a.Inventory[c].ItemInstanceId);q=!0;try{if(void 0==a.Inventory[c].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0==a.Inventory[c].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");if(Number(a.Inventory[c].CustomData.Amount)>=Number(k.baseCardCost))t=a.Inventory[c].ItemInstanceId,a.Inventory[c].CustomData.Amount-=
k.baseCardCost,p={Amount:a.Inventory[c].CustomData.Amount};else return generateFailObj("Insufficient cards: "+a.Inventory[c].CustomData.Amount+" vs "+k.baseCardCost+".")}catch(u){return generateFailObj("Insufficient cards: "+u)}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");d=checkBalance(k.currType,k.baseCurrCost,e,d);if("OK"!=d)return d;c=[];c.push(b.carId);d=server.GrantItemsToUser({CatalogVersion:"CarsProgress",
PlayFabId:currentPlayerId,ItemIds:c});if(0==d.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:t,Data:p});0<k.baseCurrCost&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:k.baseCurrCost}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",
GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:c});c={TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:c});c={PlatesId:"0",WindshieldId:"0",Pr:k.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,
Data:c});g=d=!1;for(var n,c=0;c<a.Inventory.length;c++)if("PaintJobs"==a.Inventory[c].ItemId){g=!0;log.debug("user has paintjobs");void 0!=a.Inventory[c].CustomData?(log.debug("user has paintjobs customData"),k.defaultPaintID in a.Inventory[c].CustomData?(log.debug("user has paintjob already"),d=!0):(log.debug("user doesn't have paintjob"),n={},n[k.defaultPaintID]="Owned")):(n={},n[k.defaultPaintID]="Owned");void 0!=n&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,
Data:n});break}0==g&&(paintToGive=[],paintToGive.push("PaintJobs"),a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),n={},n[k.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:n}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:k.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:k.basePr};a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:p},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:c}];0==d&&(c={},c[k.defaultPaintID]="Owned",a.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:c}));k={};c={Inventory:a};void 0!=m&&(k[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=k);k={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:c}}return k;case "partUpgrade":log.debug("Upgrading Part: "+b.partId+" on Car: "+b.carId);log.debug("Checking to see if car exists in catalog");
p=server.GetCatalogItems({CatalogVersion:"CarsProgress"});n=!1;for(c=0;c<p.Catalog.length;c++)if(p.Catalog[c].ItemId==b.carId){n=!0;break}if(0==n)return log.error("invalid car ID"),k={Result:"Error",Message:"car with ID: "+b.carId+" not found in catalog."};log.debug("Checking to see if part exists in catalog");p=server.GetCatalogItems({CatalogVersion:"PartCards"});n=!1;for(c=0;c<p.Catalog.length;c++)if(p.Catalog[c].ItemId==b.partId){k=JSON.parse(p.Catalog[c].CustomData);n=!0;break}if(0==n)return log.error("invalid part ID"),
k={Result:"Error",Message:"part with ID: "+b.partId+" not found in catalog."};log.debug("Checking to see if user has car: "+b.carId);h=!1;for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarsProgress"==a.Inventory[c].CatalogVersion){h=!0;log.debug("car is in user's inventory!");g=a.Inventory[c];break}if(0==h)return generateFailObj("car with ID: "+b.carId+" not found in user inventory.");log.debug("Checking to see if user has part and or has enough parts");n=!1;for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==
b.partId&&"PartCards"==a.Inventory[c].CatalogVersion){n=!0;log.debug("part is in user's inventory!");f={};h={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"};log.debug("calculating "+b.partId+" cost and modifying "+h[b.partId]);t=parseInt(k.baseCardCost)+parseInt(g.CustomData[h[b.partId]])*parseInt(k.cardCostPerLvl);var r=parseInt(k.baseCurrCost)+parseInt(g.CustomData[h[b.partId]])*parseInt(k.currCostPerLvl),v=parseInt(g.CustomData[h[b.partId]])+
1;f[h[b.partId]]=v;g.CustomData[h[b.partId]]=v;log.debug("we need: "+t+" cards");d=checkBalance(k.currType,r,e,d);if("OK"!=d)return d;log.debug("consuming part instance: "+a.Inventory[c].ItemInstanceId);try{if(void 0!=a.Inventory[c].CustomData&&void 0!=a.Inventory[c].CustomData.Amount&&a.Inventory[c].CustomData.Amount>=t)a.Inventory[c].CustomData.Amount-=t,q={Amount:a.Inventory[c].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,
Data:q});else return generateFailObj("Insufficient cards")}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}if(0==n)return generateFailObj("Part not found");0<r&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:k.currType,Amount:r}));a=recalculateCarPr(g.CustomData,g.ItemId,void 0,p);f.Pr=a;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemInstanceId,Data:f});a=[{ItemId:b.partId,
CatalogVersion:"PartCards",CustomData:q},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:f}];log.debug("succesfully upgraded part!");k={};c={Inventory:a};void 0!=m&&(k[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=k);return k={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:c};case "custPurchase":log.debug("Purchasing Customization: "+b.custId+" with val: "+b.custVal);log.debug("Checking to see if customization exists in catalog");g=server.GetCatalogItems({CatalogVersion:"Customization"});
k=0;m="SC";for(c=0;c<g.Catalog.length;c++)if(g.Catalog[c].ItemId==b.custId){v=g.Catalog[c];k=JSON.parse(g.Catalog[c].CustomData);c=b.custVal+",Cost";m=k[b.custVal+",Curr"];k=k[c];d=checkBalance(m,k,e,d);if("OK"!=d)return d;log.debug("custCurr: "+m);log.debug("custPrice: "+k);break}if(void 0==v)return log.error("Customization does not exist in catalog"),k={Result:"Error",Message:"Customization does not exist in catalog."};log.debug("Checking to see if user has said customization");for(var w,c=0;c<
a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.custId){log.debug("user has customization category!");w=a.Inventory[c];h=a.Inventory[c].ItemInstanceId;if(void 0!=w.CustomData&&String(b.custVal)in w.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==w){log.info("user doesn't have customization category. Granting ... ");c=[];c.push(b.custId);a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:c});if(0==a.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),
k={Result:"Error",Message:"something went wrong while granting user customization class object."};h=a.ItemGrantResults[0].ItemInstanceId}a={};a[String(b.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h,Data:a});a=[{ItemId:b.custId,CatalogVersion:"Customization",CustomData:a}];0<k?(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:m,Amount:k}),k={},k[m.VirtualCurrency]=m.Balance,c={Inventory:a,VirtualCurrency:k}):c=
{Inventory:a};return k={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:c};case "softCurrencyPurchase":log.debug("Purchasing pack: "+b.packId);log.debug("Checking to see if pack exists in catalog");m=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});a=!1;for(c=g=0;c<m.Catalog.length;c++)if(m.Catalog[c].ItemId==b.packId){g=m.Catalog[c].VirtualCurrencyPrices.HC;k=JSON.parse(m.Catalog[c].CustomData);a=!0;break}if(0==a)return k={Result:"Error",Message:"pack with ID: "+
b.packId+" not found in catalog."};if(0>=g)return k={Result:"Error",Message:"pack with ID: "+b.packId+" shouldn't have negative cost."};if(g>d)return generateFailObj("Not enough HC.");m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:g});a=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:k.quantity});k={};k[a.VirtualCurrency]=a.Balance;k[m.VirtualCurrency]=m.Balance;return k={Result:"OK",Message:"SoftCurrencyPurchased",
InventoryChange:{VirtualCurrency:k}};default:log.debug("invalid purchase parameter")}};handlers.giveMoney=function(b){b=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.amount});var l={};l[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:l}}};
handlers.grantItems=function(b){for(var l=server.GetUserInventory({PlayFabId:currentPlayerId}),a,e=!1,d=0;d<l.Inventory.length;d++)if(l.Inventory[d].ItemId==b.itemId&&l.Inventory[d].CatalogVersion==b.catalogId){log.debug("adding amount to: "+l.Inventory[d].ItemInstanceId);a=void 0==l.Inventory[d].CustomData?b.amount:void 0==l.Inventory[d].CustomData.Amount?b.amount:isNaN(Number(l.Inventory[d].CustomData.Amount))?b.amount:Number(l.Inventory[d].CustomData.Amount)+b.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:l.Inventory[d].ItemInstanceId,Data:a});e=!0;break}0==e&&(l=[],l.push(b.itemId),l=server.GrantItemsToUser({CatalogVersion:b.catalogId,PlayFabId:currentPlayerId,ItemIds:l}),a={Amount:b.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:b.itemId,CatalogVersion:b.catalogId,CustomData:a}]}}};
handlers.openChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<b.currCost){if("OK"!=checkBalance(b.currType,b.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:b.currCost})}for(var e in b.currencyReq)0<b.currencyReq[e]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:e,Amount:b.currencyReq[e]});var d;
for(e in b.carCardsRequest)if(log.debug(e+" : "+b.carCardsRequest[e]),b.carCardsRequest.hasOwnProperty(e)){d=!1;log.debug("looking for: "+e);for(var f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"CarCards"==a.Inventory[f].CatalogVersion){log.debug("adding amount to: "+a.Inventory[f].ItemInstanceId);d=void 0==a.Inventory[f].CustomData?Number(b.carCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(b.carCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(b.carCardsRequest[e]):
Number(a.Inventory[f].CustomData.Amount)+Number(b.carCardsRequest[e]);d={Amount:d};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:d});d=!0;break}0==d&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:f}),d={Amount:b.carCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:d}))}for(e in b.partCardsRequest)if(log.debug(e+
" : "+b.partCardsRequest[e]),b.partCardsRequest.hasOwnProperty(e)){d=!1;log.debug("looking for: "+e);for(f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"PartCards"==a.Inventory[f].CatalogVersion){log.debug("adding amount to: "+a.Inventory[f].ItemInstanceId);d=void 0==a.Inventory[f].CustomData?Number(b.partCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(b.partCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(b.partCardsRequest[e]):Number(a.Inventory[f].CustomData.Amount)+
Number(b.partCardsRequest[e]);d={Amount:d};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:d});d=!0;break}0==d&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:f}),d={Amount:b.partCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:d}))}return{Result:"OK",Message:"InventoryUpdated",InventoryChange:server.GetUserInventory({PlayFabId:currentPlayerId})}};
handlers.buyChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(b.curr,b.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.cost}),e={};e[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:e}}};handlers.getServerTime=function(b,l){return{time:new Date}};
