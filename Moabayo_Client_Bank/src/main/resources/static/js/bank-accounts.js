// ===== Mock Data =====
const MOCK = {
  accounts: [
    {
      id: "A-001",
      icon: "💳",
      name: "생활비통장",
      number: "110-123-456789",
      product: "모으냥즈 입출금",
      type: "DEPOSIT",
      balance: 1250340,
      openedAt: "2024-08-12",
      history: [
        { ts: "2025-08-10 12:10", type: "입금", amount: 300000, bal: 1250340 },
        { ts: "2025-08-04 08:31", type: "카드결제", amount: -23000, bal: 950340 },
        { ts: "2025-07-28 18:20", type: "이체수신", amount: 500000, bal: 973340 },
        { ts: "2025-07-21 09:15", type: "편의점", amount: -2300, bal: 473340 },
      ],
    },
    {
      id: "A-002",
      icon: "🏦",
      name: "냥청년 적금",
      number: "210-456-987654",
      product: "12개월 만기 · 자동이체",
      type: "SAVINGS",
      balance: 3200000,
      openedAt: "2025-01-03",
      history: [
        { ts: "2025-08-01 09:00", type: "자동이체", amount: 200000, bal: 3200000 },
        { ts: "2025-07-01 09:00", type: "자동이체", amount: 200000, bal: 3000000 },
        { ts: "2025-06-01 09:00", type: "자동이체", amount: 200000, bal: 2800000 },
      ],
    },
    {
      id: "A-003",
      icon: "📄",
      name: "학자금대출",
      number: "390-777-222222",
      product: "변동금리 · 매월 25일 상환",
      type: "LOAN",
      balance: -8200000,
      openedAt: "2023-03-11",
      history: [
        { ts: "2025-07-25 10:00", type: "원리금 상환", amount: 350000, bal: -8200000 },
        { ts: "2025-06-25 10:00", type: "원리금 상환", amount: 350000, bal: -8550000 },
      ],
    },
  ],
};

// ===== Helpers =====
const fmt = (n) => Number(n).toLocaleString("ko-KR");
const el = (sel, root = document) => root.querySelector(sel);
const els = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== State =====
let view = {
  list: [...MOCK.accounts],
  selectedId: null,
  sort: "RECENT",
  type: "",
  q: "",
};

// ===== Renderers =====
function renderStats() {
  const total = view.list.reduce((s, a) => s + a.balance, 0);
  const latest = [...view.list]
    .map((a) => a.openedAt)
    .filter(Boolean)
    .sort()
    .slice(-1)[0];

  el("#stat-total").textContent = `${fmt(total)} 원`;
  el("#stat-count").textContent = view.list.length.toString();
  el("#stat-latest").textContent = latest || "-";
}

function badgeClass(type) {
  if (type === "DEPOSIT") return "b-dep";
  if (type === "SAVINGS") return "b-sav";
  if (type === "LOAN") return "b-loan";
  return "b-dep";
}

function renderList() {
  const root = el("#accList");
  root.innerHTML = "";

  if (view.list.length === 0) {
    root.innerHTML = `<div class="detail-empty"><div class="cat">😿</div><p>조건에 맞는 계좌가 없습니다.</p></div>`;
    return;
  }

  view.list.forEach((a) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "acc-card";
    card.setAttribute("role", "listitem");
    card.dataset.id = a.id;
    card.innerHTML = `
      <div class="acc-left">
        <div class="acc-ico">${a.icon}</div>
        <div class="acc-meta">
          <div class="name">${a.name}</div>
          <div class="sub">${a.number} · ${a.product}</div>
        </div>
        <span class="badge ${badgeClass(a.type)}">${a.type}</span>
      </div>
      <div class="acc-right">
        <div class="bal">${fmt(a.balance)} 원</div>
        <a class="btn btn-outline view-btn" href="#">보기</a>
      </div>
    `;
    card.addEventListener("click", (e) => {
      // '보기' 버튼만 눌러도 동일 동작
      e.preventDefault();
      selectAccount(a.id);
    });
    root.appendChild(card);
  });
}

function renderDetail(acc) {
  if (!acc) {
    el("#detailEmpty").hidden = false;
    el("#detailBody").hidden = true;
    return;
  }
  el("#detailEmpty").hidden = true;
  el("#detailBody").hidden = false;

  el("#detailType").textContent = acc.type;
  el("#detailType").className = `pill pill-dark ${badgeClass(acc.type)}`;

  el("#dName").textContent = acc.name;
  el("#dNumber").textContent = acc.number;
  el("#dProduct").textContent = acc.product;
  el("#dOpened").textContent = `개설일 ${acc.openedAt}`;
  el("#dBalance").textContent = `${fmt(acc.balance)} 원`;

  el("#dSend").href = `/bank/transfer?from=${encodeURIComponent(acc.id)}`;
  el("#dMore").href = `/bank/account/${encodeURIComponent(acc.id)}`;

  // history
  const tbody = el("#dHistory");
  tbody.innerHTML = "";
  (acc.history || []).forEach((h) => {
    const tr = document.createElement("tr");
    const amount = Number(h.amount);
    tr.innerHTML = `
      <td>${h.ts}</td>
      <td>${h.type}</td>
      <td class="t-right">${fmt(amount)}</td>
      <td class="t-right">${fmt(h.bal)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function selectAccount(id) {
  view.selectedId = id;
  els(".acc-card").forEach((c) => c.classList.toggle("is-active", c.dataset.id === id));
  const acc = MOCK.accounts.find((a) => a.id === id);
  renderDetail(acc);
}

// ===== Filters & Sort =====
function applyFilters() {
  const q = view.q.trim().toLowerCase();
  view.list = MOCK.accounts.filter((a) => {
    const mType = view.type ? a.type === view.type : true;
    const mQ =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.number.toLowerCase().includes(q) ||
      a.product.toLowerCase().includes(q);
    return mType && mQ;
  });

  if (view.sort === "BALANCE_DESC") view.list.sort((a, b) => b.balance - a.balance);
  else if (view.sort === "BALANCE_ASC") view.list.sort((a, b) => a.balance - b.balance);
  else view.list.sort((a, b) => (a.openedAt > b.openedAt ? -1 : 1)); // RECENT

  renderList();
  renderStats();
}

// ===== Init =====
window.addEventListener("DOMContentLoaded", () => {
  // Controls
  const $q = el("#q");
  const $type = el("#type");
  const $sort = el("#sort");
  const $reset = el("#resetBtn");

  $q.addEventListener("input", (e) => {
    view.q = e.target.value || "";
    applyFilters();
  });
  $type.addEventListener("change", (e) => {
    view.type = e.target.value || "";
    applyFilters();
  });
  $sort.addEventListener("change", (e) => {
    view.sort = e.target.value || "RECENT";
    applyFilters();
  });
  $reset.addEventListener("click", () => {
    view.q = ""; view.type = ""; view.sort = "RECENT";
    $q.value = ""; $type.value = ""; $sort.value = "RECENT";
    applyFilters();
  });

  // First render
  applyFilters();

  // Optional: 첫 카드 자동 선택
  if (view.list[0]) selectAccount(view.list[0].id);
});
function selectAccount(id) {
  view.selectedId = id;
  document.querySelector('.bank-accounts')?.classList.add('detail-wide'); // ★ 추가
  els(".acc-card").forEach((c) => c.classList.toggle("is-active", c.dataset.id === id));
  const acc = MOCK.accounts.find((a) => a.id === id);
  renderDetail(acc);
}

// EDIT HERE: 선택 시 상태 클래스 추가
document.querySelector('.bank-accounts')?.classList.add('detail-wide');
