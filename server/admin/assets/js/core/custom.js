function deleteDialog(id, email) {
  openDialog(id, email);
}

function openDialog(id, email) {
  const dialog = document.querySelector("#deletion-modal-" + id);
  dialog.showModal();

  const form = document.querySelector("form");
  form.setAttribute("hx-post", "/admin/user/delete/" + id);

  const closeButton = dialog.querySelector("#close");

  // "Close" button closes the dialog
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
}
