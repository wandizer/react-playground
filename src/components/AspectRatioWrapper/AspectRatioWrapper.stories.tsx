import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatioWrapper } from "./AspectRatioWrapper";

const meta: Meta<typeof AspectRatioWrapper> = {
  component: AspectRatioWrapper,
  args: {
    ratio: "16/9",
    children: <img src="https://fakeimg.pl/300/" />,
    className: "border-dashed border border-red-500",
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatioWrapper>;

export const Default: Story = {
  render: (args) => {
    return (
      <div className="inline-flex gap-4 w-full">
        <div className="w-1/3">
          <AspectRatioWrapper {...args} />
        </div>
        <div className="w-1/3">
          <AspectRatioWrapper {...args} />
        </div>
        <div className="w-1/3">
          <AspectRatioWrapper {...args} />
        </div>
      </div>
    );
  },
};

export const WithWidthProperlySet: Story = {
  args: {
    className: "border-dashed border border-green-500 w-[200px]",
  },
};
