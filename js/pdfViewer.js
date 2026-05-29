// =========================================
// PDF VIEWER MODULE
// =========================================

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// =========================================
// STATE
// =========================================

let pdfDocument = null;

let currentPage = 1;

let totalPages = 0;

let currentScale = 1.3;

// =========================================
// DOM
// =========================================

const pdfInput =
    document.getElementById(
        "gfcPdfInput"
    );

const canvas =
    document.getElementById(
        "pdfCanvas"
    );

const ctx =
    canvas.getContext("2d");

const currentPageElement =
    document.getElementById(
        "currentPage"
    );

const totalPagesElement =
    document.getElementById(
        "totalPages"
    );

// =========================================
// PDF UPLOAD
// =========================================

pdfInput?.addEventListener(
    "change",
    handlePdfUpload
);

async function handlePdfUpload(
    event
) {

    const file =
        event.target.files[0];

    if (!file) return;

    try {

        const arrayBuffer =
            await file.arrayBuffer();

        const pdfData =
            new Uint8Array(
                arrayBuffer
            );

        pdfDocument =
            await pdfjsLib
                .getDocument(pdfData)
                .promise;

        totalPages =
            pdfDocument.numPages;

        currentPage = 1;

        updatePageDisplay();

        await renderPage(
            currentPage
        );

        console.log(
            "PDF Loaded",
            totalPages
        );

    } catch (error) {

        console.error(
            "PDF Load Error",
            error
        );

        alert(
            "Unable to load PDF"
        );

    }

}

// =========================================
// RENDER PAGE
// =========================================

async function renderPage(
    pageNumber
) {

    if (!pdfDocument) return;

    try {

        const page =
            await pdfDocument.getPage(
                pageNumber
            );

        const viewport =
            page.getViewport({
                scale:
                    currentScale
            });

        canvas.height =
            viewport.height;

        canvas.width =
            viewport.width;

        await page.render({

            canvasContext:
                ctx,

            viewport:
                viewport

        }).promise;

        updatePageDisplay();

        // Load Validation
        loadPageValidation(
            pageNumber
        );

    } catch (error) {

        console.error(
            "Page Render Error",
            error
        );

    }

}

// =========================================
// PREVIOUS PAGE
// =========================================

async function previousPage() {

    if (!pdfDocument) return;

    if (currentPage <= 1)
        return;

    currentPage--;

    await renderPage(
        currentPage
    );

}

// =========================================
// NEXT PAGE
// =========================================

async function nextPage() {

    if (!pdfDocument) return;

    if (
        currentPage >= totalPages
    )
        return;

    currentPage++;

    await renderPage(
        currentPage
    );

}

// =========================================
// PAGE DISPLAY
// =========================================

function updatePageDisplay() {

    currentPageElement.innerText =
        currentPage;

    totalPagesElement.innerText =
        totalPages;

}

// =========================================
// CURRENT PAGE
// =========================================

function getCurrentPageNumber() {

    return currentPage;

}

// =========================================
// PAGE NAVIGATION BUTTONS
// =========================================

document
    .getElementById(
        "prevPageBtn"
    )
    ?.addEventListener(
        "click",
        previousPage
    );

document
    .getElementById(
        "nextPageBtn"
    )
    ?.addEventListener(
        "click",
        nextPage
    );

// =========================================
// ZOOM SUPPORT
// =========================================

async function zoomIn() {

    currentScale += 0.2;

    await renderPage(
        currentPage
    );

}

async function zoomOut() {

    if (currentScale <= 0.6)
        return;

    currentScale -= 0.2;

    await renderPage(
        currentPage
    );

}

// =========================================
// KEYBOARD SHORTCUTS
// =========================================

document.addEventListener(
    "keydown",
    async function (event) {

        if (
            event.key ===
            "ArrowRight"
        ) {

            await nextPage();

        }

        if (
            event.key ===
            "ArrowLeft"
        ) {

            await previousPage();

        }

    }
);

// =========================================
// PDF INFO
// =========================================

function getPdfInfo() {

    return {

        totalPages:
            totalPages,

        currentPage:
            currentPage,

        loaded:
            pdfDocument !== null

    };

}
