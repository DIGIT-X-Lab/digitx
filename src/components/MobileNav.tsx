// src/components/MobileNav.tsx
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { label: 'Vision', href: '#vision' },
  { label: 'Focus', href: '#focus' },
  { label: 'Software', href: '#tools' },
  { label: 'Approach', href: '#approach' },
  { label: 'People', href: '#people' },
  { label: 'Publications', href: '#publications' },
  { label: 'Careers', href: '#careers' },
  { label: 'Connect', href: '#connect' },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden p-2 -ml-2 text-[hsl(var(--text-primary))] hover:text-[hsl(var(--accent))] transition-colors"
          aria-label="Open navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-[hsl(var(--bg-primary))] border-[hsl(var(--border))]"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-semibold tracking-tight text-[hsl(var(--text-primary))]">
            DIGITX
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-[0.9375rem] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-secondary))] transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
