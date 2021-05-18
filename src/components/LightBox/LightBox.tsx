import * as React from 'react';
import Modal from 'react-modal';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

import './LightBox.css';

interface Props {
    currentPhotoIndex: number;
    photos: IGalleryPhotoData[];
    lightBoxOpen: boolean;
    setLightBoxOpen: (open: boolean) => void;
}

Modal.setAppElement('#___gatsby');

const LightBox: React.FC<Props> = ({photos, currentPhotoIndex, lightBoxOpen, setLightBoxOpen}) => {   
    const image = getImage(photos[currentPhotoIndex].fileFull as any);

    const closeModal = () => {
        setLightBoxOpen(false);
    }

    const renderImage = () => {
        if(!image) return <div>Cannot find photo data</div>;

        return (
            <GatsbyImage className="galleryImage__gatsby" image={image} alt="Image"/>
        )
    }
    
    return (
        <Modal
          isOpen={lightBoxOpen}
          onRequestClose={closeModal}
          className="c-modal"
          overlayClassName="fixed top-0 bottom-0 left-0 right-0 z-40 nowrap text-center flex justify-center items-center bg-opacity-90 bg-gray-600"
        >
            { renderImage() }   
        </Modal>
    );
}

export default LightBox;