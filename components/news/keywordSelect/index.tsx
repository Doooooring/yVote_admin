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
