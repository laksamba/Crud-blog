
import Comment from './Comment';

interface CommentType {
  _id: string;
  author: {
    username: string; // Adjust according to the actual structure
  };
  createdAt: string;
  content: string;
}

const CommentList = ({ comments }: { comments: CommentType[] }) => {
  return (
    <div>
      {comments.length === 0 ? (
        <p className='font-[500]'>No comments posted yet.</p>
      ) : (
        comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))
      )}
    </div>
  );
};

export default CommentList;
