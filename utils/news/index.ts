import {
  CommentsArr,
  CommentToEdit,
  CURRENT_COMMENT_TYPES,
  HISTORICAL_COMMENT_TYPES,
  commentType,
} from '@interface/news';

export const convertCommentArrToEdit: (comments: Array<CommentToEdit>) => Array<CommentsArr> = (
  comments: Array<CommentToEdit>,
) => {
  const commentDict = {} as { [key in commentType]: CommentToEdit[] };

  comments.forEach((comment) => {
    const { commentType } = comment;
    if (!(commentType in commentDict)) {
      commentDict[commentType] = [] as CommentToEdit[];
    }

    commentDict[commentType].push(comment);
  });

  return (Object.keys(commentDict) as commentType[]).map((type) => {
    return {
      type: type,
      data: commentDict[type],
    };
  });
};

export const convertCommentArrToPatch = (comments: Array<CommentsArr>) => {
  const result = [] as Array<CommentToEdit>;

  comments.forEach(({ type, data }) => {
    data.forEach((v, i) => {
      v.commentType = type;
      v.order = i;
      result.push(v);
    });
  });

  return result;
};

// "Alive" types first (the dropdown's expected initial cluster), then
// historical era-only types. Both sources keep their internal order so
// the editor sees current 청와대/국민의힘/더불어민주당 immediately and
// scrolls down to reach 한나라당, 민주당, 새정치민주연합, etc.
export const commentTypes: Array<commentType> = [
  ...CURRENT_COMMENT_TYPES,
  ...HISTORICAL_COMMENT_TYPES,
];

export const getCommentRest = (comments: commentType[]) => {
  return commentTypes.filter((type) => {
    return !comments.includes(type);
  });
};

export const commentTypeColor = (type: commentType) => {
  switch (type) {
    case commentType.더불어민주당:
      return 'rgb(11, 104, 179)';
    case commentType.국민의힘:
      return 'rgb(230, 30, 43)';
    // Conservative lineage variants
    case commentType.한나라당:
      return 'rgb(0, 75, 156)';
    case commentType.새누리당:
    case commentType.자유한국당:
    case commentType.미래통합당:
      return 'rgb(230, 30, 43)';
    // Progressive lineage variants
    case commentType.통합민주당:
    case commentType.민주당:
      return 'rgb(73, 170, 78)';
    case commentType.민주통합당:
    case commentType.새정치민주연합:
      return 'rgb(11, 104, 179)';
    case commentType.청와대:
    case commentType.대통령실:
      return 'rgb(0, 32, 92)';
    case commentType.입법부:
      return 'rgb(255, 153, 0)';
    case commentType.행정부:
      return 'rgb(87, 87, 87)';
    case commentType.헌법재판소:
      return 'rgb(180, 123, 98)';
    case commentType.와이보트:
      return 'rgb(121, 192, 215)';
    default:
      return 'rgb(0,0,0)';
  }
};
