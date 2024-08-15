import { useRef, forwardRef } from 'react';

import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconPhotoPlus } from '@tabler/icons-react';
import { generateHTML } from '@tiptap/core';
import { Editor, useEditor } from '@tiptap/react';

function UploadImagesControl() {
  const { editor } = useRichTextEditorContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.FormEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files as ArrayLike<File>);
    if (files) {
      for (const file of files) {
        editor!.chain().focus().setImage({ src: URL.createObjectURL(file), title: 'image', alt: 'image' }).run();
      }
    }
    fileInputRef.current!.value = '';
  };

  const handleIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    fileInputRef.current!.click();
  };

  return (
    <RichTextEditor.Control
      onClick={handleIconClick}
      aria-label="Insert image"
      title="Insert image"
    >
      <IconPhotoPlus stroke={1.5} size="1rem" />
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} name="imagePicker" hidden multiple />
    </RichTextEditor.Control>
  );
}

export const TextEditor =
forwardRef<Editor, { extensions: any, content: any }>((props: any, editorRef: any) => {
  const editor = useEditor({
    extensions: props.extensions,
    content: props.content
      ? generateHTML(
          JSON.parse(props.content),
          props.extensions
        )
      : '',
  });
  editorRef!.current! = editor;

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <UploadImagesControl />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      {/* <RichTextEditor.Content ref={contentRef} /> */}
      <RichTextEditor.Content />
    </RichTextEditor>
  );
});
