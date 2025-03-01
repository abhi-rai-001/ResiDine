/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
      },
    env: {
      UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
      UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
     
    
    },
  };
  
  export default nextConfig;