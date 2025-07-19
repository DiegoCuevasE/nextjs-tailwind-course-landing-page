import React from "react";
import Link from 'next/link';
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  Squares2X2Icon,
  XMarkIcon,
  Bars3Icon,
  MusicalNoteIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";

const NAV_MENU = [
  {
    name: "Inicio",
    icon: RectangleStackIcon,
    href: "/",
  },
  {
    name: "Spotify",
    icon: MusicalNoteIcon,
    href: "/api/spotify",
  },
  {
    name: "Anime",
    icon: PlayCircleIcon,
    href: "/anime",
  },
  {
    name: "Docs",
    icon: CommandLineIcon,
    href: "https://www.material-tailwind.com/docs/react/installation",
  },
];

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  const isInternal = href && href.startsWith('/');

  if (isInternal) {
    return (
      <li>
        <Link
          href={href}
          className="flex items-center gap-2 font-medium text-gray-400"
        >
          {children}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-medium text-gray-400"
      >
        {children}
      </a>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  return (
    <div className="px-10 sticky top-4 z-50">
      <div className="mx-auto container">
        <MTNavbar
          blurred
          className="z-50 mt-6 relative border-0 pr-3 py-3 pl-6 bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <Typography className="text-lg font-bold text-orange-900">
              El RincóN del DikorN
            </Typography>
            <ul className="ml-10 hidden items-center gap-8 lg:flex">
              {NAV_MENU.map(({ name, icon: Icon, href }) => (
                <NavItem key={name} href={href}>
                  <Icon className="h-5 w-5" />
                  {name}
                </NavItem>
              ))}
            </ul>
            <div className="hidden items-center gap-4 lg:flex bg-orange-900">
              <Button variant="text" className="text-gray-800">Log in</Button>
            </div>
            <IconButton
              variant="text"
              color="gray"
              onClick={handleOpen}
              className="ml-auto inline-block lg:hidden"
            >
              {open ? (
                <XMarkIcon strokeWidth={2} className="h-6 w-6" />
              ) : (
                <Bars3Icon strokeWidth={2} className="h-6 w-6" />
              )}
            </IconButton>
          </div>
          <Collapse open={open}>
            <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
              <ul className="flex flex-col gap-4">
                {NAV_MENU.map(({ name, icon: Icon, href }) => (
                  <NavItem key={name} href={href}>
                    <Icon className="h-5 w-5" />
                    {name}
                  </NavItem>
                ))}
              </ul>
              <div className="mt-6 mb-4 flex items-center gap-4">
                <Button variant="text">Log in</Button>
                <a
                  href="https://www.material-tailwind.com/blocks"
                  target="_blank"
                >
                  <Button color="gray">blocks</Button>
                </a>
              </div>
            </div>
          </Collapse>
        </MTNavbar>
      </div>
    </div>
  );
}

export default Navbar;
