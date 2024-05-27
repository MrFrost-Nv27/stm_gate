$("body").on("submit", "form#auth", function (e) {
  e.preventDefault();
  const data = {};
  $(this)
    .serializeArray()
    .map(function (x) {
      data[x.name] = x.value;
    });
  const credType = data.cred.includes("@") ? "email" : "username";
  $(this).find("#cred_type").attr("name", credType).val(data.cred);
  delete data.username;
  delete data.email;
  data[credType] = data.cred;
  const urlParams = Array.from(new URLSearchParams(window.location.search)).map((uri) => {
    const a = {};
    a[uri[0]] = uri[1];
    return a;
  });
  urlParams.forEach((uri) => {
    data[Object.keys(uri)[0]] = Object.values(uri)[0];
  });
  $(".preloader").slideDown();
  $.ajax({
    type: "POST",
    url: origin + "/login",
    data: data,
    cache: false,
    success: function (response) {
      $(".preloader").slideUp();
      Toast.fire({
        icon: "success",
        title: "Anda berhasil masuk",
      });
      if (response.redirect) {
        window.location.href = response.redirect;
      } else {
        window.location.reload();
      }
    },
    complete: function () {
      $(".preloader").slideUp();
    },
  });
});

$(document).ready(function () {
  $(".preloader").slideUp();
});
