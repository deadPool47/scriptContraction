//github
handlers.setSplitPlayerRecording = function(args, context) {
 var dict = [];
    dict.push({
        Key:   args.keyPos+"_"+args.envIndex+"_"+args.courseIndex, 
        Value: args.recordingPos
    });  
      dict.push({
            Key:   args.keyRot+"_"+args.envIndex+"_"+args.courseIndex, 
        Value: args.recordingRot
    });  
  var playerData = server.UpdateUserReadOnlyData( 
    {
      PlayFabId: currentPlayerId,
        Data:dict
    }
  );  
  var titleDataVal = server.GetTitleInternalData(
    {
      Key: "Rec" + "_" + args.envIndex + "_" + args.courseIndex, //Recording_0_0,
    }
    );  
  var str2 = titleDataVal.Data["Rec_" + args.envIndex + "_" + args.courseIndex] || "";
  var userArray = str2.split(",");
  var str;  
  if(userArray.length < 6)
  {
    log.debug("adding " + currentPlayerId + " to str: " + str);
    str = titleDataVal.Data["Rec_" + args.envIndex + "_" + args.courseIndex];
    
    if(str)
      str += "," + currentPlayerId;
    else
      str = currentPlayerId;
    
  }
  else
  {
    for(var i = 1; i < userArray.length; i++)
    {
      userArray[i - 1] = userArray[i];
    }
    userArray[userArray.length - 1] = currentPlayerId;
    str = userArray[0] + ",";
    for(var i = 1; i < userArray.length - 1; i++)
    {
      str += userArray[i] + ",";
    }
    
    str += userArray[userArray.length-1];
  }
  
  log.debug("users: " + str);
  
  var titleData = server.SetTitleInternalData(
    {
      Key: "Rec" + "_" + args.envIndex + "_" + args.courseIndex, //Recording_0_0
      Value: str
    }
    );
  
  return {dicVal : dict} ;
}

handlers.requestSplitPlayerRecording = function(args, context) {
  var titleData = server.GetTitleInternalData(
    {
      Keys : "Rec_" + args.envIndex + "_" + args.courseIndex //i.e Rec_1_1 
    }
    ); 
  var str = titleData.Data["Rec_" + args.envIndex + "_" + args.courseIndex];
  var getPlayerArray = str.split(",");
  var opponentId = getPlayerArray[0];
  for(var i=0;i<getPlayerArray.length;i++)
  {
    if(getPlayerArray[i]!=currentPlayerId){opponentId = getPlayerArray[i];break;}    
  }
  var recordingData = server.GetUserReadOnlyData(
    {
      PlayFabId: opponentId,
      Keys: [("RecPos_" + args.envIndex + "_" + args.courseIndex) , ("RecRot_" + args.envIndex + "_" + args.courseIndex)] 
    }
    );
  var oI = server.GetPlayerCombinedInfo(
    {
      PlayFabId:opponentId,
      InfoRequestParameters: {"GetUserAccountInfo": true,"GetUserInventory": false,"GetUserVirtualCurrency": false,"GetUserData": false,"GetUserReadOnlyData": false,"GetCharacterInventories": false,"GetCharacterList": false, "GetTitleData": false,"GetPlayerStatistics": false}
    }
    );
  return {
    PosData: recordingData.Data["RecPos_" + args.envIndex + "_" + args.courseIndex].Value,
    RotData: recordingData.Data["RecRot_" + args.envIndex + "_" + args.courseIndex].Value,
    Opp: oI.InfoResultPayload.AccountInfo.TitleInfo.DisplayName
         };
}

// matchmaking code
handlers.updateTrophyCount = function(args, context) {
  var t = 0;
  var ps=server.GetPlayerStatistics(
  {
     PlayFabId: currentPlayerId,
     StatisticNames: ["TrophyCount"]
  });
  if(ps.Statistics.length != 0)
  {
    t = ps.Statistics[0].Value;
  }
  if(args.val == "rStart") t-=30;
  if(t < 0) t=0;
  if(args.val == "rWin") t+=60;
  if(args.val == "rLose") return {val:t};
  var suArray = [];
  var su = {StatisticName : "TrophyCount", Version : "0", Value: t};
  suArray.push(su);  
  var updateRequest = server.UpdatePlayerStatistics(
  {
    PlayFabId: currentPlayerId,
    Statistics: suArray
  }
  );
  if(args.val == "rWin") return {val:t};
}

handlers.initServerData = function(args)
{
//create trophy statistic
var suArray = [];

var su = {StatisticName : "TrophyCount", Version : "0", Value: "0"};
suArray.push(su);
su = {StatisticName : "League", Version : "0", Value: "0"};
suArray.push(su);

var updateRequest = server.UpdatePlayerStatistics(
{
  PlayFabId: currentPlayerId,
  Statistics: suArray
}
);
var itemsToGive = [];
itemsToGive.push("Decals");
itemsToGive.push("PaintJobs");
itemsToGive.push("Plates");
itemsToGive.push("Rims");
itemsToGive.push("WindshieldText");

var grantRequest = server.GrantItemsToUser(
  {
    CatalogVersion : "Customization",
    PlayFabId: currentPlayerId,
    ItemIds : itemsToGive
  }
  );  

var InvData = {0 : "Owned"};

for(var i = 0; i < grantRequest.ItemGrantResults.length; i++)
{
  server.UpdateUserInventoryItemCustomData(
       {
         PlayFabId: currentPlayerId,
         ItemInstanceId: grantRequest.ItemGrantResults[i].ItemInstanceId,
         Data: InvData
       }
       );
}
var carsToGive = [];
carsToGive.push("FordFocus");    
var carRequest = server.GrantItemsToUser(
{
  CatalogVersion : "CarsProgress",
  PlayFabId: currentPlayerId,
  ItemIds : carsToGive
}
); 
var CarData = {"CarLvl" : "1","EngineLvl" : "0","ExhaustLvl" : "0","GearboxLvl" : "0","SuspensionLvl" : "0"};
server.UpdateUserInventoryItemCustomData(
{
  PlayFabId: currentPlayerId,
  ItemInstanceId: carRequest.ItemGrantResults[0].ItemInstanceId,
  Data: CarData
}
);
CarData = {"TiresLvl" : "0","TurboLvl" : "0","PaintId" : "0","DecalId" : "0","RimsId" : "0"};
server.UpdateUserInventoryItemCustomData(
{
  PlayFabId: currentPlayerId,
  ItemInstanceId: carRequest.ItemGrantResults[0].ItemInstanceId,
  Data: CarData
}
);
CarData = {"PlatesId" : "0","WindshieldId" : "0","Pr" : "10"};
server.UpdateUserInventoryItemCustomData(
{
  PlayFabId: currentPlayerId,
  ItemInstanceId: carRequest.ItemGrantResults[0].ItemInstanceId,
  Data: CarData
}
);
var addUserCurrencyResult = server.AddUserVirtualCurrency(
{
  PlayFabId: currentPlayerId,
  VirtualCurrency : "SC",
  Amount: 3000
}
);
var addUserCurrencyResult = server.AddUserVirtualCurrency(
{
  PlayFabId: currentPlayerId,
  VirtualCurrency : "HC",
  Amount: 200
}
); 
}
handlers.requestInventory = function(args)
{
  var userInventoryObject = server.GetUserInventory(
  {
    PlayFabId: currentPlayerId,
  }
  );
  for(var i = 0; i < userInventoryObject.Inventory.length; i++)
  {
    if(userInventoryObject.Inventory[i].CatalogVersion == "CarsProgress")
    {
      log.debug("found " + userInventoryObject.Inventory[i].ItemId);
      userInventoryObject.Inventory[i].CustomData.Pr = recalculateCarPr(userInventoryObject.Inventory[i].CustomData, userInventoryObject.Inventory[i].ItemId); 
      var d = {};
      d["Pr"] = userInventoryObject.Inventory[i].CustomData.Pr;
      server.UpdateUserInventoryItemCustomData(
      {
        PlayFabId: currentPlayerId,
        ItemInstanceId: userInventoryObject.Inventory[i].ItemInstanceId,
        Data: d
      }
      );
    }
  }
  return userInventoryObject;
}

function generateFailObj(mess)
{
  var retObj = {
    Result: "Failed",
    Message: mess
  };
  return retObj;
}

function generateErrObj(mess)
{
  var retObj = {
    Result: "Error",
    Message: mess
  };
  return retObj;
}

function checkBalance(currType, cost, userSCBalance, userHCBalance)
{
  if(currType == "SC")
  {
    if(userSCBalance < cost)
      return generateFailObj("NotEnoughSC");
  }
  else
  {
    if(userHCBalance < cost)
      return generateFailObj("NotEnoughHC");
  }
  return "OK";
}

function recalculateCarPr(CarData, carId) 
{
    var pr = 0;
    var carCardsCatalog = server.GetCatalogItems(
       {
         CatalogVersion : "CarCards"
       }
       );
    for(var i = 0; i < carCardsCatalog.Catalog.length; i++)
    {
      if(carCardsCatalog.Catalog[i].ItemId == carId)
      {
        var carCardInfo = JSON.parse(carCardsCatalog.Catalog[i].CustomData);
        pr += parseInt(carCardInfo.basePr) + (parseInt(carCardInfo.prPerLvl) * (parseInt(CarData.CarLvl) - 1));
        break;
      }
    }
  
    //calcualte pr based on each part level
    var partCardsCatalog = server.GetCatalogItems(
     {
       CatalogVersion : "PartCards"
     }
     );
  
    var tempDict = 
        {
          Exhaust: CarData.ExhaustLvl,
          Engine: CarData.EngineLvl,
          Gearbox: CarData.GearboxLvl,
          Suspension: CarData.SuspensionLvl,
          Tires: CarData.TiresLvl,
          Turbo: CarData.TurboLvl
        };
    var partCardInfo;
    for(var i = 0; i < partCardsCatalog.Catalog.length; i++) //refactored
    {
      partCardInfo = JSON.parse(partCardsCatalog.Catalog[i].CustomData);
      pr += parseInt(partCardInfo.basePr) + (parseInt(partCardInfo.prPerLvl) * tempDict[partCardsCatalog.Catalog[i].ItemId]);
    }  
  return pr;
}

function GenerateBlackMarket(currentPlayerId)
{
  //getting parts        
  var partsCatalog = server.GetCatalogItems(
     {
       CatalogVersion : "PartCards"
     }
     );
  var dataToUpdate = {};
  var d = new Date();
  dataToUpdate["BMTime"] = d.getTime();
  //get first part
  var part0Index = Math.floor(Math.random() * partsCatalog.Catalog.length);
  var cardParsed = JSON.parse(partsCatalog.Catalog[part0Index].CustomData);
  if(cardParsed == undefined) return generateErrObj("Part card " + partsCatalog.Catalog[i].ItemId + " has no custom data.");
  dataToUpdate["BMItem0"] = partsCatalog.Catalog[part0Index].ItemId + "_" + cardParsed.BMCurrType + "_" + cardParsed.BMbasePrice + "_" + 0 + "_" + cardParsed.BMpriceIncrPerBuy;
  //generate second part card
  var part1Index = Math.floor(Math.random() * partsCatalog.Catalog.length);
  if(part1Index == part0Index) part1Index = partsCatalog.Catalog.length - part0Index - 1;
  cardParsed = JSON.parse(partsCatalog.Catalog[part1Index].CustomData);
  if(cardParsed == undefined) return generateErrObj("Part card " + partsCatalog.Catalog[i].ItemId + " has no custom data.");
  dataToUpdate["BMItem1"] = partsCatalog.Catalog[part1Index].ItemId + "_" + cardParsed.BMCurrType + "_" + cardParsed.BMbasePrice + "_" + 0 + "_" + cardParsed.BMpriceIncrPerBuy;
  //getting car cards
  var carsCatalog = server.GetCatalogItems(
   {
     CatalogVersion : "CarCards"
   }
   );
  var carCardParsed;
  var nonRareIndexes = [];
  var rareIndexes = [];
  for(var i = 0; i < carsCatalog.Catalog.length; i++)
  {
    carCardParsed = JSON.parse(carsCatalog.Catalog[i].CustomData)
    if(carCardParsed == undefined) return generateErrObj("Car card " + carsCatalog.Catalog[i].ItemId + " has no custom data.");
    if(carCardParsed.rareCar == "false")
      nonRareIndexes.push(carsCatalog.Catalog[i].ItemId + "_" + carCardParsed.BMCurrType + "_" + carCardParsed.BMbasePrice + "_" + 0 + "_" + carCardParsed.BMpriceIncrPerBuy);
    else
      rareIndexes.push(carsCatalog.Catalog[i].ItemId + "_" + carCardParsed.BMCurrType + "_" + carCardParsed.BMbasePrice + "_" + 0 + "_" + carCardParsed.BMpriceIncrPerBuy);
  }
  if(nonRareIndexes.length <= 0)
  {
    dataToUpdate["BMItem2"] = rareIndexes[Math.floor(Math.random() * rareIndexes.length)];
    dataToUpdate["BMItem3"] = rareIndexes[Math.floor(Math.random() * rareIndexes.length)];
  }
  else
    if(rareIndexes.length <= 0)
    {
      dataToUpdate["BMItem2"] = nonRareIndexes[Math.floor(Math.random() * nonRareIndexes.length)];
      dataToUpdate["BMItem3"] = nonRareIndexes[Math.floor(Math.random() * nonRareIndexes.length)];
    }
    else
    {
        dataToUpdate["BMItem2"] = nonRareIndexes[Math.floor(Math.random() * nonRareIndexes.length)];
      dataToUpdate["BMItem3"] = rareIndexes[Math.floor(Math.random() * rareIndexes.length)];
    }  
  server.UpdateUserInternalData(
    {
      PlayFabId : currentPlayerId,
      Data : dataToUpdate
    }
  );
  var tK = [];
  tK.push("BlackMarketResetMinutes");
  var tData = server.GetTitleData(
    {
      PlayFabId : currentPlayerId,
      Keys : tK
    }
    );
  dataToUpdate["BMTime"] = parseInt(tData.Data.BlackMarketResetMinutes) * 60;
  return dataToUpdate;
}

function GetCurrentBlackMarket(currentPlayerId, getInternalDataResult)
{
  var bmObj = {};
  var d = new Date();
  
  var tK = [];
  tK.push("BlackMarketResetMinutes");
  var tData = server.GetTitleData(
    {
      PlayFabId : currentPlayerId,
      Keys : tK
    }
    );
  
  bmObj["BMTime"] = parseInt(tData.Data.BlackMarketResetMinutes) * 60 - Math.floor((d.getTime() - getInternalDataResult.Data.BMTime.Value) / 1000);  
  for(var i = 0; i < 4; i++)
  {
    bmObj["BMItem" + i] = getInternalDataResult.Data["BMItem" + i].Value; 
  }
  return bmObj;
}

handlers.purchaseBMItem = function(args, context)
{
  log.debug("purchasing item " + args.itemId + " from black market");
  if((args.itemId < 0) || (args.itemId > 3)) return generateFailObj("invalid item index");
  var keysToGet = [];
  keysToGet.push("BMItem" + args.itemId);
  
  var getInternalDataResult = server.GetUserInternalData(
  {
    PlayFabId: currentPlayerId,
    Keys: keysToGet
  }
  );
  log.debug("RETRIEVING USER CURRENCY");
  var userInventoryObject = server.GetUserInventory(
  {
    PlayFabId: currentPlayerId
  }
  );
  
  var userArray = getInternalDataResult.Data["BMItem" + args.itemId].Value.split("_");//name, curr, baseCost, uses, costUse
  log.debug("userArray: " + userArray);
  var playerMoney = userInventoryObject.VirtualCurrency[userArray[1]];
  
  if(userArray.length != 5)
  {
    generateErrObj("User Black Market corrupted. Try again tomorrow");
  }
  
  var catalogName = "";
  if(args.itemId < 2)
    catalogName = "PartCards";
  else
    catalogName = "CarCards";
  
  var price = parseInt(userArray[2]) + parseInt(userArray[3])* parseInt(userArray[4]);
  var checkObj = checkBalance(userArray[1], price, playerMoney, playerMoney);
  if(checkObj != "OK") return checkObj;
  try
  {
    var itemsToGive = [];
    itemsToGive.push(userArray[0]);
    var grantRequest = server.GrantItemsToUser(
      {
        CatalogVersion : catalogName,
        PlayFabId: currentPlayerId,
        ItemIds : itemsToGive
      }
      );
    var subtractUserCurrencyResult = server.SubtractUserVirtualCurrency(
      {
        PlayFabId: currentPlayerId,
        VirtualCurrency : userArray[1],
        Amount: price
      }
      );
    var itemVal = userArray[0] + "_" + userArray[1] + "_" + userArray[2] + "_"  + (parseInt(userArray[3]) + 1) + "_" +  userArray[4];
    log.debug("generatedArray: " + itemVal);
    var dataToUpdate = {};
    dataToUpdate["BMItem" + args.itemId] = itemVal;
    server.UpdateUserInternalData(
      {
        PlayFabId : currentPlayerId,
        Data : dataToUpdate
      }  );
    var uses = "1";
    if(grantRequest.ItemGrantResults[0].RemainingUses != undefined) uses = grantRequest.ItemGrantResults[0].RemainingUses;
    var objectsUpdated = 
        [
        {
          ItemId : userArray[0],
          CatalogVersion: catalogName,
          RemainingUses: uses
        }
        ];
      
      var currencyUpdated = {};
      currencyUpdated[subtractUserCurrencyResult.VirtualCurrency] = subtractUserCurrencyResult.Balance;
      var b=args.itemId+"_"+userArray[2]+"_"+(parseInt(userArray[3]) + 1)+"_"+userArray[4];
      var i= 
          {
            Inventory: objectsUpdated,
          VirtualCurrency: currencyUpdated
          }
      var returnObj = {
        Result: "OK",
      Message: "InventoryUpdate",
        InventoryChange:i,
        BMItemChange: b
      };
      return returnObj;
  }
  catch(err)
  {
    generateErrObj("Something went horribly wrong somewhere: " + err);
  }
  
}

handlers.retrieveBlackMarket = function(args, context)
{
  //let's get last BM Time Call
  var keysToGet = [];
  keysToGet.push("BMTime");
  for(var i = 0; i < 4; i++)
  {
    keysToGet.push("BMItem" + i);
  }
  
  var getInternalDataResult = server.GetUserInternalData(
    {
      PlayFabId: currentPlayerId,
      Keys: keysToGet
    }
    );
  
  if(getInternalDataResult.Data.BMTime == undefined)
  {
    log.debug("No user BM data detected; generating ...");
    return GenerateBlackMarket(currentPlayerId);
  }
  
  var d = new Date();
  log.debug("milliseconds passed: " +  d.getTime());
  log.debug("BMTime: " +  getInternalDataResult.Data.BMTime.Value);
  
  var tK = [];
  tK.push("BlackMarketResetMinutes");
  var tData = server.GetTitleData(
    {
      PlayFabId : currentPlayerId,
      Keys : tK
    }
    );
  
  if(d.getTime() - parseInt(getInternalDataResult.Data.BMTime.Value) > parseInt(tData.Data.BlackMarketResetMinutes) *60*1000) // minutes *60*1000
  {
    log.debug("regenerating market");
    return GenerateBlackMarket(currentPlayerId);
  }
  log.debug("get current market");
  return GetCurrentBlackMarket(currentPlayerId, getInternalDataResult);

}

handlers.updateCarCust = function(args, context)
{
  var userInv = server.GetUserInventory(
  {
    PlayFabId : currentPlayerId,
  }
  );
  var itemsToGive = [];
  var carFound = "-1";
  var DataToUpdate = {};
  var customizations = {
    PaintJobs : { itemOwned : "no", itemCustData: args.paintId, carItemId : "PaintId" },
    Decals : { itemOwned : "no", itemCustData: args.decalId, carItemId : "DecalId" },
    Plates : { itemOwned : "no", itemCustData: args.platesId, carItemId : "PlatesId" },
    Rims : { itemOwned : "no", itemCustData: args.rimsId, carItemId : "RimsId" },
    WindshieldText : { itemOwned : "no", itemCustData: args.wsId, carItemId : "WindshieldId" }
  };

  for(var i = 0; i < userInv.Inventory.length; i++)
  {
    if((userInv.Inventory[i].ItemId == args.carId) && (userInv.Inventory[i].CatalogVersion == "CarsProgress"))
    {
      carFound = userInv.Inventory[i].ItemInstanceId;       
    }
    if(userInv.Inventory[i].ItemId in customizations)
    {
      customizations[userInv.Inventory[i].ItemId].itemOwned = "yes";
      if(customizations[userInv.Inventory[i].ItemId].itemCustData in userInv.Inventory[i].CustomData)
      {
        DataToUpdate[customizations[userInv.Inventory[i].ItemId].carItemId] = customizations[userInv.Inventory[i].ItemId].itemCustData;
      }
      else
      {
        log.debug("user doesn't own: " + userInv.Inventory[i].ItemId + " " + customizations[userInv.Inventory[i].ItemId].itemCustData);
      }
    }
  }
  if(carFound == "-1")
  {
    return generateFailObj("User does not own car with id: " + args.carId);
  }
    //give inventory
  for (var prop in customizations) 
  {
    if (customizations.hasOwnProperty(prop)) 
    {
        if(customizations[prop].itemOwned == "no")
        {
           itemsToGive.push(prop);
        }
    }
  }
  
  if(DataToUpdate == {}) return generateFailObj("User doesn't own any of those customizations");
  server.UpdateUserInventoryItemCustomData(
     {
       PlayFabId: currentPlayerId,
       ItemInstanceId: carFound,
       Data: DataToUpdate
     }
     );
  var objectsUpdated = 
  [
  {
    ItemId : args.carId,
    CatalogVersion: "CarsProgress",
    CustomData : DataToUpdate
  }
  ];  
  if(itemsToGive.length > 0)
  {
    var grantRequest = server.GrantItemsToUser(
    {
      CatalogVersion : "Customization",
      PlayFabId: currentPlayerId,
      ItemIds : itemsToGive
    }
    );  

    var InvData = {
      0 : "Owned"        
    };

   for(var i = 0; i < grantRequest.ItemGrantResults.length; i++)
  {
    server.UpdateUserInventoryItemCustomData(
         {
           PlayFabId: currentPlayerId,
           ItemInstanceId: grantRequest.ItemGrantResults[i].ItemInstanceId,
           Data: InvData
         }
         );
  }
  }
  var invChangeObj = 
      {
          Inventory: objectsUpdated
      }
  var returnObj = {
    Result: "OK",
    Message: "InventoryUpdate",
    InventoryChange:invChangeObj
  };
  return returnObj;
  
}

handlers.purchaseItems = function(args, context)
{
  //retrieve user inventory
  log.debug("RETRIEVING USER INVENTORY");
  var userInventoryObject = server.GetUserInventory(
  {
    PlayFabId: currentPlayerId
  }
  );
  //retrieve player currency
  var playerSC = userInventoryObject.VirtualCurrency.SC;
  var playerHC = userInventoryObject.VirtualCurrency.HC;

  log.debug("user currency: SC: " + playerSC + " HC: " + playerHC);
  
  switch(args.purchaseType) 
  {
      //CarUpgrade
    case "carUpgrade":
      
      log.debug("== carUpgrade request: " + "carId: " + args.carId);
      log.debug("RETRIEVING CARDS CATALOGUE");
        var carCardsCatalog = server.GetCatalogItems(
          {
            CatalogVersion : "CarCards"
          }
          );

      var carFound = false;
      var car;
      for(var i = 0; i < userInventoryObject.Inventory.length; i++)
      {
        if((userInventoryObject.Inventory[i].ItemId == args.carId) && (userInventoryObject.Inventory[i].CatalogVersion == "CarsProgress"))
        {
          carFound = true;
          log.debug("car is in user's inventory!");
          car = userInventoryObject.Inventory[i];
          break;
        }
      } 
        var cardInfo;
        for(var i = 0; i < carCardsCatalog.Catalog.length; i++)
        {
          if(carCardsCatalog.Catalog[i].ItemId == args.carId)
          {
            cardInfo = JSON.parse(carCardsCatalog.Catalog[i].CustomData);
            log.debug("cardInfo found!");
            break;
          }
        }
      
      if(cardInfo == undefined)
      {
        log.error("cardInfo undefined!");
            var returnObj = {
          Result: "Error",
          Message: "CardNotFoundForCarwithID: " + args.carId + ". It is possible that the carCard ID and the Car ID do not coincide. Check Playfab catalog data."
            };
            return returnObj; 
      }
      
      if(carFound == true)
      {
        log.debug("user has car: " +  args.carId + "... upgrading");
        
        //let's check that the user has enough money + cards
        var currCost = parseInt(cardInfo.baseCurrCost) + (parseInt(car.CustomData.CarLvl) * parseInt(cardInfo.currCostPerLvl));
        var costCheckObj = checkBalance(cardInfo.currType, currCost, playerSC, playerHC);
        if(costCheckObj != "OK") return costCheckObj;

        
        log.debug("user has enough currency. Let's check for card balance");
        
        var cardCost = parseInt(cardInfo.baseCardCost) + (parseInt(car.CustomData.CarLvl) * parseInt(cardInfo.cardCostPerLvl));
      log.debug("cardCost: " + cardCost);
        var cardFound = false;                                                  
        for(var i = 0; i < userInventoryObject.Inventory.length; i++)
        {
          if((userInventoryObject.Inventory[i].ItemId == args.carId) && (userInventoryObject.Inventory[i].CatalogVersion == "CarCards"))
          {
            log.debug("consuming: " + userInventoryObject.Inventory[i].ItemInstanceId);
            cardFound = true;
            try
            {
            var itemConsumptionResult = server.ConsumeItem(
              {
                PlayFabId: currentPlayerId,
                ItemInstanceId: userInventoryObject.Inventory[i].ItemInstanceId,
                ConsumeCount:cardCost
              }
        );
            }
            catch(err)
            {
              log.debug("itemConsumptionResult.errorCode " + err);
              return generateFailObj("Insufficient cards");
            }
            break;
          }
        } 
        
        log.debug("user has enough cards to purchase upgrade!");
        
        if(cardFound == false)
        {
            return generateFailObj("No cards found");
        }

        var newLvl = (parseInt(car.CustomData.CarLvl) + 1);
        var newPr = recalculateCarPr(car.CustomData, car.ItemId);
        log.debug("upgrading to car lvl: " +  newLvl + " and pr: " + newPr);
        var CarData = {
          "CarLvl" : newLvl,
          "Pr" : newPr        
        };
        server.UpdateUserInventoryItemCustomData(
          {
            PlayFabId: currentPlayerId,
            ItemInstanceId: car.ItemInstanceId,
            Data: CarData
          }
          );
        var subtractUserCurrencyResult;
        if(currCost > 0){
        subtractUserCurrencyResult = server.SubtractUserVirtualCurrency(
          {
            PlayFabId: currentPlayerId,
            VirtualCurrency : cardInfo.currType,
            Amount: currCost
          }
          );
        }
        log.debug("Upgrade Complete!");        

        var objectsUpdated = 
          [
          {
            ItemId : args.carId,
            CatalogVersion: "CarCards",
            RemainingUses: itemConsumptionResult.RemainingUses
          },
          {
            ItemId : args.carId,
            CatalogVersion: "CarsProgress",
            CustomData : CarData
          }
          ];
        
        var currencyUpdated = {};
        var i = 
            {
                Inventory: objectsUpdated
            }
        if(subtractUserCurrencyResult!=undefined)
        {
          currencyUpdated[subtractUserCurrencyResult.VirtualCurrency] = subtractUserCurrencyResult.Balance;
          i["VirtualCurrency"] = currencyUpdated;
        }
        var r = {
          Result: "OK",
          Message: "InventoryUpdate",
          InventoryChange:i
        };
        return r;
      }
      else
      {
            log.debug("user doesn't have car: " +  args.carId + "... looking for card");
          var cardFound = false; 
          for(var i = 0; i < userInventoryObject.Inventory.length; i++)
          {
            if((userInventoryObject.Inventory[i].ItemId == args.carId) && (userInventoryObject.Inventory[i].CatalogVersion == "CarCards"))
            {
              log.debug("consuming: " + userInventoryObject.Inventory[i].ItemInstanceId);
              cardFound = true;
              try
              {
              var itemConsumptionResult = server.ConsumeItem(
                {
                  PlayFabId: currentPlayerId,
                  ItemInstanceId: userInventoryObject.Inventory[i].ItemInstanceId,
                  ConsumeCount: cardInfo.baseCardCost
                }
          );
              }
              catch(err)
              {
                return generateFailObj("Insufficient cards");
              }
              break;
            }
          }
          
          if(cardFound == false)
            {
              return generateFailObj("No cards found");
            }
        
          log.debug("user has enough cards to purchase car. Checking if enough currency is availabe");
        
          var costCheckObj = checkBalance(cardInfo.currType, cardInfo.baseCurrCost, playerSC, playerHC);
          if(costCheckObj != "OK") return costCheckObj;
          
            var itemsToGive = [];
            itemsToGive.push(args.carId);
            
            var carToGive = server.GrantItemsToUser(
              {
                CatalogVersion : "CarsProgress",
                PlayFabId: currentPlayerId,
                ItemIds : itemsToGive
              }
              );          
       
          if(carToGive.ItemGrantResults[0].Result == false)
            {
              log.error("Something went wrong while giving user the item, refunding cards");
              var cardsToRefund = [];
        
            for(var i = 0 ; i < cardInfo.baseCardCost; i++)
            {
                cardsToRefund.push(args.carId);
            }
        
              var cardRefundResult = server.GrantItemsToUser(
              {
                CatalogVersion : "CarCards",
                PlayFabId: currentPlayerId,
                ItemIds : cardsToRefund
              }
              );
              return generateFailObj("Something went wrong while giving user the item, refunding cards.");              
            }  
          var subtractUserCurrencyResult;
          if(cardInfo.baseCurrCost > 0){
            subtractUserCurrencyResult = server.SubtractUserVirtualCurrency(
            {
              PlayFabId: currentPlayerId,
              VirtualCurrency : cardInfo.currType,
              Amount: cardInfo.baseCurrCost
            }
            );
            }
        
          var CarData = {
              "CarLvl" : "1",
              "EngineLvl" : "0",
              "ExhaustLvl" : "0",
              "GearboxLvl" : "0",
              "SuspensionLvl" : "0"           
            };
        
          server.UpdateUserInventoryItemCustomData(
              {
                PlayFabId: currentPlayerId,
                ItemInstanceId: carToGive.ItemGrantResults[0].ItemInstanceId,
                Data: CarData
              }
              );
              CarData = {
                    "TiresLvl" : "0",
                    "TurboLvl" : "0",
                    "PaintId" : cardInfo.defaultPaintID,
                    "DecalId" : "0",
                    "RimsId" : "0"           
                  };
              server.UpdateUserInventoryItemCustomData(
              {
                PlayFabId: currentPlayerId,
                ItemInstanceId: carToGive.ItemGrantResults[0].ItemInstanceId,
                Data: CarData
              }
              );
              CarData = {
                    "PlatesId" : "0",
                    "WindshieldId" : "0",
                    "Pr" : cardInfo.basePr              
                  };
              server.UpdateUserInventoryItemCustomData(
              {
                PlayFabId: currentPlayerId,
                ItemInstanceId: carToGive.ItemGrantResults[0].ItemInstanceId,
                Data: CarData
              }
              );
            //if user doesn't have this paint job we give it to him/her
            var hasPaintJob = false;
              var hasPaintJobItem = false;
        var paintData;
              for(var i = 0; i < userInventoryObject.Inventory.length; i++)
            {
               if(userInventoryObject.Inventory[i].ItemId == "PaintJobs")
                 {
                   hasPaintJobItem = true;
                   log.debug("user has paintjobs");
                   if(userInventoryObject.Inventory[i].CustomData != undefined)
                   {
                      log.debug("user has paintjobs customData");
                      if (cardInfo.defaultPaintID in userInventoryObject.Inventory[i].CustomData)
                      {
                        log.debug("user has paintjob already");
                        hasPaintJob = true;
                      }
                      else
                      {
                        log.debug("user doesn't have paintjob");
                        paintData = {}
                        paintData[cardInfo.defaultPaintID] = "Owned";
                      }
                   }
                   else // userInventoryObject.Inventory[i].CustomData == undefined
                   {
                        paintData = {}
                        paintData[cardInfo.defaultPaintID] = "Owned";
                   }
                   if(paintData != undefined){
                   server.UpdateUserInventoryItemCustomData(
          {
            PlayFabId: currentPlayerId,
            ItemInstanceId: userInventoryObject.Inventory[i].ItemInstanceId,
            Data: paintData
          }
          );}
                   break;
                 }//end if "PaintJobs"
              }//end for
            
            if(hasPaintJobItem == false)
              {
                paintToGive = [];
                paintToGive.push("PaintJobs");
                var custToGive = server.GrantItemsToUser(
                {
                  CatalogVersion : "Customization",
                  PlayFabId: currentPlayerId,
                  ItemIds : paintToGive
                }
                );
                
                var paintData = {};
                paintData[cardInfo.defaultPaintID] = "Owned";
                server.UpdateUserInventoryItemCustomData(
                {
                  PlayFabId: currentPlayerId,
                  ItemInstanceId: custToGive.ItemGrantResults[0].ItemInstanceId,
                  Data: paintData
                }
                );
                
              }
        
               //create function result object for new car
                      CarData = {
                                  "CarLvl" : "1",
                          "EngineLvl" : "0",
                          "ExhaustLvl" : "0",
                          "GearboxLvl" : "0",
                          "SuspensionLvl" : "0"    ,
                            "TiresLvl" : "0",
                            "TurboLvl" : "0",
                            "PaintId" : cardInfo.defaultPaintID,
                            "DecalId" : "0",
                            "RimsId" : "0"   ,
                                  "PlatesId" : "0",
                            "WindshieldId" : "0",
                            "Pr" : cardInfo.basePr     
                      };
             var objectsUpdated = 
               [
               {
                 ItemId : args.carId,
                 CatalogVersion: "CarCards",
                 RemainingUses: itemConsumptionResult.RemainingUses
               },
               {
                 ItemId : args.carId,
                 CatalogVersion: "CarsProgress",
                 CustomData : CarData
               }
               ];
             
               if(hasPaintJob == false)
               {
                 var paintDataUpdateObj = {};
                 paintDataUpdateObj[cardInfo.defaultPaintID] = "Owned";
                 var pObj =
                       {
                    ItemId : "PaintJobs",
                    CatalogVersion: "Customization",
                    CustomData : paintDataUpdateObj
                    }
                 objectsUpdated.push(pObj);
               }
        
             var currencyUpdated = {};             

             var i = 
                 {
                     Inventory: objectsUpdated
                 }
               if(subtractUserCurrencyResult != undefined)
               {
                 currencyUpdated[subtractUserCurrencyResult.VirtualCurrency] = subtractUserCurrencyResult.Balance;
                 i["VirtualCurrency"]=currencyUpdated;
               }
        
             var r = {
               Result: "OK",
               Message: "InventoryUpdateNewCar",
               InventoryChange:i
             };
             return r;
        }  
      
        break;
    //PartUpgrade
    case "partUpgrade":
        log.debug("Upgrading Part: " + args.partId + " on Car: " + args.carId);
        
        log.debug("Checking to see if car exists in catalog");
        var carCatalog = server.GetCatalogItems(
          {
            CatalogVersion : "CarsProgress"
          }
          );

          var carExists = false;
          for(var i = 0; i < carCatalog.Catalog.length; i++)
          {
            if(carCatalog.Catalog[i].ItemId == args.carId)
            {
              carExists = true;
              break;
            }
          }
        
        if(carExists == false)
        {
          log.error("invalid car ID");
              var r = {
            Result: "Error",
            Message: "car with ID: " + args.carId + " not found in catalog."
              };
              return r; 
        }

        log.debug("Checking to see if part exists in catalog");
        var partsCatalog = server.GetCatalogItems(
          {
            CatalogVersion : "PartCards"
          }
          );
        
          var partExists = false;
          var cardInfo;
          for(var i = 0; i < partsCatalog.Catalog.length; i++)
          {
            if(partsCatalog.Catalog[i].ItemId == args.partId)
            {
              cardInfo = JSON.parse(partsCatalog.Catalog[i].CustomData);
              partExists = true;
              break;
            }
          }

        if(partExists == false)
        {
          log.error("invalid part ID");
              var returnObj = {
            Result: "Error",
            Message: "part with ID: " + args.partId + " not found in catalog."
              };
              return returnObj; 
        }
       
        log.debug("Checking to see if user has car: " + args.carId);
        var carFound = false;
        var car;
        for(var i = 0; i < userInventoryObject.Inventory.length; i++)
        {
          if((userInventoryObject.Inventory[i].ItemId == args.carId) && (userInventoryObject.Inventory[i].CatalogVersion == "CarsProgress"))
          {
            carFound = true;
            log.debug("car is in user's inventory!");
            car = userInventoryObject.Inventory[i];
            break;
          }
        } 
        
        if(carFound == false)
        {
              return generateFailObj("car with ID: " + args.carId + " not found in user inventory.");
        }
        log.debug("Checking to see whether user has enough money to upgrade part");
      
        log.debug("Checking to see if user has part and or has enough parts");
        var partFound = false;
        var part;
        for(var i = 0; i < userInventoryObject.Inventory.length; i++)
        {
          if((userInventoryObject.Inventory[i].ItemId == args.partId) && (userInventoryObject.Inventory[i].CatalogVersion == "PartCards"))
          {
            partFound = true;
            log.debug("part is in user's inventory!");
            part = userInventoryObject.Inventory[i]; 
            var CarDataToBeUpdated = {};
            var tempDict = 
          {
            Exhaust: "ExhaustLvl",
            Engine: "EngineLvl",
            Gearbox:"GearboxLvl",
            Suspension: "SuspensionLvl",
            Tires: "TiresLvl",
            Turbo: "TurboLvl"
          };
            //refactored code
            log.debug("calculating " + args.partId + " cost and modifying " + tempDict[args.partId]);
            var partsRequired = parseInt(cardInfo.baseCardCost) + (parseInt(car.CustomData[tempDict[args.partId]]) * parseInt(cardInfo.cardCostPerLvl));
            var currCost = parseInt(cardInfo.baseCurrCost) + (parseInt(car.CustomData[tempDict[args.partId]]) * parseInt(cardInfo.currCostPerLvl));
            var newlvl = parseInt(car.CustomData[tempDict[args.partId]]) + 1;
            CarDataToBeUpdated[tempDict[args.partId]] = newlvl;
            car.CustomData[tempDict[args.partId]] = newlvl;
            log.debug("we need: " + partsRequired + " cards");
            
            var costCheckObj = checkBalance(cardInfo.currType, currCost, playerSC, playerHC);
            if(costCheckObj != "OK") return costCheckObj;
            log.debug("consuming part instance: " + userInventoryObject.Inventory[i].ItemInstanceId);
              try
              {
              var itemConsumptionResult = server.ConsumeItem(
                {
                  PlayFabId: currentPlayerId,
                  ItemInstanceId: userInventoryObject.Inventory[i].ItemInstanceId,
                  ConsumeCount: partsRequired
                }
          );
              }
              catch(err)
              {
                log.debug("itemConsumptionResult.errorCode " + err);
                return generateFailObj("Insufficient cards");
              } 
               break; //for search
               }//if in inventory

          }//for 
          if(partFound == false)
             {
              return generateFailObj("Part not found");
             }
          var subtractUserCurrencyResult;
          if(currCost>0)
          {
                subtractUserCurrencyResult = server.SubtractUserVirtualCurrency(
                {
                  PlayFabId: currentPlayerId,
                  VirtualCurrency : cardInfo.currType,
                  Amount: currCost
                }
                );  
          }
      var newPr = recalculateCarPr(car.CustomData, car.ItemId);
            CarDataToBeUpdated.Pr = newPr;
          server.UpdateUserInventoryItemCustomData(
              {
                PlayFabId: currentPlayerId,
                ItemInstanceId: car.ItemInstanceId,
                Data: CarDataToBeUpdated
              }
              );
             var objectsUpdated = 
               [
               {
                 ItemId : args.partId,
                 CatalogVersion: "PartCards",
                 RemainingUses: itemConsumptionResult.RemainingUses
               },
               {
                 ItemId : args.carId,
                 CatalogVersion: "CarsProgress",
                 CustomData : CarDataToBeUpdated
               }
               ];        
             log.debug("succesfully upgraded part!");
             var currencyUpdated = {};
             var i = 
                 {
                     Inventory: objectsUpdated
                 }
               if(subtractUserCurrencyResult!=undefined)
               {
                 currencyUpdated[subtractUserCurrencyResult.VirtualCurrency] = subtractUserCurrencyResult.Balance;
                 i["VirtualCurrency"]=currencyUpdated;
               }
             var r = {
               Result: "OK",
               Message: "InventoryUpdatePart",
               InventoryChange:i
             };
             return r;
        break; // big switch
    case "custPurchase":
        log.debug("Purchasing Customization: " + args.custId + " with val: " + args.custVal);
        
        log.debug("Checking to see if customization exists in catalog");
        var custCatalog = server.GetCatalogItems(
          {
            CatalogVersion : "Customization"
          }
          );
        
        var custCatalogItem;
        var custPrice = 0;
        var custCurr = "SC";
        for(var i = 0; i < custCatalog.Catalog.length; i++)
        {
          if(custCatalog.Catalog[i].ItemId == args.custId)
          {
            custCatalogItem = custCatalog.Catalog[i];
            cardInfo = JSON.parse(custCatalog.Catalog[i].CustomData)
            var keyRequestCurr = args.custVal + ",Curr";
            var keyRequestCost = args.custVal + ",Cost";
            
            custCurr = cardInfo[keyRequestCurr];
            custPrice = cardInfo[keyRequestCost];
            
            var costCheckObj = checkBalance(custCurr, custPrice, playerSC, playerHC);
            if(costCheckObj != "OK") return costCheckObj;
            
      log.debug("custCurr: " + custCurr);
            log.debug("custPrice: " + custPrice);
            
            break;
          }
        }
      
        if(custCatalogItem == undefined)
        {
          log.error("Customization does not exist in catalog");
           var returnObj = {
                      Result: "Error",
                  Message: "Customization does not exist in catalog."
                  };
          return returnObj;
        }
        
         log.debug("Checking to see if user has said customization");
         var customizationItem;
         var customizationItemInstance;
         for(var i = 0; i < userInventoryObject.Inventory.length; i++)
         {
           if(userInventoryObject.Inventory[i].ItemId == args.custId)
           {
             log.debug("user has customization category!");
             customizationItem = userInventoryObject.Inventory[i];
             customizationItemInstance = userInventoryObject.Inventory[i].ItemInstanceId;
              if (customizationItem.CustomData != undefined)
              {
                if (String(args.custVal) in customizationItem.CustomData)
                {
                return generateFailObj("User already has this customization.");
                }
              }
             break;
           }
         } 
         
         if(customizationItem == undefined)
         {
           log.info("user doesn't have customization category. Granting ... ");
           var itemsToGive = [];
           itemsToGive.push(args.custId);
           
           var custToGive = server.GrantItemsToUser(
             {
               CatalogVersion : "Customization",
               PlayFabId: currentPlayerId,
               ItemIds : itemsToGive
             }
             );
           
           if(custToGive.ItemGrantResults[0].Result == false)
           {
             log.error("something went wrong while granting user customization class object");
             var returnObj =    {
                      Result: "Error",
                  Message: "something went wrong while granting user customization class object."
                    };
             return returnObj;
           }
           customizationItemInstance = custToGive.ItemGrantResults[0].ItemInstanceId;
         }
      
         var customizationData = {};
         customizationData[String(args.custVal)] = "Owned";
      
         server.UpdateUserInventoryItemCustomData(
              {
                PlayFabId: currentPlayerId,
                ItemInstanceId: customizationItemInstance,
                Data: customizationData
              }
              );
          var i; 
          var objectsUpdated = 
               [
               {
                 ItemId : args.custId,
                 CatalogVersion: "Customization",
                 CustomData : customizationData
               }
               ];
      
          if(custPrice > 0)
          {
            var subtractUserCurrencyResult = server.SubtractUserVirtualCurrency(
              {
                PlayFabId: currentPlayerId,
                VirtualCurrency : custCurr,
                Amount: custPrice
              }
              ); 
            var currencyUpdated = {};
            currencyUpdated[subtractUserCurrencyResult.VirtualCurrency] = subtractUserCurrencyResult.Balance;            
            i = 
                 {
                     Inventory: objectsUpdated,
                   VirtualCurrency: currencyUpdated
                 };
          }      
      else
      {
            i = 
                 {
                     Inventory: objectsUpdated
                };
      }
        var r = {
               Result: "OK",
               Message: "InventoryUpdateNewCustomization",
               InventoryChange:i
             };
        return r;
      
      break; // big switch
    case "softCurrencyPurchase":
        log.debug("Purchasing pack: " + args.packId);
        
        log.debug("Checking to see if pack exists in catalog");
        var packCatalog = server.GetCatalogItems(
          {
            CatalogVersion : "SoftCurrencyStore"
          }
          );
      
         var packExists = false;
         var packPrice = 0;
         for(var i = 0; i < packCatalog.Catalog.length; i++)
         {
           if(packCatalog.Catalog[i].ItemId == args.packId)
           {
             packPrice = packCatalog.Catalog[i].VirtualCurrencyPrices.HC;
             cardInfo = JSON.parse(packCatalog.Catalog[i].CustomData);
             packExists = true;
             break;
           }
         }
      
      if(packExists == false)
      {
          var returnObj = {
          Result: "Error",
          Message: "pack with ID: " + args.packId + " not found in catalog."
            };
            return returnObj;
      }
       
      if(packPrice <= 0)
      {
            var returnObj = {
              Result: "Error",
              Message: "pack with ID: " + args.packId + " shouldn't have negative cost."
            };
            return returnObj;
      }
      
      if(packPrice > playerHC)
      {
        return generateFailObj("Not enough HC.");
      }
      
       var subtractUserCurrencyResult = server.SubtractUserVirtualCurrency(
       {
         PlayFabId: currentPlayerId,
         VirtualCurrency : "HC",
         Amount: packPrice
       }
       ); 
       
       var addUserCurrencyResult = server.AddUserVirtualCurrency(
       {
         PlayFabId: currentPlayerId,
         VirtualCurrency : "SC",
         Amount: cardInfo.quantity
       }
       ); 
        var currencyUpdated = {};
        currencyUpdated[addUserCurrencyResult.VirtualCurrency] = addUserCurrencyResult.Balance;   
        currencyUpdated[subtractUserCurrencyResult.VirtualCurrency] = subtractUserCurrencyResult.Balance;  
        var invChangeObj = 
                 {
                   VirtualCurrency: currencyUpdated
                 };
        var returnObj = {
               Result: "OK",
               Message: "SoftCurrencyPurchased",
               InventoryChange:invChangeObj
             };
      return returnObj;
      break;
    default:
        log.debug("invalid purchase parameter");
   }
}
//cheat scripts
handlers.giveMoney = function(args)
{
  //args.curr, args.amount
  var addUserCurrencyResult = server.AddUserVirtualCurrency(
  {
    PlayFabId: currentPlayerId,
    VirtualCurrency : args.curr,
    Amount: args.amount
  }
  );
  
  var currencyUpdated = {};
  currencyUpdated[addUserCurrencyResult.VirtualCurrency] = addUserCurrencyResult.Balance;   
  var invChangeObj = 
           {
             VirtualCurrency: currencyUpdated
           };
  var r = {
         Result: "OK",
         Message: "CurrencyChanged",
         InventoryChange:invChangeObj
       };
  return r;
}

handlers.grantItems = function(args)
{
  //args.itemId, args.catalogId, args.amount
  var itemsToGrant = [];
  for(var i = 0; i < args.amount; i++)
  {
    itemsToGrant.push(args.itemId);
  }
  try
  {
   var grantVar = server.GrantItemsToUser(
   {
     CatalogVersion : args.catalogId,
     PlayFabId: currentPlayerId,
     ItemIds : itemsToGrant
   }
   ); 
   var objectsUpdated = 
   [
   {
     ItemId : args.itemId,
     CatalogVersion: args.catalogId,
     RemainingUses: grantVar.ItemGrantResults[0].RemainingUses
   }
   ] ;
    var invChangeObj = 
        {
            Inventory: objectsUpdated
        }
    var returnObj = {
      Result: "OK",
      Message: "InventoryUpdated",
      InventoryChange:invChangeObj
    };
   return returnObj;
  }
  catch(err)
  {
    generateErrObj("Error: "+err);
  }
}
handlers.buyChest = function(args, context)
{
  var userInventoryObject=server.GetUserInventory(
  {
    PlayFabId:currentPlayerId
  }
  );
  var bO = checkBalance(args.curr, args.cost, userInventoryObject.VirtualCurrency.SC, userInventoryObject.VirtualCurrency.HC);
  if(bO != "OK") return generateFailObj("not enough money");
  
  var subtractUserCurrencyResult = server.SubtractUserVirtualCurrency(
  {
    PlayFabId: currentPlayerId,
    VirtualCurrency : args.curr,
    Amount: args.cost
  }
  ); 
  var cU = {};
  cU[subtractUserCurrencyResult.VirtualCurrency] = subtractUserCurrencyResult.Balance;   
  var i = 
           {
             VirtualCurrency: cU
           };
  var r = {
         Result: "OK",
         Message: "ChestBought",
         InventoryChange:i
       };
  return r;
}