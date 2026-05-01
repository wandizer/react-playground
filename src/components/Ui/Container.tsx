import classNames from "classnames";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className={classNames("max-w-7xl mx-auto px-4", className)}>
      {children}
    </div>
  );
}
