
"use client";
import React, { useState } from "react";
import Backdrop from "../ui/Backdrop";
import Card from "../ui/Card";

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  buttons?: React.ReactNode;
  children?: React.ReactNode;
  cardStyles?: string;
}

const Modal: React.FC<ModalProps> = ({
  open = false,
  onClose,
  title,
  description,
  buttons,
  children,
  cardStyles,
}) => {
  const [isOpen, setIsOpen] = useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Backdrop show={isOpen} onClicked={handleClose} />
      <div className="fixed inset-0 z-[120] flex items-center justify-center">
        <Card styles={`max-w-md w-full ${cardStyles ?? ""}`}>
          {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
          {description && <p className="text-muted-foreground mb-4">{description}</p>}
          {children}
          {buttons && <div className="mt-6 flex gap-2 justify-end">{buttons}</div>}
        </Card>
      </div>
    </>
  );
};

export default Modal;
