//working of file upload
import { v2 as cloudinary } from 'cloudinary';
import FileSystem from 'fs';

    // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_API_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            //throw new Error('Please provide a valid file path');
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        //console.log('File uploaded successfully',response.url);
        FileSystem.unlinkSync(localFilePath);
    
        return response;
    } catch (error) {
        FileSystem.unlink(localFilePath);
        //remove the file from the local storage
        return null;
    }

    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);   
    };
const deleteFileFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) {
            throw new Error("Image URL is required");
        }

        // Extract public ID from the Cloudinary URL
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extracts the file name without extension

        // Delete the file from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        return result.result === "ok";
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error.message);
        return false;
    }
};


export { uploadOnCloudinary };
export default {deleteFileFromCloudinary};
