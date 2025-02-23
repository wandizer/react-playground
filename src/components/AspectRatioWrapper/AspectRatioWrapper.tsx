import classNames from "classnames/bind";
import { ReactNode } from "react";
import styles from "./AspectRatioWrapper.module.css";

const cx = classNames.bind(styles);

type Ratio = `${number}/${number}` | `${number}:${number}` | number;

type AspectRatioWrapperProps = {
  children: ReactNode;
  ratio?: Ratio;
  className?: string;
};

/**
 * AspectRatioWrapper component, used to maintain aspect ratio of children. In order
 * to maintain aspect ratio, the parent element must have a width set.
 * @example <AspectRatioWrapper ratio="16/9">...</AspectRatioWrapper>
 */
export function AspectRatioWrapper({
  children,
  ratio = "16/9",
  className,
}: AspectRatioWrapperProps): JSX.Element {
  return (
    <div
      className={cx("AspectRatioWrapper", className)}
      style={
        { "--aspect-ratio": ratio } as React.CSSProperties & {
          [key: string]: string;
        }
      }
    >
      {children}
    </div>
  );
}
