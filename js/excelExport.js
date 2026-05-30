// =========================================
// EXCEL EXPORT - VERSION 3
// =========================================

function exportValidationExcel() {

    try {

        const workbook =
            XLSX.utils.book_new();

        addCoverageSummarySheet(
            workbook
        );

        addDetailedValidationSheet(
            workbook
        );

        addMissingBOQSheet(
            workbook
        );

        addDrawingNotAvailableSheet(
            workbook
        );

        addRoomCoverageSheet(
            workbook
        );

        const timestamp =
            new Date()
                .toISOString()
                .replace(
                    /[:.]/g,
                    "-"
                );

        XLSX.writeFile(

            workbook,

            `GFC_Validation_Report_${timestamp}.xlsx`

        );

    }
    catch (error) {

        console.error(
            error
        );

        alert(
            "Failed to export Excel"
        );

    }

}

// =========================================
// SHEET 1
// COVERAGE SUMMARY
// =========================================

function addCoverageSummarySheet(
    workbook
) {

    const summary =
        getCoverageSummary();

    const data = [

        [
            "Metric",
            "Value"
        ],

        [
            "Total BOQ Items",
            summary.total
        ],

        [
            "Covered Items",
            summary.covered
        ],

        [
            "Missing Items",
            summary.missing
        ],

        [
            "Coverage %",
            summary.percentage
        ]

    ];

    const worksheet =
        XLSX.utils.aoa_to_sheet(
            data
        );

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Coverage Summary"

    );

}

// =========================================
// SHEET 2
// DETAILED VALIDATION
// =========================================

function addDetailedValidationSheet(
    workbook
) {

    const rows = [];

    validationStore.forEach(
        page => {

            rows.push({

                Page:
                    page.pageNo,

                Room:
                    page.room,

                Items:
                    page.items.join(
                        ", "
                    ),

                Categories:
                    page.categories.join(
                        ", "
                    ),

                DrawingNotAvailable:
                    page.drawingNotAvailable
                        ? "Yes"
                        : "No",

                MissingReason:
                    page.drawingMissingReason,

                Remarks:
                    page.overallRemarks

            });

        }
    );

    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Detailed Validation"

    );

}

// =========================================
// SHEET 3
// MISSING BOQ
// =========================================

function addMissingBOQSheet(
    workbook
) {

    const rows =
        getMissingBOQItems()
            .map(
                row => ({

                    Room:
                        row.room,

                    Item:
                        row.item,

                    Status:
                        "Missing"

                })
            );

    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Missing BOQ"

    );

}

// =========================================
// SHEET 4
// DRAWING NOT AVAILABLE
// =========================================

function addDrawingNotAvailableSheet(
    workbook
) {

    const rows =
        getDrawingNotAvailablePages()
            .map(
                page => ({

                    Page:
                        page.pageNo,

                    Room:
                        page.room,

                    Reason:
                        page.drawingMissingReason

                })
            );

    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Drawing NA"

    );

}

// =========================================
// SHEET 5
// ROOM COVERAGE
// =========================================

function addRoomCoverageSheet(
    workbook
) {

    const coverage =
        getBOQCoverage();

    const roomMap = {};

    coverage.forEach(
        row => {

            if (
                !roomMap[
                    row.room
                ]
            ) {

                roomMap[
                    row.room
                ] = {

                    total: 0,

                    covered: 0

                };

            }

            roomMap[
                row.room
            ].total++;

            if (
                row.validated
            ) {

                roomMap[
                    row.room
                ].covered++;

            }

        }
    );

    const rows = [];

    Object.keys(
        roomMap
    ).forEach(
        room => {

            const data =
                roomMap[
                    room
                ];

            const percentage =
                data.total === 0
                    ? 0
                    : Math.round(
                        (
                            data.covered /
                            data.total
                        ) * 100
                    );

            rows.push({

                Room:
                    room,

                TotalItems:
                    data.total,

                CoveredItems:
                    data.covered,

                CoveragePercent:
                    percentage

            });

        }
    );

    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Room Coverage"

    );

}

// =========================================
// DEBUG
// =========================================

window.testExcelExport =
    function () {

        exportValidationExcel();

    };
