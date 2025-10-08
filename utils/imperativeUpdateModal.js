let controller = null; // holds the mounted modal's methods
let queuedOpen = false; // if open() is called before mount

export function registerUpdateModal(ctrl) {
  controller = ctrl;
  if (queuedOpen) {
    queuedOpen = false;
    controller.open();
  }
}

export function unregisterUpdateModal() {
  controller = null;
}

export function openUpdateModal() {
  if (controller && typeof controller.open === "function") {
    controller.open();
  } else {
    // modal not mounted yet; remember to open once it registers
    queuedOpen = true;
  }
}

export function closeUpdateModal() {
  if (controller && typeof controller.close === "function") {
    controller.close();
  }
}
