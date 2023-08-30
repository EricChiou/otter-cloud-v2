import { useEffect, useRef, useState } from 'react';

import { File } from '../types';

import FileAPI from '@/api/file';
import Loading from './Loading';

interface Props {
  path: string,
  target: File;
}

export default function VideoPreviewer({ path, target }: Props) {
  const chunks = useRef<Uint8Array[]>([]);
  const [isDone, setIsDone] = useState(false);
  const controller = useRef<AbortController>();
  const renderTimeout = useRef<number>();
  const [src, setSrc] = useState<string>();
  const [totalLength, setTotalLength] = useState(0);
  const [receivedLength, setReceivedLength] = useState(0);

  useEffect(() => {
    const fileName = target.name.split('/').pop();
    if(!fileName) return;

    controller.current && controller.current.abort();
    controller.current = new AbortController();
    setIsDone(() => false);
    FileAPI.PreviewFile({ path }, fileName, controller.current.signal).then(async (resp) => {
      setTotalLength(() => Number(resp.headers.get('Content-Length')));
      const reader = resp.body?.getReader();
      if(!reader) return;
      read(reader);
    });
    render();

    return () => {
      controller.current && controller.current.abort();
      renderTimeout.current && clearTimeout(renderTimeout.current);
      src && URL.revokeObjectURL(src);
    };
  }, []);

  async function read(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const { value, done } = await reader.read();
    if(value) {
      setReceivedLength((val) => val + value.length);
      chunks.current.push(value);
    }

    (isDone !== done) && setIsDone(() => done);
    !done && read(reader);
  }

  function render() {
    renderTimeout.current && clearTimeout(renderTimeout.current);
    renderTimeout.current = window.setTimeout(() => {
      src && URL.revokeObjectURL(src);
      setSrc(() => URL.createObjectURL(new Blob(chunks.current, { type: target.contentType })));
      !isDone && render();
    }, 200);
  }

  return (<>
    <img className="max-w-screen max-h-screen" src={src}></img>
    <Loading show={!isDone} total={totalLength} received={receivedLength}></Loading>
  </>);
}
