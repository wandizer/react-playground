import classNames from "classnames";
import { useId } from "react";

const defaultRenderOverlay = () => (
  <div className="absolute inset-x-0 inset-y-0 group">
    {/* Backdrop */}
    <div className="w-full h-full group-hover:backdrop-blur group-hover:bg-black/50" />
    {/* Content */}
    <div className="hidden group-hover:flex absolute inset-0 items-center justify-center">
      <h1 className="text-white text-2xl font-bold drop-shadow-2xl">
        Read more...
      </h1>
    </div>
  </div>
);

export type SectionCardProps = {
  title?: string;
  description?: string;
  img?: {
    src: string;
    alt: string;
  };
  tags?: string[];
  className?: string;
  renderOverlay?: boolean | (() => JSX.Element);
  onClick?: React.DOMAttributes<HTMLDivElement>["onClick"];
};

export function SectionCard({
  img,
  title,
  description,
  tags = [],
  className,
  renderOverlay = false,
  onClick,
}: SectionCardProps): JSX.Element {
  const id = useId();
  return (
    <div
      className={classNames(
        "max-w-sm h-[27.5rem] w-[24rem] rounded overflow-hidden shadow-lg relative flex flex-col",
        // "hover:shadow-xl transition duration-300 ease-in-out",
        className
      )}
      {...(onClick && { onClick, role: "button", tabIndex: 0 })}
    >
      {/* Overlay */}
      {renderOverlay && typeof renderOverlay === "function" && renderOverlay()}
      {renderOverlay &&
        typeof renderOverlay === "boolean" &&
        defaultRenderOverlay()}
      {/* Cover */}
      <div className="aspect-video flex-shrink-0">
        {img ? (
          <img
            className="w-full h-full object-cover"
            src={img.src}
            alt={img.alt}
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>
      {/* Title & Description */}
      <div className="flex-grow px-6 py-2 min-h-0">
        {title ? (
          <div className="font-bold text-xl mb-2">{title}</div>
        ) : (
          <div className="bg-gray-300 w-1/2 h-7 mb-2 rounded-sm" />
        )}
        {description ? (
          <p className="text-gray-700 text-base line-clamp-5">{description}</p>
        ) : (
          <>
            <div className="bg-gray-200 w-5/5 h-4 mb-2 rounded-sm" />
            <div className="bg-gray-200 w-3/5 h-4 mb-2 rounded-sm" />
            <div className="bg-gray-200 w-4/5 h-4 mb-2 rounded-sm" />
            <div className="bg-gray-200 w-2/5 h-4 mb-2 rounded-sm" />
          </>
        )}
      </div>
      {/* Tags */}
      <div className="px-6 pb-2 flex-grow-0 align-bottom">
        {tags.length
          ? tags.map((tag) => (
              <span
                key={`tag-${id}-${tag}`}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))
          : ["tag 1", "long tag 2", "tag 3"].map((tag) => (
              <span
                key={`tag-${id}-${tag}`}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
      </div>
    </div>
  );
}
