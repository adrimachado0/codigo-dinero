import { Fragment } from "react";

import type { RichTextValue } from "@/shared/lib/rich-text";

type RichTextProps = {
  value: RichTextValue;
  /** Classes of the bold runs (the reference sets weight 600 and, on dark, white). */
  strongClassName?: string;
};

export function RichText({ value, strongClassName = "font-semibold" }: RichTextProps) {
  return value.map((segment, index) =>
    typeof segment === "string" ? (
      <Fragment key={index}>{segment}</Fragment>
    ) : (
      <strong key={index} className={strongClassName}>
        {segment.strong}
      </strong>
    ),
  );
}
