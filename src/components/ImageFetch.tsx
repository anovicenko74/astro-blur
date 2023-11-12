import { encode } from "blurhash";
import { useEffect, type FunctionComponent, useState } from "react";
import { Blurhash } from "react-blurhash";

interface ImageFetchProps {}

const loadImage = async (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (...args) => reject(args);
        img.src = src;
    });

const getImageData = (image: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
};

const encodeImageToBlurhash = async (imageUrl: string) => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};

const ImageFetch: FunctionComponent<ImageFetchProps> = () => {
    const [imageHash, setImageHash] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = async () => {
            const res = await fetch("https://loremflickr.com/320/240");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            return url;
        };
        loadImage().then((url) => {
            setImageUrl(url);
        });

        encodeImageToBlurhash("https://loremflickr.com/320/240").then((hash) =>
            setImageHash(hash)
        );
    }, []);

    return (
        <>
            {imageHash && (
                <Blurhash
                    hash={imageHash}
                    width={400}
                    height={300}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                />
            )}
            {imageUrl && <img src={imageUrl} />}
        </>
    );
};

export default ImageFetch;
