// src/app/admin/blog-management/page.tsx
"use client";

import { useState, useEffect, useTransition, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, PlusCircle, Edit3, Trash2, Tags, FolderTree, RefreshCw } from "lucide-react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockBlogPosts, type BlogPost, type BlogCategory, type BlogTag } from '@/app/(public)/blog/mockBlogPosts'; // Import types
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { 
  getBlogPostsAction, 
  addBlogPostAction, 
  updateBlogPostAction, 
  deleteBlogPostAction,
  type BlogPostFormState,
  type BlogPostFormData
} from './postActions';

import {
  getCategoriesAction,
  addCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  getTagsAction,
  addTagAction,
  updateTagAction,
  deleteTagAction,
  type TaxonomyFormState,
  type CategoryFormData,
  type TagFormData
} from './taxonomyActions';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for blog post form validation (matches schema in postActions.ts)
const blogPostClientSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(3, "Slug is required (min 3 chars, e.g., my-first-post)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format (e.g., 'my-post-slug')"),
  title: z.string().min(5, "Title is required (min 5 chars)"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  author: z.string().min(3, "Author name is required"),
  excerpt: z.string().min(10, "Excerpt is required (min 10 chars)"),
  imageUrl: z
    .any()
    .optional()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  imageAiHint: z.string().optional(),
  content: z.string().min(20, "Content is required (min 20 chars)"),
  categories: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)), // Stored as array in DB, string in form
  tags: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)), // Stored as array in DB, string in form
  featured: z.boolean().optional(),
});


// Zod schema for category form validation (matches schema in taxonomyActions.ts)
const categoryClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Category name is required (min 2 chars)"),
  slug: z.string().min(2, "Slug is required (min 2 chars)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(),
});

// Zod schema for tag form validation (matches schema in taxonomyActions.ts)
const tagClientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Tag name is required (min 2 chars)"),
  slug: z.string().min(2, "Slug is required (min 2 chars)").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});


const initialPostFormState: BlogPostFormState = { message: "", isSuccess: false, errors: {} };
const initialTaxonomyFormState: TaxonomyFormState = { message: "", isSuccess: false, errors: {} };

export default function AdminBlogManagementPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // --- Posts State & Forms ---
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  const postForm = useForm<z.infer<typeof blogPostClientSchema>>({
    resolver: zodResolver(blogPostClientSchema),
    defaultValues: { featured: false, categories: "", tags: "" }
  });

  // --- Categories State & Forms ---
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);

  const categoryForm = useForm<CategoryFormData>({
    resolver: zodResolver(categoryClientSchema),
  });

  // --- Tags State & Forms ---
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);

  const tagForm = useForm<TagFormData>({
    resolver: zodResolver(tagClientSchema),
  });
  

  // --- Data Fetching Effects ---
  const fetchPosts = async () => {
    startTransition(async () => {
      const result = await getBlogPostsAction();
      if (result.isSuccess && result.data) {
        setPosts(result.data as BlogPost[]);
      } else {
        toast({ title: "Error", description: result.message || "Failed to fetch posts.", variant: "destructive" });
      }
    });
  };

  const fetchCategories = async () => {
    startTransition(async () => {
      const result = await getCategoriesAction();
      if (result.isSuccess && result.data) {
        setCategories(result.data as BlogCategory[]);
      } else {
        toast({ title: "Error", description: result.message || "Failed to fetch categories.", variant: "destructive" });
      }
    });
  };

  const fetchTags = async () => {
    startTransition(async () => {
      const result = await getTagsAction();
      if (result.isSuccess && result.data) {
        setTags(result.data as BlogTag[]);
      } else {
        toast({ title: "Error", description: result.message || "Failed to fetch tags.", variant: "destructive" });
      }
    });
  };
  
  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Post Management ---
  const openAddPostDialog = () => {
    postForm.reset({ 
      title: "", slug: "", date: new Date().toISOString().split('T')[0], 
      author: "Admin", excerpt: "", imageUrl: undefined, imageAiHint: "",
      content: "", categories: "", tags: "", featured: false,
    });
    setEditingPost(null);
    setIsPostDialogOpen(true);
  };

  const openEditPostDialog = (post: BlogPost) => {
    setEditingPost(post);
    postForm.reset({
      ...post,
      imageUrl: undefined, // Don't try to pre-fill a file input
      categories: Array.isArray(post.categories) ? post.categories.join(', ') : '', // Ensure it's a string for the form
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '', // Ensure it's a string for the form
    });
    setIsPostDialogOpen(true);
  };

  const handlePostFormSubmit: SubmitHandler<z.infer<typeof blogPostClientSchema>> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'imageUrl' && value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
        } else if (value !== undefined && value !== null && key !== 'imageUrl') {
            formData.append(key, String(value));
        }
    });

    if (editingPost?.id) {
        formData.append('id', editingPost.id);
    }
    
    startTransition(async () => {
        const actionToCall = editingPost ? updateBlogPostAction : addBlogPostAction;
        const result = await actionToCall(initialPostFormState, formData);
        if (result.isSuccess) {
            toast({ title: "Success", description: result.message });
            setIsPostDialogOpen(false);
            fetchPosts();
        } else {
            toast({ title: "Error", description: result.message || "Failed to save post.", variant: "destructive" });
        }
    });
  };
  
  const handleDeletePost = (postId: string) => {
    startTransition(async () => {
      const result = await deleteBlogPostAction(postId);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        fetchPosts();
      } else {
        toast({ title: "Error", description: result.message || "Failed to delete post.", variant: "destructive" });
      }
    });
  };

  // --- Category Management ---
  const openAddCategoryDialog = () => {
    categoryForm.reset({ name: "", slug: "", description: "" });
    setEditingCategory(null);
    setIsCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: BlogCategory) => {
    setEditingCategory(category);
    categoryForm.reset(category);
    setIsCategoryDialogOpen(true);
  };

  const handleCategoryFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
     if (editingCategory && editingCategory.id) {
        formData.append('id', editingCategory.id);
    }
    
    categoryForm.handleSubmit(async (data) => {
      startTransition(async () => {
        const actionToCall = editingCategory ? updateCategoryAction : addCategoryAction;
        const result = await actionToCall(initialTaxonomyFormState, formData);
        if (result.isSuccess) {
          toast({ title: "Success", description: result.message });
          setIsCategoryDialogOpen(false);
          fetchCategories();
        } else {
          toast({ title: "Error", description: result.message || "Failed to save category.", variant: "destructive" });
        }
      });
    })(event);
  };

  const handleDeleteCategory = (categoryId: string) => {
    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        fetchCategories();
      } else {
        toast({ title: "Error", description: result.message || "Failed to delete category.", variant: "destructive" });
      }
    });
  };

  // --- Tag Management ---
  const openAddTagDialog = () => {
    tagForm.reset({ name: "", slug: "" });
    setEditingTag(null);
    setIsTagDialogOpen(true);
  };

  const openEditTagDialog = (tag: BlogTag) => {
    setEditingTag(tag);
    tagForm.reset(tag);
    setIsTagDialogOpen(true);
  };

 const handleTagFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editingTag && editingTag.id) {
        formData.append('id', editingTag.id);
    }

    tagForm.handleSubmit(async (data) => {
        startTransition(async () => {
            const actionToCall = editingTag ? updateTagAction : addTagAction;
            const result = await actionToCall(initialTaxonomyFormState, formData);
            if (result.isSuccess) {
                toast({ title: "Success", description: result.message });
                setIsTagDialogOpen(false);
                fetchTags();
            } else {
                toast({ title: "Error", description: result.message || "Failed to save tag.", variant: "destructive" });
            }
        });
    })(event);
 };


  const handleDeleteTag = (tagId: string) => {
     startTransition(async () => {
      const result = await deleteTagAction(tagId);
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message });
        fetchTags();
      } else {
        toast({ title: "Error", description: result.message || "Failed to delete tag.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Blog Content Management</h1>

      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-3 md:max-w-md">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        {/* Posts Tab Content */}
        <TabsContent value="posts" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Posts</h2>
            <div>
              <Button onClick={fetchPosts} variant="outline" size="icon" className="mr-2" aria-label="Refresh Posts" disabled={isPending}>
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={openAddPostDialog} disabled={isPending}><PlusCircle className="mr-2 h-4 w-4" /> Add New Post</Button>
            </div>
          </div>
          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogContent className="sm:max-w-[725px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
                <DialogDescription>
                  {editingPost ? "Update the details of this blog post." : "Enter the details for the new blog post."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={postForm.handleSubmit(handlePostFormSubmit)} id="blogPostForm" className="grid gap-4 py-4 flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" {...postForm.register("title")} className="col-span-3" />
                  {postForm.formState.errors.title && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.title.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">Slug</Label>
                  <Input id="slug" {...postForm.register("slug")} className="col-span-3" placeholder="e.g., my-first-post" />
                  {postForm.formState.errors.slug && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.slug.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input id="date" type="date" {...postForm.register("date")} className="col-span-3" />
                  {postForm.formState.errors.date && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.date.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">Author</Label>
                  <Input id="author" {...postForm.register("author")} className="col-span-3" />
                  {postForm.formState.errors.author && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.author.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="excerpt" className="text-right pt-2">Excerpt</Label>
                  <Textarea id="excerpt" {...postForm.register("excerpt")} className="col-span-3" rows={3} />
                  {postForm.formState.errors.excerpt && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.excerpt.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right pt-2">Content (Markdown/HTML)</Label>
                  <Textarea id="content" {...postForm.register("content")} className="col-span-3" rows={8} />
                  {postForm.formState.errors.content && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.content.message}</p>}
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">Featured Image</Label>
                  <Input id="imageUrl" type="file" {...postForm.register("imageUrl")} className="col-span-3 file:text-foreground" />
                  {postForm.formState.errors.imageUrl && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.imageUrl.message as string}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageAiHint" className="text-right">Image AI Hint</Label>
                  <Input id="imageAiHint" {...postForm.register("imageAiHint")} className="col-span-3" placeholder="e.g., student learning french"/>
                  {postForm.formState.errors.imageAiHint && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.imageAiHint.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categories_post" className="text-right">Categories</Label>
                  <Input id="categories_post" {...postForm.register("categories")} className="col-span-3" placeholder="Comma-separated, e.g., TEF Speaking, Exam Tips" />
                  {postForm.formState.errors.categories && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.categories.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags_post" className="text-right">Tags</Label>
                  <Input id="tags_post" {...postForm.register("tags")} className="col-span-3" placeholder="Comma-separated, e.g., TEF, French, Canada" />
                  {postForm.formState.errors.tags && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.tags.message}</p>}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="featured" className="text-right">Featured Post</Label>
                    <Controller
                        name="featured"
                        control={postForm.control}
                        render={({ field }) => (
                            <div className="col-span-3 flex items-center">
                                <Checkbox
                                    id="featured" 
                                    checked={field.value || false} 
                                    onCheckedChange={field.onChange}
                                    className="h-4 w-4 mr-2"
                                />
                                <Label htmlFor="featured" className="font-normal">Mark as featured</Label>
                            </div>
                        )}
                    />
                    {postForm.formState.errors.featured && <p className="col-span-4 text-sm text-destructive text-right">{postForm.formState.errors.featured.message}</p>}
                </div>
              </form>
              <DialogFooter className="mt-auto pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsPostDialogOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" form="blogPostForm" disabled={isPending}>{isPending ? "Saving..." : (editingPost ? "Save Changes" : "Add Post")}</Button>
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
                    <TableCell className="hidden md:table-cell">{Array.isArray(post.categories) ? post.categories.join(', ') : ''}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditPostDialog(post)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeletePost(post.id!)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
          {posts.length === 0 && <p className="text-center text-muted-foreground py-8">No blog posts found. {isPending && "Loading..."}</p>}
        </TabsContent>

        {/* Categories Tab Content */}
        <TabsContent value="categories" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Categories</h2>
            <div>
              <Button onClick={fetchCategories} variant="outline" size="icon" className="mr-2" aria-label="Refresh Categories" disabled={isPending}>
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={openAddCategoryDialog} disabled={isPending}><FolderTree className="mr-2 h-4 w-4" /> Add New Category</Button>
            </div>
          </div>
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCategoryFormSubmit} id="categoryForm" className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoryName">Name</Label>
                  <Input id="categoryName" {...categoryForm.register("name")} />
                  {categoryForm.formState.errors.name && <p className="text-sm text-destructive">{categoryForm.formState.errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categorySlug">Slug</Label>
                  <Input id="categorySlug" {...categoryForm.register("slug")} placeholder="e.g., exam-tips" />
                  {categoryForm.formState.errors.slug && <p className="text-sm text-destructive">{categoryForm.formState.errors.slug.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="categoryDescription">Description (Optional)</Label>
                  <Textarea id="categoryDescription" {...categoryForm.register("description")} rows={3} />
                </div>
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" form="categoryForm" disabled={isPending}>{isPending ? "Saving..." : (editingCategory ? "Save Changes" : "Add Category")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="hidden md:table-cell">{category.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditCategoryDialog(category)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
          {categories.length === 0 && <p className="text-center text-muted-foreground py-8">No categories found. {isPending && "Loading..."}</p>}
        </TabsContent>

        {/* Tags Tab Content */}
        <TabsContent value="tags" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Manage Tags</h2>
             <div>
              <Button onClick={fetchTags} variant="outline" size="icon" className="mr-2" aria-label="Refresh Tags" disabled={isPending}>
                <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={openAddTagDialog} disabled={isPending}><Tags className="mr-2 h-4 w-4" /> Add New Tag</Button>
            </div>
          </div>
          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTagFormSubmit} id="tagForm" className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="tagName">Name</Label>
                  <Input id="tagName" {...tagForm.register("name")} />
                  {tagForm.formState.errors.name && <p className="text-sm text-destructive">{tagForm.formState.errors.name.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tagSlug">Slug</Label>
                  <Input id="tagSlug" {...tagForm.register("slug")} placeholder="e.g., tef-canada" />
                  {tagForm.formState.errors.slug && <p className="text-sm text-destructive">{tagForm.formState.errors.slug.message}</p>}
                </div>
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsTagDialogOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" form="tagForm" disabled={isPending}>{isPending ? "Saving..." : (editingTag ? "Save Changes" : "Add Tag")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell>{tag.slug}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isPending}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditTagDialog(tag)}><Edit3 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
          {tags.length === 0 && <p className="text-center text-muted-foreground py-8">No tags found. {isPending && "Loading..."}</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
