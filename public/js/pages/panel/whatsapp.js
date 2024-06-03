const table = {
  whatsapp: $(`#accounts-table`).DataTable({
    ajax: {
      url: origin + "/api/whatsapp",
      dataSrc: "",
    },
    rowId: "id",
    columns: [
      { title: "Nama", data: "name" },
      { title: "Nama Session", data: "session" },
      {
        title: "Terhubung",
        data: "connected",
        render: (data) => {
          return data ? "<i class='fas fa-check green-text'></i>" : "<i class='fas fa-times red-text'></i>";
        },
      },
      {
        title: "Aksi",
        data: "id",
        render: (data, type, row) => {
          let connectBtn = "";
          if (!row.connected) {
            connectBtn = `<a role="button" class="btn-control with-text with-text btn-control-small green" data-action="connecting" data-id="${data}"><i class="material-icons">qr_code_scanner</i> Hubungkan</a>`;
          }
          return `<div class="control">${connectBtn}</div>`;
        },
      },
    ],
  }),
};

const popup = {
  side: $(".popup-wrapper:not(.float)").popup({
    content: {
      formAdd: $("#template-form-add").html(),
    },
  }),
  float: $(".popup-wrapper.float").popup({
    content: {
      scanner: $("#template-scanner").html(),
    },
  }),
};

$("body").on("click", "#btn-add", function () {
  popup.side.open("formAdd");
});

$("body").on("submit", "form#form-add", function (e) {
  e.preventDefault();
  const data = {};
  $(this)
    .serializeArray()
    .forEach((input) => {
      data[input.name] = input.value;
    });
  $(this).find("button[type=submit]").addClass("disabled");
  $.ajax({
    type: "POST",
    url: origin + "/api/whatsapp",
    data: data,
    success: (res) => {
      Toast.fire({
        icon: "success",
        title: "data berhasil disimpan",
      });
      $(this).trigger("reset");
      cloud.pull("whatsapp");
    },
    complete: () => {
      $(this).find("button[type=submit]").removeClass("disabled");
    },
  });
});

$("body").on("click", ".btn-control", function (e) {
  const action = $(this).data("action");
  let id = null;
  switch (action) {
    case "connecting":
      id = $(this).data("id");
      $(popup.float.el).find(".popup-content[data-popup=scanner] img").attr("data-session", id);
      popup.float.open("scanner");
      $.ajax({
        type: "POST",
        url: origin + "/api/whatsapp/scan",
        data: {
          id: id,
        },
        success: function (res) {
          console.log(res);
        }
      });
      break;
  }
});

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher('a51eec4ef86427630d9a', {
  cluster: 'ap1'
});

const channel = pusher.subscribe('scanner');
channel.bind('scanning', function(data) {
  alert(JSON.stringify(data));
});
channel.bind('qr', function(data) {
  $(popup.float.el).find(".popup-content[data-popup=scanner] img").attr("src", "/img/qr.png?timestamp=" + new Date().getTime());
});

$(document).ready(function () {
  cloud
    .add(origin + "/api/whatsapp", {
      name: "whatsapp",
      callback: (data) => {
        table.whatsapp.ajax.reload();
      },
    })
    .then((whatsapp) => {});
  M.AutoInit();
  $(".preloader").slideUp();
});
