"use client"

import { JSX, useMemo } from "react"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  NodeContextMenuOption,
  NodeContextMenuPlugin,
} from "@lexical/react/LexicalNodeContextMenuPlugin"
import {
  $getSelection,
  $isRangeSelection,
  COPY_COMMAND,
  CUT_COMMAND,
  PASTE_COMMAND,
} from "lexical"

export function ContextMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()

  const items = useMemo(
    () => [
      new NodeContextMenuOption("Remove Link", {
        $onSelect: () => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
        },
        $showOn: (node) => $isLinkNode(node.getParent()),
      }),
      new NodeContextMenuOption("Copy", {
        $onSelect: () => {
          editor.dispatchCommand(COPY_COMMAND, null)
        },
      }),
      new NodeContextMenuOption("Cut", {
        $onSelect: () => {
          editor.dispatchCommand(CUT_COMMAND, null)
        },
      }),
      new NodeContextMenuOption("Paste", {
        $onSelect: () => {
          navigator.clipboard.read().then(async () => {
            const data = new DataTransfer()
            const items = await navigator.clipboard.read()
            const item = items[0]

            const permission = await navigator.permissions.query({
              // @ts-expect-error Browser typing is still narrower here.
              name: "clipboard-read",
            })

            if (permission.state === "denied") {
              alert("Not allowed to paste from clipboard.")
              return
            }

            for (const type of item.types) {
              const dataString = await (await item.getType(type)).text()
              data.setData(type, dataString)
            }

            const event = new ClipboardEvent("paste", {
              clipboardData: data,
            })

            editor.dispatchCommand(PASTE_COMMAND, event)
          })
        },
      }),
      new NodeContextMenuOption("Paste as Plain Text", {
        $onSelect: () => {
          navigator.clipboard.read().then(async () => {
            const permission = await navigator.permissions.query({
              // @ts-expect-error Browser typing is still narrower here.
              name: "clipboard-read",
            })

            if (permission.state === "denied") {
              alert("Not allowed to paste from clipboard.")
              return
            }

            const data = new DataTransfer()
            const items = await navigator.clipboard.readText()
            data.setData("text/plain", items)

            const event = new ClipboardEvent("paste", {
              clipboardData: data,
            })

            editor.dispatchCommand(PASTE_COMMAND, event)
          })
        },
      }),
      new NodeContextMenuOption("Delete Node", {
        $onSelect: () => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const currentNode = selection.anchor.getNode()
            const ancestorNodeWithRootAsParent = currentNode.getParents().at(-2)

            ancestorNodeWithRootAsParent?.remove()
          }
        },
      }),
    ],
    [editor]
  )

  return (
    <NodeContextMenuPlugin
      items={items}
      className="z-50 min-w-[200px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
      itemClassName="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      separatorClassName="my-1 border-border"
    />
  )
}
