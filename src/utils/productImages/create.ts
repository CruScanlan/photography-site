import sharp from "sharp";
import fs from 'fs';
import path from 'path';

import loadImage from './loadImage';

const publicDirectory = path.join(__dirname, "../../../public/"); //Full path to public
const productImageDirectory = publicDirectory + 'productImages/'; //Full path to productImages

const createProductImage = async (remotePath: string, fileName: string) => {
    const productFileName = `${fileName.replace('.jpg', '')}-productImage.jpg`; //File name
    const productPublicFile = `/productImages/${productFileName}`; //Path from public to file
    const productFilePath = productImageDirectory + productFileName; //Full path to productImage

    if(!fs.existsSync(productImageDirectory)) fs.mkdirSync(productImageDirectory); //Make sure cache folder exists

    if(process.env.NODE_ENV === 'development') { //Check cache for development
        const productImageCached = await loadImage(productFilePath);

        if(productImageCached) return {
            publicFile: productPublicFile,
            width: productImageCached.img.width,
            height: productImageCached.img.height
        }
    }

    const photoImage = await loadImage(remotePath);
    const baseImage = await loadImage(publicDirectory + 'print-room1.jpg'); //Get base image
    const resizedPhoto = await sharp(photoImage.file).resize(400).toBuffer();; //Get photo

    const productImage = sharp(baseImage.file)
        .resize(1100)
        .composite([
            {
                input: resizedPhoto,
                gravity: 'center'
            }
        ]).jpeg({ quality: 100 }); //Composite image


    await productImage.toFile(productFilePath); //Save to cache

    const { width, height } = (await loadImage((await productImage.toBuffer()))).img; //Get width height

    return {
        publicFile: productPublicFile,
        width,
        height
    };
}

export default createProductImage;