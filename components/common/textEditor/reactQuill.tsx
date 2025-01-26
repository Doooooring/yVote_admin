import { ForwardedRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';

export interface ReactQuillCompProps extends ReactQuillProps {
  forwardedRef: ForwardedRef<ReactQuill>;
}

export default function MyQuillComp({ forwardedRef, ...props }: ReactQuillCompProps) {
  return <ReactQuill ref={forwardedRef} {...props} />;
}
