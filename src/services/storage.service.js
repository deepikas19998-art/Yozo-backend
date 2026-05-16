require("dotenv").config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileBuffer, fileName) {
  const result = await imagekit.upload({
    file: fileBuffer,   
    fileName: fileName,
    folder: "/reels",    
  });

  return {
  url: result.url
};
}

module.exports = { uploadFile };