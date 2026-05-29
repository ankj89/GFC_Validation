// =========================================
// VALIDATION STORE
// =========================================

let validationStore = [];

// =========================================
// SAVE PAGE VALIDATION
// =========================================

function saveCurrentPageValidation() {

    const room =
        document.getElementById(
            "roomDropdown"
        )?.value || "";

    const selectedItems =
        Array.from(
            document.getElementById(
                "itemDropdown"
            ).selectedOptions
        ).map(
            option => option.value
        );

    const selectedCategories =
        Array.from(
            document.getElementById(
                "categoryDropdown"
            ).selectedOptions
        ).map(
            option => option.value
        );

    const drawingNotAvailable =
        document.getElementById(
            "drawingNotAvailable"
        )?.checked || false;

    const drawingMissingReason =
        document.getElementById(
            "drawingMissingReason"
        )?.value || "";

    const overallRemarks =
        document.getElementById(
            "overallRemarks"
        )?.value || "";

    const checklistResults =
        getChecklistValidationData();

    const pageNumber =
        getCurrentPageNumber();

    const pageValidation = {

        page: pageNumber,

        room: room,

        items: selectedItems,

        categories: selectedCategories,

        drawingNotAvailable:
            drawingNotAvailable,

        drawingMissingReason:
            drawingMissingReason,

        overallRemarks:
            overallRemarks,

        checklistResults:
            checklistResults,

        lastUpdated:
            new Date().toISOString()

    };

    const existingIndex =
        validationStore.findIndex(
            item =>
                item.page === pageNumber
        );

    if (existingIndex >= 0) {

        validationStore[
            existingIndex
        ] = pageValidation;

    } else {

        validationStore.push(
            pageValidation
        );

    }

    console.log(
        "Validation Saved",
        pageValidation
    );

    alert(
        `Page ${pageNumber} saved successfully`
    );

}

function getRoomSelectedItems() {

    const roomMap = {};

    validationStore.forEach(
        page => {

            if(
                !roomMap[
                    page.room
                ]
            ) {

                roomMap[
                    page.room
                ] = new Set();
            }

            page.items.forEach(
                item => {

                    roomMap[
                        page.room
                    ].add(item);

                }
            );

        }
    );

    return roomMap;
}

function getBOQCoverage() {

    const selectedItems =
        getRoomSelectedItems();

    const report = [];

    Object.keys(
        projectMaster.roomItemMap
    ).forEach(room => {

        const boqItems =
            projectMaster
            .roomItemMap[
                room
            ];

        boqItems.forEach(item => {

            const found =

                selectedItems[room]

                &&

                selectedItems[
                    room
                ].has(item);

            report.push({

                room:
                    room,

                item:
                    item,

                validated:
                    found === true

            });

        });

    });

    return report;
}

// =========================================
// LOAD PAGE VALIDATION
// =========================================

function loadPageValidation(
    pageNumber
) {

    const pageData =
        validationStore.find(
            item =>
                item.page === pageNumber
        );

    if (!pageData) {

        clearValidationForm();

        return;
    }

    // ROOM

    document.getElementById(
        "roomDropdown"
    ).value =
        pageData.room || "";

    // ITEMS

    const itemDropdown =
        document.getElementById(
            "itemDropdown"
        );

    Array.from(
        itemDropdown.options
    ).forEach(option => {

        option.selected =
            pageData.items.includes(
                option.value
            );

    });

    // CATEGORIES

    const categoryDropdown =
        document.getElementById(
            "categoryDropdown"
        );

    Array.from(
        categoryDropdown.options
    ).forEach(option => {

        option.selected =
            pageData.categories.includes(
                option.value
            );

    });

    // REBUILD CHECKLIST

    generateChecklist();

    // LOAD CHECKLIST VALUES

    loadChecklistData(
        pageData.checklistResults
    );

    // DRAWING STATUS

    document.getElementById(
        "drawingNotAvailable"
    ).checked =
        pageData.drawingNotAvailable;

    document.getElementById(
        "drawingMissingReason"
    ).value =
        pageData.drawingMissingReason;

    document.getElementById(
        "overallRemarks"
    ).value =
        pageData.overallRemarks;

}

// =========================================
// CLEAR FORM
// =========================================

function clearValidationForm() {

    document.getElementById(
        "roomDropdown"
    ).value = "";

    document.getElementById(
        "drawingNotAvailable"
    ).checked = false;

    document.getElementById(
        "drawingMissingReason"
    ).value = "";

    document.getElementById(
        "overallRemarks"
    ).value = "";

    // CLEAR ITEMS

    const itemDropdown =
        document.getElementById(
            "itemDropdown"
        );

    Array.from(
        itemDropdown.options
    ).forEach(option => {

        option.selected = false;

    });

    // CLEAR CATEGORIES

    const categoryDropdown =
        document.getElementById(
            "categoryDropdown"
        );

    Array.from(
        categoryDropdown.options
    ).forEach(option => {

        option.selected = false;

    });

    checklistContainer.innerHTML = "";

}

// =========================================
// GET ALL VALIDATIONS
// =========================================

function getAllValidations() {

    return validationStore;

}

// =========================================
// GET PAGE VALIDATION
// =========================================

function getValidationByPage(
    pageNumber
) {

    return validationStore.find(
        item =>
            item.page === pageNumber
    );

}

// =========================================
// DELETE PAGE VALIDATION
// =========================================

function deletePageValidation(
    pageNumber
) {

    validationStore =
        validationStore.filter(
            item =>
                item.page !== pageNumber
        );

}

// =========================================
// COVERAGE REPORT DATA
// =========================================

function getValidatedItems() {

    const validatedItems = [];

    validationStore.forEach(page => {

        page.items.forEach(item => {

            validatedItems.push({

                room: page.room,

                item: item,

                page: page.page

            });

        });

    });

    return validatedItems;

}



// =========================================
// SUMMARY DATA
// =========================================

function getValidationSummary() {

    return validationStore.map(
        page => {

            const totalChecks =
                page.checklistResults
                    .length;

            const present =
                page.checklistResults
                    .filter(
                        item =>
                            item.status ===
                            "Present"
                    )
                    .length;

            const absent =
                page.checklistResults
                    .filter(
                        item =>
                            item.status ===
                            "Absent"
                    )
                    .length;

            const na =
                page.checklistResults
                    .filter(
                        item =>
                            item.status ===
                            "NA"
                    )
                    .length;

            return {

                page:
                    page.page,

                room:
                    page.room,

                itemCount:
                    page.items.length,

                categoryCount:
                    page.categories.length,

                totalChecks:
                    totalChecks,

                present:
                    present,

                absent:
                    absent,

                na:
                    na

            };

        }
    );

}

// =========================================
// SAVE BUTTON
// =========================================

document
    .getElementById(
        "saveValidationBtn"
    )
    ?.addEventListener(
        "click",
        saveCurrentPageValidation
    );
