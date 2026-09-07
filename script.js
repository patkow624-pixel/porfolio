document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       HEADER
    ========================= */

    const header = document.getElementById("header");

    if (header) {
        const updateHeader = function () {
            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };

        updateHeader();

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });
    }


    /* =========================
       PŁYNNE PRZEWIJANIE
    ========================= */

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =========================
       ANIMACJE SEKCJI
    ========================= */

    const sections = document.querySelectorAll("main section");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observerInstance.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.08
            }
        );

        sections.forEach(function (section) {

            section.classList.add("reveal");

            observer.observe(section);

        });

    } else {

        sections.forEach(function (section) {
            section.classList.add("visible");
        });

    }


    /* =========================
       FORMULARZ
    ========================= */

    const contactForm = document.getElementById("contact-form");
    const formSuccess = document.getElementById("form-success");
    const newMessageButton = document.getElementById("new-message");
    const submitButton = document.getElementById("submit-button");


    if (contactForm) {

        contactForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            if (submitButton) {
                submitButton.disabled = true;

                const buttonText =
                    submitButton.querySelector("span:first-child");

                if (buttonText) {
                    buttonText.textContent = "Wysyłanie...";
                }
            }

            try {

                const response = await fetch(
                    contactForm.action,
                    {
                        method: "POST",

                        body: new FormData(contactForm),

                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


                if (!response.ok) {
                    throw new Error("Formularz nie został wysłany.");
                }


                contactForm.style.display = "none";


                if (formSuccess) {

                    formSuccess.style.display = "block";

                    formSuccess.setAttribute(
                        "aria-hidden",
                        "false"
                    );
                }


            } catch (error) {

                console.error(
                    "Błąd wysyłania formularza:",
                    error
                );

                alert(
                    "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę."
                );


                if (submitButton) {

                    submitButton.disabled = false;

                    const buttonText =
                        submitButton.querySelector("span:first-child");

                    if (buttonText) {
                        buttonText.textContent =
                            "Wyślij wiadomość";
                    }
                }

            }

        });

    }


    /* =========================
       NOWA WIADOMOŚĆ
    ========================= */

    if (newMessageButton && contactForm) {

        newMessageButton.addEventListener("click", function () {

            contactForm.reset();

            contactForm.style.display = "block";


            if (formSuccess) {

                formSuccess.style.display = "none";

                formSuccess.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }


            if (submitButton) {

                submitButton.disabled = false;

                const buttonText =
                    submitButton.querySelector("span:first-child");

                if (buttonText) {
                    buttonText.textContent =
                        "Wyślij wiadomość";
                }
            }


            contactForm.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    }


    /* =========================
       BRAKUJĄCE ZDJĘCIA PORTFOLIO
    ========================= */

    const portfolioImages =
        document.querySelectorAll(".project-image img");


    portfolioImages.forEach(function (image) {

        image.addEventListener("error", function () {

            const container =
                image.closest(".project-image");


            if (container) {
                container.classList.add("image-missing");
            }

        });


        /*
         * Obsługa sytuacji, gdy obraz
         * jest już niedostępny przy
         * uruchomieniu strony.
         */

        if (image.complete && image.naturalWidth === 0) {

            const container =
                image.closest(".project-image");


            if (container) {
                container.classList.add("image-missing");
            }

        }

    });

});