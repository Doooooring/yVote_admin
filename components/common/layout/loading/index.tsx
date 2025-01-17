import CommonModal from '@components/common/comonModal';
import LoadingCommon from '@components/common/loadingCommon';
import { Device, useDevice } from '@utils/hook/useDevice';

export default function LoadingIndicator({ state }: { state: boolean }) {
  const device = useDevice();

  return (
    <CommonModal state={state} backgroundColor={'rgb(255,255,255, 0.3)'}>
      <LoadingCommon
        comment={''}
        fontColor="black"
        isRow={false}
        fontSize={device === Device.pc ? '2rem' : '1.3rem'}
        iconSize={device === Device.pc ? 64 : 32}
      />
    </CommonModal>
  );
}
