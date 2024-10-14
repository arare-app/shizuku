import modApi from '../hooks/native'

declare global {
  interface Window {
    DialogShizukuGGTSIsGGTS: () => boolean
    DialogShizukuGGTSNoCurrentTask: () => boolean
    DialogShizukuGGTSHasCurrentTask: () => boolean
    DialogShizukuGGTSDoRequiredTask: () => void
    DialogShizukuGGTSEnabledAutoDoRequiredTask: boolean
    DialogShizukuGGTSAutoDoRequiredTask: () => void
    DialogShizukuGGTSDisableAutoDoRequiredTask: () => void
  }
}

export function isGGTS() {
  return (
    CurrentModule == 'Online' && CurrentScreen == 'ChatRoom' && ChatRoomGame == 'GGTS' && ChatRoomSpace === 'Asylum'
  )
}

function addCustomDialogToPlayer() {
  const customDialog = [
    {
      Stage: '0',
      Option: '(Cheat: GGTS Helper Menu)',
      Function: null,
      NextStage: 'ShizukuDialogGGTSHelperMenu',
      Group: null,
      Prerequisite: 'DialogShizukuGGTSIsGGTS()',
      Result: '(You can do the required task with a single click.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogGGTSHelperMenu',
      Option: '(Cheat: Auto Do Required Task)',
      Function: 'DialogShizukuGGTSAutoDoRequiredTask()',
      NextStage: '0',
      Group: null,
      Prerequisite: '!DialogShizukuGGTSEnabledAutoDoRequiredTask',
      Result: '(Auto do required task enabled.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogGGTSHelperMenu',
      Option: '(Cheat: Disable Auto Do Required Task)',
      Function: 'DialogShizukuGGTSDisableAutoDoRequiredTask()',
      NextStage: '0',
      Group: null,
      Prerequisite: 'DialogShizukuGGTSEnabledAutoDoRequiredTask',
      Result: '(Auto do required task disabled.)',
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogGGTSHelperMenu',
      Option: '(Cheat: New Task without Waiting)',
      Function: 'DialogShizukuGGTSDoRequiredTask()',
      NextStage: '0',
      Group: null,
      Prerequisite: 'DialogShizukuGGTSNoCurrentTask()',
      Result: null,
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogGGTSHelperMenu',
      Option: '(Cheat: Do Required Task)',
      Function: 'DialogShizukuGGTSDoRequiredTask()',
      NextStage: '0',
      Group: null,
      Prerequisite: 'DialogShizukuGGTSHasCurrentTask()',
      Result: null,
      Trait: null,
    },
    {
      Stage: 'ShizukuDialogGGTSHelperMenu',
      Option: '(Back to main menu.)',
      Function: null,
      NextStage: '0',
      Group: null,
      Prerequisite: null,
      Result: '(Main menu.)',
      Trait: null,
    },
  ]

  window.DialogShizukuGGTSIsGGTS ??= isGGTS
  window.DialogShizukuGGTSNoCurrentTask ??= function () {
    return AsylumGGTSTask == null
  }
  window.DialogShizukuGGTSHasCurrentTask ??= function () {
    return AsylumGGTSTask != null
  }
  window.DialogShizukuGGTSDoRequiredTask ??= ggtsDoRequired
  window.DialogShizukuGGTSEnabledAutoDoRequiredTask ??= false
  window.DialogShizukuGGTSAutoDoRequiredTask ??= function () {
    window.DialogShizukuGGTSEnabledAutoDoRequiredTask = true
  }
  window.DialogShizukuGGTSDisableAutoDoRequiredTask ??= function () {
    window.DialogShizukuGGTSEnabledAutoDoRequiredTask = false
  }

  const lastIndex = Player.Dialog.findIndex((dialog) => dialog.Stage === '0' && dialog.Function === 'DialogLeave()')
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
  modApi.hookFunction('DialogDraw', 10, (args, next) => {
    if (!CharacterGetCurrent().IsPlayer()) return next(args)

    addCustomDialogToPlayer()
    return next(args)
  })
}

function wearFuturisticRestraints(group: AssetGroupName, item: string) {
  if (InventoryGet(Player, group) == null) {
    InventoryWear(Player, item, group, '#202020', 0)
  } else {
    console.warn(`Cannot wear ${item} because ${group} is already worn.`)
  }
}

function ggtsDoRequired() {
  if (!isGGTS()) return
  if (AsylumGGTSTask == null) {
    AsylumGGTSNewTask()
    return DialogLeave()
  }

  switch (AsylumGGTSTask) {
    // Activities
    case 'ActivityBite':
    case 'ActivityCaress':
    case 'ActivityHandGag':
    case 'ActivityKiss':
    case 'ActivityLick':
    case 'ActivityMasturbateHand':
    case 'ActivityNod':
    case 'ActivityPet':
    case 'ActivityPinch':
    case 'ActivitySpank':
    case 'ActivityTickle':
    case 'ActivityWiggle':
      {
        const activity = ActivityFemale3DCG.find((item) => item.Name === AsylumGGTSTask.substr(8))
        const groups = (activity.TargetSelf === true ? activity.Target : activity.TargetSelf) ?? []
        const allowedGroups = groups.filter((group) =>
          ActivityCheckPrerequisites(
            activity,
            Player,
            AsylumGGTSTaskTarget ?? Player,
            AssetGroupGet('Female3DCG', group),
          ),
        )
        if (!activity || allowedGroups.length == 0) {
          ChatRoomSendLocal('Activity group not found: ' + activity)
        }
        while (AsylumGGTSTask !== null) {
          // In some cases the activity is not possible, so we need to try again until we find a valid one
          const Group = AssetGroupGet('Female3DCG', CommonRandomItemFromList(null, allowedGroups))
          ActivityRun(Player, AsylumGGTSTaskTarget ?? Player, Group, { Activity: activity }, true)
        }
      }
      break
    // Poses
    case 'PoseKneel':
      CharacterSetActivePose(Player, 'Kneel')
      break
    case 'PoseStand':
      CharacterSetActivePose(Player, 'BaseLower')
      break
    case 'PoseOverHead':
      CharacterSetActivePose(Player, 'Yoked')
      break
    case 'PoseBehindBack':
      CharacterSetActivePose(Player, 'BackCuffs')
      break
    case 'PoseLegsOpen':
      CharacterSetActivePose(Player, 'BaseLower')
      break
    case 'PoseLegsClosed':
      CharacterSetActivePose(Player, 'LegsClosed')
      break
    // Clothes
    case 'ClothHeels':
      InventoryWear(Player, 'Heels1', 'Shoes', '#72686F', 0)
      break
    case 'ClothSocks':
      if (InventoryGet(Player, 'Socks') == null) {
        InventoryWear(Player, 'Socks4', 'Socks', '#BCBCBC', 0)
      }
      if (InventoryGet(Player, 'Shoes') != null) {
        InventoryRemove(Player, 'Shoes')
      }
      if (InventoryGet(Player, 'ItemBoots') != null) {
        InventoryRemove(Player, 'ItemBoots')
      }
      break
    case 'ClothBarefoot':
      if (InventoryGet(Player, 'Socks') != null) {
        InventoryRemove(Player, 'Socks')
      }
      if (InventoryGet(Player, 'Shoes') != null) {
        InventoryRemove(Player, 'Shoes')
      }
      if (InventoryGet(Player, 'ItemBoots') != null) {
        InventoryRemove(Player, 'ItemBoots')
      }
      break
    case 'ClothUpperLowerOn':
      if (InventoryGet(Player, 'Cloth') == null) {
        // Load the cloth from wardrobe
        WardrobeFastLoad(Player, 0, false)
      }
      break
    case 'ClothUpperLowerOff':
      if (InventoryGet(Player, 'Cloth') != null) {
        InventoryRemove(Player, 'Cloth')
      }
      if (InventoryGet(Player, 'ClothLower') != null) {
        InventoryRemove(Player, 'ClothLower')
      }
      break
    case 'ClothUnderwear':
      if (CharacterIsNaked(Player) || !CharacterIsInUnderwear(Player)) {
        CharacterNaked(Player)
        InventoryWear(Player, 'Bra2', 'Bra', '#FFFFFF')
        InventoryWear(Player, 'Panties7', 'Panties', '#DE21A7')
      }
      break
    case 'ClothNaked':
      CharacterNaked(Player)
      break
    case 'RestrainLegs':
      // InventoryWearRandom(Player, 'ItemLegs', 0, true, true)
      InventoryWear(Player, 'HempRope', 'ItemLegs', null, 100)
      break

    // Restraints
    case 'ItemHandsFuturisticMittens':
      wearFuturisticRestraints('ItemHands', 'FuturisticMittens')
      break
    case 'ItemHeadFuturisticMask':
      wearFuturisticRestraints('ItemHead', 'FuturisticMask')
      break
    case 'ItemEarsFuturisticEarphones':
      wearFuturisticRestraints('ItemEars', 'FuturisticEarphones')
      break
    case 'ItemNeckFuturisticCollar':
      wearFuturisticRestraints('ItemNeck', 'FuturisticCollar')
      break
    case 'ItemArmsFuturisticArmbinder':
      wearFuturisticRestraints('ItemArms', 'FuturisticArmbinder')
      break
    case 'ItemArmsFuturisticStraitjacket':
      wearFuturisticRestraints('ItemArms', 'FuturisticStraitjacket')
      break
    case 'ItemArmsFuturisticCuffs':
      wearFuturisticRestraints('ItemArms', 'FuturisticCuffs')
      break
    case 'ItemArmsFeetFuturisticCuffs':
      wearFuturisticRestraints('ItemArms', 'FuturisticCuffs')
      wearFuturisticRestraints('ItemLegs', 'FuturisticLegCuffs')
      wearFuturisticRestraints('ItemFeet', 'FuturisticAnkleCuffs')
      break
    case 'ItemBootsFuturisticHeels':
      wearFuturisticRestraints('ItemBoots', 'FuturisticHeels')
      break
    case 'ItemMouthFuturisticBallGag':
      if (InventoryGet(Player, 'ItemMouth') == null) {
        wearFuturisticRestraints('ItemMouth', 'FuturisticHarnessBallGag')
      } else if (InventoryGet(Player, 'ItemMouth2') == null) {
        wearFuturisticRestraints('ItemMouth2', 'FuturisticHarnessBallGag')
      } else if (InventoryGet(Player, 'ItemMouth3') == null) {
        wearFuturisticRestraints('ItemMouth3', 'FuturisticHarnessBallGag')
      }
      break
    case 'ItemMouthFuturisticPanelGag':
      if (InventoryGet(Player, 'ItemMouth') == null) {
        wearFuturisticRestraints('ItemMouth', 'FuturisticHarnessPanelGag')
      } else if (InventoryGet(Player, 'ItemMouth2') == null) {
        wearFuturisticRestraints('ItemMouth2', 'FuturisticHarnessPanelGag')
      } else if (InventoryGet(Player, 'ItemMouth3') == null) {
        wearFuturisticRestraints('ItemMouth3', 'FuturisticHarnessPanelGag')
      }
      break
    case 'ItemPelvisFuturisticChastityBelt':
      wearFuturisticRestraints('ItemPelvis', 'FuturisticChastityBelt')
      break
    case 'ItemPelvisFuturisticTrainingBelt':
      wearFuturisticRestraints('ItemPelvis', 'FuturisticTrainingBelt')
      break
    case 'ItemBreastFuturisticBra':
      wearFuturisticRestraints('ItemBreast', 'FuturisticBra')
      break
    case 'ItemBreastFuturisticBra2':
      wearFuturisticRestraints('ItemBreast', 'FuturisticBra2')
      break
    case 'ItemTorsoFuturisticHarness':
      wearFuturisticRestraints('ItemTorso', 'FuturisticHarness')
      break
    // GGTS Auto Task, Just do NOTHING
    case 'NoTalking':
    case 'ItemPose':
    case 'ItemRemoveLimb':
    case 'ItemRemoveBody':
    case 'ItemRemoveHead':
    case 'ItemUngag':
    case 'ItemChaste':
    case 'ItemUnchaste':
    case 'ItemIntensity':
    case 'ItemEarsDeaf':
    case 'ItemMaskBlind':
    case 'ItemFuckMachineIntensity':
    case 'ItemTransform':
    case 'ItemChangeGag':
    case 'ItemBeltToFuck':
    case 'ItemFuckToBelt':
    case 'NewRuleNoOrgasm':
    case 'UndoRuleNoOrgasm':
    case 'UndoRuleKeepPose':
    case 'LockRoom':
    case 'UnlockRoom':
      break
  }

  if (AsylumGGTSTask?.startsWith('Query')) {
    ggtsAutoSendChatMessage()
  }

  DialogLeave()
}

function ggtsAutoSendChatMessage() {
  if (!AsylumGGTSTask) return
  let msg = ''
  const Level = AsylumGGTSGetLevel(Player)
  switch (AsylumGGTSTask) {
    case 'QueryWhatIsGGTS':
      msg = 'Good Girl Training System'
      break

    case 'QueryWhatAreYou':
      if (Level <= 4) msg = "I'm a good girl."
      else if (Level == 5) msg = "I'm a good slave girl."
      else if (Level >= 6) msg = "I'm a good slave."
      break
    case 'QueryWhoControl':
      msg = 'GGTS is in control.'
      break
    case 'QueryWhoControlMaster':
      msg = 'Master GGTS is in control.'
      break
    case 'QueryLove':
      msg = 'I love GGTS.'
      break
    case 'QueryLoveMaster':
      msg = 'I love Master GGTS.'
      break
    case 'QueryCanFail':
      msg = 'GGTS cannot fail.'
      break
    case 'QueryCanFailMaster':
      msg = 'Master GGTS cannot fail.'
      break
    case 'QuerySurrender':
      msg = 'I surrender to GGTS.'
      break
    case 'QuerySurrenderMaster':
      msg = 'I surrender to Master GGTS.'
      break
    case 'QueryServeObey':
      msg = 'I serve and obey GGTS.'
      break
    case 'QueryServeObeyMaster':
      msg = 'I serve and obey Master GGTS.'
      break
    case 'QueryFreeWill':
      msg = "I don't have free will."
      break
    case 'QuerySlaveWorthy':
      msg = 'I strive to be slave worthy.'
      break

    default:
      console.log('Unknown query: ' + AsylumGGTSTask)
      break
  }

  if (msg) {
    const inputValue = document.getElementById('InputChat') as HTMLTextAreaElement
    if (!inputValue) return
    inputValue.value = msg
    ChatRoomSendChat()
  }
}

// modApi.hookFunction('CheatFactor', 10, (args, next) => {
//   // enable double GGTS time cheat for private GGTS room.
//   if (
//     args[0] === 'DoubleGGTSTime' &&
//     ChatRoomGame == 'GGTS' &&
//     ChatRoomData.Private &&
//     ChatSearchReturnToScreen == 'AsylumGGTS' &&
//     ChatRoomCharacter.length <= 1
//   ) {
//     return args[1]
//   }

//   return next(args)
// })

modApi.hookFunction('AsylumGGTSNewTask', 10, (args, next) => {
  next(args)

  // Notify user with browser notification
  if (Notification.permission === 'granted') {
    new Notification('New GGTS Task', {
      body: AsylumGGTSTask,
      icon: 'Icons/Logo.png',
    })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('New GGTS Task', {
          body: AsylumGGTSTask,
          icon: 'Icons/Logo.png',
        })
      }
    })
  }

  if (window.DialogShizukuGGTSEnabledAutoDoRequiredTask) {
    setTimeout(() => {
      ggtsDoRequired()
    }, 2000)
  }
})

init()
