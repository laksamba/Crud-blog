

interface CommentType {
  author: {
    username: string; // Adjust according to the actual structure
  };

  createdAt: string;
  content: string;
}

const Comment = ({ comment }: { comment: CommentType }) => {
  console.log('comment username',comment); 
  const date = new Date(comment.createdAt).toDateString();
  
  return (
    <div className="bg-slate-500/5 text-gray-500 text-[14px] font-[500] mb-2 px-2 rounded-full shadow-md">
      <div className="flexBetween gap-x-4">
        <div className="text-[15px] font-[600] text-gray-700 ">@{comment.author.username}</div>
        <div className="text-[12px] font-[500]">{date}</div>
      </div>
      <p className="text-[14px] font-[500]">{comment.content}</p>
    </div>
  );
};

export default Comment;
