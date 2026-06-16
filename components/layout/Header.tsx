import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { getNavItems, getSiteConfig } from "@/lib/content";
import { Button } from "@/components/ui/Button";

const navItems = getNavItems();
const site = getSiteConfig();

function NavLinks({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName?: string;
}) {
  const linkClasses =
    linkClassName ??
    "nav-link block px-4 py-3 text-center text-xs font-semibold tracking-widest text-gray-700 hover:text-primary lg:py-4";

  return (
    <ul className={className}>
      {navItems.map((item) => (
        <li key={item.label}>
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              {item.label}
            </a>
          ) : (
            <Link href={item.href} className={linkClasses}>
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-3 py-3 lg:gap-4 lg:py-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.webp"
              alt={`${site.name} Logo`}
              width={180}
              height={143}
              className="h-auto w-28 sm:w-32 md:w-44"
              priority
            />
          </Link>

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <Button
              href={site.giveUrl}
              external
              size="md"
              className="inline-flex h-10 items-center justify-center px-3 py-0 text-center text-xs"
            >
              GIVE NOW
            </Button>

            <MobileNav items={navItems} />
          </div>

          <div className="hidden flex-1 flex-col items-end gap-2 lg:flex">
            <p className="max-w-md text-right text-sm italic text-gray-600 md:text-base">
              {site.headerQuote}
            </p>
            <Button
              href={site.giveUrl}
              external
              size="md"
              className="inline-flex h-10 items-center justify-center py-0"
            >
              GIVE NOW
            </Button>
          </div>
        </div>

        <nav
          className="hidden border-t border-gray-200 lg:block"
          aria-label="Main navigation"
        >
          <NavLinks className="flex flex-row items-center justify-center gap-0" />
        </nav>
      </div>
    </header>
  );
}