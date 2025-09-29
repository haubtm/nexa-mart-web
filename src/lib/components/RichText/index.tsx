import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Button, Select } from 'antd';

// Kéo font-size bằng TextStyle
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (el: HTMLElement) => el.style.fontSize || null,
        renderHTML: (attrs: Record<string, any>) =>
          attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
      },
    };
  },
});

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  minHeight?: number;
};

const sizes = ['12px', '14px', '16px', '18px', '24px', '32px'];

export default function RichText({
  value = '',
  onChange,
  minHeight = 160,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  // Đồng bộ khi Form setFieldsValue từ ngoài
  useEffect(() => {
    if (editor && value !== editor.getHTML())
      editor.commands.setContent(value || '');
  }, [value, editor]);

  if (!editor) return null;

  const setSize = (sz: string) =>
    editor.chain().focus().setMark('textStyle', { fontSize: sz }).run();

  return (
    <div className="rte">
      {/* Toolbar */}
      <div
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}
      >
        <Button
          size="small"
          type={editor.isActive('bold') ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Button>
        <Button
          size="small"
          type={editor.isActive('italic') ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </Button>
        <Button
          size="small"
          type={editor.isActive('underline') ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </Button>

        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          Căn trái
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          Căn giữa
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          Căn phải
        </Button>

        <Select
          size="small"
          placeholder="Cỡ chữ"
          style={{ width: 110 }}
          onChange={setSize}
          options={sizes.map((v) => ({ label: v, value: v }))}
        />

        <Button
          size="small"
          danger
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          Clear
        </Button>
      </div>

      {/* Vùng soạn thảo */}
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          padding: 8,
          minHeight,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
