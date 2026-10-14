// نسخه نمایشی رابط ادمین؛ داده‌ها فعلاً از نمونه‌های زیر و localStorage مرورگر می‌آیند.
const demoLeads = [
  {
    id: 1,
    name: "سارا محمدی",
    phone: "09121234567",
    service: "طراحی سایت",
    date: "۱۴۰۵/۰۷/۲۱",
    status: "جدید",
    note: "",
  },
  {
    id: 2,
    name: "علی رضایی",
    phone: "09351234567",
    service: "پشتیبانی سایت",
    date: "۱۴۰۵/۰۷/۲۰",
    status: "در حال پیگیری",
    note: "تماس اولیه انجام شد",
  },
  {
    id: 3,
    name: "نگار احمدی",
    phone: "09199876543",
    service: "طراحی فروشگاه",
    date: "۱۴۰۵/۰۷/۱۹",
    status: "در انتظار پاسخ",
    note: "منتظر اعلام بودجه",
  },
  {
    id: 4,
    name: "محمد کریمی",
    phone: "09901234567",
    service: "طراحی سایت",
    date: "۱۴۰۵/۰۷/۱۸",
    status: "تبدیل‌شده",
    note: "قرارداد نهایی شد",
  },
  {
    id: 5,
    name: "مریم حسینی",
    phone: "09123456789",
    service: "مشاوره دیجیتال",
    date: "۱۴۰۵/۰۷/۱۷",
    status: "از دست‌رفته",
    note: "فعلاً منصرف شد",
  },
];
const defaultProjects = [
  {
    id: "p1",
    name: "وب‌سایت شرکتی",
    category: "طراحی سایت",
    url: "",
    image: "",
    description: "نمونه نمایشی برای نمایش کارت نمونه‌کار در پنل.",
    published: true,
  },
  {
    id: "p2",
    name: "فروشگاه آنلاین",
    category: "فروشگاه اینترنتی",
    url: "",
    image: "",
    description: "ساختار نمونه برای پروژه فروشگاهی.",
    published: false,
  },
];
const statusOptions = [
  "جدید",
  "در حال پیگیری",
  "در انتظار پاسخ",
  "تبدیل‌شده",
  "از دست‌رفته",
];
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let leads = demoLeads.map((x) => ({ ...x }));
let projects = readProjects();
function readProjects() {
  try {
    const v = localStorage.getItem("es_admin_projects");
    return v ? JSON.parse(v) : defaultProjects.map((x) => ({ ...x }));
  } catch {
    return defaultProjects.map((x) => ({ ...x }));
  }
}
function saveProjects() {
  localStorage.setItem("es_admin_projects", JSON.stringify(projects));
}
function faNum(n) {
  return new Intl.NumberFormat("fa-IR").format(n);
}
function statusClass(s) {
  return (
    {
      جدید: "status-new",
      "در حال پیگیری": "status-follow",
      "در انتظار پاسخ": "status-wait",
      تبدیل‌شده: "status-won",
      "از دست‌رفته": "status-lost",
    }[s] || "status-new"
  );
}
function statusBadge(s) {
  return `<span class="status ${statusClass(s)}">${s}</span>`;
}
function escapeHTML(v = "") {
  return String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function renderStats() {
  $("#statTotal").textContent = faNum(leads.length);
  $("#statNew").textContent = faNum(
    leads.filter((x) => x.status === "جدید").length,
  );
  $("#statFollow").textContent = faNum(
    leads.filter((x) => ["در حال پیگیری", "در انتظار پاسخ"].includes(x.status))
      .length,
  );
  $("#statWon").textContent = faNum(
    leads.filter((x) => x.status === "تبدیل‌شده").length,
  );
  $("#navLeadCount").textContent = faNum(
    leads.filter((x) => x.status === "جدید").length,
  );
  $("#recentLeads").innerHTML =
    leads
      .slice(0, 4)
      .map(
        (l) =>
          `<tr><td>${escapeHTML(l.name)}</td><td>${escapeHTML(l.phone)}</td><td>${statusBadge(l.status)}</td></tr>`,
      )
      .join("") || '<tr><td colspan="3">هنوز لیدی ثبت نشده است.</td></tr>';
}
function renderLeads() {
  const q = $("#leadSearch").value.trim().toLowerCase(),
    f = $("#statusFilter").value;
  const rows = leads.filter(
    (l) =>
      (f === "all" || l.status === f) &&
      [l.name, l.phone, l.service].some((v) =>
        String(v).toLowerCase().includes(q),
      ),
  );
  $("#leadsTable").innerHTML =
    rows
      .map(
        (l) =>
          `<tr><td><strong>${escapeHTML(l.name)}</strong></td><td dir="ltr">${escapeHTML(l.phone)}</td><td>${escapeHTML(l.service)}</td><td>${escapeHTML(l.date)}</td><td><select class="status-select" data-status-id="${l.id}" aria-label="تغییر وضعیت ${escapeHTML(l.name)}">${statusOptions.map((s) => `<option ${l.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td><td><input class="note-input" data-note-id="${l.id}" value="${escapeHTML(l.note)}" placeholder="افزودن یادداشت..." aria-label="یادداشت ${escapeHTML(l.name)}"></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="6" style="text-align:center;padding:35px">موردی با این مشخصات پیدا نشد.</td></tr>';
  $("#leadCount").textContent =
    `نمایش ${faNum(rows.length)} از ${faNum(leads.length)} لید`;
}
function renderProjects() {
  $("#portfolioGrid").innerHTML = projects
    .map(
      (p) =>
        `<article class="project-card"><div class="project-cover">${p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" onerror="this.remove()">` : "▧"}</div><div class="project-body"><span class="project-category">${escapeHTML(p.category || "بدون دسته‌بندی")}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description || "توضیحی ثبت نشده است.")}</p><div class="project-meta"><span class="${p.published ? "published" : "unpublished"}">${p.published ? "● فعال برای انتشار" : "○ پیش‌نویس"}</span><div class="project-actions"><button class="mini-btn" data-edit="${p.id}">ویرایش</button><button class="mini-btn delete" data-delete="${p.id}">حذف</button></div></div></div></article>`,
    )
    .join("");
  $("#portfolioEmpty").hidden = projects.length > 0;
  $("#portfolioGrid").hidden = projects.length === 0;
}
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
function navigate(page) {
  $$(".page").forEach((p) =>
    p.classList.toggle("active", p.id === `page-${page}`),
  );
  $$(".nav-link").forEach((b) =>
    b.classList.toggle("active", b.dataset.page === page),
  );
  $("#pageTitle").textContent =
    { dashboard: "داشبورد", leads: "مدیریت لیدها", portfolio: "نمونه‌کارها" }[
      page
    ] || "داشبورد";
  $("#sidebar").classList.remove("open");
}
$$(".nav-link").forEach((b) =>
  b.addEventListener("click", () => navigate(b.dataset.page)),
);
$$("[data-goto]").forEach((b) =>
  b.addEventListener("click", () => navigate(b.dataset.goto)),
);
$("#mobileMenu").addEventListener("click", () =>
  $("#sidebar").classList.toggle("open"),
);
$("#leadSearch").addEventListener("input", renderLeads);
$("#statusFilter").addEventListener("change", renderLeads);
$("#leadsTable").addEventListener("change", (e) => {
  if (e.target.dataset.statusId) {
    const l = leads.find((x) => x.id === Number(e.target.dataset.statusId));
    if (l) {
      l.status = e.target.value;
      renderStats();
      renderLeads();
      showToast("وضعیت لید تغییر کرد. (فقط در این نسخه نمایشی)");
    }
  }
  if (e.target.dataset.noteId) {
    const l = leads.find((x) => x.id === Number(e.target.dataset.noteId));
    if (l) l.note = e.target.value;
  }
});
function openProject(p) {
  $("#projectForm").reset();
  $("#projectId").value = p?.id || "";
  $("#projectName").value = p?.name || "";
  $("#projectCategory").value = p?.category || "";
  $("#projectUrl").value = p?.url || "";
  $("#projectImage").value = p?.image || "";
  $("#projectDescription").value = p?.description || "";
  $("#projectPublished").checked = p ? p.published : true;
  $("#modalTitle").textContent = p ? "ویرایش نمونه‌کار" : "افزودن نمونه‌کار";
  $("#projectDialog").showModal();
}
$("#addProject").addEventListener("click", () => openProject());
$("#emptyAdd").addEventListener("click", () => openProject());
$("#closeModal").addEventListener("click", () => $("#projectDialog").close());
$("#cancelModal").addEventListener("click", () => $("#projectDialog").close());
$("#projectForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("#projectId").value || `p${Date.now()}`;
  const p = {
    id,
    name: $("#projectName").value.trim(),
    category: $("#projectCategory").value.trim(),
    url: $("#projectUrl").value.trim(),
    image: $("#projectImage").value.trim(),
    description: $("#projectDescription").value.trim(),
    published: $("#projectPublished").checked,
  };
  const idx = projects.findIndex((x) => String(x.id) === String(id));
  if (idx >= 0) projects[idx] = p;
  else projects.unshift(p);
  saveProjects();
  renderProjects();
  $("#projectDialog").close();
  showToast("نمونه‌کار در این مرورگر ذخیره شد.");
});
$("#portfolioGrid").addEventListener("click", (e) => {
  const edit = e.target.closest("[data-edit]"),
    del = e.target.closest("[data-delete]");
  if (edit) {
    const p = projects.find((x) => String(x.id) === edit.dataset.edit);
    if (p) openProject(p);
  }
  if (del) {
    const p = projects.find((x) => String(x.id) === del.dataset.delete);
    if (p && confirm(`نمونه‌کار «${p.name}» حذف شود؟`)) {
      projects = projects.filter((x) => x.id !== p.id);
      saveProjects();
      renderProjects();
      showToast("نمونه‌کار از نسخه نمایشی حذف شد.");
    }
  }
});
$("#exportLeads").addEventListener("click", () => {
  const rows = [
    ["نام", "شماره تماس", "خدمت", "تاریخ ثبت", "وضعیت", "یادداشت"],
    ...leads.map((l) => [l.name, l.phone, l.service, l.date, l.status, l.note]),
  ];
  const csv =
    "\\ufeff" +
    rows
      .map((r) =>
        r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\\r\\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  a.download = "eversupport-leads-demo.csv";
  a.click();
  URL.revokeObjectURL(a.href);
});
renderStats();
renderLeads();
renderProjects();
