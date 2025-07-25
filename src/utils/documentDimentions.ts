export const getDocumentDimentions = () => {
    const docHeight = window.innerHeight;
    const docWidth = window.innerWidth;
    return {
        docHeight,
        docWidth,
    }
}