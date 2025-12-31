import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type BucketName = 'passport-photos' | 'signatures' | 'nin-photos' | 'payment-slips';

interface UseFileUploadOptions {
  bucket: BucketName;
  maxSizeMB?: number;
}

export const useFileUpload = ({ bucket, maxSizeMB = 1 }: UseFileUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file: File, userId: string): Promise<string | null> => {
    if (!file) return null;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return null;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload file');
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setProgress(100);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload file');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileUrl: string): Promise<boolean> => {
    try {
      // Extract path from URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf(bucket);
      if (bucketIndex === -1) return false;
      
      const filePath = pathParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  };

  return {
    upload,
    deleteFile,
    isUploading,
    progress,
  };
};
