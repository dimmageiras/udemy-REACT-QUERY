import { useQuery } from "@tanstack/react-query";
import { ApiService } from "./api";
import "./PostDetail.css";

const PostDetail = ({ deletePostMutation, post, updatePostMutation }) => {
  const { fetchComments } = ApiService;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
  });

  if (isLoading) return <h3>Fetching in progress...</h3>;

  if (isError)
    return (
      <>
        <h3>Error fetching comments</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deletePostMutation.mutate(post.id)}>
          Delete
        </button>
        {deletePostMutation.isPending ? (
          <p className="loading">Deleting the post</p>
        ) : null}
        {deletePostMutation.isError ? (
          <p className="error">
            Error deleting the post: {deletePostMutation.error.toString()}
          </p>
        ) : null}
        {deletePostMutation.isSuccess ? (
          <p className="success">Post was (not) deleted</p>
        ) : null}
      </div>
      <div>
        <button onClick={() => updatePostMutation.mutate(post.id)}>
          Update title
        </button>
        {updatePostMutation.isPending ? (
          <p className="loading">Updating the post</p>
        ) : null}
        {updatePostMutation.isError ? (
          <p className="error">
            Error updating the post: {updatePostMutation.error.toString()}
          </p>
        ) : null}
        {updatePostMutation.isSuccess ? (
          <p className="success">Title was (not) updated</p>
        ) : null}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
};

export default PostDetail;
