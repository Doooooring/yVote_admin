import styled from 'styled-components';
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
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

const TextEditor = forwardRef((props, ref: ForwardedRef<ReactQuill>) => {
  return (
    <Wrapper>
      <ReactQuillComp forwardedRef={ref} modules={{ toolbar: toolbarOptions }} />
    </Wrapper>
  );
});

export default TextEditor;

const Wrapper = styled.div``;
