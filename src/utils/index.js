function getCurrentDateFormatted() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy}`;
}

export { getCurrentDateFormatted };

export function openSidebar() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--SideNavigation-slideIn", "1");
  }
}

export function closeSidebar() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--SideNavigation-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleSidebar() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--SideNavigation-slideIn");
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

export function openMessagesPane() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden";
    document.documentElement.style.setProperty("--MessagesPane-slideIn", "1");
  }
}

export function closeMessagesPane() {
  if (typeof window !== "undefined") {
    document.documentElement.style.removeProperty("--MessagesPane-slideIn");
    document.body.style.removeProperty("overflow");
  }
}

export function toggleMessagesPane() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--MessagesPane-slideIn");
    if (slideIn) {
      closeMessagesPane();
    } else {
      openMessagesPane();
    }
  }
}

export function formatDate(dateString, format) {
  if (dateString) {
    const date = new Date(dateString);

    const pad = (number) => String(number).padStart(2, "0");

    const formatMap = {
      "yyyy-mm-dd": () =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}`,
      "d F, Y": () =>
        `${date.getDate()} ${date.toLocaleString("default", {
          month: "long",
        })}, ${date.getFullYear()}`,
      "mm/dd/yyyy": () =>
        `${pad(date.getMonth() + 1)}/${pad(
          date.getDate()
        )}/${date.getFullYear()}`,
      "dd-mm-yyyy": () =>
        `${pad(date.getDate())}-${pad(
          date.getMonth() + 1
        )}-${date.getFullYear()}`,
      "MMMM d, yyyy": () =>
        `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getDate()}, ${date.getFullYear()}`,
      "yyyy-mm-dd hh:mm:ss": () =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
          date.getSeconds()
        )}`,
      "dd-mm-yyyy hh:mm:ss": () =>
        `${pad(date.getDate())}-${pad(
          date.getMonth() + 1
        )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(
          date.getMinutes()
        )}:${pad(date.getSeconds())}`,
      "d F, Y hh:mm:ss": () =>
        `${date.getDate()} ${date.toLocaleString("default", {
          month: "long",
        })}, ${date.getFullYear()} ${pad(date.getHours())}:${pad(
          date.getMinutes()
        )}:${pad(date.getSeconds())}`,
    };

    if (!formatMap[format]) {
      throw new Error("Unsupported format");
    }

    return formatMap[format]();
  } else {
    return "";
  }
}
