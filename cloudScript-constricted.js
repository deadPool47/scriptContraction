handlers.endGame=function(b,g){var a="01",e="0";"rWin"==b.outcome&&(e="1");var d=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=d.Statistics.length&&(a=d.Statistics[0].Value.toString(),log.debug("wlStat "+a));var k=0,h;log.debug("wlStat.length "+a.length);if(50>a.length){a+=e;h=a.length;for(d=0;d<a.length;d++)"1"==a[d]&&k++;log.debug("wlStatNew "+a)}else{h=a.length;for(d=0;d<a.length-1;d++)a[d]=a[d+1],"1"==a[d]&&k++;a[a.length-1]=e;"1"==e&&k++;log.debug("wlStatNewMoreThanMax "+
a)}e=Math.round(k/h*100);log.debug("winRatio "+e);d=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]});h=0;k=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=k.Statistics.length&&(h=k.Statistics[0].Value);k=h;"rWin"==b.val&&(h=0>=h?30:h+60);var l=[];l.push({StatisticName:"WinLoss",Version:"0",Value:a});l.push({StatisticName:"TrophyCount",Version:"0",Value:h});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:l});if("rOot"!=
b.val){a=JSON.parse(d.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+a);for(var c,d=0;d<a.subdivisions.length;d++)if(k<a.subdivisions[d]){c=d;break}log.debug("user is in subdivision "+c);a=[];a.push({Key:b.envIndex+"_"+b.courseIndex+"_RecPos",Value:b.recordingPos});a.push({Key:b.envIndex+"_"+b.courseIndex+"_RecRot",Value:b.recordingRot});a.push({Key:b.envIndex+"_"+b.courseIndex+"_RecHeader",Value:b.recordingHeader});server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:a});
d=server.GetTitleInternalData({Key:"RecSubDivision"+c}).Data["RecSubDivision"+c];log.debug("recPool: "+d);void 0==d?(d=[],d.push({wl:e,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId}),log.debug("recArray: "+d)):(d=JSON.parse(d),log.debug("recArrayLN: "+d.length));server.SetTitleInternalData({Key:"RecSubDivision"+c,Value:d});return{dicVal:a}}};
handlers.requestSplitPlayerRecording=function(b,g){for(var a=server.GetTitleInternalData({Keys:"Rec_"+b.envIndex+"_"+b.courseIndex}).Data["Rec_"+b.envIndex+"_"+b.courseIndex].split(","),e=a[0],d=0;d<a.length;d++)if(a[d]!=currentPlayerId){e=a[d];break}a=server.GetUserReadOnlyData({PlayFabId:e,Keys:["RecPos_"+b.envIndex+"_"+b.courseIndex,"RecRot_"+b.envIndex+"_"+b.courseIndex,"RecHeader_"+b.envIndex+"_"+b.courseIndex]});e=server.GetPlayerCombinedInfo({PlayFabId:e,InfoRequestParameters:{GetUserAccountInfo:!0,
GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}});return{PosData:a.Data["RecPos_"+b.envIndex+"_"+b.courseIndex].Value,RotData:a.Data["RecRot_"+b.envIndex+"_"+b.courseIndex].Value,HeaderData:a.Data["RecHeader_"+b.envIndex+"_"+b.courseIndex].Value,Opp:e.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};
handlers.updateTrophyCount=function(b,g){var a=0,e=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=e.Statistics.length&&(a=e.Statistics[0].Value);"rStart"==b.val&&(a-=30);0>a&&(a=0);"rWin"==b.val&&(a+=60);if("rLose"==b.val)return{val:a};e=[];e.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:e});if("rWin"==b.val)return{val:a}};
handlers.initServerData=function(b){b=[];var g={StatisticName:"TrophyCount",Version:"0",Value:"0"};b.push(g);g={StatisticName:"League",Version:"0",Value:"0"};b.push(g);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=[];b.push("Decals");b.push("PaintJobs");b.push("Plates");b.push("Rims");b.push("WindshieldText");b=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:b});for(var g={0:"Owned"},a=0;a<b.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[a].ItemInstanceId,Data:g});b=[];b.push("FordFocus");b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b});g={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:g});g={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:g});g={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:g});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:3E3});server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:200})};
handlers.requestInventory=function(b){b=server.GetUserInventory({PlayFabId:currentPlayerId});for(var g=0;g<b.Inventory.length;g++)if("CarsProgress"==b.Inventory[g].CatalogVersion){log.debug("found "+b.Inventory[g].ItemId);b.Inventory[g].CustomData.Pr=recalculateCarPr(b.Inventory[g].CustomData,b.Inventory[g].ItemId);var a={};a.Pr=b.Inventory[g].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[g].ItemInstanceId,Data:a})}return b};
function generateFailObj(b){return{Result:"Failed",Message:b}}function generateErrObj(b){return{Result:"Error",Message:b}}function checkBalance(b,g,a,e){if("SC"==b){if(a<g)return generateFailObj("NotEnoughSC")}else if(e<g)return generateFailObj("NotEnoughHC");return"OK"}
function recalculateCarPr(b,g){for(var a=0,e=server.GetCatalogItems({CatalogVersion:"CarCards"}),d=0;d<e.Catalog.length;d++)if(e.Catalog[d].ItemId==g){d=JSON.parse(e.Catalog[d].CustomData);a+=parseInt(d.basePr)+parseInt(d.prPerLvl)*(parseInt(b.CarLvl)-1);break}for(var e=server.GetCatalogItems({CatalogVersion:"PartCards"}),k={Exhaust:b.ExhaustLvl,Engine:b.EngineLvl,Gearbox:b.GearboxLvl,Suspension:b.SuspensionLvl,Tires:b.TiresLvl,Turbo:b.TurboLvl},h,d=0;d<e.Catalog.length;d++)h=JSON.parse(e.Catalog[d].CustomData),
a+=parseInt(h.basePr)+parseInt(h.prPerLvl)*k[e.Catalog[d].ItemId];return a}
function GenerateBlackMarket(b){var g=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var e=Math.floor(Math.random()*g.Catalog.length),d=JSON.parse(g.Catalog[e].CustomData);if(void 0==d)return generateErrObj("Part card "+g.Catalog[h].ItemId+" has no custom data.");a.BMItem0=g.Catalog[e].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy;var k=Math.floor(Math.random()*g.Catalog.length);k==e&&(k=g.Catalog.length-e-1);d=JSON.parse(g.Catalog[k].CustomData);
if(void 0==d)return generateErrObj("Part card "+g.Catalog[h].ItemId+" has no custom data.");a.BMItem1=g.Catalog[k].ItemId+"_"+d.BMCurrType+"_"+d.BMbasePrice+"_0_"+d.BMpriceIncrPerBuy;for(var g=server.GetCatalogItems({CatalogVersion:"CarCards"}),d=[],k=[],h=0;h<g.Catalog.length;h++){e=JSON.parse(g.Catalog[h].CustomData);if(void 0==e)return generateErrObj("Car card "+g.Catalog[h].ItemId+" has no custom data.");"false"==e.rareCar?d.push(g.Catalog[h].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy):
k.push(g.Catalog[h].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy)}0>=d.length?(a.BMItem2=k[Math.floor(Math.random()*k.length)],a.BMItem3=k[Math.floor(Math.random()*k.length)]):0>=k.length?(a.BMItem2=d[Math.floor(Math.random()*d.length)],a.BMItem3=d[Math.floor(Math.random()*d.length)]):(a.BMItem2=d[Math.floor(Math.random()*d.length)],a.BMItem3=k[Math.floor(Math.random()*k.length)]);server.UpdateUserInternalData({PlayFabId:b,Data:a});h=[];h.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:b,
Keys:h});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes);return a}function GetCurrentBlackMarket(b,g){var a={},e=new Date,d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:b,Keys:d});a.BMTime=60*parseInt(d.Data.BlackMarketResetMinutes)-Math.floor((e.getTime()-g.Data.BMTime.Value)/1E3);for(e=0;4>e;e++)a["BMItem"+e]=g.Data["BMItem"+e].Value;return a}
handlers.purchaseBMItem=function(b,g){log.debug("purchasing item "+b.itemId+" from black market");if(0>b.itemId||3<b.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+b.itemId);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});log.debug("RETRIEVING USER CURRENCY");var e=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+b.itemId].Value.split("_");log.debug("userArray: "+a);var d=e.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var e=2>b.itemId?"PartCards":"CarCards",k=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),d=checkBalance(a[1],k,d,d);if("OK"!=d)return d;try{d=[];d.push(a[0]);var h=server.GrantItemsToUser({CatalogVersion:e,PlayFabId:currentPlayerId,ItemIds:d}),l=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a[1],Amount:k}),c=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];log.debug("generatedArray: "+c);k={};k["BMItem"+b.itemId]=c;server.UpdateUserInternalData({PlayFabId:currentPlayerId,
Data:k});c="1";void 0!=h.ItemGrantResults[0].RemainingUses&&(c=h.ItemGrantResults[0].RemainingUses);var f=[{ItemId:a[0],CatalogVersion:e,RemainingUses:c}],h={};h[l.VirtualCurrency]=l.Balance;var q=b.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:f,VirtualCurrency:h},BMItemChange:q}}catch(p){generateErrObj("Something went horribly wrong somewhere: "+p)}};
handlers.retrieveBlackMarket=function(b,g){var a=[];a.push("BMTime");for(var e=0;4>e;e++)a.push("BMItem"+e);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0==a.Data.BMTime)return log.debug("No user BM data detected; generating ..."),GenerateBlackMarket(currentPlayerId);e=new Date;log.debug("milliseconds passed: "+e.getTime());log.debug("BMTime: "+a.Data.BMTime.Value);var d=[];d.push("BlackMarketResetMinutes");d=server.GetTitleData({PlayFabId:currentPlayerId,Keys:d});if(e.getTime()-
parseInt(a.Data.BMTime.Value)>6E4*parseInt(d.Data.BlackMarketResetMinutes))return log.debug("regenerating market"),GenerateBlackMarket(currentPlayerId);log.debug("get current market");return GetCurrentBlackMarket(currentPlayerId,a)};
handlers.updateCarCust=function(b,g){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=[],d="-1",k={},h={PaintJobs:{itemOwned:"no",itemCustData:b.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:b.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:b.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:b.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:b.wsId,carItemId:"WindshieldId"}},l=0;l<a.Inventory.length;l++)a.Inventory[l].ItemId==
b.carId&&"CarsProgress"==a.Inventory[l].CatalogVersion&&(d=a.Inventory[l].ItemInstanceId),a.Inventory[l].ItemId in h&&(h[a.Inventory[l].ItemId].itemOwned="yes",h[a.Inventory[l].ItemId].itemCustData in a.Inventory[l].CustomData?k[h[a.Inventory[l].ItemId].carItemId]=h[a.Inventory[l].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[l].ItemId+" "+h[a.Inventory[l].ItemId].itemCustData));if("-1"==d)return generateFailObj("User does not own car with id: "+b.carId);for(var c in h)h.hasOwnProperty(c)&&
"no"==h[c].itemOwned&&e.push(c);if(k=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:k});a=[{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:k}];if(0<e.length)for(e=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:e}),d={0:"Owned"},l=0;l<e.ItemGrantResults.length;l++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:e.ItemGrantResults[l].ItemInstanceId,Data:d});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.purchaseItems=function(b,g){log.debug("RETRIEVING USER INVENTORY");var a=server.GetUserInventory({PlayFabId:currentPlayerId}),e=a.VirtualCurrency.SC,d=a.VirtualCurrency.HC;log.debug("user currency: SC: "+e+" HC: "+d);switch(b.purchaseType){case "carUpgrade":log.debug("== carUpgrade request: carId: "+b.carId);log.debug("RETRIEVING CARDS CATALOGUE");for(var k=server.GetCatalogItems({CatalogVersion:"CarCards"}),h=!1,l,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarsProgress"==
a.Inventory[c].CatalogVersion){h=!0;log.debug("car is in user's inventory!");l=a.Inventory[c];break}for(var f,c=0;c<k.Catalog.length;c++)if(k.Catalog[c].ItemId==b.carId){f=JSON.parse(k.Catalog[c].CustomData);log.debug("cardInfo found!");break}if(void 0==f)return log.error("cardInfo undefined!"),f={Result:"Error",Message:"CardNotFoundForCarwithID: "+b.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(1==h){log.debug("user has car: "+b.carId+
"... upgrading");k=parseInt(f.baseCurrCost)+parseInt(l.CustomData.CarLvl)*parseInt(f.currCostPerLvl);d=checkBalance(f.currType,k,e,d);if("OK"!=d)return d;log.debug("user has enough currency. Let's check for card balance");d=parseInt(f.baseCardCost)+parseInt(l.CustomData.CarLvl)*parseInt(f.cardCostPerLvl);log.debug("cardCost: "+d);for(var q=!1,c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarCards"==a.Inventory[c].CatalogVersion){log.debug("consuming: "+a.Inventory[c].ItemInstanceId);
q=!0;try{var p=server.ConsumeItem({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,ConsumeCount:d})}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}log.debug("user has enough cards to purchase upgrade!");if(0==q)return generateFailObj("No cards found");a=parseInt(l.CustomData.CarLvl)+1;c=recalculateCarPr(l.CustomData,l.ItemId);log.debug("upgrading to car lvl: "+a+" and pr: "+c);c={CarLvl:a,Pr:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:l.ItemInstanceId,Data:c});var m;0<k&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:f.currType,Amount:k}));log.debug("Upgrade Complete!");c=[{ItemId:b.carId,CatalogVersion:"CarCards",RemainingUses:p.RemainingUses},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:c}];f={};c={Inventory:c};void 0!=m&&(f[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=f);f={Result:"OK",Message:"InventoryUpdate",InventoryChange:c}}else{log.debug("user doesn't have car: "+
b.carId+"... looking for card");q=!1;for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarCards"==a.Inventory[c].CatalogVersion){log.debug("consuming: "+a.Inventory[c].ItemInstanceId);q=!0;try{p=server.ConsumeItem({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,ConsumeCount:f.baseCardCost})}catch(u){return generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("No cards found");log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");
d=checkBalance(f.currType,f.baseCurrCost,e,d);if("OK"!=d)return d;c=[];c.push(b.carId);d=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:c});if(0==d.ItemGrantResults[0].Result){log.error("Something went wrong while giving user the item, refunding cards");m=[];for(c=0;c<f.baseCardCost;c++)m.push(b.carId);server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:m});return generateFailObj("Something went wrong while giving user the item, refunding cards.")}0<
f.baseCurrCost&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:f.currType,Amount:f.baseCurrCost}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:c});c={TiresLvl:"0",TurboLvl:"0",PaintId:f.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,
Data:c});c={PlatesId:"0",WindshieldId:"0",Pr:f.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemGrantResults[0].ItemInstanceId,Data:c});l=d=!1;for(var n,c=0;c<a.Inventory.length;c++)if("PaintJobs"==a.Inventory[c].ItemId){l=!0;log.debug("user has paintjobs");void 0!=a.Inventory[c].CustomData?(log.debug("user has paintjobs customData"),f.defaultPaintID in a.Inventory[c].CustomData?(log.debug("user has paintjob already"),d=!0):(log.debug("user doesn't have paintjob"),
n={},n[f.defaultPaintID]="Owned")):(n={},n[f.defaultPaintID]="Owned");void 0!=n&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,Data:n});break}0==l&&(paintToGive=[],paintToGive.push("PaintJobs"),c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),n={},n[f.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:c.ItemGrantResults[0].ItemInstanceId,
Data:n}));c={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:f.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:f.basePr};c=[{ItemId:b.carId,CatalogVersion:"CarCards",RemainingUses:p.RemainingUses},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:c}];0==d&&(a={},a[f.defaultPaintID]="Owned",c.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:a}));f={};c={Inventory:c};void 0!=m&&(f[m.VirtualCurrency]=
m.Balance,c.VirtualCurrency=f);f={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:c}}return f;case "partUpgrade":log.debug("Upgrading Part: "+b.partId+" on Car: "+b.carId);log.debug("Checking to see if car exists in catalog");n=server.GetCatalogItems({CatalogVersion:"CarsProgress"});h=!1;for(c=0;c<n.Catalog.length;c++)if(n.Catalog[c].ItemId==b.carId){h=!0;break}if(0==h)return log.error("invalid car ID"),f={Result:"Error",Message:"car with ID: "+b.carId+" not found in catalog."};log.debug("Checking to see if part exists in catalog");
n=server.GetCatalogItems({CatalogVersion:"PartCards"});h=!1;for(c=0;c<n.Catalog.length;c++)if(n.Catalog[c].ItemId==b.partId){f=JSON.parse(n.Catalog[c].CustomData);h=!0;break}if(0==h)return log.error("invalid part ID"),f={Result:"Error",Message:"part with ID: "+b.partId+" not found in catalog."};log.debug("Checking to see if user has car: "+b.carId);h=!1;for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.carId&&"CarsProgress"==a.Inventory[c].CatalogVersion){h=!0;log.debug("car is in user's inventory!");
l=a.Inventory[c];break}if(0==h)return generateFailObj("car with ID: "+b.carId+" not found in user inventory.");log.debug("Checking to see whether user has enough money to upgrade part");log.debug("Checking to see if user has part and or has enough parts");n=!1;for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.partId&&"PartCards"==a.Inventory[c].CatalogVersion){n=!0;log.debug("part is in user's inventory!");var q={},r={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",
Tires:"TiresLvl",Turbo:"TurboLvl"};log.debug("calculating "+b.partId+" cost and modifying "+r[b.partId]);var h=parseInt(f.baseCardCost)+parseInt(l.CustomData[r[b.partId]])*parseInt(f.cardCostPerLvl),k=parseInt(f.baseCurrCost)+parseInt(l.CustomData[r[b.partId]])*parseInt(f.currCostPerLvl),t=parseInt(l.CustomData[r[b.partId]])+1;q[r[b.partId]]=t;l.CustomData[r[b.partId]]=t;log.debug("we need: "+h+" cards");d=checkBalance(f.currType,k,e,d);if("OK"!=d)return d;log.debug("consuming part instance: "+a.Inventory[c].ItemInstanceId);
try{p=server.ConsumeItem({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[c].ItemInstanceId,ConsumeCount:h})}catch(u){return log.debug("itemConsumptionResult.errorCode "+u),generateFailObj("Insufficient cards")}break}if(0==n)return generateFailObj("Part not found");0<k&&(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:f.currType,Amount:k}));c=recalculateCarPr(l.CustomData,l.ItemId);q.Pr=c;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.ItemInstanceId,
Data:q});c=[{ItemId:b.partId,CatalogVersion:"PartCards",RemainingUses:p.RemainingUses},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:q}];log.debug("succesfully upgraded part!");f={};c={Inventory:c};void 0!=m&&(f[m.VirtualCurrency]=m.Balance,c.VirtualCurrency=f);return f={Result:"OK",Message:"InventoryUpdatePart",InventoryChange:c};case "custPurchase":log.debug("Purchasing Customization: "+b.custId+" with val: "+b.custVal);log.debug("Checking to see if customization exists in catalog");
p=server.GetCatalogItems({CatalogVersion:"Customization"});f=0;m="SC";for(c=0;c<p.Catalog.length;c++)if(p.Catalog[c].ItemId==b.custId){r=p.Catalog[c];f=JSON.parse(p.Catalog[c].CustomData);c=b.custVal+",Cost";m=f[b.custVal+",Curr"];f=f[c];d=checkBalance(m,f,e,d);if("OK"!=d)return d;log.debug("custCurr: "+m);log.debug("custPrice: "+f);break}if(void 0==r)return log.error("Customization does not exist in catalog"),f={Result:"Error",Message:"Customization does not exist in catalog."};log.debug("Checking to see if user has said customization");
for(c=0;c<a.Inventory.length;c++)if(a.Inventory[c].ItemId==b.custId){log.debug("user has customization category!");t=a.Inventory[c];h=a.Inventory[c].ItemInstanceId;if(void 0!=t.CustomData&&String(b.custVal)in t.CustomData)return generateFailObj("User already has this customization.");break}if(void 0==t){log.info("user doesn't have customization category. Granting ... ");c=[];c.push(b.custId);c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:c});if(0==c.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),
f={Result:"Error",Message:"something went wrong while granting user customization class object."};h=c.ItemGrantResults[0].ItemInstanceId}c={};c[String(b.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:h,Data:c});c=[{ItemId:b.custId,CatalogVersion:"Customization",CustomData:c}];0<f?(m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:m,Amount:f}),f={},f[m.VirtualCurrency]=m.Balance,c={Inventory:c,VirtualCurrency:f}):c=
{Inventory:c};return f={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:c};case "softCurrencyPurchase":log.debug("Purchasing pack: "+b.packId);log.debug("Checking to see if pack exists in catalog");m=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});a=!1;for(c=p=0;c<m.Catalog.length;c++)if(m.Catalog[c].ItemId==b.packId){p=m.Catalog[c].VirtualCurrencyPrices.HC;f=JSON.parse(m.Catalog[c].CustomData);a=!0;break}if(0==a)return f={Result:"Error",Message:"pack with ID: "+
b.packId+" not found in catalog."};if(0>=p)return f={Result:"Error",Message:"pack with ID: "+b.packId+" shouldn't have negative cost."};if(p>d)return generateFailObj("Not enough HC.");m=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:p});c=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:f.quantity});f={};f[c.VirtualCurrency]=c.Balance;f[m.VirtualCurrency]=m.Balance;return f={Result:"OK",Message:"SoftCurrencyPurchased",
InventoryChange:{VirtualCurrency:f}};default:log.debug("invalid purchase parameter")}};handlers.giveMoney=function(b){b=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.amount});var g={};g[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:g}}};
handlers.grantItems=function(b){for(var g=[],a=0;a<b.amount;a++)g.push(b.itemId);try{var e=server.GrantItemsToUser({CatalogVersion:b.catalogId,PlayFabId:currentPlayerId,ItemIds:g});return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:b.itemId,CatalogVersion:b.catalogId,RemainingUses:e.ItemGrantResults[0].RemainingUses}]}}}catch(d){generateErrObj("Error: "+d)}};
handlers.buyChest=function(b,g){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(b.curr,b.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.cost}),e={};e[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:e}}};handlers.getServerTime=function(b,g){return{time:new Date}};
