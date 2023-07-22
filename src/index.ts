(async () => {
  if (window.MaikoBCScriptLoaded !== true) {
    while (!window.bcModSdk) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    window.MaikoBCScriptLoaded = true;
    console.log("MaikoBCScriptLoaded loaded");

    await import('./entry');
  } else {
    console.log("MaikoBCScriptLoaded already loaded");
  }
})()
