// =========================================
// BOQ PARSER - VERSION 3
// =========================================

window.projectMaster = {

    rooms: [],

    roomItemMap: {},

    boqRows: []

};

// =========================================
// DOM
// =========================================

const boqInput =
    document.getElementById(
        "boqPdfInput"
    );

// =========================================
// BOQ UPLOAD
// =========================================

boqInput?.addEventListener(
    "change",
    handleBOQUpload
);

async function handleBOQUpload(
    event
) {

    const file =
        event.target.files[0];

    if (!file) return;

    try {

        resetProjectMaster();

        const buffer =
            await file.arrayBuffer();

        const pdf =
            await pdfjsLib
                .getDocument(
                    new Uint8Array(
                        buffer
                    )
                )
                .promise;

        await parseBOQ(pdf);

        buildFullHome();

        renderBOQReviewTable();

        showBOQReview();

        alert(
            "BOQ Parsed. Please review extracted items."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Failed to parse BOQ."
        );

    }

}

// =========================================
// MAIN PARSER
// =========================================

async function parseBOQ(
    pdf
) {

    let fullText = "";

    for (
        let pageNo = 1;
        pageNo <= pdf.numPages;
        pageNo++
    ) {

        const page =
            await pdf.getPage(
                pageNo
            );

        const content =
            await page.getTextContent();

        const pageText =
            content.items
                .map(
                    item => item.str
                )
                .join("\n");

        fullText +=
            "\n" +
            pageText;

    }

    const blocks =
        fullText.split(
            /QI-\d+/gi
        );

    blocks.forEach(
        parseItemBlock
    );

}

// =========================================
// ITEM BLOCK
// =========================================
function cleanRoomName(
    room
) {

    if (!room) {
        return "";
    }

    return room

        .replace(
            /\s*Elevation\s*:\s*[A-Z0-9\-]+/gi,
            ""
        )

        .replace(
            /\s*Section\s*:\s*[A-Z0-9\-]+/gi,
            ""
        )

        .replace(
            /\s*Drawing\s*:\s*[A-Z0-9\-]+/gi,
            ""
        )

        .trim();

}
function parseItemBlock(
    block
) {

    let room =
    extractField(
        block,
        "Location"
    );

room = cleanRoomName(
    room
);

    let item =
        extractField(
            block,
            "SKU"
        );

    if (!item) {

        item =
            extractItemNameFallback(
                block
            );

    }

    if (
        !room ||
        !item
    ) {
        return;
    }

    addBOQRow(
        room,
        item
    );

}

// =========================================
// FIELD EXTRACTION
// =========================================



function extractField(
    text,
    label
) {

    const regex =
        new RegExp(

            label +
            "\\s*:\\s*(.*?)" +
            "(?=Location\\s*:|SKU\\s*:|Description\\s*:|Super Category\\s*:|Sub Super Category\\s*:|Service On\\s*:|$)",

            "is"
        );

    const match =
        text.match(regex);

    if (!match) {
        return "";
    }

    return cleanText(
        match[1]
    );

}

// =========================================
// ITEM NAME FALLBACK
// =========================================

function extractItemNameFallback(
    block
) {

    const match =
        block.match(
            /Item Name(.*?)Brand/is
        );

    if (!match) {
        return "";
    }

    return cleanText(
        match[1]
    );

}

// =========================================
// CLEAN
// =========================================

function cleanText(
    text
) {

    return text
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

// =========================================
// ADD ROW
// =========================================

function addBOQRow(
    room,
    item
) {

    projectMaster.boqRows.push({

        room,
        item

    });

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

// =========================================
// FULL HOME
// =========================================

function buildFullHome() {

    const allItems =
        new Set();

    Object.keys(
        projectMaster.roomItemMap
    ).forEach(room => {

        projectMaster
            .roomItemMap[
                room
            ]
            .forEach(item => {

                allItems.add(
                    item
                );

            });

    });

    projectMaster.roomItemMap[
        "FULL HOME"
    ] =
        Array.from(
            allItems
        );

    if (
        !projectMaster.rooms.includes(
            "FULL HOME"
        )
    ) {

        projectMaster.rooms.unshift(
            "FULL HOME"
        );

    }

}

// =========================================
// RESET
// =========================================

function resetProjectMaster() {

    projectMaster.rooms = [];

    projectMaster.roomItemMap = {};

    projectMaster.boqRows = [];

}

// =========================================
// SHOW REVIEW SCREEN
// =========================================

function showBOQReview() {

    document
        .getElementById(
            "boqReviewSection"
        )
        .style.display =
        "block";

}

function populateRoomDropdown() {

    const dropdown =
        document.getElementById(
            "roomDropdown"
        );

    if (!dropdown)
        return;

    dropdown.innerHTML =
        '<option value="">Select Room</option>';

    projectMaster.rooms.forEach(
        room => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                room;

            option.textContent =
                room;

            dropdown.appendChild(
                option
            );

        }
    );

}
document
    .getElementById(
        "roomDropdown"
    )
    ?.addEventListener(
        "change",
        handleRoomChange
    );

function handleRoomChange() {

    const room =
        document.getElementById(
            "roomDropdown"
        ).value;

    const itemDropdown =
        document.getElementById(
            "itemDropdown"
        );

    itemDropdown.innerHTML =
        "";

    const items =
        projectMaster.roomItemMap[
            room
        ] || [];

    items.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item;

            option.textContent =
                item;

            itemDropdown.appendChild(
                option
            );

        }
    );

}
