// Server-safe: inlined in <head> so the first paint already has the saved theme (no flash).
export const THEME_KEY = "theme";
export const themeScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
