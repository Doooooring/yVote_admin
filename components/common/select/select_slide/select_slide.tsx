import { ReactNode, useMemo } from 'react';
import { SelectCompProps } from '../interface';
import styled from 'styled-components';
import { Row } from '../../figure';

interface Select_SlideProps<T> extends SelectCompProps<T> {
  direction: 'row' | 'column';
  menuToView: (menu: T, selected?: boolean) => ReactNode;
}

export default function Select_Slide<T>({
  direction,
  selected,
  setSelected,
  menus,
  menuToView,
}: Select_SlideProps<T>) {
  const boxSize = useMemo(() => {
    const splited = `calc(100% / ${menus.length})`;
    if (direction === 'row') {
      return {
        width: '100%',
        height: splited,
      };
    } else {
      return {
        width: splited,
        height: '100%',
      };
    }
  }, [menus, direction]);

  const boxAnimation = useMemo(() => {
    const position = `calc(100%/${menus.length} * ${selected})`;

    if (direction === 'column') {
      return {
        left: 0,
        top: position,
        transition: 'top 0.3s ease',
      };
    } else {
      return {
        top: 0,
        left: position,
        transition: 'left 0.3s ease',
      };
    }
  }, [selected, menus, direction]);

  return (
    <Wrapper>
      <Menus direction={direction}>
        {menus.map((menu, i) => {
          return (
            <Menu
              key={i}
              selected={selected === i}
              onClick={() => {
                setSelected(i);
              }}
            >
              {menuToView(menu)}
            </Menu>
          );
        })}
      </Menus>
      <SelectedWrapper style={{ ...boxAnimation, ...boxSize }}>
        <Selected />
      </SelectedWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.gray100};
  overflow: hidden;
`;

const Menus = styled.div<{ direction: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
  cursor: pointer;
  z-index: 2;
`;

const Menu = styled(Row)<{ selected: boolean }>`
  flex: 0 1 auto;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  color: ${({ selected, theme }) => (selected ? theme.colors.black : theme.colors.gray500)};
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const SelectedWrapper = styled.div`
  padding: 0.25rem;
  position: absolute;
  top: 0;
  z-index: 1;
`;

const Selected = styled.div`
  width: 100%;
  height: 100%;
  backgroud-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.5rem;
`;
