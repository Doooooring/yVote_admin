import { ReactNode, useCallback, useState } from 'react';
import { SelectCompProps } from '../interface';
import styled from 'styled-components';
import { CommonLayoutBox, Row } from '../../figure';

interface SelectDropDownProps<T> extends SelectCompProps<T> {
  menus: Array<T>;
  selectedToView: (menu: T) => ReactNode;
  menuToView: (menu: T, selected?: boolean) => ReactNode;
  fallback?: ReactNode;
}

export default function Select_DropDown<T>({
  selected,
  setSelected,
  menus,
  selectedToView,
  menuToView,
  fallback = <></>,
}: SelectDropDownProps<T>) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const clickDropBox = useCallback(() => {
    setIsFocused((prev) => !prev);
  }, [setIsFocused]);

  const selectMenu = useCallback(
    (i: number) => {
      if (selected !== i) {
        setSelected(i);
      }
      setIsFocused(false);
    },
    [selected, setSelected, setIsFocused],
  );
  return;
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Selected = styled(CommonLayoutBox)`
  display: flex;
  flex-direction: row;
  flex: 0 1 auto;
  width: 100%;
  color: ${({ theme }) => theme.colors.gray900};
  font-size: 14px;
  font-weight: 700;
  transition: border-color 0.4s ease;
  overlofw: hidden;
  cursor: pointer;
`;

const MenusWrapper = styled(CommonLayoutBox)`
  background-color: white;
  position: absolute;
  min-width: 100%;
  left: 0;
  top: calc(100% + 4px);
  border: 0;
  box-shadow: rgba(30, 30, 34, 0.08) 0px 2px 10px, rgba(23, 23, 28, 0.08) 0px 2px 60px;
  z-index: 99999;
`;

const Menus = styled.div`
  cursor: pointer;
  border-radius: 0.75rem;
  overflow: hidden;
`;

const MenuWrapper = styled.div`
  padding: 0.5rem;
  &:hover {
    div {
      background-color: ${({ theme }) => theme.colors.gray200};
    }
  }
`;

const Menu = styled.div<{ selected: boolean }>`
  width: 100%;
  border-radius: 0.25rem;
  padding: 0.25rem 1rem;
  white-space: nowrap;
  color: ${({ selected, theme }) => (selected ? theme.colors.gray900 : theme.colors.gray500)};
`;
