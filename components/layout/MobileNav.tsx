"use client";

import Link from "next/link";
import { useRef } from "react";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  mobileLabel?: string;
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details ref={detailsRef} className="mobile-nav group flex items-center">
      <summary
        className="relative z-[60] flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-sm border-2 border-navy/15 bg-white p-2 text-navy shadow-sm transition-colors hover:border-primary hover:text-primary touch-manipulation [&::-webkit-details-marker]:hidden"
        aria-label="Menu"
      >
        <MenuIcon className="block h-7 w-7 group-open:hidden" />
        <CloseIcon className="hidden h-7 w-7 group-open:block" />
      </summary>

      <div
        className="mobile-nav-backdrop fixed inset-0 z-40 bg-black/50"
        aria-hidden="true"
        onClick={closeMenu}
      />

      <nav
        aria-label="Main navigation"
        className="mobile-nav-panel fixed inset-y-0 right-0 z-50 flex w-[min(85vw,18rem)] flex-col bg-white shadow-2xl"
      >
        <div className="border-b border-gray-100 px-5 py-4">
          <p className="font-serif text-sm font-semibold tracking-wide text-gray-900">
            Navigation
          </p>
        </div>

        <ul className="flex flex-1 flex-col overflow-y-auto py-2">
          {items.map((item) => {
            const label = item.mobileLabel ?? item.label;

            return (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b border-gray-50 px-5 py-4 text-sm font-semibold tracking-widest text-gray-800 transition-colors hover:bg-surface hover:text-primary"
                    onClick={closeMenu}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block border-b border-gray-50 px-5 py-4 text-sm font-semibold tracking-widest text-gray-800 transition-colors hover:bg-surface hover:text-primary"
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}