"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Undo2,
  Redo2,
} from "lucide-react";

type ToolbarAction =
  | {
      kind: "command";
      title: string;
      icon: typeof Bold;
      command: string;
      value?: string;
    }
  | {
      kind: "prompt";
      title: string;
      icon: typeof Bold;
      promptMessage: string;
      command: string;
    };

const TOOLBAR_GROUPS: ToolbarAction[][] = [
  [
    { kind: "command", title: "Bold", icon: Bold, command: "bold" },
    { kind: "command", title: "Italic", icon: Italic, command: "italic" },
    { kind: "command", title: "Underline", icon: Underline, command: "underline" },
    { kind: "command", title: "Strikethrough", icon: Strikethrough, command: "strikeThrough" },
  ],
  [
    { kind: "command", title: "Heading 1", icon: Heading1, command: "formatBlock", value: "h1" },
    { kind: "command", title: "Heading 2", icon: Heading2, command: "formatBlock", value: "h2" },
    { kind: "command", title: "Heading 3", icon: Heading3, command: "formatBlock", value: "h3" },
  ],
  [
    { kind: "command", title: "Bullet List", icon: List, command: "insertUnorderedList" },
    { kind: "command", title: "Ordered List", icon: ListOrdered, command: "insertOrderedList" },
    { kind: "command", title: "Quote", icon: Quote, command: "formatBlock", value: "blockquote" },
  ],
  [
    { kind: "command", title: "Code Block", icon: Code, command: "formatBlock", value: "pre" },
    { kind: "prompt", title: "Insert Link", icon: Link, promptMessage: "Enter the URL:", command: "createLink" },
    { kind: "prompt", title: "Insert Image", icon: Image, promptMessage: "Enter the image URL:", command: "insertImage" },
  ],
  [
    { kind: "command", title: "Undo", icon: Undo2, command: "undo" },
    { kind: "command", title: "Redo", icon: Redo2, command: "redo" },
  ],
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  action,
  onAction,
}: {
  action: ToolbarAction;
  onAction: (action: ToolbarAction) => void;
}) {
  const Icon = action.icon;

  return (
    <button
      type="button"
      title={action.title}
      onClick={() => onAction(action)}
      className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocus, setIsEditorFocus] = useState(false);

  // Word and read time calculations
  const wordCount = value.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  const applyFormat = (command: string, formatValue?: string) => {
    document.execCommand(command, false, formatValue);
    editorRef.current?.focus();
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleToolbarAction = (action: ToolbarAction) => {
    if (action.kind === "prompt") {
      const response = prompt(action.promptMessage);
      if (response) {
        applyFormat(action.command, response);
      }
      return;
    }

    applyFormat(action.command, action.value);
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-slate-200 p-2 bg-slate-50 flex flex-wrap gap-1 sticky top-0 z-10">
        {TOOLBAR_GROUPS.map((group, groupIndex) => (
          <div
            key={group[0]?.title ?? groupIndex}
            className={groupIndex < TOOLBAR_GROUPS.length - 1 ? "flex gap-1 border-r border-slate-200 pr-2" : "flex gap-1"}
          >
            {group.map((action) => (
              <ToolbarButton
                key={action.title}
                action={action}
                onAction={handleToolbarAction}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        data-placeholder={placeholder}
        onInput={handleEditorChange}
        onFocus={() => setIsEditorFocus(true)}
        onBlur={() => setIsEditorFocus(false)}
        data-focused={isEditorFocus}
        className="min-h-96 p-4 focus:outline-none prose prose-sm max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none [&_img]:max-w-full [&_img]:rounded [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-slate-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto"
        suppressContentEditableWarning
      />

      {/* Footer */}
      <div className="border-t border-slate-200 p-3 bg-slate-50 text-xs text-slate-600 flex justify-between">
        <span>
          {wordCount} words · {readTime} min read
        </span>
      </div>
    </div>
  );
}
