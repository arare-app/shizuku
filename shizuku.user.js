// ==UserScript==
// @name         shizuku - Bondage Club Scripts by MaikoTan
// @namespace    Shizuku
// @version      0.0.4
// @description  Loader of MaikoTan's Shizuku mod
// @author       MaikoTan
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @homepage     https://github.com/maikolib/shizuku#readme
// @source       https://github.com/maikolib/shizuku
// @downloadURL  https://maikolib.github.io/shizuku.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

// eslint-disable-next-line no-restricted-globals
setTimeout(
	function () {
		if (typeof window.MaikoScriptShizukuLoaded === 'undefined') {
			var n = document.createElement("script");
			n.setAttribute("language", "JavaScript");
			n.setAttribute("crossorigin", "anonymous");
			n.setAttribute("src", "https://maikolib.github.io/shizuku/index.global.js?_=" + Date.now());
			n.onload = () => n.remove();
			document.head.appendChild(n);
		}
	},
	2000
);
