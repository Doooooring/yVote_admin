import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { CommonLayoutBox } from '../figure';

interface PrimaryButtonProps {
  title: string;
  click: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ title, click, disabled = false }: PrimaryButtonProps) {
  return (
    <button className="btn btn-primary" disabled={disabled} onClick={click}>
      {title}
    </button>
  );
}

export const CommonIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px;

  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 50%;
  background: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;

export const TextButton = styled(CommonLayoutBox)`
  padding: 0.4rem 1.2rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;
