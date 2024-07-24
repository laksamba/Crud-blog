import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.VITE_CLOUD_NAME_CLOUDINARY,
  api_key: '595153637866851',
  api_secret: 'KidqoWKXIJEHIME9B6tFSVmhXxk',
});

export default cloudinary;
