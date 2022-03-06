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
    const ratio = (photoImage.img.width / photoImage.img.height).toFixed(2);

    let productImage: sharp.Sharp | undefined;
    let imageInfoMessage = '';

    try {
        if(ratio === '0.67') { //2x3 Vertical
            imageInfoMessage = `Created Set Image 2x3 Vertical - ${fileName}`;
    
            const setImage = await loadImage(publicDirectory + 'Product Image Template 1 2x3 Vertical.png'); //Get base image
    
            const setImageSharp = await sharp(setImage.file).toBuffer(); //Get photo
            const productImageBase = await sharp(photoImage.file)
                .resize(401, 603)
                .extend({
                    top: 259,
                    bottom: 1166,
                    left: 734,
                    right: 825,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .composite([
                    {
                        input: setImageSharp,
                        top: 0,
                        left: 0
                    }
                ])
                .jpeg({ quality: 100 })
                .toBuffer(); //Composite image
            
            productImage = sharp(productImageBase).resize(1800);
        } else if(ratio === '0.80') { //4x5 Vertical
            imageInfoMessage = `Created Set Image 4x5 Vertical - ${fileName}`;
    
            const setImage = await loadImage(publicDirectory + 'Product Image Template 1 4x5 Vertical.png'); //Get base image
    
            const setImageSharp = await sharp(setImage.file).toBuffer(); //Get photo
            const productImageBase = await sharp(photoImage.file)
                .resize(401, 501)
                .extend({
                    top: 362,
                    bottom: 1166,
                    left: 734,
                    right: 825,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .composite([
                    {
                        input: setImageSharp,
                        top: 0,
                        left: 0
                    }
                ])
                .jpeg({ quality: 100 })
                .toBuffer(); //Composite image
            
            productImage = sharp(productImageBase).resize(1800);
        } else if(ratio === '1.50') { //2x3 Landscape
            imageInfoMessage = `Created Set Image 2x3 Landscape - ${fileName}`;
    
            const setImage = await loadImage(publicDirectory + 'Product Image Template 1 2x3 Landscape.png'); //Get base image
    
            const setImageSharp = await sharp(setImage.file).toBuffer(); //Get photo
            const productImageBase = await sharp(photoImage.file)
                .resize(603, 401)
                .extend({
                    top: 361,
                    bottom: 1266,
                    left: 634,
                    right: 725,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .composite([
                    {
                        input: setImageSharp,
                        top: 0,
                        left: 0
                    }
                ])
                .jpeg({ quality: 100 })
                .toBuffer(); //Composite image
            
            productImage = sharp(productImageBase).resize(1800);
        } else if(ratio === '2.00') { //2x3 Landscape
            imageInfoMessage = `Created Set Image 1x2 Landscape - ${fileName}`;
    
            const setImage = await loadImage(publicDirectory + 'Product Image Template 1 1x2 Landscape.png'); //Get base image
    
            const setImageSharp = await sharp(setImage.file).toBuffer(); //Get photo
            const productImageBase = await sharp(photoImage.file)
                .resize(803, 401)
                .extend({
                    top: 361,
                    bottom: 1266,
                    left: 533,
                    right: 624,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .composite([
                    {
                        input: setImageSharp,
                        top: 0,
                        left: 0
                    }
                ])
                .jpeg({ quality: 100 })
                .toBuffer(); //Composite image
            
            productImage = sharp(productImageBase).resize(1800);
        } else if(ratio === '3.00') { //1x3 Landscape
            imageInfoMessage = `Created Set Image 1x3 Landscape - ${fileName}`;
    
            const setImage = await loadImage(publicDirectory + 'Product Image Template 1 1x3 Landscape.png'); //Get base image
    
            const setImageSharp = await sharp(setImage.file).toBuffer(); //Get photo
            const productImageBase = await sharp(photoImage.file)
                .resize(1125, 374)
                .extend({
                    top: 324,
                    bottom: 1330,
                    left: 372,
                    right: 463,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .composite([
                    {
                        input: setImageSharp,
                        top: 0,
                        left: 0
                    }
                ])
                .jpeg({ quality: 100 })
                .toBuffer(); //Composite image
            
            productImage = sharp(productImageBase).resize(1800);
        } else { //Default
            productImage = sharp(photoImage.file).resize(1800);
        }
    
        
        await productImage.toFile(productFilePath); //Save to cache
        const { width, height } = (await loadImage((await productImage.toBuffer()))).img; //Get width height

        console.log(`Created Set Image: ${imageInfoMessage}`);

        return {
            publicFile: productPublicFile,
            width,
            height
        };
    } catch(e) {
        console.error(e);
        throw new Error(`Failed Creating Set Image Failed: ${imageInfoMessage}`);
    }
}

export default createProductImage;