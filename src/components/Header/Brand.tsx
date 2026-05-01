import { Link } from "@tanstack/react-router";

export function Brand() {
  return (
    <Link to="/" aria-label="logo" className="flex items-center space-x-2">
      <div aria-hidden="true" className="flex ml-2">
        {/* Chevron left shape */}
        <div className="h-5 w-2 bg-primary rounded rotate-45 "></div>
        <div className="h-5 w-2 bg-primary rounded -rotate-45 -translate-x-2 translate-y-2 "></div>
        {/* Slash */}
        <div className="h-[25px] w-2 rotate-[25deg] mx-2 mt-0.5 bg-white rounded"></div>
        {/* Chevron right shape */}
        <div className="h-5 w-2 bg-primary rounded -rotate-45"></div>
        <div className="h-5 w-2 bg-primary rounded rotate-45 -translate-x-2 translate-y-2"></div>
      </div>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        React-Playground
      </span>
    </Link>
  );
}
