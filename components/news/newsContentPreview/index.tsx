import { htmlFromString } from '@utils/tools';
import styled from 'styled-components';
import icoNew from '@images/ico_new_2x.png';
import Image from 'next/image';

interface NewsContentPreviewProps {
  title: string;
  content: string;
  keywords: string[];
  state: boolean;
}

export default function NewsContentPreview({
  title,
  content,
  keywords,
  state,
}: NewsContentPreviewProps) {
  return (
    <Wrapper>
      <div className="contents-body">
        <div className="right">
          <div className="summary">
            <div className="main-image-wrapper">
              <div className="image-box">뉴스 이미지</div>
            </div>
            <h2 className="head">
              <span>{title}</span>
              {state ? <Image src={icoNew} alt="new" height="16" /> : <div></div>}
            </h2>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
          <div className="keyword-wrapper">
            {keywords?.map((keyword) => {
              return (
                <p className="keyword" key={keyword}>
                  {`# ${keyword}`}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  min-height: 800px;
  background-color: white;
  border: 1px solid rgba(200, 200, 200, 0.5);
  border-radius: 5px;
  box-shadow: 0 0 35px -30px;
  padding: 1rem;
  padding-right: 2.5em;
  margin: 0 auto;
  .main-image-wrapper {
    width: 100px;
    height: 100px;
    margin-top: 1px;
    margin-right: 12px;
    margin-bottom: 0px;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 10px;
    overflow: hidden;
    float: left;
  }
  .right {
    .head {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      margin: 0.2em 0 1.7em 0;
      line-height: 1.6em;
      span {
        color: rgb(6, 6, 6);
        min-height: 20.25px;
        max-height: 48px;
        img {
          margin: 0.1em 0 -0.1em 0;
        }
      }
      span:hover {
        cursor: pointer;
      }
    }

    .summary {
      display: inline-block;
      font-size: 14px;
      line-height: 2;
      color: rgb(10, 10, 10);
      font-weight: 450;
      word-break: break-all;
      & {
        p {
          margin: 0 0 1em 0.5em;
          min-height: 10px;
          font-family: Helvetica, sans-serif;
        }
      }
    }

    .keyword-wrapper {
      line-height: 1;
      .keyword {
        display: inline-block;
        text-decoration: none;
        font-size: 11px;
        font-weight: 500;
        color: rgb(120, 120, 120);
        margin: 0;
        margin-left: 3px;
        margin-right: 6px;
        margin-bottom: 6px;
        padding: 0.25rem 0.25rem;
        background-color: #f1f2f5;
        border-radius: 2px;
        cursor: pointer;
      }
    }
  }

  .keyword-wrapper {
    line-height: 1;
    .keyword {
      display: inline-block;
      text-decoration: none;
      font-size: 11px;
      font-weight: 500;
      color: rgb(120, 120, 120);
      margin: 0;
      margin-left: 3px;
      margin-right: 6px;
      margin-bottom: 6px;
      padding: 0.25rem 0.25rem;
      background-color: #f1f2f5;
      border-radius: 2px;
      cursor: pointer;
    }
  }
  @media screen and (max-width: 768px) {
    padding-right: 1.5rem;
  }
`;
