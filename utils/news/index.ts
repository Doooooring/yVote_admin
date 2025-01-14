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
  console.log('==============');
  console.log(comments);

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
