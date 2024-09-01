export const handleScrollToError = (className = "error-label", time = 100) => {
  setTimeout(() => {
    const errorElement = document.getElementsByClassName(className)[0]
    errorElement.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  }, time)
}

export const handleScrollToErrorModal = (wrapper = 'form-defect-yes', className = "error-label", time = 100) => {
  setTimeout(() => {
    const errorElement = document.getElementsByClassName(wrapper)[0].getElementsByClassName(className)[0]
    if (!errorElement) return
    errorElement.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  }, time)
}

export const handleScrollToTopOfDialog = (id = 'form-defect-yes') => {
  const dialogHeader = document.getElementsByClassName(id)[0]
  if (dialogHeader) {
    dialogHeader.scrollIntoView(true)
  }
}

export const stringGroupExtractor = (text: string, delimeter = ':'): string => {
  if (!text) return ''
  const array = text.split(delimeter)
  if (array.length >= 2) {
    return array.slice(1).join(delimeter)
  }
  return ''
}

export const handleScrollToID = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.error(`Element with id '${id}' not found.`);
  }
};
