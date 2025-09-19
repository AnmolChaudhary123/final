# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image storage in your blog application.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret

## 3. Install Cloudinary SDK

The Cloudinary SDK is already included in the project dependencies. If you need to install it manually:

```bash
npm install cloudinary
```

## 4. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
```

**Important:** 
- Replace the placeholder values with your actual Cloudinary credentials
- The `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is used for client-side image URL generation
- Never commit your `.env.local` file to version control

## 5. Features Included

### Image Upload Component
- Drag and drop functionality
- File type validation (JPEG, PNG, WebP, GIF)
- File size validation (configurable, default 10MB)
- Image preview
- Error handling
- Loading states

### Upload API Route
- Located at `/api/upload`
- Handles file uploads to Cloudinary
- Automatic image optimization
- Returns image URL and metadata

### Utility Functions
- `uploadImage()` - Upload images programmatically
- `deleteImage()` - Delete images from Cloudinary
- `getCloudinaryUrl()` - Generate optimized image URLs
- `extractPublicId()` - Extract public ID from Cloudinary URLs
- `isCloudinaryUrl()` - Validate Cloudinary URLs

## 6. Usage Examples

### Using the ImageUpload Component

```tsx
import ImageUpload from '@/components/ImageUpload';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <ImageUpload
      value={imageUrl}
      onChange={setImageUrl}
      placeholder="Upload your image"
      maxSize={5} // 5MB limit
    />
  );
}
```

### Using Utility Functions

```tsx
import { uploadImage, getCloudinaryUrl } from '@/lib/cloudinary-utils';

// Upload an image
const result = await uploadImage(file, 'my_folder', {
  quality: 'auto',
  width: 800,
  height: 600
});

// Generate optimized URL
const optimizedUrl = getCloudinaryUrl(result.publicId, {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto'
});
```

## 7. Image Transformations

The upload route automatically applies these transformations:
- Maximum width: 1200px
- Maximum height: 630px
- Crop: limit (maintains aspect ratio)
- Quality: auto (optimizes file size)
- Format: auto (serves best format for browser)

## 8. Security Considerations

- File type validation prevents malicious uploads
- File size limits prevent abuse
- Images are stored in a dedicated folder (`blog_images`)
- Public IDs are generated automatically by Cloudinary

## 9. Troubleshooting

### Common Issues

1. **"Cloudinary config not found" error**
   - Check that all environment variables are set correctly
   - Restart your development server after adding environment variables

2. **Upload fails with 400 error**
   - Check file type is supported (JPEG, PNG, WebP, GIF)
   - Check file size is under the limit (default 10MB)

3. **Images not displaying**
   - Check that `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
   - Verify the image URL is correct

### Debug Mode

To enable Cloudinary debug logging, add this to your environment:

```env
CLOUDINARY_DEBUG=true
```

## 10. Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- 25,000 transformations per month

For production applications, consider upgrading to a paid plan.
