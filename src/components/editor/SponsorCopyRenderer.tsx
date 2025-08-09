/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import { createSlateEditor } from "@udecode/plate";
import { PlateStatic } from "@udecode/plate";
import { BasicElementsPlugin } from "@udecode/plate-basic-elements/react";
import { BasicMarksPlugin } from "@udecode/plate-basic-marks/react";
// import type { Value } from "@udecode/plate";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any[];
import React from "react";

interface SponsorCopyRendererProps {
  value: Value;
  className?: string;
}

// Static components for rendering
const ParagraphStatic = React.memo((props: any) => (
  <p className="mb-0">{props.children}</p>
));
ParagraphStatic.displayName = "ParagraphStatic";

const BoldStatic = React.memo((props: any) => (
  <strong className="font-semibold">{props.children}</strong>
));
BoldStatic.displayName = "BoldStatic";

const ItalicStatic = React.memo((props: any) => (
  <em className="italic">{props.children}</em>
));
ItalicStatic.displayName = "ItalicStatic";

const UnderlineStatic = React.memo((props: any) => (
  <u className="underline">{props.children}</u>
));
UnderlineStatic.displayName = "UnderlineStatic";

// Component mapping for PlateStatic
const staticComponents = {
  p: ParagraphStatic,
  bold: BoldStatic,
  italic: ItalicStatic,
  underline: UnderlineStatic,
};

export function SponsorCopyRenderer({
  value,
  className = "",
}: SponsorCopyRendererProps) {
  const editor = createSlateEditor({
    plugins: [BasicElementsPlugin, BasicMarksPlugin],
    value,
  });

  return (
    <div className={className}>
      <PlateStatic
        editor={editor}
        components={staticComponents}
        value={value}
      />
    </div>
  );
}
