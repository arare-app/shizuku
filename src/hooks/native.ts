import { ModSDKGlobalAPI } from "bondage-club-mod-sdk"

declare global {
  interface Window {
    bcModSdk: ModSDKGlobalAPI
  }
}
export default window.bcModSdk.registerMod({
  name: "Shizuku",
  version: "0.0.3",
  fullName: "Shizuku Bondage Club Mod",
  repository: 'https://github.com/maikolib/shizuku',
})
