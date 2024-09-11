import styled, { CSSProperties } from 'styled-components';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import React, { ForwardedRef, forwardRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';

interface ReactQuillCompProps extends ReactQuillProps {
  forwardedRef: ForwardedRef<ReactQuill>;
}

const ReactQuillComp = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    return ({ forwardedRef, ...props }: ReactQuillCompProps) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
  },
);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['link', 'image', 'video'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
];

interface TextEditorProps {
  style?: CSSProperties;
  onChange: (v: string) => void;
}

const TextEditor = forwardRef(
  ({ style, onChange }: TextEditorProps, ref: ForwardedRef<ReactQuill>) => {
    if (!ref) return <></>;

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
