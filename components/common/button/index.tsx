import 'bootstrap/dist/css/bootstrap.min.css';

interface SubmitButtonProps {
  title: string;
  click: () => void;
}

export function SubmitButton({ title, click }: SubmitButtonProps) {
  return (
    <button className="btn btn-primary" onClick={click}>
      {title}
    </button>
  );
}
