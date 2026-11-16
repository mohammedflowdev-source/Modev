// Browser bar colour = the page background of the active site theme (stone-200 light / stone-950 dark).
export const THEME_COLORS = { light: "#e7e5e4", dark: "#0c0a09" } as const;

/**
 * Runs before first paint (inline in <body>): creates the theme-color tag from the theme next-themes
 * saved (default light), so the browser bar matches the page from the very first frame.
 */
export const THEME_COLOR_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");var c=t==="dark"?"${THEME_COLORS.dark}":"${THEME_COLORS.light}";var m=document.querySelectorAll('meta[name="theme-color"]');if(!m.length){var n=document.createElement("meta");n.name="theme-color";document.head.appendChild(n);m=[n];}for(var i=0;i<m.length;i++){m[i].removeAttribute("media");m[i].content=c;}}catch(e){}})();`;
