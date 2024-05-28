M.AutoInit();
// $.each(listMenu, function (i, m) {
//   $(".panel-nav-list").append(`<div class="nav-item"><a href="${m.url}" class="nav-item-link" data-page="${m.id}"><i class="fa-solid fa-${m.icon}"></i>${i}</a></div>`);
// });

$("body").on("click", ".btn-logout", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Apakah anda yakin ingin keluar ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "keluar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/auth/logout";
    }
  });
});

$(document).ready(function () {
  $(`.nav-item-link[data-page=${page}]`).addClass("active");
});
