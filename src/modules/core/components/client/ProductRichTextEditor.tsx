"use client";

import { nodes } from "@/components/blocks/editor-x/nodes";
import { FloatingLinkContext } from "@/components/editor/context/floating-link-context";
import { SharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { ActionsPlugin } from "@/components/editor/plugins/actions/actions-plugin";
import { ClearEditorActionPlugin } from "@/components/editor/plugins/actions/clear-editor-plugin";
import { CounterCharacterPlugin } from "@/components/editor/plugins/actions/counter-character-plugin";
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin";
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProductRichTextEditorProps } from "@/modules/product.management";
import HtmlHydrationPlugin, {
  ToolbarUI,
} from "@/modules/product.management/utils/richTextEditorUtils";
import { $generateHtmlFromNodes } from "@lexical/html";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState, LexicalEditor } from "lexical";
import { useRef, useState } from "react";

export default function ProductRichTextEditor({
  name,
  value,
  handleOnChange,
  className,
  placeholder,
  toolbar = "none",
  enableImages = false,
}: ProductRichTextEditorProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const lastAppliedHtml = useRef<string | undefined>(undefined);
  const handleRTEChange = (editorState: EditorState, editor: LexicalEditor) => {
    if (!handleOnChange || !name) return;
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      if (htmlString !== lastAppliedHtml.current) {
        handleOnChange(name, htmlString);
      }
    });
  };
  const onAnchorRef = (elem: HTMLDivElement | null) => {
    if (elem) setFloatingAnchorElem(elem);
  };
  const initialConfig: Parameters<typeof LexicalComposer>[0]["initialConfig"] =
    {
      namespace: `ProductRichTextEditor:${name}`,
      theme: editorTheme,
      nodes,
      onError: (e: Error) => console.error(e),
    };

  return (
    <div className={className}>
      <LexicalComposer initialConfig={initialConfig}>
        <TooltipProvider>
          <SharedAutocompleteContext>
            <FloatingLinkContext>
              <ToolbarUI variant={toolbar} enableImages={enableImages} />
              <RichTextPlugin
                contentEditable={
                  <div className="relative">
                    <div ref={onAnchorRef}>
                      <ContentEditable
                        placeholder={placeholder}
                        className="relative block min-h-72 max-h-[40rem] overflow-auto px-6 py-4 focus:outline-none"
                      />
                    </div>
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HtmlHydrationPlugin
                html={typeof value === "string" ? value : undefined}
                onApplied={(h) => (lastAppliedHtml.current = h)}
              />
              <HistoryPlugin />
              <ListPlugin />
              <CheckListPlugin />
              <ClickableLinkPlugin />
              <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
              <ImagesPlugin />

              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={handleRTEChange}
              />
            </FloatingLinkContext>
          </SharedAutocompleteContext>
        </TooltipProvider>
        <ActionsPlugin>
          <div className="flex flex-row gap-x-4 items-center">
            <ClearEditorActionPlugin />
            <ClearEditorPlugin />
            <CounterCharacterPlugin charset="UTF-16" />
          </div>
        </ActionsPlugin>
      </LexicalComposer>
    </div>
  );
}
