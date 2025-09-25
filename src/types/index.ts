import { IUser } from "@/models/User"

export interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  category: string
  tags: string[]
  views: number
  readTime: number
  publishedAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  author: {
    _id: string
    name: string
    image?: string
  } | null
  likes: string[]
  _count?: {
    comments: number
    likes: number
  }
  isLiked?: boolean
  isSaved?: boolean
}

export interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    image?: string
  }
  blog: string
  parentComment?: string
  replies: Comment[]
  likes: string[]
  createdAt: string
  updatedAt: string
  isLiked?: boolean
}

import { Types } from 'mongoose';

export interface UserProfile extends Omit<IUser, 'password' | 'savedPosts' | 'following' | 'followers'> {
  _id: string
  name: string
  email: string
  image?: string
  bio?: string
  role: 'admin' | 'user'
  savedPosts: string[] | Types.ObjectId[]
  following: string[] | Types.ObjectId[]
  followers: string[] | Types.ObjectId[]
  _count?: {
    posts: number
    followers: number
    following: number
  }
}

export type Theme = 'light' | 'dark' | 'system'
