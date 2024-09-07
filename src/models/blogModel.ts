import mongoose from "mongoose";

export enum BlogPostTag {
  History = "history",
  Biology = "biology",
  Physics = "physics",
  Math = "math",
}

export interface IBlogPost {
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
    funny: number;
  };
  views: number;
  author: mongoose.Types.ObjectId;
}

const blogPostSchema = new mongoose.Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: { type: [String], enum: Object.keys(BlogPostTag), default: [] },
    views: { type: Number, default: 0 },
    reactions: {
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      funny: { type: Number, default: 0 },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    methods: {},
  }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
