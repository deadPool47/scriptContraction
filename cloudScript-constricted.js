handlers.endGame=function(b,l){var a="01",d,e="0";"rWin"==b.outcome&&(e="1");var g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=g.Statistics.length&&(d=g.Statistics[0].Value.toString(),log.debug("wlStatInt "+d),a=Number(d).toString(2),log.debug("wlStat "+a));g=0;log.debug("wlStat.length "+a.length);var k=Array(a.length);log.debug("tempString.length "+k.length);for(var f=0;f<k.length-1;f++)k[f]=a[f];k[k.length-1]=e;log.debug("tempString "+k);a=k;log.debug("wlStat "+
a);e=a.length;for(f=0;f<a.length;f++)"1"==a[f]&&g++;log.debug("wlStatNew "+a);g=Math.round(g/e*100);log.debug("winRatio "+g);f=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});e=0;k=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=k.Statistics.length&&(e=k.Statistics[0].Value);k=e;"rWin"==b.outcome&&(e=0>=e?30:e+60);log.debug("trophies change: "+k+" => "+e);var c=calculateLeague(e);d=parseInt(a,2);log.debug("winLossInt is : "+d+" from : "+
a+" parseInt(wlStat, 2): "+parseInt(a,2));a=[];a.push({StatisticName:"WinLoss",Version:"0",Value:d});d={StatisticName:"TrophyCount",Version:"0",Value:e};a.push(d);d={StatisticName:"League",Version:"0",Value:c};a.push(d);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});if("rOot"==b.outcome){var h={TrophyCount:e};return{Result:h}}a=JSON.parse(f.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+a);for(f=0;f<a.subdivisions.length;f++)if(k<a.subdivisions[f]){h=f;
break}log.debug("user is in subdivision "+h);f=[];f.push({Key:b.envIndex+"_"+b.courseIndex+"_RecPos",Value:b.recordingPos});f.push({Key:b.envIndex+"_"+b.courseIndex+"_RecRot",Value:b.recordingRot});f.push({Key:b.envIndex+"_"+b.courseIndex+"_RecHeader",Value:b.recordingHeader});log.debug("updating user read only data ");f=server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:f});log.debug("updated user read only data for "+currentPlayerId+" "+f);f=server.GetTitleInternalData({Key:"RecSubDivision"+
h}).Data["RecSubDivision"+h];log.debug("recPool: "+f);if(void 0==f)a=[],g={wl:g,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId},a.push(g),g=JSON.stringify(a),log.debug("recArray: "+g);else{a=JSON.parse(f);log.debug("recArray: "+a);g={wl:g,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId};k=!1;for(f=0;f<a.length;f++)if(a[f].e==b.envIndex&&a[f].c==b.courseIndex){k=!0;a[f]=g;if(1==a.length)break;if(0<f)if(a[f].wl>a[f-1].wl){if(f==a.length-1)break;for(d=f+1;d<a.length;d++)if(a[d-1].wl>a[d].wl)c=a[d],
a[d]=a[d-1],a[d-1]=c;else break}else for(d=f-1;0<=d;d--)if(a[d+1].wl<a[d].wl)c=a[d],a[d]=a[d+1],a[d+1]=c;else break;else for(d=f+1;d<a.length;d++)if(a[d-1].wl>a[d].wl)c=a[d],a[d]=a[d-1],a[d-1]=c;else break}0==k&&(log.debug("recArrayLNbefore: "+a.length),a.push(g),log.debug("recArrayLNafter: "+a.length));g=JSON.stringify(a);log.debug("titleKeyVal: "+g)}server.SetTitleInternalData({Key:"RecSubDivision"+h,Value:g});h={TrophyCount:e};return{Result:h}};
handlers.startGame=function(b,l){var a="01",d=50,e=0,g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=g.Statistics.length){for(var a=g.Statistics[0].Value.toString(),a=Number(a).toString(2),d=a.length,k=0;k<a.length;k++)"1"==a[k]&&e++;d=Math.round(e/d*100)}log.debug("wlStatBeforeshiftandAdd "+a);a+="0";log.debug("wlStatBeforeshift "+a);20<a.length&&a.shift();log.debug("wlStat "+a);g=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});
k=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});e=0;0!=k.Statistics.length&&(e=k.Statistics[0].Value);g=JSON.parse(g.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+g);for(var f,k=0;k<g.subdivisions.length;k++)if(e<g.subdivisions[k]){f=k;break}log.debug("user is in subdivision "+f);f=server.GetTitleInternalData({Keys:"RecSubDivision"+f}).Data["RecSubDivision"+f];log.debug("recPool "+f);if(void 0==f)return generateErrObj("Recording pool for this subdivision is null");
log.debug("parsing to json array");var c=JSON.parse(f),h=c[c.length-1].uId;f=c[c.length-1].e;g=c[c.length-1].c;for(k=0;k<c.length;k++)if(d<c[k].wl){h=c[k].uId;f=c[k].e;g=c[k].c;break}d=[f+"_"+g+"_RecPos",f+"_"+g+"_RecRot",f+"_"+g+"_RecHeader"];log.debug("requesting "+d);d=server.GetUserReadOnlyData({PlayFabId:h,Keys:d});if(void 0==d)return generateErrObj("Did not find recording for this user: "+h);k=server.GetPlayerCombinedInfo({PlayFabId:h,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserInventory:!1,
GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}});e-=30;0>=e&&(e=0);a=parseInt(a,2);log.debug("updating WL to:  "+a);h=calculateLeague(e);c=[];c.push({StatisticName:"WinLoss",Version:"0",Value:a});c.push({StatisticName:"TrophyCount",Version:"0",Value:e});c.push({StatisticName:"League",Version:"0",Value:h});log.debug("updatingStats: "+c);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});
return{Result:"OK",PosData:d.Data[f+"_"+g+"_RecPos"].Value,RotData:d.Data[f+"_"+g+"_RecRot"].Value,HeaderData:d.Data[f+"_"+g+"_RecHeader"].Value,Opp:k.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateTrophyCount=function(b,l){var a=0,d=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=d.Statistics.length&&(a=d.Statistics[0].Value);"rStart"==b.val&&(a-=30);0>a&&(a=0);"rWin"==b.val&&(a+=60);if("rLose"==b.val)return{val:a};d=[];d.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:d});if("rWin"==b.val)return{val:a}};
handlers.initServerData=function(b){b=[];var l={StatisticName:"TrophyCount",Version:"0",Value:"0"};b.push(l);l={StatisticName:"League",Version:"0",Value:"0"};b.push(l);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=[];b.push("Decals");b.push("PaintJobs");b.push("Plates");b.push("Rims");b.push("WindshieldText");b=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:b});for(var l={0:"Owned"},a=0;a<b.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[a].ItemInstanceId,Data:l});b=[];b.push("FordFocus");b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b});l={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:3E3});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:200})};
handlers.requestInventory=function(b){b=server.GetUserInventory({PlayFabId:currentPlayerId});for(var l=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),d=0;d<b.Inventory.length;d++)if("CarsProgress"==b.Inventory[d].CatalogVersion){log.debug("found "+b.Inventory[d].ItemId);b.Inventory[d].CustomData.Pr=recalculateCarPr(b.Inventory[d].CustomData,b.Inventory[d].ItemId,l,a);var e={};e.Pr=b.Inventory[d].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.Inventory[d].ItemInstanceId,Data:e})}return b};function generateFailObj(b){return{Result:"Failed",Message:b}}function generateErrObj(b){return{Result:"Error",Message:b}}function checkBalance(b,l,a,d){if("SC"==b){if(a<l)return generateFailObj("NotEnoughSC")}else if(d<l)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(b){td=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==td.Data.LeagueSubdivisions||void 0==td.Data.SubdivisionTrophyRanges)return 1;for(var l=JSON.parse(td.Data.LeagueSubdivisions).leagues,a=JSON.parse(td.Data.SubdivisionTrophyRanges).subdivisions,d=0;d<l.length;d++)if(!(Number(b)<Number(a[l[d]])))return d}
function recalculateCarPr(b,l,a,d){var e=0,g;g=void 0==a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<g.Catalog.length;a++)if(g.Catalog[a].ItemId==l){a=JSON.parse(g.Catalog[a].CustomData);e+=parseInt(a.basePr)+parseInt(a.prPerLvl)*(parseInt(b.CarLvl)-1);break}d=void 0==d?server.GetCatalogItems({CatalogVersion:"PartCards"}):d;b={Exhaust:b.ExhaustLvl,Engine:b.EngineLvl,Gearbox:b.GearboxLvl,Suspension:b.SuspensionLvl,Tires:b.TiresLvl,Turbo:b.TurboLvl};for(a=0;a<d.Catalog.length;a++)l=
JSON.parse(d.Catalog[a].CustomData),e+=parseInt(l.basePr)+parseInt(l.prPerLvl)*b[d.Catalog[a].ItemId];return e}
function GenerateBlackMarket(b){var l=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var d=Math.floor(Math.random()*l.Catalog.length),e=JSON.parse(l.Catalog[d].CustomData);if(void 0==e)return generateErrObj("Part card "+l.Catalog[k].ItemId+" has no custom data.");a.BMItem0=l.Catalog[d].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy;var g=Math.floor(Math.random()*l.Catalog.length);g==d&&(g=l.Catalog.length-d-1);e=JSON.parse(l.Catalog[g].CustomData);
if(void 0==e)return generateErrObj("Part card "+l.Catalog[k].ItemId+" has no custom data.");a.BMItem1=l.Catalog[g].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy;for(var l=server.GetCatalogItems({CatalogVersion:"CarCards"}),e=[],g=[],k=0;k<l.Catalog.length;k++){d=JSON.parse(l.Catalog[k].CustomData);if(void 0==d)return generateErrObj("Car card "+l.Catalog[k].ItemId+" has no custom data.");"false"==d.rareCar?e.push(l.Catalog[k].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy):
g.push(l.Catalog[k].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy)}0>=e.length?(a.BMItem2=g[Math.floor(Math.random()*g.length)],a.BMItem3=g[Math.floor(Math.random()*g.length)]):0>=g.length?(a.BMItem2=e[Math.floor(Math.random()*e.length)],a.BMItem3=e[Math.floor(Math.random()*e.length)]):(a.BMItem2=e[Math.floor(Math.random()*e.length)],a.BMItem3=g[Math.floor(Math.random()*g.length)]);server.UpdateUserInternalData({PlayFabId:b,Data:a});k=[];k.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:b,
Keys:k});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes);return a}function GetCurrentBlackMarket(b,l){var a={},d=new Date,e=[];e.push("BlackMarketResetMinutes");e=server.GetTitleData({PlayFabId:b,Keys:e});a.BMTime=60*parseInt(e.Data.BlackMarketResetMinutes)-Math.floor((d.getTime()-l.Data.BMTime.Value)/1E3);for(d=0;4>d;d++)a["BMItem"+d]=l.Data["BMItem"+d].Value;return a}
handlers.purchaseBMItem=function(b,l){log.debug("purchasing item "+b.itemId+" from black market");if(0>b.itemId||3<b.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+b.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),d=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+b.itemId].Value.split("_");log.debug("userArray: "+a);var e=d.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var g;g=2>b.itemId?"PartCards":"CarCards";var k=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),e=checkBalance(a[1],k,e,e);if("OK"!=e)return e;var f,c;log.debug("searching for: "+a[0]+" in "+g);for(e=0;e<d.Inventory.length;e++)if(d.Inventory[e].ItemId==a[0]&&d.Inventory[e].CatalogVersion==g){log.debug("found it!");f=d.Inventory[e].ItemInstanceId;void 0==d.Inventory[e].CustomData?(log.debug("no custom data. creating ..."),c={Amount:1}):void 0==d.Inventory[e].CustomData.Amount?c={Amount:1}:(c=Number(d.Inventory[e].CustomData.Amount)+
1,isNaN(c)&&(c=1),c={Amount:c});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f,Data:c});break}void 0==f&&(log.debug("cardInstance is undefined"),f=[],f.push(a[0]),f=server.GrantItemsToUser({CatalogVersion:g,PlayFabId:currentPlayerId,ItemIds:f}).ItemGrantResults[0].ItemInstanceId,void 0==f?generateErrObj("grantRequest denied"):(c={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f,Data:c})));f=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:a[1],Amount:k});k=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];log.debug("generatedArray: "+k);d={};d["BMItem"+b.itemId]=k;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:d});c=[{ItemId:a[0],CatalogVersion:g,CustomData:c}];g={};g[f.VirtualCurrency]=f.Balance;a=b.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];e={Inventory:c,VirtualCurrency:g};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:e,BMItemChange:a}};
handlers.retrieveBlackMarket=function(b,l){var a=[];a.push("BMTime");for(var d=0;4>d;d++)a.push("BMItem"+d);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0==a.Data.BMTime)return log.debug("No user BM data detected; generating ..."),GenerateBlackMarket(currentPlayerId);d=new Date;log.debug("milliseconds passed: "+d.getTime());log.debug("BMTime: "+a.Data.BMTime.Value);var e=[];e.push("BlackMarketResetMinutes");e=server.GetTitleData({PlayFabId:currentPlayerId,Keys:e});if(d.getTime()-
parseInt(a.Data.BMTime.Value)>6E4*parseInt(e.Data.BlackMarketResetMinutes))return log.debug("regenerating market"),GenerateBlackMarket(currentPlayerId);log.debug("get current market");return GetCurrentBlackMarket(currentPlayerId,a)};
handlers.updateCarCust=function(b,l){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),d=[],e="-1",g={},k={PaintJobs:{itemOwned:"no",itemCustData:b.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:b.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:b.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:b.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:b.wsId,carItemId:"WindshieldId"}},f=0;f<a.Inventory.length;f++)a.Inventory[f].ItemId==
b.carId&&"CarsProgress"==a.Inventory[f].CatalogVersion&&(e=a.Inventory[f].ItemInstanceId),a.Inventory[f].ItemId in k&&(k[a.Inventory[f].ItemId].itemOwned="yes",k[a.Inventory[f].ItemId].itemCustData in a.Inventory[f].CustomData?g[k[a.Inventory[f].ItemId].carItemId]=k[a.Inventory[f].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[f].ItemId+" "+k[a.Inventory[f].ItemId].itemCustData));if("-1"==e)return generateFailObj("User does not own car with id: "+b.carId);for(var c in k)k.hasOwnProperty(c)&&
"no"==k[c].itemOwned&&d.push(c);if(g=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e,Data:g});a=[{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:g}];if(0<d.length)for(d=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:d}),e={0:"Owned"},f=0;f<d.ItemGrantResults.length;f++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:d.ItemGrantResults[f].ItemInstanceId,Data:e});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.purchaseItems=function(b,l){log.debug("RETRIEVING USER INVENTORY");var a=server.GetUserInventory({PlayFabId:currentPlayerId}),d=a.VirtualCurrency.SC,e=a.VirtualCurrency.HC;log.debug("user currency: SC: "+d+" HC: "+e);switch(b.purchaseType){case "carUpgrade":log.debug("== carUpgrade request: carId: "+b.carId);log.debug("RETRIEVING CARDS CATALOGUE");for(var g=server.GetCatalogItems({CatalogVersion:"CarCards"}),k=!1,f,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarsProgress"==
a.Inventory[c].CatalogVersion){k=!0;log.debug("car is in user's inventory!");f=a.Inventory[c];break}for(var h,c=0;c<g.Catalog.length;c++)if(g.Catalog[c].ItemId==b.carId){h=JSON.parse(g.Catalog[c].CustomData);log.debug("cardInfo found!");break}if(void 0==h)return log.error("cardInfo undefined!"),h={Result:"Error",Message:"CardNotFoundForCarwithID: "+b.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(1==k){log.debug("user has car: "+b.carId+
"... upgrading");var r=parseInt(h.baseCurrCost)+parseInt(f.CustomData.CarLvl)*parseInt(h.currCostPerLvl),e=checkBalance(h.currType,r,d,e);if("OK"!=e)return e;log.debug("user has enough currency. Let's check for card balance");e=parseInt(h.baseCardCost)+parseInt(f.CustomData.CarLvl)*parseInt(h.cardCostPerLvl);log.debug("cardCost: "+e);for(var q=!1,p,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarCards"==a.Inventory[c].CatalogVersion){log.debug("consuming: "+a.Inventory[c].ItemInstanceId);
q=!0;try{if(void 0==a.Inventory[c].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");if(void 0==a.Inventory[c].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(a.Inventory[c].CustomData.Amount)>=e)a.Inventory[c].CustomData.Amount-=e,p={Amount:a.Inventory[c].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,Data:p});else return generateFailObj("Insufficient cards for real: "+
a.Inventory[c].CustomData.Amount+" vs "+e)}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase upgrade!");c=parseInt(f.CustomData.CarLvl)+1;a=recalculateCarPr(f.CustomData,f.ItemId,g,void 0);log.debug("upgrading to car lvl: "+c+" and pr: "+a);c={CarLvl:c,Pr:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemInstanceId,
Data:c});var m;0<r&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:r}));log.debug("Upgrade Complete!");a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:p},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:c}];h={};c={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdate",InventoryChange:c}}else{log.debug("user doesn't have car: "+b.carId+"... looking for card");for(var q=
!1,t,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarCards"==a.Inventory[c].CatalogVersion){log.debug("consuming: "+a.Inventory[c].ItemInstanceId);q=!0;try{if(void 0==a.Inventory[c].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0==a.Inventory[c].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");if(Number(a.Inventory[c].CustomData.Amount)>=Number(h.baseCardCost))t=a.Inventory[c].ItemInstanceId,a.Inventory[c].CustomData.Amount-=
h.baseCardCost,p={Amount:a.Inventory[c].CustomData.Amount};else return generateFailObj("Insufficient cards: "+a.Inventory[c].CustomData.Amount+" vs "+h.baseCardCost+".")}catch(u){return generateFailObj("Insufficient cards: "+u)}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");e=checkBalance(h.currType,h.baseCurrCost,d,e);if("OK"!=e)return e;c=[];c.push(b.carId);e=server.GrantItemsToUser({CatalogVersion:"CarsProgress",
PlayFabId:currentPlayerId,ItemIds:c});if(0==e.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:t,Data:p});0<h.baseCurrCost&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:h.baseCurrCost}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",
GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,Data:c});c={TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,Data:c});c={PlatesId:"0",WindshieldId:"0",Pr:h.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,
Data:c});f=e=!1;for(var n,c=0;c<a.Inventory.length;c++)if("PaintJobs"==a.Inventory[c].ItemId){f=!0;log.debug("user has paintjobs");void 0!=a.Inventory[c].CustomData?(log.debug("user has paintjobs customData"),h.defaultPaintID in a.Inventory[c].CustomData?(log.debug("user has paintjob already"),e=!0):(log.debug("user doesn't have paintjob"),n={},n[h.defaultPaintID]="Owned")):(n={},n[h.defaultPaintID]="Owned");void 0!=n&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,
Data:n});break}0==f&&(paintToGive=[],paintToGive.push("PaintJobs"),a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),n={},n[h.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:n}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:h.basePr};a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:p},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:c}];0==e&&(c={},c[h.defaultPaintID]="Owned",a.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:c}));h={};c={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:c}}return h;case "partUpgrade":log.debug("Upgrading Part: "+b.partId+" on Car: "+b.carId);log.debug("Checking to see if car exists in catalog");
p=server.GetCatalogItems({CatalogVersion:"CarsProgress"});n=!1;for(c=0;c<p.Catalog.length;c++)if(p.Catalog[c].ItemId==b.carId){n=!0;break}if(0==n)return log.error("invalid car ID"),h={Result:"Error",Message:"car with ID: "+b.carId+" not found in catalog."};log.debug("Checking to see if part exists in catalog");p=server.GetCatalogItems({CatalogVersion:"PartCards"});n=!1;for(c=0;c<p.Catalog.length;c++)if(p.Catalog[c].ItemId==b.partId){h=JSON.parse(p.Catalog[c].CustomData);n=!0;break}if(0==n)return log.error("invalid part ID"),
h={Result:"Error",Message:"part with ID: "+b.partId+" not found in catalog."};log.debug("Checking to see if user has car: "+b.carId);k=!1;for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarsProgress"==a.Inventory[c].CatalogVersion){k=!0;log.debug("car is in user's inventory!");f=a.Inventory[c];break}if(0==k)return generateFailObj("car with ID: "+b.carId+" not found in user inventory.");log.debug("Checking to see if user has part and or has enough parts");n=!1;for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==
b.partId&&"PartCards"==a.Inventory[c].CatalogVersion){n=!0;log.debug("part is in user's inventory!");g={};k={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"};log.debug("calculating "+b.partId+" cost and modifying "+k[b.partId]);t=parseInt(h.baseCardCost)+parseInt(f.CustomData[k[b.partId]])*parseInt(h.cardCostPerLvl);var r=parseInt(h.baseCurrCost)+parseInt(f.CustomData[k[b.partId]])*parseInt(h.currCostPerLvl),v=parseInt(f.CustomData[k[b.partId]])+
1;g[k[b.partId]]=v;f.CustomData[k[b.partId]]=v;log.debug("we need: "+t+" cards");e=checkBalance(h.currType,r,d,e);if("OK"!=e)return e;log.debug("consuming part instance: "+a.Inventory[c].ItemInstanceId);try{if(void 0!=a.Inventory[c].CustomData&&void 0!=a.Inventory[c].CustomData.Amount&&a.Inventory[c].CustomData.Amount>=t)a.Inventory[c].CustomData.Amount-=t,q={Amount:a.Inventory[c].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,
Data:q});else return generateFailObj("Insufficient cards")}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}if(0==n)return generateFailObj("Part not found");0<r&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:r}));a=recalculateCarPr(f.CustomData,f.ItemId,void 0,p);g.Pr=a;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemInstanceId,Data:g});a=[{ItemId:b.partId,
CatalogVersion:"PartCards",CustomData:q},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:g}];log.debug("succesfully upgraded part!");h={};c={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=h);return h={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:c};case "custPurchase":log.debug("Purchasing Customization: "+b.custId+" with val: "+b.custVal);log.debug("Checking to see if customization exists in catalog");f=server.GetCatalogItems({CatalogVersion:"Customization"});
h=0;m="SC";for(c=0;c<f.Catalog.length;c++)if(f.Catalog[c].ItemId==b.custId){v=f.Catalog[c];h=JSON.parse(f.Catalog[c].CustomData);c=b.custVal+",Cost";m=h[b.custVal+",Curr"];h=h[c];e=checkBalance(m,h,d,e);if("OK"!=e)return e;log.debug("custCurr: "+m);log.debug("custPrice: "+h);break}if(void 0==v)return log.error("Customization does not exist in catalog"),h={Result:"Error",Message:"Customization does not exist in catalog."};log.debug("Checking to see if user has said customization");for(var w,c=0;c<
a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.custId){log.debug("user has customization category!");w=a.Inventory[c];k=a.Inventory[c].ItemInstanceId;if(void 0!=w.CustomData&&String(b.custVal)in w.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==w){log.info("user doesn't have customization category. Granting ... ");c=[];c.push(b.custId);a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:c});if(0==a.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),
h={Result:"Error",Message:"something went wrong while granting user customization class object."};k=a.ItemGrantResults[0].ItemInstanceId}a={};a[String(b.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k,Data:a});a=[{ItemId:b.custId,CatalogVersion:"Customization",CustomData:a}];0<h?(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:m,Amount:h}),h={},h[m.VirtualCurrency]=m.Balance,c={Inventory:a,VirtualCurrency:h}):c=
{Inventory:a};return h={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:c};case "softCurrencyPurchase":log.debug("Purchasing pack: "+b.packId);log.debug("Checking to see if pack exists in catalog");m=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});a=!1;for(c=f=0;c<m.Catalog.length;c++)if(m.Catalog[c].ItemId==b.packId){f=m.Catalog[c].VirtualCurrencyPrices.HC;h=JSON.parse(m.Catalog[c].CustomData);a=!0;break}if(0==a)return h={Result:"Error",Message:"pack with ID: "+
b.packId+" not found in catalog."};if(0>=f)return h={Result:"Error",Message:"pack with ID: "+b.packId+" shouldn't have negative cost."};if(f>e)return generateFailObj("Not enough HC.");m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:f});a=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:h.quantity});h={};h[a.VirtualCurrency]=a.Balance;h[m.VirtualCurrency]=m.Balance;return h={Result:"OK",Message:"SoftCurrencyPurchased",
InventoryChange:{VirtualCurrency:h}};default:log.debug("invalid purchase parameter")}};handlers.giveMoney=function(b){b=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.amount});var l={};l[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:l}}};
handlers.grantItems=function(b){for(var l=server.GetUserInventory({PlayFabId:currentPlayerId}),a,d=!1,e=0;e<l.Inventory.length;e++)if(l.Inventory[e].ItemId==b.itemId&&l.Inventory[e].CatalogVersion==b.catalogId){log.debug("adding amount to: "+l.Inventory[e].ItemInstanceId);a=void 0==l.Inventory[e].CustomData?b.amount:void 0==l.Inventory[e].CustomData.Amount?b.amount:isNaN(Number(l.Inventory[e].CustomData.Amount))?b.amount:Number(l.Inventory[e].CustomData.Amount)+b.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:l.Inventory[e].ItemInstanceId,Data:a});d=!0;break}0==d&&(l=[],l.push(b.itemId),l=server.GrantItemsToUser({CatalogVersion:b.catalogId,PlayFabId:currentPlayerId,ItemIds:l}),a={Amount:b.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:b.itemId,CatalogVersion:b.catalogId,CustomData:a}]}}};
handlers.openChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<b.currCost){if("OK"!=checkBalance(b.currType,b.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:b.currCost})}for(var d in b.currencyReq)0<b.currencyReq[d]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:d,Amount:b.currencyReq[d]});var e;
for(d in b.carCardsRequest)if(log.debug(d+" : "+b.carCardsRequest[d]),b.carCardsRequest.hasOwnProperty(d)){e=!1;log.debug("looking for: "+d);for(var g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==d&&"CarCards"==a.Inventory[g].CatalogVersion){log.debug("adding amount to: "+a.Inventory[g].ItemInstanceId);e=void 0==a.Inventory[g].CustomData?Number(b.carCardsRequest[d]):void 0==a.Inventory[g].CustomData.Amount?Number(b.carCardsRequest[d]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.carCardsRequest[d]):
Number(a.Inventory[g].CustomData.Amount)+Number(b.carCardsRequest[d]);e={Amount:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:e});e=!0;break}0==e&&(g=[d],g=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:g}),e={Amount:b.carCardsRequest[d]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:e}))}for(d in b.partCardsRequest)if(log.debug(d+
" : "+b.partCardsRequest[d]),b.partCardsRequest.hasOwnProperty(d)){e=!1;log.debug("looking for: "+d);for(g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==d&&"PartCards"==a.Inventory[g].CatalogVersion){log.debug("adding amount to: "+a.Inventory[g].ItemInstanceId);e=void 0==a.Inventory[g].CustomData?Number(b.partCardsRequest[d]):void 0==a.Inventory[g].CustomData.Amount?Number(b.partCardsRequest[d]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.partCardsRequest[d]):Number(a.Inventory[g].CustomData.Amount)+
Number(b.partCardsRequest[d]);e={Amount:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:e});e=!0;break}0==e&&(g=[d],g=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:g}),e={Amount:b.partCardsRequest[d]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:e}))}return{Result:"OK",Message:"InventoryUpdated",InventoryChange:server.GetUserInventory({PlayFabId:currentPlayerId})}};
handlers.buyChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(b.curr,b.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.cost}),d={};d[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:d}}};handlers.getServerTime=function(b,l){return{time:new Date}};
