// =========================================
// VALIDATION STORE - VERSION 3
// =========================================

window.validationStore = [];

// =========================================
// SAVE CURRENT PAGE
// =========================================

function saveCurrentPageValidation() {

    const room =
        document.getElementById(
            "roomDropdown"
        )?.value || "";
    
const extraDrawingItems =
    collectExtraItems();
    
    const items =
        Array.from(
            document.getElementById(
                "itemDropdown"
            )?.selectedOptions || []
        ).map(
            option => option.value
        );

    const categories =
        Array.from(
            document.getElementById(
                "categoryDropdown"
            )?.selectedOptions || []
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

    const checklist =
        collectChecklist();

    const pageNo =
        getCurrentPageNumber();

    const existingIndex =
        validationStore.findIndex(
            row =>
                row.pageNo ===
                pageNo
        );

    const record = {

        pageNo,

        room,

        items,

        categories,

        checklist,

        drawingNotAvailable,

        drawingMissingReason,

        overallRemarks,

        extraDrawingItems

    };

    if (
        existingIndex >= 0
    ) {

        validationStore[
            existingIndex
        ] = record;

    }
    else {

        validationStore.push(
            record
        );

    }

    console.log(
        "Validation Saved",
        record
    );

    alert(
        `Page ${pageNo} saved`
    );

}

function collectExtraItems() {

    const items = [];

    document
    .querySelectorAll(
        "#extraItemsContainer > div"
    )
    .forEach(row => {

        items.push({

            item:
                row.querySelector(
                    ".extra-item-name"
                )?.value || "",

            action:
                row.querySelector(
                    ".extra-item-action"
                )?.value || "",

            reason:
                row.querySelector(
                    ".extra-item-reason"
                )?.value || ""

        });

    });

    return items;

}


// =========================================
// CHECKLIST COLLECTION
// =========================================

function collectChecklist() {

    const rows = [];

    document
        .querySelectorAll(
            ".checklist-item"
        )
        .forEach(
            item => {

                const title =
                    item
                    .querySelector(
                        ".checklist-title"
                    )
                    ?.textContent || "";

                const status =
                    item
                    .querySelector(
                        'input[type="radio"]:checked'
                    )
                    ?.value || "";

                const remark =
                    item
                    .querySelector(
                        ".item-remark"
                    )
                    ?.value || "";

                rows.push({

                    title,

                    status,

                    remark

                });

            }
        );

    return rows;

}

// =========================================
// PAGE NUMBER
// =========================================

function getCurrentPageNumber() {

    const pageElement =
        document.getElementById(
            "currentPage"
        );

    if (!pageElement)
        return 1;

    return Number(
        pageElement.textContent
    );

}

// =========================================
// PAGE LOOKUP
// =========================================

function getValidationByPage(
    pageNo
) {

    return validationStore.find(
        row =>
            row.pageNo ===
            pageNo
    );

}

// =========================================
// ROOM COVERAGE
// =========================================

function getRoomSelectedItems() {

    const roomMap = {};

    validationStore.forEach(
        page => {

            if (
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
                    ]
                    .add(item);

                }
            );

        }
    );

    return roomMap;

}

// =========================================
// BOQ COVERAGE
// =========================================

function getBOQCoverage() {

    const selectedItems =
        getRoomSelectedItems();

    const coverage = [];

    Object.keys(
        projectMaster.roomItemMap
    ).forEach(room => {

        if (
            room ===
            "FULL HOME"
        ) {
            return;
        }

        const boqItems =
            projectMaster.roomItemMap[
                room
            ] || [];

        boqItems.forEach(item => {

            let covered =
                false;

            // Room specific

            if (
                selectedItems[
                    room
                ] &&
                selectedItems[
                    room
                ].has(item)
            ) {

                covered =
                    true;

            }

            // FULL HOME

            if (
                selectedItems[
                    "FULL HOME"
                ] &&
                selectedItems[
                    "FULL HOME"
                ].has(item)
            ) {

                covered =
                    true;

            }

            coverage.push({

                room,

                item,

                validated:
                    covered

            });

        });

    });

    return coverage;

}

// =========================================
// MISSING ITEMS
// =========================================

function getMissingBOQItems() {

    return getBOQCoverage()
        .filter(
            row =>
                !row.validated
        );

}

// =========================================
// DRAWING NOT AVAILABLE
// =========================================

function getDrawingNotAvailablePages() {

    return validationStore.filter(
        page =>
            page.drawingNotAvailable
    );

}

// =========================================
// COVERED ITEMS
// =========================================

function getCoveredBOQItems() {

    return getBOQCoverage()
        .filter(
            row =>
                row.validated
        );

}

// =========================================
// SUMMARY
// =========================================

function getCoverageSummary() {

    const coverage =
        getBOQCoverage();

    const total =
        coverage.length;

    const covered =
        coverage.filter(
            row =>
                row.validated
        ).length;

    const missing =
        total -
        covered;

    return {

        total,

        covered,

        missing,

        percentage:

            total === 0
                ? 0
                : Math.round(
                    (
                        covered /
                        total
                    ) * 100
                )

    };

}

// =========================================
// RESET
// =========================================

function resetValidationStore() {

    validationStore.length = 0;

}

// =========================================
// DEBUG
// =========================================

window.showCoverage =
    function () {

        console.table(
            getBOQCoverage()
        );

    };

window.showMissingItems =
    function () {

        console.table(
            getMissingBOQItems()
        );

    };

window.showValidationStore =
    function () {

        console.table(
            validationStore
        );

    };
