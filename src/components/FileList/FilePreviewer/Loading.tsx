import { CircularProgress } from '@mui/material';

interface Props {
  show: boolean;
  total: number;
  received: number;
}

export default function Loading({ show, total, received }: Props) {
  return show
    ? <>
        <CircularProgress
          className="fixed top-[calc(50vh-1.5rem)] left-[calc(50vw-1.5rem)]"
          size={48}
        ></CircularProgress>
        <div className="fixed top-[calc(50vh-0.75rem)] left-[calc(50vw-1rem)] text-white">
          { (total < 0) ? 0 : ((received / total) * 100).toFixed(0) }%
        </div>
      </>
    : null;
}