import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SignupForm from "./SignupForm";

const meta: Meta<typeof SignupForm> = {
  title: "Auth/SignupForm",
  component: SignupForm,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof SignupForm>;

export const Default: Story = {
  args: {
    onSubmit: async ({ email }) => {
      await new Promise((r) => setTimeout(r, 600));
      // eslint-disable-next-line no-console
      console.log("signup", email);
    },
  },
};

export const WithError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 200));
      throw new Error("Email already exists");
    },
  },
};
