const preloader = document.getElementById("preloader");
const body = document.body;
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const navLinks = nav ? Array.from(nav.querySelectorAll("a")) : [];
const categoryCards = Array.from(document.querySelectorAll(".portfolio-category"));

const galleryModal = document.getElementById("galleryModal");
const galleryImage = document.getElementById("galleryImage");
const galleryTitle = document.getElementById("galleryTitle");
const galleryDescription = document.getElementById("galleryDescription");
const galleryCounter = document.getElementById("galleryCounter");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryClose = document.getElementById("galleryClose");


const portfolioData = {
  bridal: {
    title: "Свадебный макияж",
    description: "Нежный, стойкий и фотогеничный свадебный макияж.",
    items: [
      { image: "images/wedding.jpeg" },
      { image: "images/wedding1.jpeg" }
    ]
  },

  day: {
    title: "Дневной макияж",
    description: "Свежий, легкий и естественный макияж на каждый день и важные встречи.",
    items: [
      { image: "images/day.jpeg" },
      { image: "images/day1.jpeg" }
    ]
  },

  lifting: {
    title: "Лифтинг-макияж",
    description: "Мягкая коррекция, свежесть и деликатный омолаживающий эффект.",
    items: [
      { image: "images/lifting.jpeg" },
      { image: "images/lifting1.jpeg" },
      { image: "images/lifting2.jpeg" }
    ]
  },

  evening: {
    title: "Вечерний макияж",
    description: "Более выразительный макияж для мероприятий, ужинов и выходов.",
    items: [
      { image: "images/night.jpeg" },
      { image: "images/night1.jpeg" },
      { image: "images/night2.jpeg" },
      { image: "images/night3.jpeg" },
      { image: "images/smoky.jpeg" }
    ]
  },

  shooting: {
    title: "Макияж для съемки",
    description: "Макияж для фотосъемки, который красиво работает в кадре.",
    items: [
      { image: "images/photo.jpeg" },
      { image: "images/photo1.jpeg" }
    ]
  },
};

let currentCategory = "bridal";
let currentItems = portfolioData[currentCategory].items;
let activeIndex = 0;

function openMenu() {
  if (!burger || !nav) return;
  burger.classList.add("is-active");
  burger.setAttribute("aria-expanded", "true");
  nav.classList.add("is-open");
  body.classList.add("menu-open");
}

function closeMenu() {
  if (!burger || !nav) return;
  burger.classList.remove("is-active");
  burger.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  body.classList.remove("menu-open");
}

if (burger) {
  burger.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      closeMenu();
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

function renderSlide(index) {
  const item = currentItems[index];
  const category = portfolioData[currentCategory];

  if (!item || !galleryImage || !galleryTitle || !galleryDescription || !galleryCounter) {
    return;
  }

  galleryImage.src = item.image;
  galleryImage.alt = category.title;
  galleryTitle.textContent = category.title;
  galleryDescription.textContent = category.description;
  galleryCounter.textContent = `${index + 1} / ${currentItems.length}`;

  if (galleryPrev) {
    galleryPrev.style.display = currentItems.length > 1 ? "grid" : "none";
  }

  if (galleryNext) {
    galleryNext.style.display = currentItems.length > 1 ? "grid" : "none";
  }

  if (currentItems.length > 1) {
    const nextIndex = (index + 1) % currentItems.length;
    const prevIndex = (index - 1 + currentItems.length) % currentItems.length;

    preloadImage(currentItems[nextIndex].image);
    preloadImage(currentItems[prevIndex].image);
  }
}

function openGallery(category, index = 0) {
  if (!galleryModal || !portfolioData[category]) return;

  currentCategory = category;
  currentItems = portfolioData[category].items;
  activeIndex = index;

  renderSlide(activeIndex);

  galleryModal.classList.add("is-open");
  galleryModal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
}

function closeGallery() {
  if (!galleryModal) return;
  galleryModal.classList.remove("is-open");
  galleryModal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
}

function showNext() {
  if (currentItems.length <= 1) return;
  activeIndex = (activeIndex + 1) % currentItems.length;
  renderSlide(activeIndex);
}

function showPrev() {
  if (currentItems.length <= 1) return;
  activeIndex = (activeIndex - 1 + currentItems.length) % currentItems.length;
  renderSlide(activeIndex);
}

categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    openGallery(card.dataset.category, 0);
  });
});

if (galleryPrev) {
  galleryPrev.addEventListener("click", showPrev);
}

if (galleryNext) {
  galleryNext.addEventListener("click", showNext);
}

if (galleryClose) {
  galleryClose.addEventListener("click", closeGallery);
}

if (galleryModal) {
  galleryModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.close === "true") {
      closeGallery();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGallery();
    closeMenu();
  }

  if (!galleryModal || !galleryModal.classList.contains("is-open")) return;

  if (event.key === "ArrowRight") {
    showNext();
  }

  if (event.key === "ArrowLeft") {
    showPrev();
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const reviewsTrack = document.getElementById("reviewsTrack");
const reviewsPrev = document.getElementById("reviewsPrev");
const reviewsNext = document.getElementById("reviewsNext");
const reviewsDots = document.getElementById("reviewsDots");
const reviewSlides = reviewsTrack ? Array.from(reviewsTrack.querySelectorAll(".review-slide")) : [];

let reviewIndex = 0;

function renderReviewsSlider() {
  if (!reviewsTrack || !reviewSlides.length) return;

  reviewsTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;

  if (reviewsDots) {
    const dots = Array.from(reviewsDots.querySelectorAll(".reviews-slider__dot"));
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === reviewIndex);
    });
  }
}

function createReviewsDots() {
  if (!reviewsDots || !reviewSlides.length) return;

  reviewsDots.innerHTML = "";

  reviewSlides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "reviews-slider__dot";
    dot.setAttribute("aria-label", `Перейти к отзыву ${index + 1}`);
    dot.addEventListener("click", () => {
      reviewIndex = index;
      renderReviewsSlider();
    });
    reviewsDots.appendChild(dot);
  });

  renderReviewsSlider();
}

if (reviewsPrev) {
  reviewsPrev.addEventListener("click", () => {
    if (!reviewSlides.length) return;
    reviewIndex = (reviewIndex - 1 + reviewSlides.length) % reviewSlides.length;
    renderReviewsSlider();
  });
}

if (reviewsNext) {
  reviewsNext.addEventListener("click", () => {
    if (!reviewSlides.length) return;
    reviewIndex = (reviewIndex + 1) % reviewSlides.length;
    renderReviewsSlider();
  });
}

createReviewsDots();

window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add("is-hidden");

    setTimeout(() => {
      preloader.remove();
    }, 800);
  }, 1500);
});