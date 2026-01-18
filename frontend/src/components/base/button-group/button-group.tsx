import { type FC, type PropsWithChildren, type ReactNode, type RefAttributes, createContext, isValidElement, useContext } from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from "react-aria-components";
import { cx, sortCx } from "../../../lib/utils/cx";
import { isReactComponent } from "../../../lib/utils/is-react-component";

export const styles = {
  common: {
    root: sortCx(
      [
        "group/button-group inline-flex h-max cursor-pointer items-center bg-primary font-semibold whitespace-nowrap text-secondary shadow-skeumorphic ring-1 ring-primary outline-brand transition duration-100 ease-linear ring-inset",
        "hover:bg-primary_hover hover:text-secondary_hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:bg-primary disabled:text-disabled",
        "selected:bg-active selected:text-secondary_hover selected:disabled:bg-disabled_subtle",
      ].join(" ")
    ),
    icon: sortCx(
      "pointer-events-none text-fg-quaternary transition-[inherit] group-hover/button-group:text-fg-quaternary_hover group-disabled/button-group:text-fg-disabled_subtle"
    ),
  },

  sizes: {
    sm: {
      root: sortCx(
        "gap-1.5 px-3.5 py-2 text-sm not-last:pr-[calc(calc(var(--spacing)*3.5)+1px)] first:rounded-l-lg last:rounded-r-lg data-icon-leading:pl-3 data-icon-only:p-2"
      ),
      icon: sortCx("size-5"),
    },
    md: {
      root: sortCx(
        "gap-1.5 px-4 py-2.5 text-sm not-last:pr-[calc(calc(var(--spacing)*4)+1px)] first:rounded-l-lg last:rounded-r-lg data-icon-leading:pl-3.5 data-icon-only:px-3"
      ),
      icon: sortCx("size-5"),
    },
    lg: {
      root: sortCx(
        "gap-2 px-4.5 py-2.5 text-md not-last:pr-[calc(calc(var(--spacing)*4.5)+1px)] first:rounded-l-lg last:rounded-r-lg data-icon-leading:pl-4 data-icon-only:p-3"
      ),
      icon: sortCx("size-5"),
    },
  },
};

type ButtonSize = keyof typeof styles.sizes;

const ButtonGroupContext = createContext<{ size: ButtonSize }>({ size: "md" });

interface ButtonGroupItemProps extends ToggleButtonProps, RefAttributes<HTMLButtonElement> {
  iconLeading?: FC<{ className?: string }> | ReactNode;
  iconTrailing?: FC<{ className?: string }> | ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ButtonGroupItem = ({
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  children,
  className,
  ...otherProps
}: PropsWithChildren<ButtonGroupItemProps>) => {
  const { size } = useContext(ButtonGroupContext);

  const isIcon = (IconLeading || IconTrailing) && !children;

  return (
    <AriaToggleButton
      {...otherProps}
      data-icon-only={isIcon ? true : undefined}
      data-icon-leading={IconLeading ? true : undefined}
      className={cx(styles.common.root, styles.sizes[size].root, className)}
    >
      {isReactComponent(IconLeading) && (
        <IconLeading className={cx(styles.common.icon, styles.sizes[size].icon)} />
      )}
      {isValidElement(IconLeading) && IconLeading}

      {children}

      {isReactComponent(IconTrailing) && (
        <IconTrailing className={cx(styles.common.icon, styles.sizes[size].icon)} />
      )}
      {isValidElement(IconTrailing) && IconTrailing}
    </AriaToggleButton>
  );
};

interface ButtonGroupProps extends Omit<ToggleButtonGroupProps, "orientation">, RefAttributes<HTMLDivElement> {
  size?: ButtonSize;
  className?: string;
}

export const ButtonGroup = ({ children, size = "md", className, ...otherProps }: ButtonGroupProps) => {
  return (
    <ButtonGroupContext.Provider value={{ size }}>
      <AriaToggleButtonGroup
        selectionMode="single"
        className={cx("relative z-0 inline-flex w-max -space-x-px rounded-lg shadow-xs", className)}
        {...otherProps}
      >
        {children}
      </AriaToggleButtonGroup>
    </ButtonGroupContext.Provider>
  );
};
