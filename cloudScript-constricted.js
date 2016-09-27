handlers.endGame=function(b,k){var a="01",e="0";"rWin"==b.outcome&&(e="1");var c=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=c.Statistics.length&&(a=c.Statistics[0].Value.toString(),log.debug("wlStat "+a));var f=0,l;log.debug("wlStat.length "+a.length);if(50>a.length){a+=e;l=a.length;for(c=0;c<a.length;c++)"1"==a[c]&&f++;log.debug("wlStatNew "+a)}else{l=a.length;for(c=0;c<a.length-1;c++)a[c]=a[c+1],"1"==a[c]&&f++;a[a.length-1]=e;"1"==e&&f++;log.debug("wlStatNewMoreThanMax "+
a)}e=Math.round(f/l*100);log.debug("winRatio "+e);c=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});l=0;f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=f.Statistics.length&&(l=f.Statistics[0].Value);f=l;"rWin"==b.val&&(l=0>=l?30:l+60);var g=[];g.push({StatisticName:"WinLoss",Version:"0",Value:a});g.push({StatisticName:"TrophyCount",Version:"0",Value:l});if("rOot"!=b.val){a=JSON.parse(c.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+
a);for(var d,c=0;c<a.subdivisions.length;c++)if(f<a.subdivisions[c]){d=c;break}log.debug("user is in subdivision "+d);a=[];a.push({Key:b.envIndex+"_"+b.courseIndex+"_RecPos",Value:b.recordingPos});a.push({Key:b.envIndex+"_"+b.courseIndex+"_RecRot",Value:b.recordingRot});a.push({Key:b.envIndex+"_"+b.courseIndex+"_RecHeader",Value:b.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:a});c=server.GetTitleInternalData({Key:"RecSubDivision"+d}).Data["RecSubDivision"+d];log.debug("recPool: "+
c);if(void 0==c)f=[],e={wl:e,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId},f.push(e),c=JSON.stringify(f),log.debug("recArray: "+c);else{f=JSON.parse(c);log.debug("recArray: "+f);e={wl:e,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId};l=!1;for(c=0;c<f.length;c++)if(f[c].e==b.envIndex&&f[c].c==b.courseIndex){l=!0;f[c]=e;if(1==f.length)break;if(0<c)if(f[c].wl>f[c-1].wl){if(c==f.length-1)break;for(g=c+1;g<f.length;g++)if(f[g-1].wl>f[g].wl){var h=f[g];f[g]=f[g-1];f[g-1]=h}else break}else for(g=c-
1;0<=g;g--)if(f[g+1].wl<f[g].wl)h=f[g],f[g]=f[g+1],f[g+1]=h;else break;else for(g=c+1;g<f.length;g++)if(f[g-1].wl>f[g].wl)h=f[g],f[g]=f[g-1],f[g-1]=h;else break}0==l&&(log.debug("recArrayLNbefore: "+f.length),f.push(e),log.debug("recArrayLNafter: "+f.length));c=JSON.stringify(f);log.debug("titleKeyVal: "+c)}server.SetTitleInternalData({Key:"RecSubDivision"+d,Value:c});return{dicVal:a}}};
handlers.startGame=function(b,k){var a;a=50;var e,c=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=c.Statistics.length){a=c.Statistics[0].Value.toString();log.debug("wlStat "+a);e=a.length;for(c=0;c<a.length;c++)"1"==a[c]&&wins++;a=Math.round(wins/e*100)}var c=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});e=0;0!=f.Statistics.length&&(e=f.Statistics[0].Value);
f=JSON.parse(c.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+f);for(var l,c=0;c<f.subdivisions.length;c++)if(e<f.subdivisions[c]){l=15;break}log.debug("user is in subdivision "+l);l=server.GetTitleInternalData({Keys:"RecSubDivision"+l}).Data["RecSubDivision"+l];log.debug("recPool "+l);void 0==l&&generateErrObj("Recording pool for this subdivision is null");log.debug("parsing to json array");e=JSON.parse(l);l=e[e.length-1].uId;for(c=0;c<e.length;c++)if(a>e[c].wl){l=e[c].uId;break}a=
server.GetUserReadOnlyData({PlayFabId:l,Keys:["RecPos_"+b.envIndex+"_"+b.courseIndex,"RecRot_"+b.envIndex+"_"+b.courseIndex,"RecHeader_"+b.envIndex+"_"+b.courseIndex]});l=server.GetPlayerCombinedInfo({PlayFabId:l,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}});return{Result:"OK",PosData:a.Data["RecPos_"+b.envIndex+"_"+b.courseIndex].Value,
RotData:a.Data["RecRot_"+b.envIndex+"_"+b.courseIndex].Value,HeaderData:a.Data["RecHeader_"+b.envIndex+"_"+b.courseIndex].Value,Opp:l.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateTrophyCount=function(b,k){var a=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=e.Statistics.length&&(a=e.Statistics[0].Value);"rStart"==b.val&&(a-=30);0>a&&(a=0);"rWin"==b.val&&(a+=60);if("rLose"==b.val)return{val:a};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==b.val)return{val:a}};
handlers.initServerData=function(b){b=[];var k={StatisticName:"TrophyCount",Version:"0",Value:"0"};b.push(k);k={StatisticName:"League",Version:"0",Value:"0"};b.push(k);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=[];b.push("Decals");b.push("PaintJobs");b.push("Plates");b.push("Rims");b.push("WindshieldText");b=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:b});for(var k={0:"Owned"},a=0;a<b.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[a].ItemInstanceId,Data:k});b=[];b.push("FordFocus");b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b});k={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k});k={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k});k={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:k});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:3E3});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:200})};
handlers.requestInventory=function(b){b=server.GetUserInventory({PlayFabId:currentPlayerId});for(var k=0;k<b.Inventory.length;k++)if("CarsProgress"==b.Inventory[k].CatalogVersion){log.debug("found "+b.Inventory[k].ItemId);b.Inventory[k].CustomData.Pr=recalculateCarPr(b.Inventory[k].CustomData,b.Inventory[k].ItemId);var a={};a.Pr=b.Inventory[k].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[k].ItemInstanceId,Data:a})}return b};
function generateFailObj(b){return{Result:"Failed",Message:b}}function generateErrObj(b){return{Result:"Error",Message:b}}function checkBalance(b,k,a,e){if("SC"==b){if(a<k)return generateFailObj("NotEnoughSC")}else if(e<k)return generateFailObj("NotEnoughHC");return"OK"}
function recalculateCarPr(b,k){for(var a=0,e=server.GetCatalogItems({CatalogVersion:"CarCards"}),c=0;c<e.Catalog.length;c++)if(e.Catalog[c].ItemId==k){c=JSON.parse(e.Catalog[c].CustomData);a+=parseInt(c.basePr)+parseInt(c.prPerLvl)*(parseInt(b.CarLvl)-1);break}for(var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),f={Exhaust:b.ExhaustLvl,Engine:b.EngineLvl,Gearbox:b.GearboxLvl,Suspension:b.SuspensionLvl,Tires:b.TiresLvl,Turbo:b.TurboLvl},l,c=0;c<e.Catalog.length;c++)l=JSON.parse(e.Catalog[c].CustomData),
a+=parseInt(l.basePr)+parseInt(l.prPerLvl)*f[e.Catalog[c].ItemId];return a}
function GenerateBlackMarket(b){var k=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var e=Math.floor(Math.random()*k.Catalog.length),c=JSON.parse(k.Catalog[e].CustomData);if(void 0==c)return generateErrObj("Part card "+k.Catalog[l].ItemId+" has no custom data.");a.BMItem0=k.Catalog[e].ItemId+"_"+c.BMCurrType+"_"+c.BMbasePrice+"_0_"+c.BMpriceIncrPerBuy;var f=Math.floor(Math.random()*k.Catalog.length);f==e&&(f=k.Catalog.length-e-1);c=JSON.parse(k.Catalog[f].CustomData);
if(void 0==c)return generateErrObj("Part card "+k.Catalog[l].ItemId+" has no custom data.");a.BMItem1=k.Catalog[f].ItemId+"_"+c.BMCurrType+"_"+c.BMbasePrice+"_0_"+c.BMpriceIncrPerBuy;for(var k=server.GetCatalogItems({CatalogVersion:"CarCards"}),c=[],f=[],l=0;l<k.Catalog.length;l++){e=JSON.parse(k.Catalog[l].CustomData);if(void 0==e)return generateErrObj("Car card "+k.Catalog[l].ItemId+" has no custom data.");"false"==e.rareCar?c.push(k.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy):
f.push(k.Catalog[l].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy)}0>=c.length?(a.BMItem2=f[Math.floor(Math.random()*f.length)],a.BMItem3=f[Math.floor(Math.random()*f.length)]):0>=f.length?(a.BMItem2=c[Math.floor(Math.random()*c.length)],a.BMItem3=c[Math.floor(Math.random()*c.length)]):(a.BMItem2=c[Math.floor(Math.random()*c.length)],a.BMItem3=f[Math.floor(Math.random()*f.length)]);server.UpdateUserInternalData({PlayFabId:b,Data:a});l=[];l.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:b,
Keys:l});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes);return a}function GetCurrentBlackMarket(b,k){var a={},e=new Date,c=[];c.push("BlackMarketResetMinutes");c=server.GetTitleData({PlayFabId:b,Keys:c});a.BMTime=60*parseInt(c.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-k.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)a["BMItem"+e]=k.Data["BMItem"+e].Value;return a}
handlers.purchaseBMItem=function(b,k){log.debug("purchasing item "+b.itemId+" from black market");if(0>b.itemId||3<b.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+b.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),e=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+b.itemId].Value.split("_");log.debug("userArray: "+a);var c=e.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var f;f=2>b.itemId?"PartCards":"CarCards";var l=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),c=checkBalance(a[1],l,c,c);if("OK"!=c)return c;var g,d;log.debug("searching for: "+a[0]+" in "+f);for(c=0;c<e.Inventory.length;c++)if(e.Inventory[c].ItemId==a[0]&&e.Inventory[c].CatalogVersion==f){log.debug("found it!");g=e.Inventory[c].ItemInstanceId;void 0==e.Inventory[c].CustomData?(log.debug("no custom data. creating ..."),d={Amount:1}):void 0==e.Inventory[c].CustomData.Amount?d={Amount:1}:(d=Number(e.Inventory[c].CustomData.Amount)+
1,isNaN(d)&&(d=1),d={Amount:d});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g,Data:d});break}void 0==g&&(log.debug("cardInstance is undefined"),g=[],g.push(a[0]),g=server.GrantItemsToUser({CatalogVersion:f,PlayFabId:currentPlayerId,ItemIds:g}).ItemGrantResults[0].ItemInstanceId,void 0==g?generateErrObj("grantRequest denied"):(d={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g,Data:d})));g=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:a[1],Amount:l});l=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];log.debug("generatedArray: "+l);e={};e["BMItem"+b.itemId]=l;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:e});d=[{ItemId:a[0],CatalogVersion:f,CustomData:d}];f={};f[g.VirtualCurrency]=g.Balance;a=b.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];c={Inventory:d,VirtualCurrency:f};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:c,BMItemChange:a}};
handlers.retrieveBlackMarket=function(b,k){var a=[];a.push("BMTime");for(var e=0;4>e;e++)a.push("BMItem"+e);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0==a.Data.BMTime)return log.debug("No user BM data detected; generating ..."),GenerateBlackMarket(currentPlayerId);e=new Date;log.debug("milliseconds passed: "+e.getTime());log.debug("BMTime: "+a.Data.BMTime.Value);var c=[];c.push("BlackMarketResetMinutes");c=server.GetTitleData({PlayFabId:currentPlayerId,Keys:c});if(e.getTime()-
parseInt(a.Data.BMTime.Value)>6E4*parseInt(c.Data.BlackMarketResetMinutes))return log.debug("regenerating market"),GenerateBlackMarket(currentPlayerId);log.debug("get current market");return GetCurrentBlackMarket(currentPlayerId,a)};
handlers.updateCarCust=function(b,k){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],c="-1",f={},l={PaintJobs:{itemOwned:"no",itemCustData:b.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:b.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:b.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:b.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:b.wsId,carItemId:"WindshieldId"}},g=0;g<a.Inventory.length;g++)a.Inventory[g].ItemId==
b.carId&&"CarsProgress"==a.Inventory[g].CatalogVersion&&(c=a.Inventory[g].ItemInstanceId),a.Inventory[g].ItemId in l&&(l[a.Inventory[g].ItemId].itemOwned="yes",l[a.Inventory[g].ItemId].itemCustData in a.Inventory[g].CustomData?f[l[a.Inventory[g].ItemId].carItemId]=l[a.Inventory[g].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[g].ItemId+" "+l[a.Inventory[g].ItemId].itemCustData));if("-1"==c)return generateFailObj("User does not own car with id: "+b.carId);for(var d in l)l.hasOwnProperty(d)&&
"no"==l[d].itemOwned&&e.push(d);if(f=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c,Data:f});a=[{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:f}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),c={0:"Owned"},g=0;g<e.ItemGrantResults.length;g++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[g].ItemInstanceId,Data:c});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.purchaseItems=function(b,k){log.debug("RETRIEVING USER INVENTORY");var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=a.VirtualCurrency.SC,c=a.VirtualCurrency.HC;log.debug("user currency: SC: "+e+" HC: "+c);switch(b.purchaseType){case "carUpgrade":log.debug("== carUpgrade request: carId: "+b.carId);log.debug("RETRIEVING CARDS CATALOGUE");for(var f=server.GetCatalogItems({CatalogVersion:"CarCards"}),l=!1,g,d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==b.carId&&"CarsProgress"==
a.Inventory[d].CatalogVersion){l=!0;log.debug("car is in user's inventory!");g=a.Inventory[d];break}for(var h,d=0;d<f.Catalog.length;d++)if(f.Catalog[d].ItemId==b.carId){h=JSON.parse(f.Catalog[d].CustomData);log.debug("cardInfo found!");break}if(void 0==h)return log.error("cardInfo undefined!"),h={Result:"Error",Message:"CardNotFoundForCarwithID: "+b.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(1==l){log.debug("user has car: "+b.carId+
"... upgrading");f=parseInt(h.baseCurrCost)+parseInt(g.CustomData.CarLvl)*parseInt(h.currCostPerLvl);c=checkBalance(h.currType,f,e,c);if("OK"!=c)return c;log.debug("user has enough currency. Let's check for card balance");c=parseInt(h.baseCardCost)+parseInt(g.CustomData.CarLvl)*parseInt(h.cardCostPerLvl);log.debug("cardCost: "+c);for(var q=!1,p,d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==b.carId&&"CarCards"==a.Inventory[d].CatalogVersion){log.debug("consuming: "+a.Inventory[d].ItemInstanceId);
q=!0;try{if(void 0!=a.Inventory[d].CustomData&&void 0!=a.Inventory[d].CustomData.Amount&&a.Inventory[d].CustomData.Amount>=c)a.Inventory[d].CustomData.Amount-=c,p={Amount:a.Inventory[d].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[d].ItemInstanceId,Data:p});else return generateFailObj("Insufficient cards")}catch(t){return log.debug("itemConsumptionResult.errorCode "+t),generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("No cards found");
log.debug("user has enough cards to purchase upgrade!");d=parseInt(g.CustomData.CarLvl)+1;a=recalculateCarPr(g.CustomData,g.ItemId);log.debug("upgrading to car lvl: "+d+" and pr: "+a);d={CarLvl:d,Pr:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemInstanceId,Data:d});var m;0<f&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:f}));log.debug("Upgrade Complete!");a=[{ItemId:b.carId,CatalogVersion:"CarCards",
CustomData:p},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:d}];h={};d={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,d.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdate",InventoryChange:d}}else{log.debug("user doesn't have car: "+b.carId+"... looking for card");for(var q=!1,r,d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==b.carId&&"CarCards"==a.Inventory[d].CatalogVersion){log.debug("consuming: "+a.Inventory[d].ItemInstanceId);q=!0;try{if(void 0!=a.Inventory[d].CustomData&&
void 0!=a.Inventory[d].CustomData.Amount&&a.Inventory[d].CustomData.Amount>=h.baseCardCost)r=a.Inventory[d].ItemInstanceId,a.Inventory[d].CustomData.Amount-=h.baseCardCost,p={Amount:a.Inventory[d].CustomData.Amount};else return generateFailObj("Insufficient cards")}catch(t){return generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");c=checkBalance(h.currType,h.baseCurrCost,
e,c);if("OK"!=c)return c;d=[];d.push(b.carId);c=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:d});if(0==c.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:r,Data:p});0<h.baseCurrCost&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:h.currType,Amount:h.baseCurrCost}));d={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:d});d={TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:d});d={PlatesId:"0",WindshieldId:"0",Pr:h.basePr};
server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,Data:d});g=c=!1;for(var n,d=0;d<a.Inventory.length;d++)if("PaintJobs"==a.Inventory[d].ItemId){g=!0;log.debug("user has paintjobs");void 0!=a.Inventory[d].CustomData?(log.debug("user has paintjobs customData"),h.defaultPaintID in a.Inventory[d].CustomData?(log.debug("user has paintjob already"),c=!0):(log.debug("user doesn't have paintjob"),n={},n[h.defaultPaintID]="Owned")):(n={},
n[h.defaultPaintID]="Owned");void 0!=n&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[d].ItemInstanceId,Data:n});break}0==g&&(paintToGive=[],paintToGive.push("PaintJobs"),a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),n={},n[h.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:n}));d={CarLvl:"1",
EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:h.basePr};a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:p},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:d}];0==c&&(d={},d[h.defaultPaintID]="Owned",a.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:d}));h={};d={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,d.VirtualCurrency=h);h={Result:"OK",
Message:"InventoryUpdateNewCar",InventoryChange:d}}return h;case "partUpgrade":log.debug("Upgrading Part: "+b.partId+" on Car: "+b.carId);log.debug("Checking to see if car exists in catalog");p=server.GetCatalogItems({CatalogVersion:"CarsProgress"});n=!1;for(d=0;d<p.Catalog.length;d++)if(p.Catalog[d].ItemId==b.carId){n=!0;break}if(0==n)return log.error("invalid car ID"),h={Result:"Error",Message:"car with ID: "+b.carId+" not found in catalog."};log.debug("Checking to see if part exists in catalog");
p=server.GetCatalogItems({CatalogVersion:"PartCards"});n=!1;for(d=0;d<p.Catalog.length;d++)if(p.Catalog[d].ItemId==b.partId){h=JSON.parse(p.Catalog[d].CustomData);n=!0;break}if(0==n)return log.error("invalid part ID"),h={Result:"Error",Message:"part with ID: "+b.partId+" not found in catalog."};log.debug("Checking to see if user has car: "+b.carId);l=!1;for(d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==b.carId&&"CarsProgress"==a.Inventory[d].CatalogVersion){l=!0;log.debug("car is in user's inventory!");
g=a.Inventory[d];break}if(0==l)return generateFailObj("car with ID: "+b.carId+" not found in user inventory.");log.debug("Checking to see if user has part and or has enough parts");p=!1;for(d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==b.partId&&"PartCards"==a.Inventory[d].CatalogVersion){p=!0;log.debug("part is in user's inventory!");q={};r={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"};log.debug("calculating "+
b.partId+" cost and modifying "+r[b.partId]);n=parseInt(h.baseCardCost)+parseInt(g.CustomData[r[b.partId]])*parseInt(h.cardCostPerLvl);f=parseInt(h.baseCurrCost)+parseInt(g.CustomData[r[b.partId]])*parseInt(h.currCostPerLvl);l=parseInt(g.CustomData[r[b.partId]])+1;q[r[b.partId]]=l;g.CustomData[r[b.partId]]=l;log.debug("we need: "+n+" cards");var v,c=checkBalance(h.currType,f,e,c);if("OK"!=c)return c;log.debug("consuming part instance: "+a.Inventory[d].ItemInstanceId);try{if(void 0!=a.Inventory[d].CustomData&&
void 0!=a.Inventory[d].CustomData.Amount&&a.Inventory[d].CustomData.Amount>=n)a.Inventory[d].CustomData.Amount-=n,v={Amount:a.Inventory[d].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[d].ItemInstanceId,Data:v});else return generateFailObj("Insufficient cards")}catch(t){return log.debug("itemConsumptionResult.errorCode "+t),generateFailObj("Insufficient cards")}break}if(0==p)return generateFailObj("Part not found");0<f&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:h.currType,Amount:f}));a=recalculateCarPr(g.CustomData,g.ItemId);q.Pr=a;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemInstanceId,Data:q});a=[{ItemId:b.partId,CatalogVersion:"PartCards",CustomData:v},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:q}];log.debug("succesfully upgraded part!");h={};d={Inventory:a};void 0!=m&&(h[m.VirtualCurrency]=m.Balance,d.VirtualCurrency=h);return h={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:d};
case "custPurchase":log.debug("Purchasing Customization: "+b.custId+" with val: "+b.custVal);log.debug("Checking to see if customization exists in catalog");g=server.GetCatalogItems({CatalogVersion:"Customization"});var w;h=0;m="SC";for(d=0;d<g.Catalog.length;d++)if(g.Catalog[d].ItemId==b.custId){w=g.Catalog[d];h=JSON.parse(g.Catalog[d].CustomData);d=b.custVal+",Cost";m=h[b.custVal+",Curr"];h=h[d];c=checkBalance(m,h,e,c);if("OK"!=c)return c;log.debug("custCurr: "+m);log.debug("custPrice: "+h);break}if(void 0==
w)return log.error("Customization does not exist in catalog"),h={Result:"Error",Message:"Customization does not exist in catalog."};log.debug("Checking to see if user has said customization");for(var u,d=0;d<a.Inventory.length;d++)if(a.Inventory[d].ItemId==b.custId){log.debug("user has customization category!");u=a.Inventory[d];l=a.Inventory[d].ItemInstanceId;if(void 0!=u.CustomData&&String(b.custVal)in u.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==u){log.info("user doesn't have customization category. Granting ... ");
d=[];d.push(b.custId);a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:d});if(0==a.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),h={Result:"Error",Message:"something went wrong while granting user customization class object."};l=a.ItemGrantResults[0].ItemInstanceId}a={};a[String(b.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l,Data:a});
a=[{ItemId:b.custId,CatalogVersion:"Customization",CustomData:a}];0<h?(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:m,Amount:h}),h={},h[m.VirtualCurrency]=m.Balance,d={Inventory:a,VirtualCurrency:h}):d={Inventory:a};return h={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:d};case "softCurrencyPurchase":log.debug("Purchasing pack: "+b.packId);log.debug("Checking to see if pack exists in catalog");m=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});
a=!1;for(d=g=0;d<m.Catalog.length;d++)if(m.Catalog[d].ItemId==b.packId){g=m.Catalog[d].VirtualCurrencyPrices.HC;h=JSON.parse(m.Catalog[d].CustomData);a=!0;break}if(0==a)return h={Result:"Error",Message:"pack with ID: "+b.packId+" not found in catalog."};if(0>=g)return h={Result:"Error",Message:"pack with ID: "+b.packId+" shouldn't have negative cost."};if(g>c)return generateFailObj("Not enough HC.");m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:g});a=
server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:h.quantity});h={};h[a.VirtualCurrency]=a.Balance;h[m.VirtualCurrency]=m.Balance;return h={Result:"OK",Message:"SoftCurrencyPurchased",InventoryChange:{VirtualCurrency:h}};default:log.debug("invalid purchase parameter")}};
handlers.giveMoney=function(b){b=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.amount});var k={};k[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:k}}};
handlers.grantItems=function(b){for(var k=server.GetUserInventory({PlayFabId:currentPlayerId}),a,e=!1,c=0;c<k.Inventory.length;c++)if(k.Inventory[c].ItemId==b.itemId&&k.Inventory[c].CatalogVersion==b.catalogId){log.debug("adding amount to: "+k.Inventory[c].ItemInstanceId);a=void 0==k.Inventory[c].CustomData?b.amount:void 0==k.Inventory[c].CustomData.Amount?b.amount:isNaN(Number(k.Inventory[c].CustomData.Amount))?b.amount:Number(k.Inventory[c].CustomData.Amount)+b.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:k.Inventory[c].ItemInstanceId,Data:a});e=!0;break}0==e&&(k=[],k.push(b.itemId),k=server.GrantItemsToUser({CatalogVersion:b.catalogId,PlayFabId:currentPlayerId,ItemIds:k}),a={Amount:b.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:k.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:b.itemId,CatalogVersion:b.catalogId,CustomData:a}]}}};
handlers.openChest=function(b,k){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<b.currCost){if("OK"!=checkBalance(b.currType,b.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:b.currCost})}for(var e in b.currencyReq)0<b.currencyReq[e]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:e,Amount:b.currencyReq[e]});var c;
for(e in b.carCardsRequest)if(log.debug(e+" : "+b.carCardsRequest[e]),b.carCardsRequest.hasOwnProperty(e)){c=!1;log.debug("looking for: "+e);for(var f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"CarCards"==a.Inventory[f].CatalogVersion){log.debug("adding amount to: "+a.Inventory[f].ItemInstanceId);c=void 0==a.Inventory[f].CustomData?Number(b.carCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(b.carCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(b.carCardsRequest[e]):
Number(a.Inventory[f].CustomData.Amount)+Number(b.carCardsRequest[e]);c={Amount:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:c});c=!0;break}0==c&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:f}),c={Amount:b.carCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:c}))}for(e in b.partCardsRequest)if(log.debug(e+
" : "+b.partCardsRequest[e]),b.partCardsRequest.hasOwnProperty(e)){c=!1;log.debug("looking for: "+e);for(f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==e&&"PartCards"==a.Inventory[f].CatalogVersion){log.debug("adding amount to: "+a.Inventory[f].ItemInstanceId);c=void 0==a.Inventory[f].CustomData?Number(b.partCardsRequest[e]):void 0==a.Inventory[f].CustomData.Amount?Number(b.partCardsRequest[e]):isNaN(Number(a.Inventory[f].CustomData.Amount))?Number(b.partCardsRequest[e]):Number(a.Inventory[f].CustomData.Amount)+
Number(b.partCardsRequest[e]);c={Amount:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:c});c=!0;break}0==c&&(f=[e],f=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:f}),c={Amount:b.partCardsRequest[e]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:f.ItemGrantResults[0].ItemInstanceId,Data:c}))}return{Result:"OK",Message:"InventoryUpdated",InventoryChange:server.GetUserInventory({PlayFabId:currentPlayerId})}};
handlers.buyChest=function(b,k){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(b.curr,b.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.cost}),e={};e[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:e}}};handlers.getServerTime=function(b,k){return{time:new Date}};
