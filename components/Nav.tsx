"use client";

import Image from "next/image";
import { site } from "@/lib/site-data";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#nongkrong", label: "Nongkrong" },
  { href: "#datang", label: "Datang" },
];

function scrollToId(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const el = document.querySelector(href);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el as HTMLElement, { offset: -72 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/** Nav pill minimal — satu bar, tanpa glassmorphism dekoratif. */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <nav
        aria-label="Navigasi utama"
        className="flex w-full max-w-2xl items-center justify-between gap-2 rounded-full bg-ink px-3 py-2 text-cream shadow-lg shadow-ink/30"
      >
        <a
          href="#atas"
          onClick={(e) => scrollToId(e, "#atas")}
          className="flex items-center gap-2"
          aria-label="Warkop Hits — ke atas"
        >
          <Image
            src="/assets/brand/favicon.svg"
            alt=""
            width={28}
            height={28}
            className="h-6 w-6 shrink-0 rounded-md sm:h-7 sm:w-7"
          />
          <span className="whitespace-nowrap font-display text-base font-bold tracking-tight sm:text-lg">
            {site.name}
          </span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => scrollToId(e, l.href)}
              className="whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-medium text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream sm:px-3 sm:text-sm"
            >
              {l.label}
            </a>
          ))}
          <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-orange px-3 py-1.5 text-xs font-bold text-onorange sm:inline-flex">
            <span className="inline-block h-2 w-2 rounded-full bg-onorange" aria-hidden="true" />
            {site.hoursLabel}
          </span>
        </div>
      </nav>
    </header>
  );
}
