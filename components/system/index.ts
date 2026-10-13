/**
 * Component System - Export all system components
 * Premium design system with world-class components
 */

// Design System
export * from "../design-system";

// Design Tokens (legacy)
export { sizing, radius, colorsDark, statusConfig } from "./tokens";
export * as legacyTokens from "./tokens";

// Core Components - Redesigned with Premium Design System
export { Button, ButtonGroup, ToggleButton, type ButtonProps } from "./Button";

// New Input System (replaces Form.Input)
export {
  Input,
  Textarea,
  PasswordInput,
  type InputProps,
  type TextareaProps,
  type PasswordInputProps,
} from "./Input";

// Card System (new)
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardBadge,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
  type CardBadgeProps,
} from "./Card";

// Badge & Status System (new)
export {
  Badge,
  StatusBadge,
  Tag,
  type BadgeProps,
  type StatusBadgeProps,
  type TagProps,
} from "./Badge";

// Avatar System (new)
export {
  Avatar,
  AvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
} from "./Avatar";

// Form (legacy - use new Input instead)
export {
  Form,
  FormField,
  Select,
  Checkbox,
  RadioGroup,
  type FormProps,
  type FormFieldProps,
  type SelectProps,
  type CheckboxProps,
  type RadioGroupProps,
} from "./Form";

// State Components
export {
  LoadingState,
  ErrorState,
  EmptyState,
  SuccessState,
  ProcessingState,
  StatusIndicator,
  type LoadingStateProps,
  type ErrorStateProps,
  type EmptyStateProps,
  type SuccessStateProps,
  type ProcessingStateProps,
  type StatusIndicatorProps,
} from "./States";

// Skeleton Components
export {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonText,
  SkeletonGrid,
  type SkeletonProps,
  type SkeletonCardProps,
  type SkeletonTableProps,
  type SkeletonTextProps,
  type SkeletonGridProps,
} from "./Skeleton";

// Dialog/Modal
export {
  Dialog,
  DialogContent,
  DialogTrigger,
  useDialog,
  type DialogProps,
  type DialogContentProps,
  type DialogTriggerProps,
  type UseDialogReturn,
} from "./Dialog";

// Toast
export { ToastContainer } from "./Toast";

// Layout
export {
  Container,
  Grid,
  Flex,
  Stack,
  Section,
  type ContainerProps,
  type GridProps,
  type FlexProps,
  type StackProps,
  type SectionProps,
} from "./Layout";

// Micro-Interactions
export {
  ScalePulse,
  FadeIn,
  SlideIn,
  SuccessCheckmark,
  Shake,
  BounceIn,
  HoverLift,
  Ripple,
  Stagger,
  type MicroInteractionProps,
  type FadeInProps,
  type SlideInProps,
  type ShakeProps,
  type BounceInProps,
  type HoverLiftProps,
  type RippleProps,
  type StaggerProps,
} from "./Interactions";
