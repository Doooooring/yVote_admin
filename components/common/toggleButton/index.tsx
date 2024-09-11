import styled, { CSSProperties, keyframes } from 'styled-components';

interface ToggleButtonProps {
  style?: CSSProperties;
  circleStyle?: CSSProperties;
  state: boolean;
  setState: (b: boolean) => void;
  activeColor: string;
  unactiveColor: string;
  activeCircleColor: string;
  unactiveCircleColor: string;
}

export default function ToggleButton({
  style = {},
  circleStyle = {},
  state,
  setState,
  activeColor,
  unactiveColor,
  activeCircleColor,
  unactiveCircleColor,
}: ToggleButtonProps) {
  return (
    <Wrapper
      style={{ ...style, backgroundColor: state ? activeColor : unactiveColor }}
      $state={state}
      onClick={() => {
        setState(!state);
      }}
    >
      <CircleWrapper>
        <Circle
          $state={state}
          style={{
            ...circleStyle,
            backgroundColor: state ? activeCircleColor : unactiveCircleColor,
          }}
        />
      </CircleWrapper>
    </Wrapper>
  );
}

interface WrapperProps {
  $state: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  border-radius: 9999px;
`;

const CircleWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

interface CircleProps {
  $state: boolean;
}
const Circle = styled.div<CircleProps>`
  border-radius: 9999px;
  transition-property: all;
  transition-duration: 0.5s;
  position: absolute;
  top: 50%;
  left: ${({ $state }) => ($state ? '0' : '100%')};
  transform: ${({ $state }) => ($state ? 'translate(0, -50%)' : 'translate(-100%, -50%)')};
`;
