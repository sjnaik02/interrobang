/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from "@/components/ui/fixed-toolbar";
import { MarkToolbarButton } from "@/components/ui/mark-toolbar-button";

export function PlateEditor() {
  const editor = useCreateEditor();

  return (
    <>
      <Plate editor={editor}>
        <FixedToolbar className="justify-start rounded-t-lg border-t-1 border-r-1 border-l-1 border-gray-300">
          <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
            B
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
            I
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
            U
          </MarkToolbarButton>
        </FixedToolbar>
        <EditorContainer className="mx-auto w-auto">
          <Editor
            variant="none"
            placeholder="Type..."
            className="h-auto rounded-t-none rounded-b-lg border-r-1 border-b-1 border-l-1 border-gray-300 px-4 pt-2"
          />
        </EditorContainer>
      </Plate>
    </>
  );
}
