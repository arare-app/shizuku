import { ModSDKGlobalAPI } from "bondage-club-mod-sdk"

declare global {
  interface Window {
    bcModSdk: ModSDKGlobalAPI
  }
}
export default window.bcModSdk.registerMod({
  name: "MaikoBCScript",
  version: "0.0.1",
  fullName: "Bondage Club Scripts",
  repository: 'https://github.com/maikolib/bcscripts',
})
