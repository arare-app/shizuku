import modApi from '../hooks/native'

declare global {
  interface Window {
    DialogShibariRandomBondage: () => void
    DialogReleaseNoLock: () => void
    DialogReleaseTotal: () => void
  }
}

window.DialogShibariRandomBondage ??= function () {
  ShibariRandomBondage(Player, Math.floor(Math.random() * 6))
}
window.DialogReleaseNoLock ??= function () {
  CharacterReleaseNoLock(CurrentCharacter)
}
window.DialogReleaseTotal ??= function () {
  CharacterReleaseTotal(CurrentCharacter)
}

function addCustomDialogToPlayer() {
  const customDialog: DialogLine[] = [
    {
      Stage: '0',
      Option: '(Cheat: Quick Bondage Menu)',
      Function: null,
      NextStage: 'ShizukuDialogCheatQuickBondageMenu',
      Group: null,
      Prerequisite: null,
      Result: '(You can restrain or release yourself with a single click.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogCheatQuickBondageMenu',
      Option: '(Remove Restrains Not Locked)',
      Function: 'DialogReleaseNoLock()',
      NextStage: '0',
      Group: null,
      Prerequisite: 'CurrentCharacter.IsRestrained()',
      Result: '(You have been released except for locked items.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogCheatQuickBondageMenu',
      Option: '(Remove All Restrains Except Collars)',
      Function: 'DialogReleaseTotal()',
      NextStage: '0',
      Group: null,
      Prerequisite: 'CurrentCharacter.IsRestrained()',
      Result: '(You have been released except for slave collars.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogCheatQuickBondageMenu',
      Option: '(Remove All Restrains)',
      Function: 'DialogRelease()',
      NextStage: '0',
      Group: null,
      Prerequisite: 'CurrentCharacter.IsRestrained()',
      Result: '(You have been released.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogCheatQuickBondageMenu',
      Option: '(Apply Random Bondage)',
      Function: 'DialogFullRandomRestrain()',
      NextStage: '0',
      Group: null,
      Prerequisite: '!CurrentCharacter.IsRestrained()',
      Result: '(You have been restrained.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogCheatQuickBondageMenu',
      Option: '(Apply Random Shibari)',
      Function: 'DialogShibariRandomBondage()',
      NextStage: '0',
      Group: null,
      Prerequisite: '!CurrentCharacter.IsRestrained()',
      Result: '(You have been restrained with Hemp Rope.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogCheatQuickBondageMenu',
      Option: '(Back to main menu.)',
      Function: null,
      NextStage: '0',
      Group: null,
      Prerequisite: null,
      Result: '(Main menu.)',
      Trait: null,
    },
  ]
  const lastIndex = Player.Dialog.findIndex((dialog) => dialog.Stage === '0' && dialog.Option === '(Leave this menu.)')
  for (let i = 0; i < customDialog.length; i++) {
    if (
      Player.Dialog.some(
        (dialog) =>
          dialog.Stage == customDialog[i].Stage &&
          dialog.Option === customDialog[i].Option &&
          dialog.Function === customDialog[i].Function &&
          dialog.NextStage === customDialog[i].NextStage &&
          dialog.Group === customDialog[i].Group &&
          dialog.Prerequisite === customDialog[i].Prerequisite &&
          dialog.Result === customDialog[i].Result &&
          dialog.Trait === customDialog[i].Trait,
      )
    )
      continue
    Player.Dialog.splice(lastIndex + i, 0, customDialog[i])
  }
}

function init() {
  // Add to player dialog when it's ready
  modApi.hookFunction('DialogDraw', 10, (args, next) => {
    // Early return if the current character is not the player.
    if (!CharacterGetCurrent().IsPlayer()) return next(args)

    addCustomDialogToPlayer()
    return next(args)
  })
}

init()
