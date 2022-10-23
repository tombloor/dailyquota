import styles from './Modal.module.css';

export interface ModalProps {
    open?: boolean,
    showHeader?: boolean,
    children: JSX.Element,
    okText?: string,
    requestClose?: () => void,
    onOk?: () => void
}

export const Modal = (props: ModalProps) => {
    if (props.open === false) {
        return <></> 
    }

    return (
        <div className={styles.ModalBackdrop}>
            <div className={styles.ModalContainer}>
                { props.showHeader === undefined || props.showHeader &&
                    <div className={styles.ModalHeader}>
                        <button onClick={() => props.requestClose && props.requestClose()}>X</button>
                    </div>
                }
                <div className={styles.ModalContent}>
                    {props.children}
                </div>
                { props.okText && 
                    <div className={styles.ModalFooter}>
                        <button onClick={() => props.onOk ? props.onOk() : props.requestClose && props.requestClose()}>{props.okText}</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Modal;