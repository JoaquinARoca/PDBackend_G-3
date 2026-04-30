declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { v2 as CloudinaryInstance } from "cloudinary";

  interface CloudinaryStorageOptions {
    cloudinary: typeof CloudinaryInstance;
    params?: Record<string, unknown>;
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile: StorageEngine["_handleFile"];
    _removeFile: StorageEngine["_removeFile"];
  }

  export { CloudinaryStorage };
}
