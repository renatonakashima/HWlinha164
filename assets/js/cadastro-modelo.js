import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const form = document.querySelector("#model-form");
const photoInput = document.querySelector("#model-photo");
const photoPreview = document.querySelector("#photo-preview");
const photoPreviewImage = document.querySelector("#photo-preview-image");
const photoName = document.querySelector("#photo-name");
const thCheckbox = document.querySelector("#is-th");
const sthCheckbox = document.querySelector("#is-sth");
const formMessage = document.querySelector("#form-message");
const submitButton = form?.querySelector("[type=submit]");

function showMessage(message, state = "error") {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.dataset.state = state;
}

function setExclusiveCheckboxes(changedCheckbox) {
  if (changedCheckbox === thCheckbox && thCheckbox.checked) sthCheckbox.checked = false;
  if (changedCheckbox === sthCheckbox && sthCheckbox.checked) thCheckbox.checked = false;
}

function normalizeLotLetter(value) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3);
}

function validateUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

photoInput?.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) {
    photoPreview.hidden = true;
    return;
  }
  if (!file.type.startsWith("image/")) {
    photoInput.value = "";
    photoPreview.hidden = true;
    showMessage("Selecione um arquivo de imagem válido.");
    return;
  }
  photoName.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  photoPreviewImage.src = URL.createObjectURL(file);
  photoPreview.hidden = false;
  showMessage("");
});

thCheckbox?.addEventListener("change", () => setExclusiveCheckboxes(thCheckbox));
sthCheckbox?.addEventListener("change", () => setExclusiveCheckboxes(sthCheckbox));

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("");

  const file = photoInput.files?.[0];
  const modelName = document.querySelector("#model-name").value.trim();
  const lotYear = Number(document.querySelector("#lot-year").value);
  const lotLetter = normalizeLotLetter(document.querySelector("#lot-letter").value);
  const collaboratorLink = document.querySelector("#collaborator-link").value.trim();
  const repeatsNextLot = document.querySelector("#repeats-next-lot").checked;

  if (!file || !file.type.startsWith("image/")) {
    showMessage("Selecione uma foto do modelo antes de confirmar.");
    return;
  }
  if (!modelName || !lotYear || !lotLetter || !collaboratorLink) {
    showMessage("Preencha todos os campos obrigatórios.");
    return;
  }
  if (lotYear < 1968 || lotYear > 2100) {
    showMessage("Informe um ano de lote entre 1968 e 2100.");
    return;
  }
  if (!validateUrl(collaboratorLink)) {
    showMessage("Informe um link válido iniciado por http:// ou https://.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Salvando…";

  const classification = thCheckbox.checked ? "TH" : sthCheckbox.checked ? "STH" : "NORMAL";
  const payload = {
    modelName,
    lotYear,
    lotLetter,
    classification,
    isTH: thCheckbox.checked,
    isSTH: sthCheckbox.checked,
    repeatsNextLot,
    collaboratorLink,
    photoName: file.name.slice(0, 180),
    photoType: file.type,
    photoSize: file.size,
    photoPendingStorage: true,
    visible: false,
    status: "PENDENTE_MODERACAO",
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "modelSubmissions"), payload);
    form.reset();
    photoPreview.hidden = true;
    showMessage("Cadastro recebido com sucesso. A foto foi selecionada localmente e ficará pendente até o armazenamento de imagens ser ativado.", "success");
  } catch (error) {
    console.error("Não foi possível salvar o cadastro.", error);
    showMessage("Não foi possível concluir o cadastro agora. Tente novamente em instantes.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Confirmar cadastro";
  }
});
