import { useRef } from 'react';
import ReactQuill from 'react-quill';

export const useReactQuill = () => {
  const ref = useRef<ReactQuill>(null);

  const getEditor = () => {
    return ref.current?.getEditor();
  };

  const getContents = () => {
    const editor = getEditor();

    if (editor) return editor.getText();
    return null;
  };

  const resetContents = () => {
    const editor = getEditor();
    if (editor) return ref.current?.setEditorContents(editor, '');
    return null;
  };
};
