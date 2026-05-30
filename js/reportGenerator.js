// =========================================
// REPORT GENERATOR - VERSION 3
// =========================================

function generateReports() {

    const container =
        document.getElementById(
            "reportContainer"
        );

    if (!container)
        return;

    container.innerHTML = "";

    generateProjectInfoReport(
    container
);
    
    generateSummaryCard(
        container
    );

    generateDetailedValidationReport(
        container
    );

    generateMissingBOQReport(
        container
    );

    generateDrawingNotAvailableReport(
        container
    );

    generateRoomCoverageReport(
        container
    );
generateDrawingMismatchReport(
    container
);
}


function generateProjectInfoReport(
    container
) {

    if (
        validationStore.length === 0
    ) {
        return;
    }

    const info =
        validationStore[0]
        ?.projectInfo;

    if (!info) {
        return;
    }

    const div =
        document.createElement(
            "div"
        );

    div.innerHTML = `

        <h3>
            Project Information
        </h3>

        <table
            class="report-table">

            <tr>

                <th>
                    Field
                </th>

                <th>
                    Value
                </th>

            </tr>

            <tr>

                <td>
                    GFC ID
                </td>

                <td>
                    ${info.gfcId}
                </td>

            </tr>

            <tr>

                <td>
                    RFV ID
                </td>

                <td>
                    ${info.rfvId}
                </td>

            </tr>

            <tr>

                <td>
                    PID
                </td>

                <td>
                    ${info.pid}
                </td>

            </tr>

        </table>

    `;

    container.appendChild(
        div
    );

}
// =========================================
// SUMMARY
// =========================================

function generateSummaryCard(
    container
) {

    const summary =
        getCoverageSummary();

    const div =
        document.createElement(
            "div"
        );

    div.innerHTML = `

        <h3>
            Coverage Summary
        </h3>

        <table class="report-table">

            <tr>
                <th>
                    Metric
                </th>
                <th>
                    Value
                </th>
            </tr>

            <tr>
                <td>
                    Total BOQ Items
                </td>
                <td>
                    ${summary.total}
                </td>
            </tr>

            <tr>
                <td>
                    Covered Items
                </td>
                <td>
                    ${summary.covered}
                </td>
            </tr>

            <tr>
                <td>
                    Missing Items
                </td>
                <td>
                    ${summary.missing}
                </td>
            </tr>

            <tr>
                <td>
                    Coverage %
                </td>
                <td>
                    ${summary.percentage}%
                </td>
            </tr>

        </table>

    `;

    container.appendChild(
        div
    );

}

// =========================================
// DETAILED VALIDATION
// =========================================

function generateDetailedValidationReport(
    container
) {

    const div =
        document.createElement(
            "div"
        );

    let html = `

        <h3>
            Detailed Validation Report
        </h3>

        <table class="report-table">

        <tr>

            <th>Page</th>
            <th>Room</th>
            <th>Items</th>
            <th>Categories</th>
            <th>Remarks</th>

        </tr>

    `;

    validationStore.forEach(
        page => {

            html += `

                <tr>

                    <td>
                        ${page.pageNo}
                    </td>

                    <td>
                        ${page.room}
                    </td>

                    <td>
                        ${page.items.join(
                            ", "
                        )}
                    </td>

                    <td>
                        ${page.categories.join(
                            ", "
                        )}
                    </td>

                    <td>
                        ${buildChecklistSummary(page)}
                    </td>

                </tr>

            `;

        }
    );

    html += `
        </table>
    `;

    div.innerHTML =
        html;

    container.appendChild(
        div
    );

}
function buildChecklistSummary(page) {

    let text = "";

    (page.checklist || []).forEach(item => {

        const status =
            item.status || "";

        const remark =
            item.remark || "";

        const hasRemark =
            remark.trim() !== "";

        if (

            status === "Absent"

            ||

            hasRemark

        ) {

            text +=

                item.title +

                " : " +

                status.toUpperCase() +

                " : " +

                remark +

                "\n";

        }

    });

    if (
        page.overallRemarks
    ) {

        text +=

            "\nOverall : " +

            page.overallRemarks;

    }

    return text;

}
// =========================================
// MISSING BOQ
// =========================================

function generateMissingBOQReport(
    container
) {

    const missing =
        getMissingBOQItems();

    const div =
        document.createElement(
            "div"
        );

    let html = `

        <h3>
            Missing BOQ Coverage Report
        </h3>

        <table class="report-table">

            <tr>

                <th>
                    Room
                </th>

                <th>
                    Item
                </th>

                <th>
                    Status
                </th>

            </tr>

    `;

    missing.forEach(
        row => {

            html += `

                <tr>

                    <td>
                        ${row.room}
                    </td>

                    <td>
                        ${row.item}
                    </td>

                    <td>
                        Missing
                    </td>

                </tr>

            `;

        }
    );

    html += `
        </table>
    `;

    div.innerHTML =
        html;

    container.appendChild(
        div
    );

}

// =========================================
// DNA REPORT
// =========================================

function generateDrawingNotAvailableReport(
    container
) {

    const pages =
        getDrawingNotAvailablePages();

    const div =
        document.createElement(
            "div"
        );

    let html = `

        <h3>
            Drawing Not Available Report
        </h3>

        <table class="report-table">

            <tr>

                <th>
                    Page
                </th>

                <th>
                    Room
                </th>

                <th>
                    Reason
                </th>

            </tr>

    `;

    pages.forEach(
        page => {

            html += `

                <tr>

                    <td>
                        ${page.pageNo}
                    </td>

                    <td>
                        ${page.room}
                    </td>

                    <td>
                        ${page.drawingMissingReason || ""}
                    </td>

                </tr>

            `;

        }
    );

    html += `
        </table>
    `;

    div.innerHTML =
        html;

    container.appendChild(
        div
    );

}

// =========================================
// ROOM COVERAGE
// =========================================

function generateRoomCoverageReport(
    container
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

    const div =
        document.createElement(
            "div"
        );

    let html = `

        <h3>
            Room Wise Coverage
        </h3>

        <table class="report-table">

            <tr>

                <th>
                    Room
                </th>

                <th>
                    Total Items
                </th>

                <th>
                    Covered
                </th>

                <th>
                    Coverage %
                </th>

            </tr>

    `;

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

            html += `

                <tr>

                    <td>
                        ${room}
                    </td>

                    <td>
                        ${data.total}
                    </td>

                    <td>
                        ${data.covered}
                    </td>

                    <td>
                        ${percentage}%
                    </td>

                </tr>

            `;

        }
    );

    html += `
        </table>
    `;

    div.innerHTML =
        html;

    container.appendChild(
        div
    );

}
function generateDrawingMismatchReport(
    container
) {

    const div =
        document.createElement(
            "div"
        );

    let html = `

        <h3>
            Drawing vs BOQ Mismatch
        </h3>

        <table class="report-table">

        <tr>

            <th>Page</th>

            <th>Room</th>

            <th>Item</th>

            <th>Action</th>

            <th>Reason</th>

        </tr>

    `;

    validationStore.forEach(
        page => {

            (
                page.extraDrawingItems || []
            )
            .forEach(item => {

                html += `

                    <tr>

                        <td>
                            ${page.pageNo}
                        </td>

                        <td>
                            ${page.room}
                        </td>

                        <td>
                            ${item.item}
                        </td>

                        <td>
                            ${item.action}
                        </td>

                        <td>
                            ${item.reason}
                        </td>

                    </tr>

                `;

            });

        }
    );

    html += `
        </table>
    `;

    div.innerHTML =
        html;

    container.appendChild(
        div
    );

}
