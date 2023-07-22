import modApi from '../hooks/native'
import { iconClose } from "src/resources/icons";

modApi.hookFunction('DialogMenuButtonBuild', 10, (args, next) => {
  next(args);
  DialogMenuButton.push(Bondage.isRestrained() ? "BCS_RemoveAll" : "BCS_RandomBondage");
  return;
})

modApi.hookFunction('DialogFindPlayer', 10, (args, next) => {
  if (args[0] == "BCS_RemoveAll") {
    return "Remove All Restrains";
  }
  if (args[0] == "BCS_RandomBondage") {
    return "Random Bondage";
  }
  return next(args);
})

modApi.hookFunction('DrawGetImage', 10, (args, next) => {
  if (args[0] == "Icons/BCS_RemoveAll.png") {
    return next([iconClose]);
  }
  if (args[0] == "Icons/BCS_RandomBondage.png") {
    return next(["Icons/Kidnap.png"]);
  }
  return next(args);
})

modApi.hookFunction('DialogMenuButtonClick', 10, (args, next) => {
  if (["colorExpression", "colorItem", "extended", "tighten"].includes(DialogMenuMode)) return false;
  if (MouseIn(1885 - (DialogMenuButton.length - 1) * 110, 15, 90, 90)) {
    Bondage.isRestrained() ? Bondage.releaseAll() : Bondage.randomBondage();
    return true;
  }

  return next(args);
})

export namespace Bondage {
  export function isRestrained() {
    return CurrentCharacter.IsRestrained();
  }
  export function randomBondage() {
    CharacterFullRandomRestrain(CurrentCharacter, (['FEW', 'LOT', 'ALL'] as const)[Math.floor(Math.random() * 3)]);
  }
  export function releaseAll() {
    CharacterRelease(CurrentCharacter)
  }
}

window.BCSDialogShowMenu = false;
