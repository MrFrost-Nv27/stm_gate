const socket = new WebSocket("/");
socket.onclose = function(event) {
    Toast.fire({
        icon: "error",
        title: "Gagal terhubung dengan server",
    });
};

$(document).ready(function () {
  $(".preloader").slideUp();
});
