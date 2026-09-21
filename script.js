const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyPlkeANJZn1tkzfz1rMkrKK11gm1Ed6tJbzId2hE2tsWZta9QuKfy8q6ypAPkzlqLl/exec";

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const leadForm = document.getElementById("leadForm");
const formStatus = document.getElementById("formStatus");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("everSupportTheme");
if (savedTheme === "dark") {
  body.dataset.theme = "dark";
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle.addEventListener("click", () => {
  const isDark = body.dataset.theme === "dark";
  if (isDark) {
    delete body.dataset.theme;
    localStorage.setItem("everSupportTheme", "light");
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    body.dataset.theme = "dark";
    localStorage.setItem("everSupportTheme", "dark");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }
});

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.innerHTML = open
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal, .scale-in").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
  observer.observe(el);
});

leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")) {
    setStatus("لینک Google Apps Script هنوز در فایل script.js قرار نگرفته است.", "error");
    return;
  }

  const submitBtn = leadForm.querySelector(".submit-btn");
  const buttonText = submitBtn.querySelector("span");
  const originalText = buttonText.textContent;

  const payload = {
    fullName: leadForm.fullName.value.trim(),
    phone: leadForm.phone.value.trim(),
    email: leadForm.email.value.trim(),
    title: leadForm.title.value.trim(),
    description: leadForm.description.value.trim(),
    timestamp: new Date().toISOString()
  };

  submitBtn.disabled = true;
  buttonText.textContent = "در حال ارسال...";
  formStatus.className = "form-status";
  formStatus.textContent = "";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    setStatus("درخواست شما با موفقیت ارسال شد. ممنون که EverSupportCo را انتخاب کردید.", "success");
    leadForm.reset();
  } catch (error) {
    console.error(error);
    setStatus("ارسال انجام نشد. لطفاً اتصال اینترنت و لینک Google Apps Script را بررسی کنید.", "error");
  } finally {
    submitBtn.disabled = false;
    buttonText.textContent = originalText;
  }
});

function setStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}
