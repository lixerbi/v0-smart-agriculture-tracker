"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Reply, MessageCircle, ThumbsUp, Edit2, Save, X } from "lucide-react"

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
  likes: number
}

interface Post {
  id: string
  author: string
  title: string
  content: string
  timestamp: string
  comments: Comment[]
  category: "general" | "pests" | "pricing" | "techniques" | "weather"
  likes: number
}

export default function CommunityForum() {
  const [posts, setPosts] = useState<Post[]>([])
  const [showNewPost, setShowNewPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [newPostData, setNewPostData] = useState({ title: "", content: "", category: "general" as const })
  const [newComment, setNewComment] = useState("")
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState({ title: "", content: "" })
  const [selectedCategory, setSelectedCategory] = useState<"all" | Post["category"]>("all")

  const CATEGORIES: { id: Post["category"]; label: string; color: string }[] = [
    { id: "general", label: "General Discussion", color: "bg-primary/10 text-primary" },
    { id: "pests", label: "Pest Management", color: "bg-destructive/10 text-destructive" },
    { id: "pricing", label: "Market Pricing", color: "bg-accent/10 text-accent" },
    { id: "techniques", label: "Farming Techniques", color: "bg-secondary/10 text-secondary" },
    { id: "weather", label: "Weather Discussion", color: "bg-blue-500/10 text-blue-500" },
  ]

  useEffect(() => {
    const storedPosts = localStorage.getItem("forumPosts")
    const name = localStorage.getItem("userName")
    setUserName(name || "Anonymous")

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    } else {
      setPosts([
        {
          id: "1",
          author: "Farmer Ahmed",
          title: "Best time to plant tomatoes?",
          content: "I want to plant tomatoes next month. What is the best time and any tips?",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          category: "techniques",
          comments: [
            {
              id: "c1",
              author: "Farmer Hassan",
              text: "Spring is the best season. Ensure good drainage.",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              likes: 5,
            },
          ],
          likes: 12,
        },
        {
          id: "2",
          author: "Farmer Fatima",
          title: "Dealing with crop pests",
          content: "My vegetables are being attacked by insects. What natural solutions work best?",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          category: "pests",
          comments: [],
          likes: 8,
        },
      ])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("forumPosts", JSON.stringify(posts))
  }, [posts])

  const handleCreatePost = () => {
    if (!newPostData.title || !newPostData.content) {
      alert("Please fill in all fields")
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      author: userName,
      title: newPostData.title,
      content: newPostData.content,
      timestamp: new Date().toISOString(),
      category: newPostData.category,
      comments: [],
      likes: 0,
    }

    setPosts([post, ...posts])
    setNewPostData({ title: "", content: "", category: "general" })
    setShowNewPost(false)
  }

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id)
    setEditingData({ title: post.title, content: post.content })
  }

  const handleSaveEdit = (postId: string) => {
    const updated = posts.map((post) =>
      post.id === postId ? { ...post, title: editingData.title, content: editingData.content } : post,
    )
    setPosts(updated)
    setEditingPostId(null)
  }

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return

    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now().toString(),
              author: userName,
              text: newComment,
              timestamp: new Date().toISOString(),
              likes: 0,
            },
          ],
        }
      }
      return post
    })

    setPosts(updated)
    setNewComment("")
  }

  const handleLikePost = (postId: string) => {
    const updated = posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
    setPosts(updated)
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)),
        }
      }
      return post
    })
    setPosts(updated)
  }

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId))
    setSelectedPost(null)
  }

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter((c) => c.id !== commentId),
        }
      }
      return post
    })
    setPosts(updated)
  }

  const filteredPosts = selectedCategory === "all" ? posts : posts.filter((p) => p.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted"
          }`}
        >
          All Posts ({posts.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap text-sm ${
              selectedCategory === cat.id
                ? `${cat.color} ring-2 ring-offset-2`
                : "bg-muted text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community Forum</CardTitle>
          <CardDescription>Share experiences, ask questions, and learn from other farmers</CardDescription>
        </CardHeader>
        <CardContent>
          {!showNewPost ? (
            <Button onClick={() => setShowNewPost(true)} className="w-full">
              Create New Post
            </Button>
          ) : (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  placeholder="Post title..."
                  value={newPostData.title}
                  onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newPostData.category}
                  onChange={(e) => setNewPostData({ ...newPostData, category: e.target.value as Post["category"] })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  placeholder="Write your post..."
                  value={newPostData.content}
                  onChange={(e) => setNewPostData({ ...newPostData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>Post</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">No posts in this category yet. Be the first to post!</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${CATEGORIES.find((c) => c.id === post.category)?.color}`}
                      >
                        {CATEGORIES.find((c) => c.id === post.category)?.label}
                      </span>
                    </div>
                    {editingPostId === post.id ? (
                      <Input
                        value={editingData.title}
                        onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                        className="mb-2"
                      />
                    ) : (
                      <button
                        onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        className="text-left w-full"
                      >
                        <CardTitle className="hover:text-primary cursor-pointer truncate">{post.title}</CardTitle>
                      </button>
                    )}
                    <CardDescription>
                      by {post.author} • {new Date(post.timestamp).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {editingPostId === post.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(post.id)}
                          className="p-2 hover:bg-primary/10 rounded text-primary"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="p-2 hover:bg-muted rounded text-muted-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-2 hover:bg-primary/10 rounded text-primary"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 hover:bg-destructive/10 rounded text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {editingPostId === post.id ? (
                  <textarea
                    value={editingData.content}
                    onChange={(e) => setEditingData({ ...editingData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    rows={3}
                  />
                ) : (
                  <p>{post.content}</p>
                )}

                {selectedPost !== post.id && (
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => setSelectedPost(post.id)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length}</span>
                    </button>
                  </div>
                )}

                {selectedPost === post.id && (
                  <div className="space-y-4 border-t border-border pt-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium mb-3">
                        <MessageCircle className="w-4 h-4" />
                        Comments ({post.comments.length})
                      </label>

                      {post.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-muted rounded-lg mb-3 flex justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{comment.author}</p>
                            <p className="text-sm text-muted-foreground break-words">{comment.text}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </p>
                              <button
                                onClick={() => handleLikeComment(post.id, comment.id)}
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                {comment.likes}
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2 mt-3">
                        <Input
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id)
                          }}
                        />
                        <Button size="sm" onClick={() => handleAddComment(post.id)} className="gap-2">
                          <Reply className="w-4 h-4" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
