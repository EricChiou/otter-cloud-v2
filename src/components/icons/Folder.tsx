interface Props {
  className?: string;
  onClick?: () => void;
}

export default function Folder({ className, onClick }: Props) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      onClick={onClick}
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="currentColor"
        d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
      />
    </svg>
  );
}
