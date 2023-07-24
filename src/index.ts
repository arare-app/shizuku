(async () => {
  const version = '0.0.1';
  if (window.MaikoBCScriptLoaded !== true) {
    while (!window.bcModSdk) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    window.MaikoBCScriptLoaded = true;
    console.log("MaikoBCScriptLoaded loaded");

    await import('./entry');

    ServerBeep = {
      Message: `BCS Loaded, Version: ${version}`,
      Timer: CommonTime() + 3000,
    }
  } else {
    console.log("MaikoBCScriptLoaded already loaded");
  }
})()
