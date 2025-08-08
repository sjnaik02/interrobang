/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import { withProps } from "@udecode/cn";
import { BasicElementsPlugin } from "@udecode/plate-basic-elements/react";
import {
  BasicMarksPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import {
  ParagraphPlugin,
  PlateElement,
  PlateLeaf,
  usePlateEditor,
  Plate,
} from "@udecode/plate/react";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Value } from "@udecode/plate/react";

interface SponsorCopyEditorProps {
  value: Value;
  onChange: (value: Value) => void;
  placeholder?: string;
  maxLength?: number;
}

export function SponsorCopyEditor({
  value,
  onChange,
  placeholder = "Enter promotional copy...",
  maxLength = 256,
}: SponsorCopyEditorProps) {
  const changeTimeoutRef = useRef<NodeJS.Timeout>();

  const editor = usePlateEditor({
    components: {
      [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
      [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
      [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
      [ParagraphPlugin.key]: withProps(PlateElement, {
        as: "p",
        className: "mb-0",
      }),
    },
    plugins: [BasicElementsPlugin, BasicMarksPlugin],
    value,
  });

  // Handle changes with debouncing to avoid performance issues
  const handleChange = useCallback(
    (newValue: Value) => {
      // Clear existing timeout
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }

      // Set a new timeout to debounce the onChange call
      changeTimeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300); // Longer debounce for autosave compatibility
    },
    [onChange]
  );

  // Calculate character count from the editor content
  const characterCount = useMemo(() => {
    if (!value || !Array.isArray(value)) return 0;
    
    const getText = (nodes: Value): string => {
      return nodes
        .map((node) => {
          if (typeof node === 'object' && node && 'text' in node && typeof node.text === 'string') {
            return node.text;
          }
          if (typeof node === 'object' && node && 'children' in node && Array.isArray(node.children)) {
            return getText(node.children as Value);
          }
          return "";
        })
        .join("");
    };
    
    return getText(value).length;
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <Plate 
        editor={editor} 
        onChange={({ value }) => handleChange(value)}
      >
        <FixedToolbar className="justify-start rounded-t-lg border border-gray-300 bg-gray-50 px-3 py-2">
          <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
            <span className="font-bold">B</span>
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
            <span className="italic">I</span>
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
            <span className="underline">U</span>
          </MarkToolbarButton>
        </FixedToolbar>
        <EditorContainer className="w-full">
          <Editor
            variant="none"
            placeholder={placeholder}
            className="min-h-[80px] max-h-[120px] overflow-y-auto rounded-t-none rounded-b-lg border-x border-b border-gray-300 px-3 py-2 text-sm"
          />
        </EditorContainer>
      </Plate>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Bold, italic, and underline formatting supported</span>
        <span className={characterCount > maxLength ? "text-red-500" : ""}>
          {characterCount} / {maxLength} characters
        </span>
      </div>
    </div>
  );
}