import { useEffect, useRef, useState } from 'react';
import MP4Box from 'mp4box';

import { File } from '../types';

import FileAPI from '@/api/file';
import Loading from './Loading';

interface Props {
  path: string,
  target: File;
}

export default function VideoPreviewer({ path, target }: Props) {
  const isInit = useRef(false);
  const stearmError = useRef(false);
  const downloading = useRef(false);
  const updateing = useRef(false);
  const controller = useRef<AbortController>();
  const buffer = useRef<Uint8Array[]>([]);
  const chunks = useRef<Uint8Array[]>([]);
  const [totalLength, setTotalLength] = useState(0);
  const [receivedLength, setReceivedLength] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [mediaSource] = useState(new MediaSource());
  const [src, setSrc] = useState<string>();
  const [mp4boxfile] = useState(MP4Box.createFile());

  function init() {
    isInit.current = true;

    mp4boxfile.onReady = (info) => {
      const videoTrack = info.tracks[0];
      console.log('Video Track:', videoTrack);
      console.log(`Video Codec: "${videoTrack.codec}"`);
    };
    mediaSource.onsourceopen = onSourceOpen;
    setSrc(() => URL.createObjectURL(mediaSource));
  }

  function onSourceOpen() {
    if(downloading.current) return;
    downloading.current = true;

    const fileName = target.name.split('/').pop();
    if(!fileName) return;

    controller.current = new AbortController();
    FileAPI.PreviewFile({ path }, fileName, controller.current.signal).then(async (resp) => {
      setTotalLength(() => Number(resp.headers.get('Content-Length')));
      const reader = resp.body?.getReader();
      if(!reader) return;

      const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
      sourceBuffer.onupdateend = () => updateChunk(sourceBuffer);
      read(reader, sourceBuffer);
    });
  }

  async function read(reader: ReadableStreamDefaultReader<Uint8Array>, sourceBuffer: SourceBuffer) {
    const { value, done } = await reader.read();
    if(value) {
      setReceivedLength((val) => val + value.length);
      buffer.current.push(value);
      chunks.current.push(value);
      if(!updateing.current && !stearmError.current) updateChunk(sourceBuffer);
    }

    if(done && (mediaSource.readyState === 'closed' || stearmError.current)) {
      src && URL.revokeObjectURL(src);
      setSrc(URL.createObjectURL(new Blob(chunks.current, { type: target.contentType })));
      setShowProgress(() => false);
    }
    if(!done) read(reader, sourceBuffer);
  }

  function updateChunk(sourceBuffer: SourceBuffer) {
    updateing.current = false;
    try {
      const chunk = buffer.current.shift();
      if(chunk) {
        updateing.current = true;
        sourceBuffer.appendBuffer(chunk);
      }
    } catch (error) {
      console.error(error);
      stearmError.current = true;
      setShowProgress(() => true);
    }
  }

  useEffect(() => {
    !isInit.current && init();
    return () => {
      controller.current && controller.current.abort();
      src && URL.revokeObjectURL(src);
    };
  }, []);

  return (<>
    { showProgress
        ? <Loading show={true} total={totalLength} received={receivedLength}></Loading>
        : <video className="max-w-screen max-h-screen" controls src={src}></video>
    }
  </>);
}
