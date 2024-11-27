"use client";
import * as React from 'react';

interface ModalContextType {
    isOpen: boolean;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [modalContent, setModalContent] = React.useState<React.ReactNode | null>(null);

    const openModal = (content: React.ReactNode) => {
        setModalContent(content);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => setModalContent(null), 200); // Allow animation to complete
    };

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
            {isOpen && modalContent}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = React.useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};