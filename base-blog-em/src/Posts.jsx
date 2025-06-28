import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApiService } from "./api";
import PostDetail from "./PostDetail";

const { deletePost, fetchPosts, updatePost } = ApiService;
const maxPostPage = 10;

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });
  const updatePostMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchPosts(currentPage),
    queryKey: ["posts", currentPage],
    staleTime: 2000,
  });

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;

      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient]);

  if (isLoading) return <h3>Fetching in progress...</h3>;

  if (isError)
    return (
      <>
        <h3>Error fetching posts</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            className="post-title"
            key={post.id}
            onClick={() => {
              deletePostMutation.reset();
              updatePostMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((previousPage) => previousPage - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage((previousPage) => previousPage + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost ? (
        <PostDetail
          deletePostMutation={deletePostMutation}
          post={selectedPost}
          updatePostMutation={updatePostMutation}
        />
      ) : null}
    </>
  );
};

export default Posts;
