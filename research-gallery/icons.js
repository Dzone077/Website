export const paths={
 arrow:'<path d="M7 17 17 7M7 7h10v10"/>',right:'<path d="M4 12h16m-6-6 6 6-6 6"/>',chevron:'<path d="m9 6 6 6-6 6"/>',down:'<path d="m6 9 6 6 6-6"/>',
 play:'<path d="m9 5 10 7-10 7Z"/>',pause:'<path d="M9 5v14M15 5v14"/>',expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',
 robot:'<rect x="5" y="7" width="14" height="12" rx="4"/><path d="M12 7V3m-3 9h.01M15 12h.01M9 16h6M2 11v4m20-4v4"/>',
 motion:'<path d="M3 17c3-12 6-12 9-4s6 5 9-7M3 6h4M2 10h3"/>',
 human:'<circle cx="12" cy="4" r="2"/><path d="M12 6v8m-7-5 7 2 7-2m-7 5-5 7m5-7 5 7"/>',
 terrain:'<path d="M3 20h6v-6h6V8h6M3 4h18"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 focus:'<rect x="3" y="4" width="18" height="16" rx="3"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 film:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>',
 check:'<path d="m5 12 4 4L19 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',
 file:'<path d="M13 3H5v18h14V9Zm0 0v6h6M8 13h8M8 17h5"/>'
};
export function icon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]||paths.film}</svg>`;}
