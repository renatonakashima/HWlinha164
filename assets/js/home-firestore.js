import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const latestContentGrid = document.querySelector("#latest-content-grid");
const collectorWall = document.querySelector("#collector-wall");
const firestoreStatus = document.querySelector("#firestore-status");

function setStatus(message, state = "info") {
  if (!firestoreStatus) return;
  firestoreStatus.textContent = message;
  firestoreStatus.dataset.state = state;
}

function sortByOrder(documents) {
  return [...documents].sort((first, second) => {
    const firstOrder = Number(first.order ?? 999);
    const secondOrder = Number(second.order ?? 999);
    return firstOrder - secondOrder;
  });
}

async function readCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return sortByOrder(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
}

function renderLatestContent(items) {
  if (!latestContentGrid || items.length === 0) return;

  latestContentGrid.innerHTML = items
    .filter((item) => item.visible !== false)
    .map(
      (item) => `
        <article class="card">
          <h4>${escapeHtml(item.title || "Conteúdo da coleção")}</h4>
          <p>${escapeHtml(item.description || "Confira as novidades da Linha 1:64.")}</p>
        </article>
      `,
    )
    .join("");
}

function renderCollectorWall(items) {
  if (!collectorWall || items.length === 0) return;

  collectorWall.innerHTML = items
    .filter((item) => item.visible !== false)
    .map(
      (item) => `
        <article class="mural-item">
          <p><strong>${escapeHtml(item.status || "ANÚNCIO")}</strong> – ${escapeHtml(item.title || "Item de coleção")}</p>
          ${item.location ? `<p>📍 ${escapeHtml(item.location)}${item.price ? ` | 💰 ${escapeHtml(item.price)}` : ""}</p>` : ""}
        </article>
      `,
    )
    .join('<hr>');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadFirestoreContent() {
  setStatus("Conectando ao Firestore…", "loading");

  try {
    const [contentItems, muralItems] = await Promise.all([
      readCollection("siteContent"),
      readCollection("mural"),
    ]);

    renderLatestContent(contentItems);
    renderCollectorWall(muralItems);

    if (contentItems.length > 0 || muralItems.length > 0) {
      setStatus("Dados atualizados a partir do Firestore.", "success");
    } else {
      setStatus("Firestore conectado · conteúdo local exibido enquanto a base recebe seus primeiros registros.", "empty");
    }
  } catch (error) {
    console.error("Não foi possível carregar os dados públicos do Firestore.", error);
    setStatus("Firestore indisponível no momento · conteúdo local exibido.", "error");
  }
}

loadFirestoreContent();
