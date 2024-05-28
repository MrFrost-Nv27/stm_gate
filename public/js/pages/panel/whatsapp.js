const table = {};
let socket;
let socketInterval;

function onWsOpen(event) {
  console.log("Websocket connected : ", event.timeStamp);
  socket.send("Hello Server!");
}
function onWsError(event) {
  Toast.fire({
    icon: "error",
    title: "Gagal terhubung dengan server",
  });
}
function onWsMessage(event) {
  let data = event.data;
  if (data[0] == "[" || data[0] == "{") {
    data = JSON.parse(data);
  }
  console.log(data);
}

function startWs() {
  socket = new WebSocket("/whatsapp");
  socket.onopen = onWsOpen;
  socket.onerror = onWsError;
  socket.onmessage = onWsMessage;
  socket.onclose = function (event) {
    console.log(event);
    Toast.fire({
      icon: "error",
      title: "Gagal terhubung dengan server",
    });
  };

  clearInterval(socketInterval);
  socketInterval = setInterval(() => {
    if (socket.readyState == WebSocket.CLOSED) {
      startWs();
    }
  }, 5000);
}

$(document).ready(function () {
  new DataTable("#accounts-table", {
    columns: [{ title: "Name" }, { title: "Position" }, { title: "Office" }, { title: "Extn." }, { title: "Start date" }, { title: "Salary" }],
  });
  startWs();
  $(".preloader").slideUp();
});
