import NodeCache from "node-cache";
import fetch from "node-fetch";
import sizeOf from "image-size";
import fs from 'fs';

const remoteImageCache = new NodeCache();

type TImage = Buffer | string;

type TGetImageSizeParam = TImage;

interface IGetImageSizeReturn {
  height: number;
  width: number;
  type?: string;
};

interface IGetImageSize {
    (file: TGetImageSizeParam): IGetImageSizeReturn;
};

interface ILoadRemoteImage {
    (srcUrl: string): Promise<Buffer>;
};

interface ILoadImageImg extends IGetImageSizeReturn {
    src: string;
};

interface ILoadImageReturn {
    img: ILoadImageImg;
    file: TImage;
};

interface ILoadImage {
    (imagePath: TImage): Promise<ILoadImageReturn | undefined>;
};

const getImageSize: IGetImageSize = (file) => {
    const { width, height, type } = sizeOf(file);
  
    return {
        width,
        height,
        type
    };
};

const loadRemoteImage: ILoadRemoteImage = async (srcUrl) => {
    const cachedImage = remoteImageCache.get(srcUrl);
  
    if(typeof cachedImage === "undefined") {
      const response = await fetch(srcUrl);
      const buffer = await response.buffer();
  
      remoteImageCache.set(srcUrl, buffer);
  
      return buffer;
    }
  
    if(!Buffer.isBuffer(cachedImage)) throw Error(`Cached value for ${srcUrl} is invalid.`);
  
    return cachedImage;
};


const loadImage: ILoadImage = async (imagePath) => {
    if(Buffer.isBuffer(imagePath)) { //Buffer
        const imageSize = getImageSize(imagePath);
    
        return {
            file: imagePath,
            img: {
                src: null,
                ...imageSize,
            }
        };
    }

    if(!imagePath.startsWith('http')) { //Local file
        if(!fs.existsSync(imagePath)) return undefined;

        const imageSize = getImageSize(imagePath);
        
        return {
            file: imagePath,
            img: {
                src: imagePath,
                ...imageSize,
            }
        };
    }

    //Remote image url
    const buffer = await loadRemoteImage(imagePath);
    const imageSize = getImageSize(buffer);

    return {
        file: buffer,
        img: {
            src: imagePath,
            ...imageSize
        }
    };
};

export default loadImage;