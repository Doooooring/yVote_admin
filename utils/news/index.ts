import { CommentsArr, CommentToEdit, commentType } from '@interface/news';

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

export const commentTypeKey = Object.keys(commentType) as Array<commentType>;

export const getCommentRest = (comments: commentType[]) => {
  return commentTypeKey.filter((type) => {
    return !comments.includes(type);
  });
};

export const commentTypeColor = (type: commentType) => {
  switch (type) {
    case commentType.더불어민주당:
      return 'rgb(11, 104, 179)';
    case commentType.국민의힘:
      return 'rgb(230, 30, 43)';
    case commentType.대통령실:
      return 'rgb(0, 32, 92)';
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
