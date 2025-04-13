const form = document.querySelector("#updateForm");
form.addEventListener("input", function () {
  const updateBtn = form.querySelector("button[type='submit']");
  if (updateBtn.hasAttribute("disabled")) {
    updateBtn.removeAttribute("disabled");
  }
});
