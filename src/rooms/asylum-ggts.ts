import modApi from '../hooks/native'

modApi.hookFunction('ChatRoomMenuBuild', 10, (args, next) => {
  next(args);
  if (ChatRoomGame != "GGTS") return;

  ChatRoomMenuButtons.push("BCS_DoRequired");
  return;
})

modApi.hookFunction('TextGet', 10, (args, next) => {
  if (ChatRoomGame == "GGTS" && args[0] == "MenuBCS_DoRequired") return "Do Required Task";
  return next(args);
})

modApi.hookFunction('DrawGetImage', 10, (args, next) => {
  if (ChatRoomGame == "GGTS" && args[0] == "Icons/Rectangle/BCS_DoRequired.png") {
    return next(["Icons/Poses/OverTheHead.png"]);
  }
  return next(args);
})

modApi.hookFunction('ChatRoomMenuClick', 10, (args, next) => {
  if (ChatRoomGame != "GGTS") return next(args);

  if (!MouseXIn(1005 + (870 / (ChatRoomMenuButtons.length - 1)) * (ChatRoomMenuButtons.length - 1), 120)) {
    return next(args);
  }

  switch (AsylumGGTSLastTask) {
    // Poses
    case "PoseOverHead":
      CharacterSetActivePose(Player, "Yoked");
      return;
    case "PoseBehindBack":
      CharacterSetActivePose(Player, "BackCuffs");
      return;
    case "PoseLegsOpen":
      CharacterSetActivePose(Player, "BaseLower");
      return;
    case "PoseLegsClosed":
      CharacterSetActivePose(Player, "LegsClosed");
      return;
    // Clothes
    case "ClothHeels":
      InventoryWear(Player, "Heels1", "Shoes", "#72686F", 0);
      return;
    case "ClothSocks":
      if (InventoryGet(Player, "Socks") == null) {
        InventoryWear(Player, "Socks4", "Socks", "#BCBCBC", 0);
      }
      if (InventoryGet(Player, "Shoes") != null) {
        InventoryRemove(Player, "Shoes");
      }
      if (InventoryGet(Player, "ItemBoots") != null) {
        InventoryRemove(Player, "ItemBoots");
      }
      return;
    case "ClothBarefoot":
      if (InventoryGet(Player, "Socks") != null) {
        InventoryRemove(Player, "Socks");
      }
      if (InventoryGet(Player, "Shoes") != null) {
        InventoryRemove(Player, "Shoes");
      }
      if (InventoryGet(Player, "ItemBoots") != null) {
        InventoryRemove(Player, "ItemBoots");
      }
      return;
    case "ClothUpperLowerOn":
      if (InventoryGet(Player, "Cloth") == null) {
        // Load the cloth from wardrobe
        WardrobeFastLoad(Player, 0, false)
      }
      return;
    case "ClothUpperLowerOff":
      if (InventoryGet(Player, "Cloth") != null) {
        InventoryRemove(Player, "Cloth");
      }
      if (InventoryGet(Player, "ClothLower") != null) {
        InventoryRemove(Player, "ClothLower");
      }
      return;
    case "ClothUnderwear":
      if (CharacterIsNaked(Player) || !CharacterIsInUnderwear(Player)) {
        CharacterNaked(Player);
        InventoryWear(Player, "Bra2", "Bra", "#FFFFFF");
        InventoryWear(Player, "Panties7", "Panties", "#DE21A7")
      }
      return;
    case "ClothNaked":
      CharacterNaked(Player);
      return;
    case "RestrainLegs":
      InventoryWearRandom(Player, "ItemLegs", 0, true, true);
      return;
  }
  return next(args);
})

modApi.hookFunction("ChatRoomSendChat", 10, (args, next) => {
  if (ChatRoomGame != "GGTS") return next(args);

  let msg = ElementValue("InputChat").trim();
  if (msg != "") {
    if (AsylumGGTSLastTask == "NoTalking") {
      msg = "*" + msg;
    } else {
      return next(args);
    }
  }

  const Level = AsylumGGTSGetLevel(Player);
  switch(AsylumGGTSLastTask) {
    case "QueryWhatIsGGTS":
      msg = "Good Girl Training System"
      break;

    case "QueryWhatAreYou":
      if (Level <= 4)
        msg = "I'm a good girl.";
      else if (Level == 5)
        msg = "I'm a good slave girl.";
      else if (Level >= 6)
        msg = "I'm a good slave.";
      break;
    case "QueryWhoControl":
      msg = "GGTS is in control.";
      break;
    case "QueryWhoControlMaster":
      msg = "Master GGTS is in control.";
      break;
    case "QueryLove":
      msg = "I love GGTS.";
      break;
    case "QueryLoveMaster":
      msg = "I love Master GGTS.";
      break;
    case "QueryCanFail":
      msg = "GGTS cannot fail.";
      break;
    case "QueryCanFailMaster":
      msg = "Master GGTS cannot fail.";
      break;
    case "QuerySurrender":
      msg = "I surrender to GGTS.";
      break;
    case "QuerySurrenderMaster":
      msg = "I surrender to Master GGTS.";
      break;
    case "QueryServeObey":
      msg = "I serve and obey GGTS.";
      break;
    case "QueryServeObeyMaster":
      msg = "I serve and obey Master GGTS.";
      break;
    case "QueryFreeWill":
      msg = "I don't have free will.";
      break;
    case "QuerySlaveWorthy":
      msg = "I strive to be slave worthy.";
      break;

    default:
      return next(args);
  }

  if (msg != "") {
    ChatRoomLastMessage.push(msg);
		ChatRoomLastMessageIndex = ChatRoomLastMessage.length;

    CommandParse(msg);

    return;
  }

  return next(args);
})

modApi.hookFunction("CheatFactor", 10, (args, next) => {
  // enable double GGTS time cheat for private GGTS room.
  if (
    args[0] === "DoubleGGTSTime" &&
    ChatRoomGame == "GGTS" &&
    ChatRoomData.Private &&
    ChatSearchReturnToScreen == "AsylumGGTS" &&
    ChatRoomCharacter.length <= 1
  ) {
    return args[1];
  }

  return next(args);
})
