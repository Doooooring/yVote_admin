import 'bootstrap/dist/css/bootstrap.min.css';

interface PrimaryButtonProps {
  title: string;
  click: () => void;
}

export function PrimaryButton({ title, click }: PrimaryButtonProps) {
  return (
    <button className="btn btn-primary" onClick={click}>
      {title}
    </button>
  );
}
