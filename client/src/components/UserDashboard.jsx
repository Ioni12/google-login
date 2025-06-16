import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user's posts from MongoDB
  const fetchPosts = async () => {
    if (!window.authToken) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          headers: {
            Authorization: `Bearer ${window.authToken}`,
          },
        }
      );
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Create new post
  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !window.authToken) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.authToken}`,
          },
          body: JSON.stringify({ content: newPost }),
        }
      );

      if (response.ok) {
        setNewPost("");
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* User Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-14 h-14 rounded-full ring-2 ring-blue-50 object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.displayName}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={createPost} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            rows="3"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !newPost.trim()}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Posts</h3>
        {posts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              No posts yet. Create your first post!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-gray-800 mb-3 leading-relaxed">
                  {post.content}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
