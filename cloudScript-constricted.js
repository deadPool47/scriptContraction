handlers.endGame=function(b,l){var a="01",c,e="0";"rWin"==b.outcome&&(e="1");var g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});0!=g.Statistics.length&&(c=g.Statistics[0].Value.toString(),log.debug("wlStatInt "+c),a=Number(c).toString(2),log.debug("wlStat "+a));var g=0,k;log.debug("wlStat.length "+a.length);k=Array(a.length);log.debug("tempString.length "+k.length);for(var d=0;d<k.length-1;d++)k[d]=a[d];k[k.length-1]=e;log.debug("tempString "+k);a=k;log.debug("wlStat "+
a);e=a.length;for(d=0;d<a.length;d++)"1"==a[d]&&g++;log.debug("wlStatNew "+a);k=Math.round(g/e*100);log.debug("winRatio "+k);var f=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges"]}),e=0,h,g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=g.Statistics.length&&(e=g.Statistics[0].Value,log.debug("getting trophy count "+g.Statistics[0].Value));h=e=Number(e);g=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:["trophyLose","trophyWin"]});
log.debug("pDat.Data[trophyLose] "+g.Data.trophyLose.Value);log.debug("pDat.Data[trophyWin] "+g.Data.trophyWin.Value);g=void 0==g.Data.trophyLose||void 0==g.Data.trophyWin?45:Number(g.Data.trophyLose.Value)+Number(g.Data.trophyWin.Value);log.debug("refund: "+g);"rWin"==b.outcome&&(e+=g);log.debug("trophies change: "+h+" => "+e);g=calculateLeague(e);for(d=c=0;d<a.length;d++)"1"==a[d]&&(c+=Math.pow(2,d));d=[];d.push({StatisticName:"WinLoss",Version:"0",Value:c});a={StatisticName:"TrophyCount",Version:"0",
Value:e};d.push(a);a={StatisticName:"League",Version:"0",Value:g};d.push(a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:d});if("rOot"==b.outcome){var m={TrophyCount:e,League:g};return{Result:m}}a=JSON.parse(f.Data.SubdivisionTrophyRanges);log.debug("SubdivisionTrophyRanges "+a);for(d=0;d<a.subdivisions.length;d++)if(h<a.subdivisions[d]){m=d;break}log.debug("user is in subdivision "+m);d=[];d.push({Key:b.envIndex+"_"+b.courseIndex+"_RecPos",Value:b.recordingPos});d.push({Key:b.envIndex+
"_"+b.courseIndex+"_RecRot",Value:b.recordingRot});d.push({Key:b.envIndex+"_"+b.courseIndex+"_RecHeader",Value:b.recordingHeader});log.debug("updating user read only data ");d=server.UpdateUserReadOnlyData({PlayFabId:currentPlayerId,Data:d});log.debug("updated user read only data for "+currentPlayerId+" "+d);d=server.GetTitleInternalData({Key:"RecSubDivision"+m}).Data["RecSubDivision"+m];log.debug("recPool: "+d);if(void 0==d)a=[],k={wl:k,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId},a.push(k),
d=JSON.stringify(a),log.debug("recArray: "+d);else{a=JSON.parse(d);log.debug("recArray: "+a);k={wl:k,e:b.envIndex,c:b.courseIndex,uId:currentPlayerId};f=!1;for(d=h=0;d<a.length;d++)a[d].uId==currentPlayerId&&h++;if(2<h)return m={TrophyCount:e,League:g},{Result:m};for(d=0;d<a.length;d++)if(a[d].e==b.envIndex&&a[d].c==b.courseIndex){f=!0;a[d]=k;if(1==a.length)break;if(0<d)if(a[d].wl>a[d-1].wl){if(d==a.length-1)break;for(h=d+1;h<a.length;h++)if(a[h-1].wl>a[h].wl)c=a[h],a[h]=a[h-1],a[h-1]=c;else break}else for(h=
d-1;0<=h;h--)if(a[h+1].wl<a[h].wl)c=a[h],a[h]=a[h+1],a[h+1]=c;else break;else for(h=d+1;h<a.length;h++)if(a[h-1].wl>a[h].wl)c=a[h],a[h]=a[h-1],a[h-1]=c;else break}0==f&&(log.debug("recArrayLNbefore: "+a.length),a.push(k),log.debug("recArrayLNafter: "+a.length));d=JSON.stringify(a);log.debug("titleKeyVal: "+d)}server.SetTitleInternalData({Key:"RecSubDivision"+m,Value:d});m={TrophyCount:e,League:g};return{Result:m}};
handlers.startGame=function(b,l){var a="01",c,e=50,g,k=0;g=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["WinLoss"]});if(0!=g.Statistics.length){c=g.Statistics[0].Value.toString();a=Number(c).toString(2);g=a.length;for(var d=0;d<a.length;d++)"1"==a[d]&&k++;e=Math.round(k/g*100)}log.debug("wlStatBeforeshiftandAdd "+a);a+="0";log.debug("wlStatBeforeshift "+a);20<a.length&&(a=a.slice(1));log.debug("wlStat "+a);g=server.GetTitleData({Key:["LeagueSubdivisions","SubdivisionTrophyRanges",
"TrophyGainRange"]});var f=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]}),k=0;0!=f.Statistics.length&&(k=f.Statistics[0].Value);k=Number(k);c=JSON.parse(g.Data.SubdivisionTrophyRanges);var h=JSON.parse(g.Data.LeagueSubdivisions);log.debug("SubdivisionTrophyRanges "+c);var m=43;g=g.Data.TrophyGainRange.split("_");f=Number(g[0]);log.debug("rMin: "+f);g=Number(g[1]);log.debug("rMax: "+g);for(d=0;d<c.subdivisions.length;d++)if(k<Number(c.subdivisions[d])){m=d;break}log.debug("user is in subdivision "+
m);var n=server.GetTitleInternalData({Keys:"RecSubDivision"+m}).Data["RecSubDivision"+m],m=!1;void 0==n&&(m=!0);var n=0==m?JSON.parse(n):[],u=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];log.debug("subrecording pool has "+n.length+" length. Must have: 15 length");15>n.length&&(m=!0);var p=Array(n.length),r=0;log.debug("iterating through recArray");for(d=0;d<n.length;d++)1==m&&(u[5*Number(n[d].e)+Number(n[d].c)]=1),n[d].uId==currentPlayerId?log.debug("found: "+n[d].uId+"... skipping"):(p[r]=n[d],r++);log.debug("isIncompleteSubDivision: "+
m);if(1==m){for(d=n=m=0;d<u.length;d++)if(0==u[d]){m=Math.floor(d/5);n=d%5;break}log.debug("gettingDefaultUser: env: "+m+" course: "+n);d=server.GetTitleData({Keys:"MasterUser"});if(void 0!=d.Data.MasterUser&&(log.debug("master user: "+d.Data.MasterUser),d=server.GetUserReadOnlyData({PlayFabId:d.Data.MasterUser,Keys:[m+"_"+n+"_RecPos",m+"_"+n+"_RecRot",m+"_"+n+"_RecHeader"]}),void 0!=d.Data&&(log.debug("defaultRecordingData: "+d.Data),void 0!=d.Data[m+"_"+n+"_RecPos"]&&void 0!=d.Data[m+"_"+n+"_RecRot"]&&
void 0!=d.Data[m+"_"+n+"_RecHeader"]))){var q=!0;0==k?(k=g,q=!1):k-=f;1>=k&&(k=1);c=parseInt(a,2);log.debug("updating WL to:  "+c);a=[];c={StatisticName:"WinLoss",Version:"0",Value:c};a.push(c);k={StatisticName:"TrophyCount",Version:"0",Value:k};a.push(k);k={StatisticName:"League",Version:"0",Value:t};a.push(k);log.debug("updatingStats: "+a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:g,trophyLose:f};0==q&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,
Data:a});log.debug("found valid default rec");return{Result:"OK",RecType:"Default",PosData:d.Data[m+"_"+n+"_RecPos"].Value,RotData:d.Data[m+"_"+n+"_RecRot"].Value,HeaderData:d.Data[m+"_"+n+"_RecHeader"].Value,TrophyLose:f,TrophyWin:g,Opp:"Mniezo"}}}log.debug("looking for user generated recording");if(0==r)return generateErrObj("no valid recording found for this subdivision");m=r-1;for(d=0;d<r;d++)if(p[d].wl>e){m=d;break}log.debug("pivot is: "+m);e=Math.min(r,3);log.debug("finalRecArraySize: "+e);
t=Array(e);for(d=0;d<e;d++)t[d]=0>=m?p[d]:m>=r-1?p[r-1-d]:p[m-Math.floor(e/2)+d];m=Math.floor(Math.random()*e);d=t[m].uId;e=t[m].e;m=t[m].c;t=[e+"_"+m+"_RecPos",e+"_"+m+"_RecRot",e+"_"+m+"_RecHeader"];log.debug("requesting "+t);n=server.GetUserReadOnlyData({PlayFabId:d,Keys:t});if(void 0==n)return generateErrObj("Did not find recording for this user: "+d);var d=server.GetPlayerCombinedInfo({PlayFabId:d,InfoRequestParameters:{GetUserAccountInfo:!0,GetUserInventory:!1,GetUserVirtualCurrency:!1,GetUserData:!1,
GetUserReadOnlyData:!1,GetCharacterInventories:!1,GetCharacterList:!1,GetTitleData:!1,GetPlayerStatistics:!1}}),p=k,t=Number(calculateLeague(k));log.debug("cLeague "+t);log.debug("lsValParsed: "+h);log.debug("sdvalParsed: "+c);log.debug("lsValParsed.leagues: "+h.leagues);log.debug("sdvalParsed.subDivisions: "+c.subdivisions);r=0<t?Number(c.subdivisions[h.leagues[t-1]]):0;c=t>=h.leagues.length-1?2*r:Number(c.subdivisions[h.leagues[t]]);log.debug("maxLT "+c+" minLeagueT "+r);h=JSON.parse(n.Data[e+"_"+
m+"_RecHeader"].Value);void 0!=h&&(q=h.Trophies);q=Number(q);0>=c-r?q=g:Math.abs(p-q)>c-r?(q=f,f=g):(log.debug("rMin: "+f+" userTrophies: "+p+" oppTrophies "+q+" maxLeagueT "+c+" minLeagueT "+r+" rMax: "+g),q=f+Math.floor((g-f)/2*((p-q)/(c-r)+1)),f=3*(g-f)-q);h=!0;0==k?(h=!1,k=g):(k-=Number(q),1>=k&&(k=1));log.debug("trophiesToTake:  "+q);log.debug("trophiesToGive:  "+f);c=parseInt(a,2);log.debug("updating WL to:  "+c);a=[];c={StatisticName:"WinLoss",Version:"0",Value:c};a.push(c);k={StatisticName:"TrophyCount",
Version:"0",Value:k};a.push(k);k={StatisticName:"League",Version:"0",Value:t};a.push(k);log.debug("updatingStats: "+a);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:a});a={trophyWin:f,trophyLose:q};0==h&&(a.trophyWin=0,a.trophyLose=0);server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:a});return{Result:"OK",RecType:"UserGenerated",PosData:n.Data[e+"_"+m+"_RecPos"].Value,RotData:n.Data[e+"_"+m+"_RecRot"].Value,HeaderData:n.Data[e+"_"+m+"_RecHeader"].Value,TrophyLose:q,
TrophyWin:f,Opp:d.InfoResultPayload.AccountInfo.TitleInfo.DisplayName}};handlers.updateTrophyCount=function(b,l){var a=0,c=server.GetPlayerStatistics({PlayFabId:currentPlayerId,StatisticNames:["TrophyCount"]});0!=c.Statistics.length&&(a=c.Statistics[0].Value);"rStart"==b.val&&(a-=30);0>a&&(a=0);"rWin"==b.val&&(a+=60);if("rLose"==b.val)return{val:a};c=[];c.push({StatisticName:"TrophyCount",Version:"0",Value:a});server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:c});if("rWin"==b.val)return{val:a}};
handlers.initServerData=function(b){b=[];var l={StatisticName:"TrophyCount",Version:"0",Value:"0"};b.push(l);l={StatisticName:"League",Version:"0",Value:"0"};b.push(l);server.UpdatePlayerStatistics({PlayFabId:currentPlayerId,Statistics:b});b=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:["Decals","PaintJobs","Plates","Rims","WindshieldText"]});for(var l={0:"Owned"},a=0;a<b.ItemGrantResults.length;a++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[a].ItemInstanceId,Data:l});b=[];b.push("FordFocus");b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b});l={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l={PlatesId:"0",WindshieldId:"0",Pr:"10"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l});l=[];l.push("Engine");l=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:l});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.ItemGrantResults[0].ItemInstanceId,Data:{Amount:"5"}});l={CarLvl:"1",EngineLvl:"0",
ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l})};handlers.requestCurrency=function(b){return{VirtualCurrency:server.GetUserInventory({PlayFabId:currentPlayerId}).VirtualCurrency}};
handlers.requestInventory=function(b){b=server.GetUserInventory({PlayFabId:currentPlayerId});for(var l=server.GetCatalogItems({CatalogVersion:"CarCards"}),a=server.GetCatalogItems({CatalogVersion:"PartCards"}),c=!1,e=0;e<b.Inventory.length;e++)if("CarsProgress"==b.Inventory[e].CatalogVersion){var c=!0,g=checkCarDataValidity(b.Inventory[e],l);log.debug("check "+g);if("PlayFabError"==g||void 0==g)return generateErrObj("PlayfabError");"OK"==g?log.debug("Data for "+b.Inventory[e].ItemId+" OK"):b.Inventory[e].CustomData=
g;b.Inventory[e].CustomData.Pr=recalculateCarPr(b.Inventory[e].CustomData,b.Inventory[e].ItemId,l,a);g={};g.Pr=b.Inventory[e].CustomData.Pr;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.Inventory[e].ItemInstanceId,Data:g})}return 0==c?(b=[],b.push("FordFocus"),b=server.GrantItemsToUser({CatalogVersion:"CarsProgress",PlayFabId:currentPlayerId,ItemIds:b}),l={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l}),l={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l}),l={PlatesId:"0",WindshieldId:"0",Pr:"10"},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemGrantResults[0].ItemInstanceId,Data:l}),generateErrObj("UserHasNoCars ... reiniting")):b};
function checkCarDataValidity(b,l){if(void 0==b.CustomData){try{var a={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a});a={TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a});for(var c=0,e=0;e<l.Catalog.length;e++)if(l.Catalog[e].ItemId==b.ItemId){var g=
JSON.parse(l.Catalog[e].CustomData),c=parseInt(g.basePr);break}a={PlatesId:"0",WindshieldId:"0",Pr:c};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:b.ItemInstanceId,Data:a})}catch(k){return"PlayFabError"}return{CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:"0",DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",Pr:c}}return"OK"}function generateFailObj(b){return{Result:"Failed",Message:b}}
function generateErrObj(b){return{Result:"Error",Message:b}}function checkBalance(b,l,a,c){if("SC"==b){if(a<l)return generateFailObj("NotEnoughSC")}else if(c<l)return generateFailObj("NotEnoughHC");return"OK"}
function calculateLeague(b){var l=server.GetTitleData({Keys:["LeagueSubdivisions","SubdivisionTrophyRanges"]});if(void 0==l.Data.LeagueSubdivisions||void 0==l.Data.SubdivisionTrophyRanges)return 1;for(var a=JSON.parse(l.Data.LeagueSubdivisions).leagues,l=JSON.parse(l.Data.SubdivisionTrophyRanges).subdivisions,c=0;c<a.length;c++)if(!(Number(b)>Number(l[a[c]])))return c}
function recalculateCarPr(b,l,a,c){var e=0,g;g=void 0==a?server.GetCatalogItems({CatalogVersion:"CarCards"}):a;for(a=0;a<g.Catalog.length;a++)if(g.Catalog[a].ItemId==l){a=JSON.parse(g.Catalog[a].CustomData);e+=parseInt(a.basePr)+parseInt(a.prPerLvl)*(parseInt(b.CarLvl)-1);break}c=void 0==c?server.GetCatalogItems({CatalogVersion:"PartCards"}):c;b={Exhaust:b.ExhaustLvl,Engine:b.EngineLvl,Gearbox:b.GearboxLvl,Suspension:b.SuspensionLvl,Tires:b.TiresLvl,Turbo:b.TurboLvl};for(a=0;a<c.Catalog.length;a++)l=
JSON.parse(c.Catalog[a].CustomData),e+=parseInt(l.basePr)+parseInt(l.prPerLvl)*b[c.Catalog[a].ItemId];return e}
function GenerateBlackMarket(b){var l=1,a=server.GetPlayerStatistics({PlayFabId:b,StatisticNames:["League"]});0!=a.Statistics.length&&(l=a.Statistics[0].Value.toString());var c=server.GetCatalogItems({CatalogVersion:"PartCards"}),a={};a.BMTime=(new Date).getTime();var e=Math.floor(Math.random()*c.Catalog.length),g=JSON.parse(c.Catalog[e].CustomData);if(void 0==g)return generateErrObj("Part card "+c.Catalog[d].ItemId+" has no custom data.");a.BMItem0=c.Catalog[e].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+
"_0_"+g.BMpriceIncrPerBuy;var k=Math.floor(Math.random()*c.Catalog.length);k==e&&(k=c.Catalog.length-e-1);g=JSON.parse(c.Catalog[k].CustomData);if(void 0==g)return generateErrObj("Part card "+c.Catalog[d].ItemId+" has no custom data.");a.BMItem1=c.Catalog[k].ItemId+"_"+g.BMCurrType+"_"+g.BMbasePrice+"_0_"+g.BMpriceIncrPerBuy;for(var c=server.GetCatalogItems({CatalogVersion:"CarCards"}),g=[],k=[],d=0;d<c.Catalog.length;d++){e=JSON.parse(c.Catalog[d].CustomData);if(void 0==e)return generateErrObj("Car card "+
c.Catalog[d].ItemId+" has no custom data.");e.unlockedAtRank>l+1||("false"==e.rareCar?g.push(c.Catalog[d].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy):k.push(c.Catalog[d].ItemId+"_"+e.BMCurrType+"_"+e.BMbasePrice+"_0_"+e.BMpriceIncrPerBuy))}0>=g.length?(a.BMItem2=k[Math.floor(Math.random()*k.length)],a.BMItem3=k[Math.floor(Math.random()*k.length)]):0>=k.length?(a.BMItem2=g[Math.floor(Math.random()*g.length)],a.BMItem3=g[Math.floor(Math.random()*g.length)]):(a.BMItem2=g[Math.floor(Math.random()*
g.length)],a.BMItem3=k[Math.floor(Math.random()*k.length)]);server.UpdateUserInternalData({PlayFabId:b,Data:a});l=[];l.push("BlackMarketResetMinutes");b=server.GetTitleData({PlayFabId:b,Keys:l});a.BMTime=60*parseInt(b.Data.BlackMarketResetMinutes);return a}
function GetCurrentBlackMarket(b,l){var a={},c=new Date,e=[];e.push("BlackMarketResetMinutes");e=server.GetTitleData({PlayFabId:b,Keys:e});a.BMTime=60*parseInt(e.Data.BlackMarketResetMinutes)-Math.floor((c.getTime()-l.Data.BMTime.Value)/1E3);for(c=0;4>c;c++)a["BMItem"+c]=l.Data["BMItem"+c].Value;return a}
handlers.purchaseBMItem=function(b,l){log.debug("purchasing item "+b.itemId+" from black market");if(0>b.itemId||3<b.itemId)return generateFailObj("invalid item index");var a=[];a.push("BMItem"+b.itemId);var a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a}),c=server.GetUserInventory({PlayFabId:currentPlayerId}),a=a.Data["BMItem"+b.itemId].Value.split("_");log.debug("userArray: "+a);var e=c.VirtualCurrency[a[1]];5!=a.length&&generateErrObj("User Black Market corrupted. Try again tomorrow");
var g;g=2>b.itemId?"PartCards":"CarCards";var k=parseInt(a[2])+parseInt(a[3])*parseInt(a[4]),e=checkBalance(a[1],k,e,e);if("OK"!=e)return e;var d,f;log.debug("searching for: "+a[0]+" in "+g);for(e=0;e<c.Inventory.length;e++)if(c.Inventory[e].ItemId==a[0]&&c.Inventory[e].CatalogVersion==g){log.debug("found it!");d=c.Inventory[e].ItemInstanceId;void 0==c.Inventory[e].CustomData?(log.debug("no custom data. creating ..."),f={Amount:1}):void 0==c.Inventory[e].CustomData.Amount?f={Amount:1}:(f=Number(c.Inventory[e].CustomData.Amount)+
1,isNaN(f)&&(f=1),f={Amount:f});server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:f});break}void 0==d&&(log.debug("cardInstance is undefined"),d=[],d.push(a[0]),d=server.GrantItemsToUser({CatalogVersion:g,PlayFabId:currentPlayerId,ItemIds:d}).ItemGrantResults[0].ItemInstanceId,void 0==d?generateErrObj("grantRequest denied"):(f={Amount:1},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d,Data:f})));d=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:a[1],Amount:k});k=a[0]+"_"+a[1]+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];log.debug("generatedArray: "+k);c={};c["BMItem"+b.itemId]=k;server.UpdateUserInternalData({PlayFabId:currentPlayerId,Data:c});f=[{ItemId:a[0],CatalogVersion:g,CustomData:f}];g={};g[d.VirtualCurrency]=d.Balance;a=b.itemId+"_"+a[2]+"_"+(parseInt(a[3])+1)+"_"+a[4];e={Inventory:f,VirtualCurrency:g};return{Result:"OK",Message:"InventoryUpdate",InventoryChange:e,BMItemChange:a}};
handlers.retrieveBlackMarket=function(b,l){var a=[];a.push("BMTime");for(var c=0;4>c;c++)a.push("BMItem"+c);a=server.GetUserInternalData({PlayFabId:currentPlayerId,Keys:a});if(void 0==a.Data.BMTime)return log.debug("No user BM data detected; generating ..."),GenerateBlackMarket(currentPlayerId);c=new Date;log.debug("milliseconds passed: "+c.getTime());log.debug("BMTime: "+a.Data.BMTime.Value);var e=[];e.push("BlackMarketResetMinutes");e=server.GetTitleData({PlayFabId:currentPlayerId,Keys:e});if(1==
b.reset){log.debug("reseting market");a="HC";c=200;e=server.GetTitleData({Keys:["BlackMarketResetCost"]});void 0!=e.Data.BlackMarketResetCost&&(c=e.Data.BlackMarketResetCost.split("_"),a=c[0],c=Number(c[1]));if(0<c){e=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(a,c,e.VirtualCurrency.SC,e.VirtualCurrency.HC))return generateFailObj("not enough money");c=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:a,Amount:c});a=GenerateBlackMarket(currentPlayerId);
e={};e[c.VirtualCurrency]=c.Balance;c={VirtualCurrency:e};a.InventoryChange=c;return a}return GenerateBlackMarket(currentPlayerId)}if(c.getTime()-parseInt(a.Data.BMTime.Value)>6E4*parseInt(e.Data.BlackMarketResetMinutes))return log.debug("regenerating market"),GenerateBlackMarket(currentPlayerId);log.debug("get current market");return GetCurrentBlackMarket(currentPlayerId,a)};
handlers.updateCarCust=function(b,l){for(var a=server.GetUserInventory({PlayFabId:currentPlayerId}),c=[],e="-1",g={},k={PaintJobs:{itemOwned:"no",itemCustData:b.paintId,carItemId:"PaintId"},Decals:{itemOwned:"no",itemCustData:b.decalId,carItemId:"DecalId"},Plates:{itemOwned:"no",itemCustData:b.platesId,carItemId:"PlatesId"},Rims:{itemOwned:"no",itemCustData:b.rimsId,carItemId:"RimsId"},WindshieldText:{itemOwned:"no",itemCustData:b.wsId,carItemId:"WindshieldId"}},d=0;d<a.Inventory.length;d++)a.Inventory[d].ItemId==
b.carId&&"CarsProgress"==a.Inventory[d].CatalogVersion&&(e=a.Inventory[d].ItemInstanceId),a.Inventory[d].ItemId in k&&(k[a.Inventory[d].ItemId].itemOwned="yes",k[a.Inventory[d].ItemId].itemCustData in a.Inventory[d].CustomData?g[k[a.Inventory[d].ItemId].carItemId]=k[a.Inventory[d].ItemId].itemCustData:log.debug("user doesn't own: "+a.Inventory[d].ItemId+" "+k[a.Inventory[d].ItemId].itemCustData));if("-1"==e)return generateFailObj("User does not own car with id: "+b.carId);for(var f in k)k.hasOwnProperty(f)&&
"no"==k[f].itemOwned&&c.push(f);if(g=={})return generateFailObj("User doesn't own any of those customizations");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e,Data:g});a=[{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:g}];if(0<c.length)for(c=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:c}),e={0:"Owned"},d=0;d<c.ItemGrantResults.length;d++)server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:c.ItemGrantResults[d].ItemInstanceId,Data:e});return{Result:"OK",Message:"InventoryUpdate",InventoryChange:{Inventory:a}}};
handlers.purchaseItems=function(b,l){log.debug("RETRIEVING USER INVENTORY");var a=server.GetUserInventory({PlayFabId:currentPlayerId}),c=a.VirtualCurrency.SC,e=a.VirtualCurrency.HC;log.debug("user currency: SC: "+c+" HC: "+e);switch(b.purchaseType){case "carUpgrade":log.debug("== carUpgrade request: carId: "+b.carId);log.debug("RETRIEVING CARDS CATALOGUE");for(var g=server.GetCatalogItems({CatalogVersion:"CarCards"}),k=!1,d,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarsProgress"==
a.Inventory[f].CatalogVersion){k=!0;log.debug("car is in user's inventory!");d=a.Inventory[f];break}for(var h,f=0;f<g.Catalog.length;f++)if(g.Catalog[f].ItemId==b.carId){h=JSON.parse(g.Catalog[f].CustomData);log.debug("cardInfo found!");break}if(void 0==h)return log.error("cardInfo undefined!"),h={Result:"Error",Message:"CardNotFoundForCarwithID: "+b.carId+". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."};if(1==k){log.debug("user has car: "+b.carId+
"... upgrading");var m=parseInt(d.CustomData.CarLvl)+1,n=parseInt(h.baseCurrCost)+parseInt(d.CustomData.CarLvl)*parseInt(h.currCostPerLvl),e=checkBalance(h.currType,n,c,e);if("OK"!=e)return e;log.debug("user has enough currency. Let's check for card balance");e=parseInt(h.baseCardCost)+parseInt(d.CustomData.CarLvl)*parseInt(h.cardCostPerLvl);d.CustomData.CarLvl=m;log.debug("cardCost: "+e);for(var k=!1,u,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarCards"==a.Inventory[f].CatalogVersion){log.debug("consuming: "+
a.Inventory[f].ItemInstanceId);k=!0;try{if(void 0==a.Inventory[f].CustomData)return generateFailObj("Insufficient cards, CusotmData undefined");if(void 0==a.Inventory[f].CustomData.Amount)return generateFailObj("Insufficient cards, CusotmData.Amount udnefined");if(Number(a.Inventory[f].CustomData.Amount)>=e)a.Inventory[f].CustomData.Amount-=e,u={Amount:a.Inventory[f].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,
Data:u});else return generateFailObj("Insufficient cards for real: "+a.Inventory[f].CustomData.Amount+" vs "+e)}catch(v){return log.debug("itemConsumptionResult.errorCode "+v),generateFailObj("Insufficient cards")}break}if(0==k)return generateFailObj("No cards found");log.debug("user has enough cards to purchase upgrade!");a=recalculateCarPr(d.CustomData,d.ItemId,g,void 0);log.debug("upgrading to car lvl: "+m+" and pr: "+a);f={CarLvl:m,Pr:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:d.ItemInstanceId,Data:f});var p;0<n&&(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:n}));log.debug("Upgrade Complete!");a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:u},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:f}];h={};f={Inventory:a};void 0!=p&&(h[p.VirtualCurrency]=p.Balance,f.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdate",InventoryChange:f}}else{log.debug("user doesn't have car: "+b.carId+
"... looking for card");for(var k=!1,r,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarCards"==a.Inventory[f].CatalogVersion){log.debug("consuming: "+a.Inventory[f].ItemInstanceId);k=!0;try{if(void 0==a.Inventory[f].CustomData)return generateFailObj("Insufficient cards, CustomData null");if(void 0==a.Inventory[f].CustomData.Amount)return generateFailObj("Insufficient cards, CustomData.Amount null");if(Number(a.Inventory[f].CustomData.Amount)>=Number(h.baseCardCost))r=a.Inventory[f].ItemInstanceId,
a.Inventory[f].CustomData.Amount-=h.baseCardCost,u={Amount:a.Inventory[f].CustomData.Amount};else return generateFailObj("Insufficient cards: "+a.Inventory[f].CustomData.Amount+" vs "+h.baseCardCost+".")}catch(v){return generateFailObj("Insufficient cards: "+v)}break}if(0==k)return generateFailObj("No cards found");log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");e=checkBalance(h.currType,h.baseCurrCost,c,e);if("OK"!=e)return e;f=[];f.push(b.carId);e=server.GrantItemsToUser({CatalogVersion:"CarsProgress",
PlayFabId:currentPlayerId,ItemIds:f});if(0==e.ItemGrantResults[0].Result)return log.error("Something went wrong while giving user the item, refunding cards"),generateFailObj("Something went wrong while giving user the item, refunding cards.");server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:r,Data:u});0<h.baseCurrCost&&(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:h.currType,Amount:h.baseCurrCost}));f={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",
GearboxLvl:"0",SuspensionLvl:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,Data:f});f={TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0"};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,Data:f});f={PlatesId:"0",WindshieldId:"0",Pr:h.basePr};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:e.ItemGrantResults[0].ItemInstanceId,
Data:f});for(var c=e=!1,q,f=0;f<a.Inventory.length;f++)if("PaintJobs"==a.Inventory[f].ItemId){c=!0;log.debug("user has paintjobs");void 0!=a.Inventory[f].CustomData?(log.debug("user has paintjobs customData"),h.defaultPaintID in a.Inventory[f].CustomData?(log.debug("user has paintjob already"),e=!0):(log.debug("user doesn't have paintjob"),q={},q[h.defaultPaintID]="Owned")):(q={},q[h.defaultPaintID]="Owned");void 0!=q&&server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,
Data:q});break}0==c&&(paintToGive=[],paintToGive.push("PaintJobs"),a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:paintToGive}),q={},q[h.defaultPaintID]="Owned",server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.ItemGrantResults[0].ItemInstanceId,Data:q}));f={CarLvl:"1",EngineLvl:"0",ExhaustLvl:"0",GearboxLvl:"0",SuspensionLvl:"0",TiresLvl:"0",TurboLvl:"0",PaintId:h.defaultPaintID,DecalId:"0",RimsId:"0",PlatesId:"0",WindshieldId:"0",
Pr:h.basePr};a=[{ItemId:b.carId,CatalogVersion:"CarCards",CustomData:u},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:f}];0==e&&(f={},f[h.defaultPaintID]="Owned",a.push({ItemId:"PaintJobs",CatalogVersion:"Customization",CustomData:f}));h={};f={Inventory:a};void 0!=p&&(h[p.VirtualCurrency]=p.Balance,f.VirtualCurrency=h);h={Result:"OK",Message:"InventoryUpdateNewCar",InventoryChange:f}}return h;case "partUpgrade":log.debug("Upgrading Part: "+b.partId+" on Car: "+b.carId);log.debug("Checking to see if car exists in catalog");
u=server.GetCatalogItems({CatalogVersion:"CarsProgress"});q=!1;for(f=0;f<u.Catalog.length;f++)if(u.Catalog[f].ItemId==b.carId){q=!0;break}if(0==q)return log.error("invalid car ID"),h={Result:"Error",Message:"car with ID: "+b.carId+" not found in catalog."};log.debug("Checking to see if part exists in catalog");u=server.GetCatalogItems({CatalogVersion:"PartCards"});q=!1;for(f=0;f<u.Catalog.length;f++)if(u.Catalog[f].ItemId==b.partId){h=JSON.parse(u.Catalog[f].CustomData);q=!0;break}if(0==q)return log.error("invalid part ID"),
h={Result:"Error",Message:"part with ID: "+b.partId+" not found in catalog."};log.debug("Checking to see if user has car: "+b.carId);k=!1;for(f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.carId&&"CarsProgress"==a.Inventory[f].CatalogVersion){k=!0;log.debug("car is in user's inventory!");d=a.Inventory[f];break}if(0==k)return generateFailObj("car with ID: "+b.carId+" not found in user inventory.");log.debug("Checking to see if user has part and or has enough parts");q=!1;for(f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==
b.partId&&"PartCards"==a.Inventory[f].CatalogVersion){q=!0;log.debug("part is in user's inventory!");g={};k={Exhaust:"ExhaustLvl",Engine:"EngineLvl",Gearbox:"GearboxLvl",Suspension:"SuspensionLvl",Tires:"TiresLvl",Turbo:"TurboLvl"};log.debug("calculating "+b.partId+" cost and modifying "+k[b.partId]);r=parseInt(h.baseCardCost,10)+parseInt(d.CustomData[k[b.partId]],10)*parseInt(h.cardCostPerLvl,10);var t=parseInt(d.CustomData[k[b.partId]])+1,n=Number(h.baseCurrCost)+parseInt(d.CustomData[k[b.partId]])*
Number(h.currCostPerLvl);g[k[b.partId]]=t;d.CustomData[k[b.partId]]=t;log.debug("we need: "+r+" cards and "+n+" money => base: "+parseInt(h.baseCurrCost)+" lvls: "+parseInt(d.CustomData[k[b.partId]])+" perLvlCost: "+parseInt(h.currCostPerLvl)+" equalling: "+parseInt(d.CustomData[k[b.partId]],10)*parseInt(h.currCostPerLvl,10));e=checkBalance(h.currType,n,c,e);if("OK"!=e)return e;log.debug("consuming part instance: "+a.Inventory[f].ItemInstanceId);try{if(void 0!=a.Inventory[f].CustomData&&void 0!=a.Inventory[f].CustomData.Amount&&
a.Inventory[f].CustomData.Amount>=r)a.Inventory[f].CustomData.Amount-=r,m={Amount:a.Inventory[f].CustomData.Amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[f].ItemInstanceId,Data:m});else return generateFailObj("Insufficient cards")}catch(v){return log.debug("itemConsumptionResult.errorCode "+v),generateFailObj("Insufficient cards")}break}if(0==q)return generateFailObj("Part not found");0<n&&(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,
VirtualCurrency:h.currType,Amount:n}));a=recalculateCarPr(d.CustomData,d.ItemId,void 0,u);g.Pr=a;server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:d.ItemInstanceId,Data:g});a=[{ItemId:b.partId,CatalogVersion:"PartCards",CustomData:m},{ItemId:b.carId,CatalogVersion:"CarsProgress",CustomData:g}];log.debug("succesfully upgraded part!");h={};f={Inventory:a};void 0!=p&&(h[p.VirtualCurrency]=p.Balance,f.VirtualCurrency=h);return h={Result:"OK",Message:"InventoryUpdatePart",
InventoryChange:f};case "custPurchase":log.debug("Purchasing Customization: "+b.custId+" with val: "+b.custVal);log.debug("Checking to see if customization exists in catalog");d=server.GetCatalogItems({CatalogVersion:"Customization"});h=0;p="SC";for(f=0;f<d.Catalog.length;f++)if(d.Catalog[f].ItemId==b.custId){t=d.Catalog[f];h=JSON.parse(d.Catalog[f].CustomData);f=b.custVal+",Cost";p=h[b.custVal+",Curr"];h=h[f];e=checkBalance(p,h,c,e);if("OK"!=e)return e;log.debug("custCurr: "+p);log.debug("custPrice: "+
h);break}if(void 0==t)return log.error("Customization does not exist in catalog"),h={Result:"Error",Message:"Customization does not exist in catalog."};log.debug("Checking to see if user has said customization");for(var w,f=0;f<a.Inventory.length;f++)if(a.Inventory[f].ItemId==b.custId){log.debug("user has customization category!");w=a.Inventory[f];k=a.Inventory[f].ItemInstanceId;if(void 0!=w.CustomData&&String(b.custVal)in w.CustomData)return generateFailObj("User already has this customization.");
break}if(void 0==w){log.info("user doesn't have customization category. Granting ... ");f=[];f.push(b.custId);a=server.GrantItemsToUser({CatalogVersion:"Customization",PlayFabId:currentPlayerId,ItemIds:f});if(0==a.ItemGrantResults[0].Result)return log.error("something went wrong while granting user customization class object"),h={Result:"Error",Message:"something went wrong while granting user customization class object."};k=a.ItemGrantResults[0].ItemInstanceId}a={};a[String(b.custVal)]="Owned";server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:k,Data:a});a=[{ItemId:b.custId,CatalogVersion:"Customization",CustomData:a}];0<h?(p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:p,Amount:h}),h={},h[p.VirtualCurrency]=p.Balance,f={Inventory:a,VirtualCurrency:h}):f={Inventory:a};return h={Result:"OK",Message:"InventoryUpdateNewCustomization",InventoryChange:f};case "softCurrencyPurchase":log.debug("Purchasing pack: "+b.packId);log.debug("Checking to see if pack exists in catalog");p=server.GetCatalogItems({CatalogVersion:"SoftCurrencyStore"});
a=!1;for(f=c=0;f<p.Catalog.length;f++)if(p.Catalog[f].ItemId==b.packId){c=p.Catalog[f].VirtualCurrencyPrices.HC;h=JSON.parse(p.Catalog[f].CustomData);a=!0;break}if(0==a)return h={Result:"Error",Message:"pack with ID: "+b.packId+" not found in catalog."};if(0>=c)return h={Result:"Error",Message:"pack with ID: "+b.packId+" shouldn't have negative cost."};if(c>e)return generateFailObj("Not enough HC.");p=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"HC",Amount:c});a=
server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:"SC",Amount:h.quantity});h={};h[a.VirtualCurrency]=a.Balance;h[p.VirtualCurrency]=p.Balance;return h={Result:"OK",Message:"SoftCurrencyPurchased",InventoryChange:{VirtualCurrency:h}};default:log.debug("invalid purchase parameter")}};
handlers.giveMoney=function(b){b=server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.amount});var l={};l[b.VirtualCurrency]=b.Balance;return{Result:"OK",Message:"CurrencyChanged",InventoryChange:{VirtualCurrency:l}}};
handlers.grantItems=function(b){for(var l=server.GetUserInventory({PlayFabId:currentPlayerId}),a,c=!1,e=0;e<l.Inventory.length;e++)if(l.Inventory[e].ItemId==b.itemId&&l.Inventory[e].CatalogVersion==b.catalogId){log.debug("adding amount to: "+l.Inventory[e].ItemInstanceId);a=void 0==l.Inventory[e].CustomData?b.amount:void 0==l.Inventory[e].CustomData.Amount?b.amount:isNaN(Number(l.Inventory[e].CustomData.Amount))?b.amount:Number(l.Inventory[e].CustomData.Amount)+b.amount;a={Amount:a};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,
ItemInstanceId:l.Inventory[e].ItemInstanceId,Data:a});c=!0;break}0==c&&(l=[],l.push(b.itemId),l=server.GrantItemsToUser({CatalogVersion:b.catalogId,PlayFabId:currentPlayerId,ItemIds:l}),a={Amount:b.amount},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:l.ItemGrantResults[0].ItemInstanceId,Data:a}));return{Result:"OK",Message:"InventoryUpdated",InventoryChange:{Inventory:[{ItemId:b.itemId,CatalogVersion:b.catalogId,CustomData:a}]}}};
handlers.openChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if(0<b.currCost){if("OK"!=checkBalance(b.currType,b.currCost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.currType,Amount:b.currCost})}for(var c in b.currencyReq)0<b.currencyReq[c]&&server.AddUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:c,Amount:b.currencyReq[c]});var e;
for(c in b.carCardsRequest)if(log.debug(c+" : "+b.carCardsRequest[c]),b.carCardsRequest.hasOwnProperty(c)){e=!1;log.debug("looking for: "+c);for(var g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==c&&"CarCards"==a.Inventory[g].CatalogVersion){log.debug("adding amount to: "+a.Inventory[g].ItemInstanceId);e=void 0==a.Inventory[g].CustomData?Number(b.carCardsRequest[c]):void 0==a.Inventory[g].CustomData.Amount?Number(b.carCardsRequest[c]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.carCardsRequest[c]):
Number(a.Inventory[g].CustomData.Amount)+Number(b.carCardsRequest[c]);e={Amount:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:e});e=!0;break}0==e&&(g=[c],g=server.GrantItemsToUser({CatalogVersion:"CarCards",PlayFabId:currentPlayerId,ItemIds:g}),e={Amount:b.carCardsRequest[c]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:e}))}for(c in b.partCardsRequest)if(log.debug(c+
" : "+b.partCardsRequest[c]),b.partCardsRequest.hasOwnProperty(c)){e=!1;log.debug("looking for: "+c);for(g=0;g<a.Inventory.length;g++)if(a.Inventory[g].ItemId==c&&"PartCards"==a.Inventory[g].CatalogVersion){log.debug("adding amount to: "+a.Inventory[g].ItemInstanceId);e=void 0==a.Inventory[g].CustomData?Number(b.partCardsRequest[c]):void 0==a.Inventory[g].CustomData.Amount?Number(b.partCardsRequest[c]):isNaN(Number(a.Inventory[g].CustomData.Amount))?Number(b.partCardsRequest[c]):Number(a.Inventory[g].CustomData.Amount)+
Number(b.partCardsRequest[c]);e={Amount:e};server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:a.Inventory[g].ItemInstanceId,Data:e});e=!0;break}0==e&&(g=[c],g=server.GrantItemsToUser({CatalogVersion:"PartCards",PlayFabId:currentPlayerId,ItemIds:g}),e={Amount:b.partCardsRequest[c]},server.UpdateUserInventoryItemCustomData({PlayFabId:currentPlayerId,ItemInstanceId:g.ItemGrantResults[0].ItemInstanceId,Data:e}))}return{Result:"OK",Message:"InventoryUpdated",InventoryChange:server.GetUserInventory({PlayFabId:currentPlayerId})}};
handlers.buyChest=function(b,l){var a=server.GetUserInventory({PlayFabId:currentPlayerId});if("OK"!=checkBalance(b.curr,b.cost,a.VirtualCurrency.SC,a.VirtualCurrency.HC))return generateFailObj("not enough money");if(0<b.cost){var a=server.SubtractUserVirtualCurrency({PlayFabId:currentPlayerId,VirtualCurrency:b.curr,Amount:b.cost}),c={};c[a.VirtualCurrency]=a.Balance;return{Result:"OK",Message:"ChestBought",InventoryChange:{VirtualCurrency:c}}}return{Result:"OK",Message:"ChestBought",InventoryChange:{}}};
handlers.getServerTime=function(b,l){return{time:new Date}};
