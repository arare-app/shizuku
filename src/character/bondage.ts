import modApi from '../hooks/native'

declare global {
  interface Window {
    DialogShibariRandomBondage: () => void;
  }
}

modApi.hookFunction('CharacterBuildDialog', 10, (args: [Character], next) => {
  next(args);

  // Only allow when player is free
  if (!args[0].IsPlayer() || !Player.CanInteract()) return;

  const customDialog = [
    {
      Stage: "0",
      Option: "(Cheat: Quick Bondage Menu)",
      Function: null,
      NextStage: "BCSDialogCheatQuickBondageMenu",
      Group: null,
      Prerequisite: null,
      Result: "(You can restrain or release yourself with a single click.)",
      Trait: null,
    },
    {
      Stage: "BCSDialogCheatQuickBondageMenu",
      Option: "(Remove All Restrains)",
      Function: "DialogRelease(CurrentCharacter)",
      NextStage: "0",
      Group: null,
      Prerequisite: "CurrentCharacter.IsRestrained()",
      Result: "(You have been released.)",
      Trait: null,
    },
    {
      Stage: "BCSDialogCheatQuickBondageMenu",
      Option: "(Apply Random Bondage)",
      Function: "DialogFullRandomRestrain(CurrentCharacter)",
      NextStage: "0",
      Group: null,
      Prerequisite: "!CurrentCharacter.IsRestrained()",
      Result: "(You have been restrained.)",
      Trait: null,
    },
    {
      Stage: "BCSDialogCheatQuickBondageMenu",
      Option: "(Apply Random Shibari)",
      Function: "DialogShibariRandomBondage(CurrentCharacter)",
      NextStage: "0",
      Group: null,
      Prerequisite: "!CurrentCharacter.IsRestrained()",
      Result: "(You have been restrained with Hemp Rope.)",
      Trait: null,
    },
    {
      Stage: "BCSDialogCheatQuickBondageMenu",
      Option: "(Back to main menu.)",
      Function: null,
      NextStage: "0",
      Group: null,
      Prerequisite: null,
      Result: "(Main menu.)",
      Trait: null,
    },
  ];

  if (!window.DialogShibariRandomBondage) {
    window.DialogShibariRandomBondage = function () {
      ShibariRandomBondage(Player, Math.floor(Math.random() * 6));
    }
  }
  const lastIndex = args[0].Dialog.findIndex((dialog) => dialog.Stage === '0' && dialog.Option === '(Leave this menu.)');
  for (let i = 0; i < customDialog.length; i++) {
    if (Player.Dialog.includes(customDialog[i])) continue;
    args[0].Dialog.splice(lastIndex + i, 0, customDialog[i]);
  }
});
