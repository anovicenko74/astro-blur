import { encode } from "blurhash";
import type { Sharp } from "sharp";
import sharp from "sharp";
import request from "request";

export const loadImage = async (src: string): unknown => {
    const res = await fetch("https://loremflickr.com/320/240");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    return url;
};

export const getImageData = (image: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
};

// export const encodeImageToBlurhash = async (imageUrl: string) => {
//     const image = await loadImage(imageUrl);
//     const imageData = getImageData(image);
//     return encode(imageData.data, imageData.width, imageData.height, 4, 4);
// };

export const encodeImageToBlurhash = async (url: string) => {
    const pipeline = sharp()
        .raw()
        .ensureAlpha()
        .resize(32, 32, { fit: "fill" });

    const sharpObj: Sharp = await request({ url, encoding: null }).pipe(
        pipeline
    );
    const { data: buffer, info: metadata } = await sharpObj.toBuffer({
        resolveWithObject: true,
    });
    const clamped = new Uint8ClampedArray(buffer);

    const hash = await encode(clamped, metadata.width, metadata.height, 4, 4);

    return hash;
};
