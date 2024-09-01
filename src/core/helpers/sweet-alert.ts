import Swal from "sweetalert2/dist/sweetalert2.min.js";

type SwalObject = {
  title?: string;
  text: string;
  icon?: string;
  showCancelButton?: boolean;
  buttonsStyling?: boolean;
  confirmButtonText?: string;
  customClass?: any | null;
  cancelButtonText?: string;
  showCloseButton?: boolean;
  reverseButtons?: boolean;
  showConfirmButton?: boolean;
  timer?: number;
};

const swalFire = (alertObj: SwalObject) => {
  return Swal.fire(alertObj);
};

export const swalAlertSuccess = (
  text: string,
  confirmButtonText: string,
  showCancelButton = false,
) => {
  return swalFire({
    text: text,
    icon: "success",
    buttonsStyling: false,
    showCancelButton: showCancelButton,
    confirmButtonText: confirmButtonText,
    customClass: {
      confirmButton: "btn fw-bold btn-light-primary",
    },
  });
};

export const swalAlertError = (
  text: string,
  confirmButtonText: string,
  showCancelButton = false,
) => {
  return swalFire({
    text: text,
    icon: "error",
    showCancelButton: showCancelButton,
    buttonsStyling: false,
    confirmButtonText: confirmButtonText,
    customClass: {
      confirmButton: "btn fw-bold btn-light-danger",
    },
  });
};

export const swalAlertWarning = (
  text: string,
  confirmButtonText: string,
  showCancelButton = false,
) => {
  return swalFire({
    text: text,
    icon: "warning",
    showCancelButton: showCancelButton,
    buttonsStyling: false,
    confirmButtonText: confirmButtonText,
    customClass: {
      confirmButton: "btn btn-primary",
    },
  });
};

export const swalAlertInfo = (
  text: string,
  confirmButtonText: string,
  showCancelButton = false,
) => {
  return swalFire({
    text: text,
    icon: "info",
    showCancelButton: showCancelButton,
    buttonsStyling: false,
    confirmButtonText: confirmButtonText,
    customClass: {
      confirmButton: "btn btn-primary",
    },
  });
};

export const swalAlertQuestion = (
  text: string,
  confirmButtonText: string,
  showCancelButton = false,
) => {
  return swalFire({
    text: text,
    icon: "question",
    showCancelButton: showCancelButton,
    buttonsStyling: false,
    confirmButtonText: confirmButtonText,
    customClass: {
      confirmButton: "btn btn-primary",
    },
  });
};

export const swalAlertConfirmation = (
  text: string | null,
  confirmLabel = "Submit"
) => {
  return swalFire({
    title: "Confirmation",
    icon: "question",
    text: text ? text : `Are You Sure?`,
    buttonsStyling: false,
    showCancelButton: true,
    confirmButtonText: confirmLabel,
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-secondary",
    },
    showCloseButton: true,
    reverseButtons: false,
  });
};

export const swalAlertErrorBulk = (text: string) => {
  return swalFire({
    title: "Warning",
    icon: "warning",
    text: text,
    buttonsStyling: false,
    confirmButtonText: "OK",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-secondary"
    },
  });
};

export const swalAlertLoading = (text: string) => {
  return swalFire({
    title: "Please Wait ...",
    icon: "warning",
    text: text,
    buttonsStyling: false,
    confirmButtonText: "OK",
    showCancelButton: false,
    showCloseButton: false,
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-secondary"
    },
  });
};

export const swalAlertSuccessTitle = (
  titleText: string,
  text: string,
  confirmButtonText: string,
  showCancelButton = false,
) => {
  return swalFire({
    title: titleText,
    text: text,
    icon: "success",
    showCancelButton: showCancelButton,
    buttonsStyling: false,
    confirmButtonText: confirmButtonText,
    customClass: {
      confirmButton: "btn fw-bold btn-light-primary",
    },
  });
};

export const swalAlertErrorTitle = (
  titleText: string,
  text: string,
  confirmButtonText: string,
  showCancelButton = false,
) => {
  return swalFire({
    title: titleText,
    text: text,
    icon: "error",
    showCancelButton: showCancelButton,
    buttonsStyling: false,
    confirmButtonText: confirmButtonText,
    customClass: {
      confirmButton: "btn fw-bold btn-light-danger",
    },
  });
};

export const swalAlertSuccessAutoClose = (text: string, title = "") => {
  return swalFire({
    icon: "success",
    title: title,
    text: text,
    showConfirmButton: false,
    customClass: null,
    timer: 2000
  });
};
