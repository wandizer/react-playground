import type { Meta, StoryObj } from '@storybook/react'

import { SectionCard } from './SectionCard.tsx'

const IMAGE_OPTIONS = {
  '-': undefined,
  Cover: {
    src: 'https://fakeimg.pl/1024x480/000,200/fff,255/?text=Cover',
    alt: 'Cover',
  },
}

const meta = {
  title: 'Components/SectionCard',
  component: SectionCard,
  argTypes: {
    img: {
      options: Object.keys(IMAGE_OPTIONS),
      control: { type: 'select' },
      mapping: IMAGE_OPTIONS,
    },
  },
} satisfies Meta<typeof SectionCard>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {
    title:
      'Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit Sed Do Eiusmod',
    description: `
      Lorem ipsum dolor sit amet, consectetur adip iscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
      dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    `,
    img: {
      src: 'https://fakeimg.pl/1024x480/000,200/fff,255/?text=Cover',
      alt: 'Cover',
    },
    tags: Array.from(
      { length: 2 },
      (_, i) => `${i % 2 === 0 ? 'Long tag' : 'Tag'} ${i + 1}`,
    ),
  },
}

export const Empty: Story = {
  args: {},
}

export const WithDefaultOverlay: Story = {
  decorators: [
    (Story) => (
      <div className="flex gap-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    pseudo: {
      hover: '#hover',
    },
  },
  args: {
    renderOverlay: true,
  },
  render: (args) => (
    <>
      <SectionCard {...args} />
      <SectionCard {...args} id="hover" />
    </>
  ),
}

export const WithCustomOverlay: Story = {
  args: {
    renderOverlay: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold">
        Coming soon...
      </div>
    ),
  },
}
