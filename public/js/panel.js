const swalKeluar = (url = null) =>
  Swal.fire({
    title: "Keluar?",
    text: "Apakah anda yakin ingin keluar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Keluar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      if (url != null) {
        window.location.href = url;
      }
    }
  });

const swalConfirm = (e, customMsg = null) => {
  e.preventDefault();
  Swal.fire({
    title: "Konfirmasi",
    text: customMsg ?? "Apakah anda yakin?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Konfirmasi",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      if (e.target.getAttribute("href") != null) {
        window.location.href = e.target.getAttribute("href");
      }
    }
  });
};

const swalToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function toCapitalizedWords(name) {
  var words = name.match(/[A-Za-z][^_\-A-Z]*/g) || [];

  return words.map(capitalize).join(" ");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

const snakeToCamel = (str) => str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
const snakeToPascal = (str) => {
  let camelCase = snakeToCamel(str);
  let pascalCase = camelCase[0].toUpperCase() + camelCase.substr(1);
  return pascalCase;
};

const popupTrigger = function (event, newOpt = {}) {
  const options = new Map([
    ["title", ""],
    ["content", null],
    ["closeButton", true],
    ["addonButton", true],
  ]);

  if (newOpt !== null) {
    Object.entries(newOpt).forEach((newOp) => {
      const [key, value] = newOp;
      options.set(key, value);
    });
  }
  const popup = $(".popup-wrapper");
  const popupTitle = $(".popup-title");
  const popupBox = $(".popup-box");
  const popupContent = $(".popup-content");

  options.get("closeButton") ? popup.addClass("close-button") : popup.removeClass("close-button");
  if (options.get("addonButton")) {
    popup.addClass("addon-button");
    popup.find(".popup-button button")[0].onclick = () => {
      popup.find("form").submit();
    };
  } else {
    popup.removeClass("addon-button");
  }

  event.preventDefault();
  popupTitle.text("Edit " + options.get("title"));
  popup.addClass("open");
  popupBox.animsition("in");
  if (options.get("content") != null) {
    popupContent.empty();
    popupContent.append(options.get("content"));
  }
};

$("body").on("input", ".material input", function (e) {
  $(this).attr("value", $(this).val());
});

$(document).ready(function () {
  $("body").on("click", ".panel-wrapper .menu-toggle", function (e) {
    const panelWrapper = $(".panel-wrapper");
    panelWrapper.addClass("menu-open");
  });
  $("body").on("click", ".panel-wrapper.menu-open .menu-toggle", function (e) {
    const panelWrapper = $(".panel-wrapper");
    panelWrapper.removeClass("menu-open");
  });
  $("body").on("click", ".panel-wrapper.menu-open .content-wrapper", function (e) {
    const panelWrapper = $(".panel-wrapper");
    panelWrapper.removeClass("menu-open");
  });
  $("body").on("click", ".btn-logout", function (e) {
    e.preventDefault();
    swalKeluar($(this).attr("href"));
  });
  $("body").on("click", ".menu-list li.active", function (e) {
    e.preventDefault();
  });
  $(window).on("click", function (e) {
    const dropdown = $(".topbar-dropdown-wrapper");
    if ($(e.target).hasClass("topbar-img")) {
      dropdown.toggleClass("show");
    } else {
      dropdown.removeClass("show");
    }
  });
});
