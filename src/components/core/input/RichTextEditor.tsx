import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorMessage from '@/src/components/core/typography/ErrorMessage'
import FieldTitle from '@/src/components/core/typography/FieldTitle'

type Props = {
  // HTML
  value: string
  onChange: (html: string) => void
  label: string
  isRequired?: boolean
  error?: string
}

const ToolButton = ({ label, isActive, onClick, children }: { label: string; isActive?: boolean; onClick: () => void; children: ReactNode }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={isActive}
    // keeps the selection in the editor
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`font-poppins flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm ${isActive ? 'bg-green-transparent text-green' : 'text-black hover:bg-light-grey-transparent'}`}
  >
    {children}
  </button>
)

/**
 * A rich text editor (TipTap): headings, bold, italic, underline, strike, lists, quotes and links.
 * Pasted HTML (from a site or Word) keeps its formatting; what the editor does not know is dropped, the api sanitizes it again.
 */
const RichTextEditor = ({ value, onChange, label, isRequired, error }: Props) => {
  const { t } = useTranslation(['g'])
  const editor = useEditor({
    // headings from h2: the page has its own h1
    extensions: [StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true } })],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: 'rich-text-editor min-h-[240px] px-4 py-3 font-poppins text-sm text-black focus:outline-none',
        'aria-label': label,
      },
    },
  })
  // the toolbar shows what the cursor is in
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bulletList: e.isActive('bulletList'),
      orderedList: e.isActive('orderedList'),
      blockquote: e.isActive('blockquote'),
      link: e.isActive('link'),
    }),
  })

  // the saved text came again from the api
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  const chain = () => editor.chain().focus()

  const handleLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const href = window.prompt(t('g:richText.linkPrompt'), previous ?? 'https://')

    if (href === null) return
    if (!href.trim()) return void chain().extendMarkRange('link').unsetLink().run()

    chain().extendMarkRange('link').setLink({ href: href.trim(), target: '_blank' }).run()
  }

  return (
    <div className="flex flex-col gap-y-2">
      <FieldTitle text={label} isRequired={isRequired} />
      <div className={`overflow-hidden rounded-xs-plus border-1 border-solid bg-white ${error ? 'border-red' : 'border-grey focus-within:border-green'}`}>
        <div role="toolbar" aria-label={label} className="flex flex-wrap gap-1 border-b-1 border-solid border-light-grey-alt bg-grey-100 p-1">
          <ToolButton label={t('g:richText.h2')} isActive={active?.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
            H2
          </ToolButton>
          <ToolButton label={t('g:richText.h3')} isActive={active?.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
            H3
          </ToolButton>
          <ToolButton label={t('g:richText.bold')} isActive={active?.bold} onClick={() => chain().toggleBold().run()}>
            <strong>B</strong>
          </ToolButton>
          <ToolButton label={t('g:richText.italic')} isActive={active?.italic} onClick={() => chain().toggleItalic().run()}>
            <em>I</em>
          </ToolButton>
          <ToolButton label={t('g:richText.underline')} isActive={active?.underline} onClick={() => chain().toggleUnderline().run()}>
            <u>U</u>
          </ToolButton>
          <ToolButton label={t('g:richText.strike')} isActive={active?.strike} onClick={() => chain().toggleStrike().run()}>
            <s>S</s>
          </ToolButton>
          <ToolButton label={t('g:richText.bulletList')} isActive={active?.bulletList} onClick={() => chain().toggleBulletList().run()}>
            • —
          </ToolButton>
          <ToolButton label={t('g:richText.orderedList')} isActive={active?.orderedList} onClick={() => chain().toggleOrderedList().run()}>
            1.
          </ToolButton>
          <ToolButton label={t('g:richText.quote')} isActive={active?.blockquote} onClick={() => chain().toggleBlockquote().run()}>
            “ ”
          </ToolButton>
          <ToolButton label={t('g:richText.link')} isActive={active?.link} onClick={handleLink}>
            🔗
          </ToolButton>
          <ToolButton label={t('g:richText.clear')} onClick={() => chain().unsetAllMarks().clearNodes().run()}>
            ⌫
          </ToolButton>
        </div>
        <EditorContent editor={editor} />
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  )
}

export default RichTextEditor
