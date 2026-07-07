/*
  Panini FIFA World Cup 2026 - Set de Actualización - Preventa Diunsa
  Phase 1: landing page + client-side form validation.

  Integration point for phase 2: this form currently POSTs JSON to
  RESERVA_ENDPOINT. That endpoint is expected to be a PHP script that
  writes the reservation to the database and triggers the downstream
  Postman-run automation. Point RESERVA_ENDPOINT at the real script
  once it exists; no other changes should be needed here.
*/

const RESERVA_ENDPOINT = "/reserva.php";

document.addEventListener("DOMContentLoaded", () => {
  setupScrollReveal();
  setupForm();
});

function setupScrollReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el) => observer.observe(el));
}

function setupForm(){
  const form = document.getElementById("reservaForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("formStatus");

  const fields = {
    nombre: {
      input: document.getElementById("nombre"),
      error: document.getElementById("err-nombre"),
      validate: (v) => v.trim().length >= 3 || "Ingresa tu nombre completo.",
    },
    identidad: {
      input: document.getElementById("identidad"),
      error: document.getElementById("err-identidad"),
      validate: (v) => /^\d{13}$/.test(v) || "Debe tener exactamente 13 dígitos, sin guiones.",
    },
    tienda: {
      input: document.getElementById("tienda"),
      error: document.getElementById("err-tienda"),
      validate: (v) => v !== "" || "Selecciona una tienda para retirar tu set.",
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("err-email"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Ingresa un correo electrónico válido.",
    },
    telefono: {
      input: document.getElementById("telefono"),
      error: document.getElementById("err-telefono"),
      validate: (v) => /^\d{8}$/.test(v) || "Debe tener exactamente 8 dígitos, sin guiones.",
    },
    consentimiento: {
      input: document.getElementById("consentimiento"),
      error: document.getElementById("err-consentimiento"),
      validate: (_v, el) => el.checked || "Debes aceptar el uso de tus datos para continuar.",
    },
  };

  // Digit-only inputs: strip anything non-numeric as the user types.
  fields.identidad.input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 13);
  });
  fields.telefono.input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
  });

  Object.values(fields).forEach(({ input }) => {
    input.addEventListener("blur", () => validateField(input.name));
  });

  function validateField(name){
    const field = fields[name];
    const el = field.input;
    const value = el.type === "checkbox" ? el.checked : el.value;
    const result = field.validate(value, el);
    const message = result === true ? "" : result;

    field.error.textContent = message;
    el.classList.toggle("is-invalid", Boolean(message));
    return !message;
  }

  function validateAll(){
    let valid = true;
    Object.keys(fields).forEach((name) => {
      if (!validateField(name)) valid = false;
    });
    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.removeAttribute("data-state");

    if (!validateAll()){
      statusEl.textContent = "Revisa los campos marcados en rojo.";
      statusEl.setAttribute("data-state", "error");
      return;
    }

    const payload = {
      nombre: fields.nombre.input.value.trim(),
      identidad: fields.identidad.input.value,
      tienda: fields.tienda.input.value,
      email: fields.email.input.value.trim(),
      telefono: fields.telefono.input.value,
    };

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn__label").textContent = "Enviando...";

    try {
      const response = await fetch(RESERVA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("request-failed");

      statusEl.textContent = "¡Reserva confirmada! Revisa tu correo para el detalle.";
      statusEl.setAttribute("data-state", "success");
      form.reset();
    } catch (err) {
      statusEl.textContent = "No pudimos enviar tu reserva. Intenta de nuevo en unos minutos.";
      statusEl.setAttribute("data-state", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn__label").textContent = "Confirmar reserva";
    }
  });
}
