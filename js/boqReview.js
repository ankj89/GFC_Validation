// =========================================
// BOQ REVIEW MODULE - VERSION 3
// =========================================

// =========================================
// DOM
// =========================================

const boqReviewTableBody =
    document.getElementById(
        "boqReviewTableBody"
    );

const addBoqRowBtn =
    document.getElementById(
        "addBoqRowBtn"
    );

const continueValidationBtn =
    document.getElementById(
        "continueValidationBtn"
    );

// =========================================
// RENDER TABLE
// =========================================

function renderBOQReviewTable() {

    if (
        !boqReviewTableBody
    ) return;

    boqReviewTableBody.innerHTML =
        "";

    projectMaster.boqRows.forEach(
        (
            row,
            index
        ) => {

            const tr =
                document.createElement(
                    "tr"
                );

            tr.innerHTML = `

                <td>

                    <input
                        type="text"
                        value="${escapeHtml(row.room)}"
                        onchange="
                            updateBOQRoom(
                                ${index},
                                this.value
                            )
                        "
                    >

                </td>

                <td>

                    <input
                        type="text"
                        value="${escapeHtml(row.item)}"
                        onchange="
                            updateBOQItem(
                                ${index},
                                this.value
                            )
                        "
                    >

                </td>

                <td>

                    <button
                        class="delete-row-btn"
                        onclick="
                            deleteBOQRow(
                                ${index}
                            )
                        "
                    >
                        Delete
                    </button>

                </td>

            `;

            boqReviewTableBody.appendChild(
                tr
            );

        }
    );

}

// =========================================
// ADD ROW
// =========================================

addBoqRowBtn?.addEventListener(
    "click",
    addBOQRowManual
);

function addBOQRowManual() {

    projectMaster.boqRows.push({

        room: "",

        item: ""

    });

    renderBOQReviewTable();

}

// =========================================
// DELETE ROW
// =========================================

function deleteBOQRow(
    index
) {

    projectMaster.boqRows.splice(
        index,
        1
    );

    renderBOQReviewTable();

}

// =========================================
// UPDATE ROOM
// =========================================

function updateBOQRoom(
    index,
    value
) {

    projectMaster
        .boqRows[index]
        .room =
        value.trim();

}

// =========================================
// UPDATE ITEM
// =========================================

function updateBOQItem(
    index,
    value
) {

    projectMaster
        .boqRows[index]
        .item =
        value.trim();

}

// =========================================
// REBUILD MASTER
// =========================================

function rebuildProjectMaster() {

    projectMaster.rooms = [];

    projectMaster.roomItemMap = {};

    projectMaster.boqRows.forEach(
        row => {

            const room =
                row.room?.trim();

            const item =
                row.item?.trim();

            if (
                !room ||
                !item
            ) {
                return;
            }

            if (
                !projectMaster.roomItemMap[
                    room
                ]
            ) {

                projectMaster.roomItemMap[
                    room
                ] = [];

                projectMaster.rooms.push(
                    room
                );

            }

            if (
                !projectMaster.roomItemMap[
                    room
                ].includes(
                    item
                )
            ) {

                projectMaster.roomItemMap[
                    room
                ].push(
                    item
                );

            }

        }
    );

    buildFullHome();

}

// =========================================
// CONTINUE TO VALIDATION
// =========================================

continueValidationBtn
?.addEventListener(
    "click",
    continueToValidation
);

function continueToValidation() {

    rebuildProjectMaster();

    populateRoomDropdown();

    document
        .getElementById(
            "boqReviewSection"
        )
        .style.display =
        "none";

    document
        .querySelector(
            ".main-layout"
        )
        .style.display =
        "flex";

    alert(
        "BOQ Review Saved"
    );

}

// =========================================
// ESCAPE HTML
// =========================================

function escapeHtml(
    value
) {

    if (!value)
        return "";

    return value
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
