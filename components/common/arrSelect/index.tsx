import styled from 'styled-components';

import Modal from '@components/common/modal';

import { useEffect, useState } from 'react';

import { useCommonStore } from '@store/common';

import { PrimaryButton } from '@components/common/button';
import Loader from '@components/common/loader';
import { TfiLoop } from 'react-icons/tfi';
import { isArrIncludeSrc } from './arrSelect.tools';
interface ArrSelectProps<T> {
  keyToView: keyof T;
  curArrSrc: Array<T>;
  totalArrSrc: Array<T>;
  setCurArrSrc: (curList: Array<T>) => void;
  compare: (a: T, b: T) => -1 | 0 | 1;
}

export default function ArrSelect<T>({
  keyToView,
  curArrSrc,
  totalArrSrc,
  compare,
  setCurArrSrc,
}: ArrSelectProps<T>) {
  const [arrRest, setArrRest] = useState<Array<T>>([]);
  const [arrContain, setArrContain] = useState<Array<T>>([]);

  const [restSelected, setRestSelected] = useState<Array<T>>([]);
  const [containSelected, setContainSelected] = useState<Array<T>>([]);

  const setIsSelectorModalUp = useCommonStore((store) => store.setIsSelectorModalUp);

  useEffect(() => {
    const curRest: Array<T> = [];
    const curContain: Array<T> = [];

    totalArrSrc.forEach((s) => {
      const isInclude = isArrIncludeSrc(curArrSrc, s, compare);
      if (isInclude) {
        curContain.push(s);
      } else {
        curRest.push(s);
      }
    });

    setArrRest(curRest);
    setArrContain(curContain);
  }, [totalArrSrc, curArrSrc]);

  function clickRest(s: T) {
    if (isArrIncludeSrc(restSelected, s, compare)) {
      setRestSelected(
        restSelected.filter((rest) => {
          return compare(rest, s) !== 0;
        }),
      );
      return;
    }
    setRestSelected([...restSelected, s]);
  }

  function clickContain(s: T) {
    if (isArrIncludeSrc(containSelected, s, compare)) {
      setContainSelected(
        containSelected.filter((contain) => {
          return compare(contain, s) !== 0;
        }),
      );
      return;
    }
    setContainSelected([...containSelected, s]);
  }

  function reBuild() {
    const newRest: Array<T> = [];
    const newContain: Array<T> = [];
    totalArrSrc.map((s) => {
      if (isArrIncludeSrc(arrRest, s, compare)) {
        if (isArrIncludeSrc(restSelected, s, compare)) {
          newContain.push(s);
        } else {
          newRest.push(s);
        }
      } else {
        if (isArrIncludeSrc(containSelected, s, compare)) {
          newRest.push(s);
        } else {
          newContain.push(s);
        }
      }
    });
    setArrRest(newRest);
    setArrContain(newContain);
    setContainSelected([]);
    setRestSelected([]);
  }

  return (
    <Modal>
      <Wrapper>
        <SourceWrapper>
          <SourceGrid>
            <h3>전체 리스트</h3>
            <SourceUl>
              {arrRest
                .sort((a, b) => compare(a, b))
                .map((s, idx) => {
                  const value = s[keyToView] as string;

                  return (
                    <SourceLi
                      key={value}
                      onClick={() => {
                        clickRest(s);
                      }}
                      state={isArrIncludeSrc(restSelected, s, compare)}
                    >
                      {value}
                    </SourceLi>
                  );
                })}
            </SourceUl>
          </SourceGrid>
          <ButtonWrapper
            onClick={() => {
              reBuild();
            }}
          >
            <TfiLoop className="reload" />
          </ButtonWrapper>
          <SourceGrid>
            <h3>선택 리스트</h3>
            <SourceUl>
              {arrContain
                .sort((a, b) => compare(a, b))
                .map((s) => {
                  const value = s[keyToView] as string;
                  return (
                    <SourceLi
                      key={value}
                      onClick={() => {
                        clickContain(s);
                      }}
                      state={isArrIncludeSrc(containSelected, s, compare)}
                    >
                      {value}
                    </SourceLi>
                  );
                })}
            </SourceUl>
            <Loader />
          </SourceGrid>
        </SourceWrapper>
        <SubmitWrapper>
          <PrimaryButton
            title={'선택 완료'}
            click={() => {
              setIsSelectorModalUp(false);
              setCurArrSrc(arrContain);
            }}
          ></PrimaryButton>
        </SubmitWrapper>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  width: 800px;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;
`;

const SourceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  width: 100%;

  padding: 0 1rem;
`;

const SourceGrid = styled.div`
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
`;

const SourceUl = styled.ul`
  width: 100%;
  height: 400px;
  overflow-y: scroll;
  list-style-type: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
`;

interface SourceLiProps {
  state: boolean;
}

const SourceLi = styled.li<SourceLiProps>`
  background-color: ${({ state }) => (state ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)')};
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  &:hover {
    cursor: pointer;
  }
  padding: 0.375rem 0.75rem;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  padding-top: 30px;
  padding-bottom: 20px;
  & > svg {
    width: 30px;
    height: 30px;
  }
  &:hover {
    cursor: pointer;
  }
`;

const SubmitWrapper = styled.div`
  padding-top: 30px;
`;
