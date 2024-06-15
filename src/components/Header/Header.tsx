export type HeaderProps = {
  children?: React.ReactNode;
};

export function Header(): JSX.Element {
  return (
    <header className="flex items-center h-16 px-4 bg-white border-b gap-4">
      <div id="brand" className="flex items-center text-primary gap-2">
        <h1 className="text-xl whitespace-nowrap">
          WanDizer/<b>React-Playground</b>
        </h1>
      </div>
      <nav id="nav" className="basis-full grow-1">
        <ul role="menubar" className="flex flex-row gap-2">
          <li role="menuitem">
            <a
              className="focus:outline-gray-300 focus:focus:outline-offset-2 hover:bg-gray-100 hover:text-primary font-medium py-1 px-3 rounded"
              href="/"
            >
              Home
            </a>
          </li>
          <li role="menuitem">
            <a
              className="focus:outline-gray-300 focus:focus:outline-offset-2 hover:bg-gray-100 hover:text-primary font-medium py-1 px-3 rounded"
              href="/"
            >
              Products
            </a>
          </li>
          <li role="menuitem">
            <a
              className="focus:outline-gray-300 focus:focus:outline-offset-2 hover:bg-gray-100 hover:text-primary font-medium py-1 px-3 rounded"
              href="/"
            >
              Services
            </a>
          </li>
          <li role="menuitem">
            <a
              className="focus:outline-gray-300 focus:focus:outline-offset-2 hover:bg-gray-100 hover:text-primary font-medium py-1 px-3 rounded"
              href="/"
            >
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
