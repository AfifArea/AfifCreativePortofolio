"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { usePageTransition } from "./TransitionProvider";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
  cursor?: string;
};

/** next/link that plays the curtain transition on plain left-clicks. */
export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, onClick, cursor, ...rest },
  ref,
) {
  const { navigate } = usePageTransition();
  return (
    <Link
      ref={ref}
      href={href}
      data-cursor={cursor}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          rest.target === "_blank"
        )
          return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
});
