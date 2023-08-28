;(async () => {
  if (window.MaikoScriptShizukuLoaded !== true) {
    while (!window.bcModSdk) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    window.MaikoScriptShizukuLoaded = true
    console.log('Shizuku loaded')

    await import('./entry')

    while (ServerBeep?.Timer > CommonTime()) {
      // This means the BCX extension is just loaded, we should wait for the message disapear.
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    ServerBeep = {
      Message: `Shizuku Loaded, Version: ${await import('./hooks/native').then((m) => m.version)}`,
      Timer: CommonTime() + 3000,
    }
  } else {
    console.log('Shizuku already loaded')
  }
})()
