// src/app/admin/blog-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, PlusCircle, Edit3, Trash2 } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockBlogPosts, type BlogPost } from '@/app/(public)/blog/mockBlogPosts'; // Using existing mock data

// Zod schema for blog post form validation
const blogPostSchema = z.object({
  id: z.string().optional(), // For editing
  slug: z.string().min(3, "Slug is required (min 3 chars, e.g., my-first-post)"),
  title: z.string().min(5, "Title is required (min 5 chars)"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  author: z.string().min(3, "Author name is required"),
  excerpt: z.string().min(10, "Excerpt is required (min 10 chars)"),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }).optional().or(z.literal('')),
  imageAiHint: z.string().optional(),
  content: z.string().min(20, "Content is required (min 20 chars)"),
  categories: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)), // Comma-separated
  tags: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)), // Comma-separated
  featured: z.boolean().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function AdminBlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Initialize with mock data. In a real app, fetch from Firestore.
    setPosts(mockBlogPosts);
  }, []);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      featured: false,
      categories: [],
      tags: [],
    }
  });

  const openAddDialog = () => {
    reset({ 
      title: "", 
      slug: "", 
      date: new Date().toISOString().split('T')[0], // Default to today
      author: "Admin", // Default author
      excerpt: "", 
      imageUrl: "", 
      imageAiHint: "",
      content: "",
      categories: [],
      tags: [],
      featured: false,
    });
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    reset({
      ...post,
      categories: post.categories.join(', '), // Convert array to comma-separated string for form
      tags: post.tags.join(', '), // Convert array to comma-separated string for form
    });
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<BlogPostFormData> = (data) => {
    if (editingPost) {
      // Update post
      setPosts(posts.map(p => p.id === editingPost.id ? { ...editingPost, ...data, id: editingPost.id } : p));
      // In real app: call server action to update post in Firestore
      console.log("Updating post:", { ...editingPost, ...data, id: editingPost.id });
    } else {
      // Add new post
      const newPost = { ...data, id: `post${Date.now()}` }; // Generate mock ID
      setPosts([newPost, ...posts]);
      // In real app: call server action to add post to Firestore
      console.log("Adding new post:", newPost);
    }
    setIsDialogOpen(false);
    reset();
  };
  
  const handleDeletePost = (postId: string) => {
    // In real app, this would call a server action to delete from Firestore
    setPosts(posts.filter(p => p.id !== postId));
    console.log(`Deleting post ${postId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Blog Post Management</h1>
        <Button onClick={openAddDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add New Post</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update the details of this blog post." : "Enter the details for the new blog post."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" {...register("title")} className="col-span-3" />
              {errors.title && <p className="col-span-4 text-sm text-destructive text-right">{errors.title.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">Slug</Label>
              <Input id="slug" {...register("slug")} className="col-span-3" placeholder="e.g., my-first-post" />
              {errors.slug && <p className="col-span-4 text-sm text-destructive text-right">{errors.slug.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Input id="date" type="date" {...register("date")} className="col-span-3" />
              {errors.date && <p className="col-span-4 text-sm text-destructive text-right">{errors.date.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">Author</Label>
              <Input id="author" {...register("author")} className="col-span-3" />
              {errors.author && <p className="col-span-4 text-sm text-destructive text-right">{errors.author.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="excerpt" className="text-right pt-2">Excerpt</Label>
              <Textarea id="excerpt" {...register("excerpt")} className="col-span-3" rows={3} />
              {errors.excerpt && <p className="col-span-4 text-sm text-destructive text-right">{errors.excerpt.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">Content (Markdown/HTML)</Label>
              <Textarea id="content" {...register("content")} className="col-span-3" rows={8} />
              {errors.content && <p className="col-span-4 text-sm text-destructive text-right">{errors.content.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} className="col-span-3" placeholder="https://placehold.co/800x400.png"/>
              {errors.imageUrl && <p className="col-span-4 text-sm text-destructive text-right">{errors.imageUrl.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageAiHint" className="text-right">Image AI Hint</Label>
              <Input id="imageAiHint" {...register("imageAiHint")} className="col-span-3" placeholder="e.g., student learning french"/>
              {errors.imageAiHint && <p className="col-span-4 text-sm text-destructive text-right">{errors.imageAiHint.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categories" className="text-right">Categories</Label>
              <Input id="categories" {...register("categories")} className="col-span-3" placeholder="Comma-separated, e.g., TEF Speaking, Exam Tips" />
              {errors.categories && <p className="col-span-4 text-sm text-destructive text-right">{errors.categories.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">Tags</Label>
              <Input id="tags" {...register("tags")} className="col-span-3" placeholder="Comma-separated, e.g., TEF, French, Canada" />
              {errors.tags && <p className="col-span-4 text-sm text-destructive text-right">{errors.tags.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featured" className="text-right">Featured Post</Label>
                <div className="col-span-3 flex items-center">
                    <Input type="checkbox" id="featured" {...register("featured")} className="h-4 w-4 mr-2"/>
                    <Label htmlFor="featured" className="font-normal">Mark as featured</Label>
                </div>
                {errors.featured && <p className="col-span-4 text-sm text-destructive text-right">{errors.featured.message}</p>}
            </div>
          </form>
          <DialogFooter className="mt-auto pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" form="blogPostForm" onClick={handleSubmit(onSubmit)}>{editingPost ? "Save Changes" : "Add Post"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Author</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Categories</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                <TableCell className="hidden lg:table-cell">{new Date(post.date).toLocaleDateString()}</TableCell>
                <TableCell className="hidden md:table-cell">{post.categories.join(', ')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(post)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {posts.length === 0 && <p className="text-center text-muted-foreground py-8">No blog posts found.</p>}
    </div>
  );
}
