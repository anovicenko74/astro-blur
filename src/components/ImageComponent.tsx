import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";

type Props = {
    hash: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const ImageComponent = ({ hash, ...props }: Props) => {
    const [imageLoad, setImageLoad] = useState<Boolean>(false);
    useEffect(() => {
        if (props.src) {
            const img = new Image();
            img.onload = () => {
                setImageLoad(true);
            };

            img.src = props.src;
        }
    }, []);

    return (
        <>
            {imageLoad ? (
                <img src={props.src} {...props} />
            ) : (
                <Blurhash
                    hash={hash}
                    width={400}
                    height={300}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                />
            )}
        </>
    );
};

export default ImageComponent;
