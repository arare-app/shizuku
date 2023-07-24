(async () => {
  const version = '0.0.2';
  if (window.MaikoBCScriptLoaded !== true) {
    while (!window.bcModSdk) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    window.MaikoBCScriptLoaded = true;
    console.log("MaikoBCScriptLoaded loaded");

    await import('./entry');

    while (ServerBeep) {
      // This means the BCX extension is just loaded, we should wait for the message disapear.
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    ServerBeep = {
      Message: `BCS Loaded, Version: ${version}`,
      Timer: CommonTime() + 3000,
    }
  } else {
    console.log("MaikoBCScriptLoaded already loaded");
  }
})()
