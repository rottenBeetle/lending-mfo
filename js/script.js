/**
 * Основная логика сайта ООО МФК "ФинансГрупп"
 * Включает: навигацию, анимации, мобильное меню, счетчики статистики
 */

// Ожидание загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  // Инициализация всех модулей
  initPageLoading();
  initMobileMenu();
  initSmoothScrolling();
  initActiveNavLinks();
  initScrollAnimations();
  initStatCounters();
  initButtonEffects();
  initContactLinks();
  initDocumentLinks();
});

/**
 * Управление кликов по документам
 */
function initDocumentLinks() {
  // Маппинг названий документов к файлам
  const documentMap = {
    "Устав МКК": "Устав МКК.pdf",
    "Свидетельство о внесении в госреестр МФО":
      "Свидетельство о внесении сведений о юридическом лице в государственный.pdf",
    "Свидетельство о членстве в СРО":
      "Свидетельство о подтверждении членства в СРО.pdf",
    "Правила предоставления микрозаймов":
      "Правила предоставления микрозаймов.pdf",
    "Базовый стандарт защиты прав и интересов физических и юридических лиц": "Базовый стандарт защиты прав и интересов физических и юридических лиц.pdf",
    "Базовый стандарт совершения МФО операций":
      "Базовый стандарт совершения МФО операций.pdf",
    "Базовый стандарт по управлению рисками МФО":
      "Базовый стандарт по управлению рисками МФО.pdf",
    "Политика обработки персональных данных":
      "Политика МКК в отношении обработки персональны данных.pdf",
  };

  // Добавляем обработчики клика для всех документов
  const documentItems = document.querySelectorAll(".document-item");

  documentItems.forEach((item) => {
    item.addEventListener("click", function () {
      const docTitle = this.querySelector(".doc-title").textContent;
      const fileName = documentMap[docTitle.trim()];

      if (fileName) {
        // Открываем документ в новой вкладке
        window.open(`documents/${fileName}`, "_blank");
      }
    });

    // Добавляем стиль курсора для показа кликабельности
    item.style.cursor = "pointer";
  });
}

/**
 * Управление экраном загрузки
 */
function initPageLoading() {
  const pageLoading = document.getElementById("pageLoading");

  // Скрытие экрана загрузки после полной загрузки
  window.addEventListener("load", function () {
    setTimeout(() => {
      if (pageLoading) {
        pageLoading.classList.add("hide");
        setTimeout(() => {
          pageLoading.style.display = "none";
        }, 500);
      }
    }, 300);
  });
}

/**
 * Мобильное меню
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (!mobileMenuBtn || !navLinks) return;

  // Переключение мобильного меню
  mobileMenuBtn.addEventListener("click", function () {
    const isActive = navLinks.classList.contains("active");

    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Закрытие меню при клике на ссылку
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Закрытие меню при клике вне его области
  document.addEventListener("click", function (e) {
    const isClickInsideMenu = navLinks.contains(e.target);
    const isClickOnButton = mobileMenuBtn.contains(e.target);

    if (
      !isClickInsideMenu &&
      !isClickOnButton &&
      navLinks.classList.contains("active")
    ) {
      closeMobileMenu();
    }
  });

  // Закрытие меню при изменении размера окна
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  function openMobileMenu() {
    navLinks.classList.add("active");
    mobileMenuBtn.classList.add("active");
    document.body.style.overflow = "hidden";

    // Анимация появления пунктов меню
    const menuItems = navLinks.querySelectorAll("li");
    menuItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      setTimeout(() => {
        item.style.transition = "all 0.3s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  function closeMobileMenu() {
    navLinks.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    document.body.style.overflow = "";

    // Сброс стилей пунктов меню
    const menuItems = navLinks.querySelectorAll("li");
    menuItems.forEach((item) => {
      item.style.opacity = "";
      item.style.transform = "";
      item.style.transition = "";
    });
  }
}

/**
 * Плавная прокрутка к секциям
 */
function initSmoothScrolling() {
  // Обработка всех ссылок, начинающихся с #
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Обновление активных ссылок навигации при скролле
 */
function initActiveNavLinks() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length) return;

  function updateActiveNavLink() {
    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // Обновление при скролле с оптимизацией производительности
  let ticking = false;

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateActiveNavLink);
      ticking = true;
    }
  }

  window.addEventListener("scroll", function () {
    requestTick();
    ticking = false;
  });

  // Инициализация активной ссылки
  updateActiveNavLink();
}

/**
 * Анимации при появлении элементов в области видимости
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (!animatedElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Отключаем наблюдение после анимации для экономии ресурсов
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Анимированные счетчики статистики
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll(".stat-number[data-count]");

  if (!statNumbers.length) return;

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 секунды
    const stepTime = duration / 100;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, stepTime);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const targetValue = parseInt(element.dataset.count);

          // Запуск анимации с небольшой задержкой
          setTimeout(() => {
            animateCounter(element, targetValue);
          }, 200);

          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Эффекты для кнопок
 */
function initButtonEffects() {
  // Эффект пульсации для основных кнопок
  const primaryButtons = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .contact-btn"
  );

  primaryButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Эффект масштабирования при клике
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);

      // Эффект пульсации
      createRippleEffect(e, this);
    });
  });

  function createRippleEffect(event, element) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    // Добавляем стили для пульсации
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.3)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.pointerEvents = "none";

    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);

    // Удаление элемента после анимации
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Добавляем CSS анимацию для пульсации
  if (!document.querySelector("#ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }
}

/**
 * Обработка контактных ссылок
 */
function initContactLinks() {
  // Форматирование телефонных номеров
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Аналитика клика по телефону (если нужно)
      console.log("Телефонный звонок:", this.href);
    });
  });

  // Обработка email ссылок
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Аналитика клика по email (если нужно)
      console.log("Email клик:", this.href);
    });
  });
}

/**
 * Инициализация системы уведомлений
 */
function initNotificationSystem() {
  // Создание контейнера для уведомлений
  const notificationContainer = document.createElement("div");
  notificationContainer.id = "notification-container";
  notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
    `;
  document.body.appendChild(notificationContainer);

  // Функция показа уведомления
  window.showNotification = function (message, type = "info", duration = 5000) {
    const notification = document.createElement("div");
    notification.style.cssText = `
            background: var(--${
              type === "error"
                ? "danger"
                : type === "success"
                ? "success"
                : "primary"
            });
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            margin-bottom: 12px;
            box-shadow: var(--shadow-lg);
            pointer-events: auto;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
            font-family: 'Inter', sans-serif;
        `;
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Автоматическое скрытие
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);

    // Закрытие по клику
    notification.addEventListener("click", function () {
      this.style.transform = "translateX(100%)";
      setTimeout(() => {
        this.remove();
      }, 300);
    });
  };
}

/**
 * Обработка ошибок загрузки изображений
 */
function initImageErrorHandling() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      this.style.display = "none";
      console.warn("Ошибка загрузки изображения:", this.src);
    });
  });
}

/**
 * Оптимизация производительности при скролле
 */
function initScrollOptimization() {
  let scrollTimer = null;

  window.addEventListener(
    "scroll",
    function () {
      // Добавляем класс при скролле
      document.body.classList.add("scrolling");

      // Убираем класс через 150ms после остановки скролла
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = setTimeout(() => {
        document.body.classList.remove("scrolling");
      }, 150);
    },
    { passive: true }
  );
}

/**
 * Обработка изменения размера окна
 */
function initResizeHandler() {
  let resizeTimer = null;

  window.addEventListener(
    "resize",
    function () {
      // Очищаем предыдущий таймер
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }

      // Выполняем действия через 250ms после завершения изменения размера
      resizeTimer = setTimeout(() => {
        // Пересчет позиций для плавной прокрутки
        updateScrollPositions();

        // Закрытие мобильного меню при увеличении экрана
        if (window.innerWidth > 768) {
          const navLinks = document.getElementById("navLinks");
          const mobileMenuBtn = document.getElementById("mobileMenuBtn");

          if (navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            mobileMenuBtn.classList.remove("active");
            document.body.style.overflow = "";
          }
        }
      }, 250);
    },
    { passive: true }
  );
}

/**
 * Обновление позиций для плавной прокрутки
 */
function updateScrollPositions() {
  // Обновление кэшированных позиций секций
  const sections = document.querySelectorAll("section[id]");
  const sectionPositions = new Map();

  sections.forEach((section) => {
    const id = section.getAttribute("id");
    const position = section.offsetTop;
    sectionPositions.set(id, position);
  });

  // Сохранение в глобальную переменную для использования в других функциях
  window.sectionPositions = sectionPositions;
}

/**
 * Инициализация дополнительных обработчиков событий
 */
function initAdditionalHandlers() {
  // Обработка клавиатурной навигации
  document.addEventListener("keydown", function (e) {
    // Закрытие мобильного меню по Escape
    if (e.key === "Escape") {
      const navLinks = document.getElementById("navLinks");
      const mobileMenuBtn = document.getElementById("mobileMenuBtn");

      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });

  // Обработка фокуса для доступности
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("using-keyboard");
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("using-keyboard");
  });
}

/**
 * Инициализация всех дополнительных функций при загрузке
 */
function initAllFeatures() {
  initNotificationSystem();
  initImageErrorHandling();
  initScrollOptimization();
  initResizeHandler();
  initAdditionalHandlers();
  updateScrollPositions();
}

/**
 * Утилитарные функции
 */
const utils = {
  // Задержка выполнения функции
  debounce: function (func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  // Ограничение частоты вызова функции
  throttle: function (func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Проверка поддержки функций браузером
  supportsFeature: function (feature) {
    switch (feature) {
      case "intersectionObserver":
        return "IntersectionObserver" in window;
      case "smoothScroll":
        return "scrollBehavior" in document.documentElement.style;
      case "backdropFilter":
        return (
          "backdropFilter" in document.documentElement.style ||
          "webkitBackdropFilter" in document.documentElement.style
        );
      default:
        return false;
    }
  },

  // Получение параметров из URL
  getUrlParameter: function (name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  // Установка параметра в URL без перезагрузки страницы
  setUrlParameter: function (name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, "", url);
  },
};

/**
 * Инициализация аналитики (если нужно)
 */
function initAnalytics() {
  // Отслеживание кликов по важным элементам
  document
    .querySelectorAll(".btn-primary, .btn-secondary, .contact-btn")
    .forEach((button) => {
      button.addEventListener("click", function () {
        const buttonText = this.textContent.trim();
        console.log("Button clicked:", buttonText);

        // Здесь можно добавить отправку данных в аналитику
        // Например: gtag('event', 'click', { button_name: buttonText });
      });
    });

  // Отслеживание скролла до определенных секций
  const sections = ["about", "services", "rates", "legal", "contacts"];
  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log("Section viewed:", sectionId);
              // gtag('event', 'section_view', { section_name: sectionId });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(section);
    }
  });
}

/**
 * Инициализация системы обратной связи
 */
function initFeedbackSystem() {
  // Обработка кликов по документам
  document.querySelectorAll(".document-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const documentTitle = this.querySelector(".document-title").textContent;

      // Показываем уведомление
      if (window.showNotification) {
        window.showNotification(
          `Документ "${documentTitle}" скоро будет доступен для скачивания`,
          "info",
          3000
        );
      }

      console.log("Document requested:", documentTitle);
    });
  });

  // Обработка форм обратной связи (если будут добавлены)
  const contactForms = document.querySelectorAll("form");
  contactForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Показываем уведомление об успешной отправке
      if (window.showNotification) {
        window.showNotification(
          "Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.",
          "success",
          5000
        );
      }
    });
  });
}

/**
 * Инициализация системы поиска (если нужно)
 */
function initSearchSystem() {
  // Создание простой системы поиска по содержимому
  window.searchContent = function (query) {
    const searchResults = [];
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTitle =
        section.querySelector(".section-title")?.textContent || "";
      const sectionContent = section.textContent.toLowerCase();
      const queryLower = query.toLowerCase();

      if (sectionContent.includes(queryLower)) {
        searchResults.push({
          id: section.id,
          title: sectionTitle,
          element: section,
        });
      }
    });

    return searchResults;
  };

  // Функция подсветки найденного текста
  window.highlightSearchResults = function (query) {
    // Удаляем предыдущую подсветку
    document.querySelectorAll(".search-highlight").forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });

    if (!query) return;

    // Находим и подсвечиваем новые результаты
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent;
      const regex = new RegExp(`(${query})`, "gi");

      if (regex.test(text)) {
        const highlightedHTML = text.replace(
          regex,
          '<mark class="search-highlight">$1</mark>'
        );
        const wrapper = document.createElement("div");
        wrapper.innerHTML = highlightedHTML;

        const fragment = document.createDocumentFragment();
        while (wrapper.firstChild) {
          fragment.appendChild(wrapper.firstChild);
        }

        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  };
}

/**
 * Инициализация системы кэширования
 */
function initCacheSystem() {
  // Простая система кэширования в localStorage
  window.cache = {
    set: function (key, value, ttl = 3600000) {
      // TTL по умолчанию 1 час
      const item = {
        value: value,
        timestamp: Date.now(),
        ttl: ttl,
      };
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (e) {
        console.warn("Cache storage failed:", e);
      }
    },

    get: function (key) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (!item) return null;

        const now = Date.now();
        if (now - item.timestamp > item.ttl) {
          localStorage.removeItem(key);
          return null;
        }

        return item.value;
      } catch (e) {
        console.warn("Cache retrieval failed:", e);
        return null;
      }
    },

    remove: function (key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn("Cache removal failed:", e);
      }
    },

    clear: function () {
      try {
        localStorage.clear();
      } catch (e) {
        console.warn("Cache clear failed:", e);
      }
    },
  };
}

/**
 * Инициализация системы темной темы (если нужно)
 */
function initThemeSystem() {
  // Проверка системных настроек
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Функция переключения темы
  window.toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    window.cache?.set("preferred-theme", newTheme);

    if (window.showNotification) {
      window.showNotification(
        `Переключено на ${newTheme === "dark" ? "темную" : "светлую"} тему`,
        "info",
        2000
      );
    }
  };

  // Загрузка сохраненной темы
  const savedTheme = window.cache?.get("preferred-theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  // Отслеживание изменения системных настроек
  prefersDarkScheme.addEventListener("change", function (e) {
    if (!window.cache?.get("preferred-theme")) {
      document.documentElement.setAttribute(
        "data-theme",
        e.matches ? "dark" : "light"
      );
    }
  });
}

/**
 * Инициализация системы обработки ошибок
 */
function initErrorHandling() {
  // Глобальная обработка ошибок JavaScript
  window.addEventListener("error", function (e) {
    console.error("Global error:", e.error);

    // Можно отправить ошибку в систему мониторинга
    // sendErrorToMonitoring(e.error);
  });

  // Обработка необработанных промисов
  window.addEventListener("unhandledrejection", function (e) {
    console.error("Unhandled promise rejection:", e.reason);

    // Предотвращение вывода ошибки в консоль браузера
    // e.preventDefault();
  });

  // Обработка ошибок загрузки ресурсов
  window.addEventListener(
    "error",
    function (e) {
      if (e.target !== window) {
        console.warn("Resource loading error:", e.target.src || e.target.href);
      }
    },
    true
  );
}

/**
 * Финальная инициализация всех систем
 */
function finalInit() {
  // Запуск всех дополнительных систем
  initAllFeatures();
  initAnalytics();
  initFeedbackSystem();
  initSearchSystem();
  initCacheSystem();
  initThemeSystem();
  initErrorHandling();

  // Добавление информации о загрузке в консоль
  console.log('✅ Сайт ООО МФК "ФинансГрупп" полностью загружен');
  console.log("📱 Мобильная версия:", window.innerWidth <= 768 ? "Да" : "Нет");
  console.log(
    "🔧 Доступные утилиты:",
    Object.keys(window).filter((key) =>
      ["showNotification", "searchContent", "toggleTheme", "cache"].includes(
        key
      )
    )
  );
}

// Запуск финальной инициализации после полной загрузки
window.addEventListener("load", finalInit);

// Экспорт утилит для использования в других скриптах
if (typeof module !== "undefined" && module.exports) {
  module.exports = { utils };
}
