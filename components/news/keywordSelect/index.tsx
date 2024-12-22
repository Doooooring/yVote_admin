import ArrSelect from '@components/common/arrSelect';
import { KeywordTitle } from '@interface/keywords';
import { useKeywordStore } from '@store/keyword';
import { useCallback } from 'react';

interface KeywordSelectProps {
  curKeywordList: Array<KeywordTitle>;
  setCurKeywordList: (arr: Array<KeywordTitle>) => void;
}

export default function KeywordSelect({ curKeywordList, setCurKeywordList }: KeywordSelectProps) {
  const keywordTitleList = useKeywordStore((state) => state.keywordTitleList);

  const compare = useCallback((a: KeywordTitle, b: KeywordTitle) => {
    if (a.id < b.id) return -1;
    if (a.id == b.id) return 0;
    return 1;
  }, []);

  return (
    <ArrSelect
      keyToView={'keyword'}
      curArrSrc={curKeywordList}
      totalArrSrc={keywordTitleList}
      setCurArrSrc={setCurKeywordList}
      compare={compare}
    />
  );
}

// import styled from 'styled-components';

// import Modal from '@components/common/modal';

// import { useEffect, useState } from 'react';

// import { useCommonStore } from '@store/common';

// import { SubmitButton } from '@components/common/button';
// import Loader from '@components/common/loader';
// import { TfiLoop } from 'react-icons/tfi';

// import { Keyword } from '@interface/keywords';
// import { useKeywordStore } from '@store/keyword';
// import { sortKorCallback } from '@utils/tools';

// interface KeywordTitle extends Partial<Pick<Keyword, '_id' | 'keyword'>> {}

// interface keywordSelectProps {
//   curKeywordList: Array<string>;
//   setCurKeywordList: (curList: Array<string>) => void;
// }

// export default function KeywordSelect({ curKeywordList, setCurKeywordList }: keywordSelectProps) {
//   const [keywordRest, setkeywordRest] = useState<Array<KeywordTitle>>([]);
//   const [keywordContain, setkeywordContain] = useState<Array<KeywordTitle>>([]);

//   const [restSelected, setRestSelected] = useState<Array<KeywordTitle>>([]);
//   const [containSelected, setContainSelected] = useState<Array<KeywordTitle>>([]);

//   const KeywordTitleList = useKeywordStore((store) => store.keywordTitleList);
//   const setIsSelectorModalUp = useCommonStore((store) => store.setIsSelectorModalUp);

//   const isLoading = useCommonStore((store) => store.isLoading);
//   const setIsLoading = useCommonStore((store) => store.setIsLoading);

//   useEffect(() => {
//     const curRest: Array<KeywordTitle> = [];
//     const curContain: Array<KeywordTitle> = [];
//     KeywordTitleList.forEach((keyword) => {
//       if (curKeywordList.includes(keyword.keyword!)) {
//         curContain.push(keyword);
//       } else {
//         curRest.push(keyword);
//       }
//     });
//     setkeywordRest(curRest);
//     setkeywordContain(curContain);
//   }, [KeywordTitleList, curKeywordList]);

//   function clickRest(keyword: KeywordTitle) {
//     if (restSelected.includes(keyword)) {
//       setRestSelected(
//         restSelected.filter((rest) => {
//           return rest.keyword != keyword.keyword;
//         }),
//       );
//       return;
//     }
//     setRestSelected([...restSelected, keyword]);
//   }

//   function clickContain(keyword: KeywordTitle) {
//     if (containSelected.includes(keyword)) {
//       setContainSelected(
//         containSelected.filter((contain) => {
//           return contain.keyword != keyword.keyword;
//         }),
//       );
//       return;
//     }
//     setContainSelected([...containSelected, keyword]);
//   }

//   function reBuild() {
//     if (isLoading) {
//       return;
//     }
//     setIsLoading(true);
//     const newRest: Array<KeywordTitle> = [];
//     const newContain: Array<KeywordTitle> = [];
//     KeywordTitleList.map((keyword) => {
//       if (keywordRest.includes(keyword)) {
//         if (restSelected.includes(keyword)) {
//           newContain.push(keyword);
//         } else {
//           newRest.push(keyword);
//         }
//       } else {
//         if (containSelected.includes(keyword)) {
//           newRest.push(keyword);
//         } else {
//           newContain.push(keyword);
//         }
//       }
//     });
//     setkeywordRest(newRest);
//     setkeywordContain(newContain);
//     setContainSelected([]);
//     setRestSelected([]);
//     setIsLoading(false);
//   }

//   return (
//     <Modal>
//       <Wrapper>
//         <KeywordWrapper>
//           <KeywordGrid>
//             <h3>전체 리스트</h3>
//             <KeywordUl>
//               {keywordRest
//                 .sort((a, b) => sortKorCallback(a.keyword!, b.keyword!))
//                 .map((keyword) => {
//                   return (
//                     <KeywordLi
//                       key={keyword._id}
//                       onClick={() => {
//                         clickRest(keyword);
//                       }}
//                       state={restSelected.includes(keyword)}
//                     >
//                       {keyword.keyword}
//                     </KeywordLi>
//                   );
//                 })}
//             </KeywordUl>
//           </KeywordGrid>
//           <ButtonWrapper
//             onClick={() => {
//               reBuild();
//             }}
//           >
//             <TfiLoop className="reload" />
//           </ButtonWrapper>
//           <KeywordGrid>
//             <h3>선택 리스트</h3>
//             <KeywordUl>
//               {keywordContain
//                 .sort((a, b) => sortKorCallback(a.keyword!, b.keyword!))
//                 .map((keyword) => {
//                   return (
//                     <KeywordLi
//                       key={keyword._id}
//                       onClick={() => {
//                         clickContain(keyword);
//                       }}
//                       state={containSelected.includes(keyword)}
//                     >
//                       {keyword.keyword}
//                     </KeywordLi>
//                   );
//                 })}
//             </KeywordUl>
//             <Loader />
//           </KeywordGrid>
//         </KeywordWrapper>
//         <SubmitWrapper>
//           <SubmitButton
//             title={'선택 완료'}
//             click={() => {
//               setIsSelectorModalUp(false);
//               setCurKeywordList(keywordContain.map((keyword) => keyword.keyword!));
//             }}
//           ></SubmitButton>
//         </SubmitWrapper>
//       </Wrapper>
//     </Modal>
//   );
// }

// const Wrapper = styled.div`
//   width: 800px;
//   background-color: white;
//   border: 1px solid #ced4da;
//   border-radius: 1rem;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding-top: 50px;
//   padding-bottom: 50px;
// `;

// const KeywordWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   gap: 10px;

//   width: 100%;

//   padding: 0 1rem;
// `;

// const KeywordGrid = styled.div`
//   width: 100%;
//   border: 1px solid #ced4da;
//   border-radius: 0.25rem;
//   padding: 0.375rem 0.75rem;
// `;

// const KeywordUl = styled.ul`
//   width: 100%;
//   height: 400px;
//   overflow-y: scroll;
//   list-style-type: none;
//   border: 1px solid #ced4da;
//   border-radius: 0.25rem;
//   padding: 0.375rem 0.75rem;
// `;

// interface keywordLiProps {
//   state: boolean;
// }

// const KeywordLi = styled.li<keywordLiProps>`
//   background-color: ${({ state }) => (state ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)')};
//   border: 1px solid #ced4da;
//   border-radius: 0.25rem;
//   &:hover {
//     cursor: pointer;
//   }
//   padding: 0.375rem 0.75rem;
//   margin-bottom: 10px;
// `;

// const ButtonWrapper = styled.div`
//   display: inline-block;
//   padding-top: 30px;
//   padding-bottom: 20px;
//   & > svg {
//     width: 30px;
//     height: 30px;
//   }
//   &:hover {
//     cursor: pointer;
//   }
// `;

// const SubmitWrapper = styled.div`
//   padding-top: 30px;
// `;
