import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from './button';

const meta = {
  title: 'UI/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    showArrow: {
      control: { type: 'boolean' },
    },
    isDark: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Get In Touch',
    href: '/contact',
    isDark: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button
        text="Outline Small"
        variant="outline"
        size="sm"
        href="#"
        isDark={false}
      />
      <Button
        text="Outline Medium"
        variant="outline"
        size="md"
        href="#"
        isDark={false}
      />
      <Button
        text="Outline Large"
        variant="outline"
        size="lg"
        href="#"
        isDark={false}
      />
      <Button
        text="Filled Small"
        variant="default"
        size="sm"
        href="#"
        isDark={false}
      />
      <Button
        text="Filled Medium"
        variant="default"
        size="md"
        href="#"
        isDark={false}
      />
      <Button
        text="Filled Large"
        variant="default"
        size="lg"
        href="#"
        isDark={false}
      />
      <Button text="No Arrow" showArrow={false} href="#" isDark={false} />
    </div>
  ),
};

export const DarkModeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-[#2A2727] p-6 rounded-lg">
      <Button
        text="Outline Small"
        variant="outline"
        size="sm"
        href="#"
        isDark={true}
      />
      <Button
        text="Outline Medium"
        variant="outline"
        size="md"
        href="#"
        isDark={true}
      />
      <Button
        text="Outline Large"
        variant="outline"
        size="lg"
        href="#"
        isDark={true}
      />
      <Button
        text="Filled Small"
        variant="default"
        size="sm"
        href="#"
        isDark={true}
      />
      <Button
        text="Filled Medium"
        variant="default"
        size="md"
        href="#"
        isDark={true}
      />
      <Button
        text="Filled Large"
        variant="default"
        size="lg"
        href="#"
        isDark={true}
      />
    </div>
  ),
};
