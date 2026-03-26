import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginForm from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Auth/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#f8fafc" },
        { name: "dark", value: "#0b1220" },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

/** Default idle state */
export const Default: Story = {
  args: {
    onSubmit: async ({ email }) => {
      await new Promise((r) => setTimeout(r, 800));
      // eslint-disable-next-line no-console
      console.log("Signed in as", email);
    },
    onGitHub: () => console.log("GitHub OAuth"),
    onGoogle: () => console.log("Google OAuth"),
  },
};

/** Button in loading / busy state */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/** Simulates a failed sign-in (trigger by submitting the form) */
export const WithError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 600));
      throw new Error("Invalid email or password.");
    },
  },
};
