import styled, { keyframes } from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Center = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CommonLayoutBox = styled.div`
  background-color: white;
  border: 1px solid rgba(200, 200, 200, 0.5);
  border-radius: 10px;
  box-shadow: 0 0 35px -30px;
`;
