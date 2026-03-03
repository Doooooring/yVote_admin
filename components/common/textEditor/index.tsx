import dynamic from 'next/dynamic';
import { ForwardedRef, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled, { CSSProperties } from 'styled-components';

import type { ComponentType } from 'react';
import { ReactQuillCompProps } from './reactQuill';

export type DynamicComponent<P> = ComponentType<P> & {
  preload: () => Promise<void>;
};

export const ReactQuillComp = dynamic<ReactQuillCompProps>(() => import('./reactQuill'), {
  ssr: false,
}) as DynamicComponent<ReactQuillCompProps>;

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['link', 'image', 'video'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
];

interface TextEditorProps {
  style?: CSSProperties;
  onChange: (v: string) => void;
  onMount?: (...args: unknown[]) => void;
}

const TextEditor = forwardRef(
  ({ style, onChange, onMount }: TextEditorProps, ref: ForwardedRef<ReactQuill>) => {
    return (
      <Wrapper style={style}>
        <ReactQuillComp
          onChange={onChange}
          forwardedRef={ref}
          modules={{ toolbar: toolbarOptions }}
        />
      </Wrapper>
    );
  },
);

export default TextEditor;

const Wrapper = styled.div`
  .quill {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .ql-container {
    overflow-y: hidden;
  }

  .ql-editor {
  }
`;
