import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';

export const useReactQuill = () => {
  const ref = useRef<ReactQuill>(null);
  const [content, setContent] = useState<string>('');

  const getEditor = () => {
    return ref.current?.getEditor();
  };

  const handleContents = (v: string) => {
    setContent(v);
  };

  const initializeQuillContents = (v: string) => {
    setContent(v);
    const editor = getEditor();
    const delta = editor?.clipboard.convert(v);
    return editor?.setContents(delta!);
  };

  const resetContents = () => {
    const editor = getEditor();
    const textLength = editor?.getLength() ?? 0;
    if (editor) {
      setContent('');
      return editor.deleteText(0, textLength);
    }
    return null;
  };

  return {
    ref,
    content,
    handleContents,
    initializeQuillContents,
    resetContents,
  };
};
