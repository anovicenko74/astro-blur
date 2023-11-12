import { encode } from "blurhash";
import type { Sharp } from "sharp";
import sharp from "sharp";
import request from "request";

export const encodeImageToBlurhash = async (url: string) => {
    const pipeline = sharp().raw().ensureAlpha();

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
