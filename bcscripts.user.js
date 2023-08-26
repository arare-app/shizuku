// ==UserScript==
// @name         bcscripts - Bondage Club Scripts by MaikoTan
// @namespace    BCS
// @version      0.0.3
// @description  Loader of MaikoTan's bcscripts mod
// @author       MaikoTan
// @include      /^https:\/\/(www\.)?bondageprojects\.elementfx\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @include      /^https:\/\/(www\.)?bondage-europe\.com\/R\d+\/(BondageClub|\d+)(\/((index|\d+)\.html)?)?$/
// @homepage     https://github.com/maikolib/bcscripts#readme
// @source       https://github.com/maikolib/bscripts
// @downloadURL  https://maikolib.github.io/bcscripts.user.js
// @run-at       document-end
// @grant        none
// ==/UserScript==

// eslint-disable-next-line no-restricted-globals
setTimeout(
	function () {
		if (typeof window.MaikoBCScriptLoaded === 'undefined') {
			const n = document.createElement("script");
			n.setAttribute("language", "JavaScript");
			n.setAttribute("crossorigin", "anonymous");
			n.setAttribute("src", "https://maikolib.github.io/bcscripts/index.global.js?_=" + Date.now());
			n.onload = () => n.remove();
			document.head.appendChild(n);
		}
	},
	2000
);
