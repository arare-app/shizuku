var MaikoBCScriptLoaded = true

function MaikoTrainWithPonyTraining() {
	const timer = setInterval(() => {
		StableGenericProgressStart(30, 0, 0, "Screens/Room/Stable/toyhorse.png", "HorseStable", StableTrainer, null, 0, "StableTrainerToyHorseFin", 0, "StableTrainerToyHorseCancel", 2,  TextGet("Toyhorse"));
		SkillProgress("Dressage", 15);

		console.log("Current Skill Level: %d, Progress: %d", Player.Skill[3].Level, Player.Skill[3].Progress)
	}, 30 * 1000)

	return () => clearInterval(timer)
}

function MaikoTrainWithSelfBondage() {
  const timer = setInterval(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const Groups = ['ItemArms', 'ItemLegs', 'ItemFeet']

    var C = CharacterGetCurrent()
    // Tie the current player
    // ShibariRandomBondage(C, 2)
    for (const Group of Groups) {
      InventoryWear(C, 'HempRope', Group, 'Default', 2)
      await wait(1000)
    }

    await wait(1000)

    for (const G of Groups) {
      const Group = AssetGroup.find((g) => G === g.Name)
      if (!Group?.IsItem()) continue
      if (Group.Zone && Groups.includes(Group.Name)) {
        DialogChangeFocusToGroup(C, Group)
        const Item = C.FocusGroup ? InventoryGet(C, C.FocusGroup.Name) : null
        await wait(1000)
        StruggleMinigameStart(C, 'Flexibility', Item, null, DialogStruggleStop)
        const timer = setInterval(() => {
          if (StruggleProgress < 100) StruggleProgress += 10
          else clearInterval(timer)
        }, 100)
        if (Group.Name == 'ItemArms') {
        }
        await wait(1000)
      }
    }

    DialogChangeFocusToGroup(C, null)

    console.log('Current Skill Level: %d, Progress: %d', Player.Skill[2].Level, Player.Skill[2].Progress)
  }, 20000)

  return () => clearInterval(timer)
}
