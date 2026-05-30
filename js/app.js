// =========================================
// APP CONTROLLER - VERSION 3
// =========================================

// =========================================
// DOM
// =========================================

const gfcPdfInput =
    document.getElementById(
        "gfcPdfInput"
    );

const saveValidationBtn =
    document.getElementById(
        "saveValidationBtn"
    );

const generateReportBtn =
    document.getElementById(
        "generateReportBtn"
    );

const exportExcelBtn =
    document.getElementById(
        "exportExcelBtn"
    );

const categoryDropdown =
    document.getElementById(
        "categoryDropdown"
    );

const drawingNotAvailable =
    document.getElementById(
        "drawingNotAvailable"
    );

// =========================================
// INITIAL UI STATE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

function initializeApp() {

    // Validation hidden initially

    const mainLayout =
        document.querySelector(
            ".main-layout"
        );

    if (
        mainLayout
    ) {

        mainLayout.style.display =
            "none";

    }

    // Review hidden initially

    const reviewSection =
        document.getElementById(
            "boqReviewSection"
        );

    if (
        reviewSection
    ) {

        reviewSection.style.display =
            "none";

    }

    console.log(
        "GFC Validation Tool V3 Loaded"
    );

}

// =========================================
// GFC PDF UPLOAD
// =========================================

gfcPdfInput?.addEventListener(
    "change",
    handleGFCPdfUpload
);

async function handleGFCPdfUpload(
    event
) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    try {

        if (
            typeof loadPDF !==
            "function"
        ) {

            console.error(
                "loadPDF() missing"
            );

            return;

        }

        await loadPDF(
            file
        );

        console.log(
            "GFC PDF Loaded"
        );

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Failed to load GFC PDF"
        );

    }

}

// =========================================
// CATEGORY CHANGE
// =========================================

categoryDropdown?.addEventListener(
    "change",
    handleCategoryChange
);

function handleCategoryChange() {

    if (
        typeof generateChecklist ===
        "function"
    ) {

        generateChecklist();

    }

}

// =========================================
// DRAWING NOT AVAILABLE
// =========================================

drawingNotAvailable
?.addEventListener(
    "change",
    function () {

        const reasonBox =
            document.getElementById(
                "drawingMissingReason"
            );

        if (!reasonBox)
            return;

        reasonBox.disabled =
            !this.checked;

    }
);

// =========================================
// SAVE VALIDATION
// =========================================

saveValidationBtn
?.addEventListener(
    "click",
    function () {

        if (
            typeof saveCurrentPageValidation !==
            "function"
        ) {

            console.error(
                "saveCurrentPageValidation missing"
            );

            return;

        }

        saveCurrentPageValidation();

    }
);

// =========================================
// REPORTS
// =========================================

generateReportBtn
?.addEventListener(
    "click",
    function () {

        if (
            typeof generateReports !==
            "function"
        ) {

            console.error(
                "generateReports missing"
            );

            return;

        }

        generateReports();

    }
);

// =========================================
// EXCEL
// =========================================

exportExcelBtn
?.addEventListener(
    "click",
    function () {

        if (
            typeof exportValidationExcel !==
            "function"
        ) {

            console.error(
                "exportValidationExcel missing"
            );

            return;

        }

        exportValidationExcel();

    }
);

// =========================================
// HELPERS
// =========================================

function getSelectedValues(
    selectElement
) {

    return Array.from(
        selectElement.selectedOptions
    ).map(
        option =>
            option.value
    );

}

function getCurrentRoom() {

    const roomDropdown =
        document.getElementById(
            "roomDropdown"
        );

    return roomDropdown
        ? roomDropdown.value
        : "";

}

function getCurrentItems() {

    const itemDropdown =
        document.getElementById(
            "itemDropdown"
        );

    if (!itemDropdown) {
        return [];
    }

    return getSelectedValues(
        itemDropdown
    );

}

function getCurrentCategories() {

    const categoryDropdown =
        document.getElementById(
            "categoryDropdown"
        );

    if (!categoryDropdown) {
        return [];
    }

    return getSelectedValues(
        categoryDropdown
    );

}

// =========================================
// DEBUG
// =========================================

window.debugProjectMaster =
    function () {

        console.log(
            projectMaster
        );

    };

window.debugValidationStore =
    function () {

        console.log(
            validationStore
        );

    };
