import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const hero = query(async () => {
  // In a real app, you might fetch from a table or storage.
  // For now, return a stable public image path so the client fetches via Convex.
  return {
    url: "/IMG_1310.png",
    alt: "Isaac and Lily",
  } as const;
});

export const getBackgroundImage = query(async (ctx) => {
  // Get the URL for the line art background image
  const fileId = "kg2ezcvfdt57bnndhrrk0e192h7phf16" as any;
  try {
    const url = await ctx.storage.getUrl(fileId);
    return { url };
  } catch (error) {
    console.error("Failed to get background image URL:", error);
    return { url: null };
  }
});

export const addPhoto = mutation({
  args: {
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    album: v.string(),
    fileId: v.id("_storage"),
    orderIndex: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const uploadedAt = Date.now();
    
    await ctx.db.insert("photos", {
      ...args,
      uploadedAt,
    });
  },
});

export const getPhotosByCategory = query({
  args: { 
    album: v.optional(v.string()),
  },
  handler: async (ctx, { album }) => {
    let query = ctx.db.query("photos");
    
    // Only show public photos
    query = query.filter((q) => q.eq(q.field("isPublic"), true));
    
    if (album) {
      query = query.filter((q) => q.eq(q.field("album"), album));
    }
    
    const photos = await query
      .order("desc")
      .collect();

    // Add the image URLs to all photos
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.fileId),
      }))
    );

    return {
      photos: photosWithUrls,
      totalCount: photos.length,
    };
  },
});

export const getFeaturedPhotos = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 6 }) => {
    const photos = await ctx.db
      .query("photos")
      .filter((q) => q.and(
        q.eq(q.field("featured"), true),
        q.eq(q.field("isPublic"), true)
      ))
      .order("desc")
      .take(limit);

    // Add the image URLs
    return await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.fileId),
      }))
    );
  },
});

export const getAllCategories = query({
  handler: async (ctx) => {
    const photos = await ctx.db
      .query("photos")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();
    const albums = [...new Set(photos.map(photo => photo.album))];
    
    // Return albums with photo counts
    const albumData = await Promise.all(
      albums.map(async (album) => {
        const count = photos.filter(photo => photo.album === album).length;
        return { name: album, count };
      })
    );
    
    return albumData.sort((a, b) => b.count - a.count);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addFileToPhotos = mutation({
  args: {
    fileId: v.id("_storage"),
    title: v.optional(v.string()),
    album: v.optional(v.string()),
    description: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, { fileId, title, album = "general", description, featured = false }) => {
    // Check if this fileId already exists in photos table
    const existingPhoto = await ctx.db
      .query("photos")
      .filter((q) => q.eq(q.field("fileId"), fileId))
      .first();
    
    if (existingPhoto) {
      return {
        success: false,
        message: `Photo with fileId ${fileId} already exists`,
        existingPhotoId: existingPhoto._id,
      };
    }
    
    // Verify the file exists in storage
    const fileUrl = await ctx.storage.getUrl(fileId);
    if (!fileUrl) {
      return {
        success: false,
        message: `File with ID ${fileId} not found in storage`,
      };
    }
    
    // Add the photo to the table
    const photoId = await ctx.db.insert("photos", {
      title: title || `Photo ${fileId.slice(-8)}`,
      description,
      album,
      fileId,
      uploadedAt: Date.now(),
      isPublic: true,
      featured,
    });
    
    return {
      success: true,
      message: `Successfully added photo to gallery`,
      photoId,
      fileId,
      fileUrl,
    };
  },
});

export const syncAllStorageToPhotos = mutation({
  args: {
    album: v.optional(v.string()),
  },
  handler: async (ctx, { album = "general" }) => {
    // Get all files from storage using file metadata
    const allFiles = await ctx.db.system.query("_storage").collect();
    
    // Get existing photo fileIds to avoid duplicates
    const existingPhotos = await ctx.db.query("photos").collect();
    const existingFileIds = new Set(existingPhotos.map(photo => photo.fileId));
    
    const results = [];
    
    for (const file of allFiles) {
      const fileId = file._id;
      
      if (existingFileIds.has(fileId)) {
        results.push({
          fileId,
          success: false,
          message: "Already exists",
        });
        continue;
      }
      
      // Add the photo
      try {
        const photoId = await ctx.db.insert("photos", {
          title: `Photo ${fileId.slice(-8)}`,
          album,
          fileId,
          uploadedAt: Date.now(),
          isPublic: true,
          featured: false,
        });
        
        const fileUrl = await ctx.storage.getUrl(fileId);
        
        results.push({
          fileId,
          success: true,
          photoId,
          fileUrl,
        });
      } catch (error) {
        results.push({
          fileId,
          success: false,
          message: `Insert failed: ${error}`,
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    return {
      message: `Found ${allFiles.length} files in storage, ${successCount} added to photos table`,
      totalFilesInStorage: allFiles.length,
      existingPhotosCount: existingPhotos.length,
      newPhotosAdded: successCount,
      results,
    };
  },
});
