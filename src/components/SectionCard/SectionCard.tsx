import classNames from "classnames";
import { useId } from "react";

const defaultRenderOverlay = () => (
  <div className="absolute inset-x-0 inset-y-0">
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
  /** Title to be shown */
  title?: string;
  /** Description to be shown */
  description?: string;
  /** Cover image */
  img?: {
    src: string;
    alt: string;
  };
  /** List of Tags to be shown */
  tags?: string[];
  /** Additional class name */
  className?: string;
  /** Render overlay */
  renderOverlay?: boolean | (() => JSX.Element);
  /** OnClick function */
  onClick?: React.DOMAttributes<HTMLDivElement>["onClick"];
  /** Id */
  id?: string;
};

/**
 * SectionCard component is a card component that displays a title, description, image, and tags.
 * It can also be used as a clickable card when an onClick function is provided.
 *
 * @example
 * ```
 * <SectionCard
 *   title="Title"
 *   description="Description"
 *   img={{ src: "https://via.placeholder.com/150", alt: "Placeholder" }}
 *   tags={["tag1", "tag2"]}
 * />
 * ```
 */
export function SectionCard({
  id,
  img,
  title,
  description,
  tags = [],
  className,
  renderOverlay = false,
  onClick,
}: SectionCardProps): JSX.Element {
  const generatedId = useId();
  const idToUse = id || generatedId;
  return (
    <div
      id={idToUse}
      className={classNames(
        "max-w-sm h-[27.5rem] w-[24rem] rounded overflow-hidden shadow-lg relative flex flex-col group",
        className,
      )}
      {...(onClick && { onClick, role: "button", tabIndex: 0 })}
    >
      {/* Overlay */}
      {renderOverlay && typeof renderOverlay === "function" && renderOverlay()}
      {renderOverlay &&
        typeof renderOverlay === "boolean" &&
        defaultRenderOverlay()}
      {/* Cover */}
      <div className="aspect-video flex-shrink-0 overflow-hidden">
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
          <div className="font-bold text-xl mb-2 line-clamp-2">{title}</div>
        ) : (
          <div className="bg-gray-300 w-1/2 h-7 mb-2 rounded-sm" />
        )}
        {description ? (
          <p className="text-gray-700 text-base line-clamp-4">{description}</p>
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
                key={`tag-${idToUse}-${tag}`}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))
          : ["tag 1", "long tag 2", "tag 3"].map((tag) => (
              <span
                key={`tag-${idToUse}-${tag}`}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
      </div>
    </div>
  );
}
