import { Link } from "@tanstack/react-router";
import classNames from "classnames";

export type HeaderProps = {
  children?: React.ReactNode;
};

const navLinks = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
];

export function Header(): JSX.Element {
  return (
    <header className="flex items-center h-16 w-full px-4 bg-black border-b border-b-primary gap-4 fixed z-20">
      <div id="brand" className="flex items-center text-primary gap-2">
        <Link to="/">
          <h1 className="text-xl whitespace-nowrap">
            WanDizer/<b>React-Playground</b>
          </h1>
        </Link>
      </div>
      <nav id="nav" className="basis-full grow-1">
        <ul role="menubar" className="flex flex-row gap-2">
          {navLinks.map(({ name, to }) => (
            <li key={to} role="menuitem">
              <Link
                activeProps={{
                  className: "bg-gray-100 text-black",
                }}
                inactiveProps={{
                  className: "text-white",
                }}
                className={classNames(
                  "font-medium py-1 px-3 rounded",
                  "hover:text-primary", // :hover
                  "focus:outline-gray-300 focus:focus:outline-offset-2",
                )}
                to={to}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
