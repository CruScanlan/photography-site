import React from 'react';
import ReactModal from 'react-modal';

interface Props {
    isOpen: boolean; 
    onRequestClose: () => void;
};

const GalleryPhotoModal: React.FC<Props>  = ({ isOpen, onRequestClose, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            portalClassName=""
            overlayClassName="z-[100] bg-bg2 w-full h-full fixed inset-0 flex justify-center items-center"
            className="p-8"
        >
            { children }
        </ReactModal>
    )
};

export default GalleryPhotoModal;

/*
import { ModalRoutingContext } from 'gatsby-plugin-modal-routing';
import { GatsbyImage, getImage } from "gatsby-plugin-image";

const GalleryPhotoPage: React.FC = (props: any) => {
    const image = getImage(props.pageContext.fullResImage.gatsbyImageData);

    return (
        <ModalRoutingContext.Consumer>
            {({ modal, closeTo }: {modal: any, closeTo: any}) =>  (
                <div>
                    {modal ? (
                        <Link to={closeTo}>
                            Close
                        </Link>
                    ) : (
                        <header>
                            <h1>
                                {props.pageContext.title}
                            </h1>
                        </header>
                    )}

                    <div className="max-w-screen-lg max-h-screen-lg">
                        {
                            image && <GatsbyImage image={image} alt="Image" />
                        }
                        {
                            !image && <div>Could not find Image</div>
                        }
                    </div>
                </div>
            )}
        </ModalRoutingContext.Consumer>
    )
};
*/