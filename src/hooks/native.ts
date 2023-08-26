import { ModSDKGlobalAPI } from "bondage-club-mod-sdk"

declare global {
  interface Window {
    bcModSdk: ModSDKGlobalAPI
  }
}

export const version = "0.0.7"

export default window.bcModSdk.registerMod({
  name: "Shizuku",
  version,
  fullName: "Shizuku Bondage Club Mod",
  repository: 'https://github.com/maikolib/shizuku',
})
