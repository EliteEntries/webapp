import React from "react";

const hashSVG = (
  <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" className="fill-current">
    <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
  </svg>
);

interface FooterProps {
  shift?: boolean;
}

const Footer: React.FC<FooterProps> = ({ shift = false }) => {
  const shiftClass = shift ? "lg:ml-64" : "";
  return (
    <footer className={`w-full h-24 px-4 flex flex-col items-center z-50 ${shiftClass}`}>
      <div className="w-full mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-6">
        {/* Left: Logo & tagline */}
        <div className="flex items-start gap-2">
          <div className="text-muted-foreground">{hashSVG}</div>
          <div className="flex flex-col gap-2 justify-end">
            <div className="text-base text-muted-foreground font-medium">Elite Entries.</div>
            <div className="text-sm text-muted-foreground">Where our entries are elite.</div>
          </div>
        </div>

        {/* Center: Social */}
        <div className="flex flex-col items-center gap-2">
          <div className="uppercase text-xs font-semibold text-muted-foreground">Social</div>
          <div className="flex gap-2">
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.543.929-.855 2.01-.855 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-foreground">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 00-2.112-2.112C19.633 3.5 12 3.5 12 3.5s-7.633 0-9.386.574a2.994 2.994 0 00-2.112 2.112C0 7.939 0 12 0 12s0 4.061.502 5.814a2.994 2.994 0 002.112 2.112C4.367 20.5 12 20.5 12 20.5s7.633 0 9.386-.574a2.994 2.994 0 002.112-2.112C24 16.061 24 12 24 12s0-4.061-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H12.82v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.104C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg>
            </a>
          </div>
        </div>

        {/* Right: Newsletter */}
        <div className="flex flex-col items-end">
          <div className="uppercase text-xs font-semibold text-muted-foreground mb-2">Newsletter</div>
          <form className="flex gap-0">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 rounded-l-lg bg-background border border-border text-muted-foreground focus:outline-none"
              defaultValue="username@site.com"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#7b8cff] text-white font-semibold rounded-r-lg hover:bg-[#6a7ad6] transition"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;