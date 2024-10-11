import styled from 'styled-components';
import yvImg from '@images/logo_image.png';
import Image from 'next/image';
interface ExplainPreviewProp {
  keyword: string;
  explain: string;
}

export default function ExplainPreview({ explain, keyword }: ExplainPreviewProp) {
  return (
    <ExplanationWrapper>
      <div className="explanation-header">
        <h1>{keyword}</h1>
      </div>
      <div className="body-wrapper">
        <div className="explanation-list">
          <div className="keyword-img">
            <Image src={yvImg} alt="ss" fill />
          </div>
          <div className="explanation" dangerouslySetInnerHTML={{ __html: explain }} />
        </div>
      </div>
    </ExplanationWrapper>
  );
}

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  background-color: white;
  border: 1px solid rgba(200, 200, 200, 0.5);
  border-radius: 5px;
  box-shadow: 0 0 35px -30px;
  margin-top : 10px;
  padding: 1.8rem 2rem 1rem;
  position: relative;
  box-sizing: border-box;
  @media screen and (max-width: 768px) {
    padding: 2rem;
  }
  
  .explanation-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;

    h1 {
      font-size: 100%;
      font-family: Helvetica, sans-serif;
      vertical-align: baseline;
      margin: 0;
      padding: 0;
      font-weight: bold;
      unicode-bidi: isolate;
      text-size-adjust: none;
      color: rgb(102, 102, 102);
    }
    & {
      img {
        flex: 0 0 auto;
        object-fit: contain;
      }
    }
  }
  .body-wrapper {
    .explanation-list {
      padding-left: 0.25rem;

      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
      .keyword-img {
        float: right;
        margin-left: 16px;
        width: 140px;
        height: 140px;
        position: relative;
        @media screen and (max-width: 768px) {
          width: 90px;
          height: 90px;
        }
      }
    }
    .explanation {
      text-align: left;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 2;
      color: black;
      font-weight: 500;
      word-break: keep-all;
      min-height: 10px;
      font-family: Helvetica, sans-serif;
      }
    }
  }
`;
