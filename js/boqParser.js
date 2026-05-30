// =========================================
// BOQ PARSER
// =========================================

const projectMaster = {

    rooms: [],

    roomItemMap: {},

    itemCategoryMap: {},

    boqRows: []

};

// =========================================
// DOM
// =========================================

const boqInput =
    document.getElementById(
        "boqPdfInput"
    );

const roomDropdown =
    document.getElementById(
        "roomDropdown"
    );

const itemDropdown =
    document.getElementById(
        "itemDropdown"
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

        const arrayBuffer =
            await file.arrayBuffer();

        const pdfData =
            new Uint8Array(
                arrayBuffer
            );

        const pdf =
            await pdfjsLib
                .getDocument(pdfData)
                .promise;

        await parseBOQ(pdf);

        populateRoomDropdown();

        console.log(
            "BOQ Parsed",
            projectMaster
        );

        alert(
            "BOQ Successfully Parsed"
        );

    } catch (error) {

        console.error(error);

        alert(
            "Error parsing BOQ"
        );

    }

}

// =========================================
// PARSE BOQ
// =========================================

async function parseBOQ(pdf) {

    resetProjectMaster();

    let currentRoom = "";
    let lastDetectedRoom = "";
    let currentItem = "";

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {

        const page = await pdf.getPage(pageNo);

        const textContent =
            await page.getTextContent();

        const rows =
            buildRowsFromPDF(
                textContent.items
            );

        console.log(
            "PAGE",
            pageNo,
            rows
        );

        for (let i = 0; i < rows.length; i++) {

            const row =
                rows[i]
                .replace(/\s+/g, " ")
                .trim();

            if (!row) continue;

            // =====================
            // ROOM HEADER
            // =====================

            if (
                isActualRoomHeader(
                    row
                )
            ) {

                currentRoom =
                    row;

                lastDetectedRoom =
                    row;

                if (
                    !projectMaster.rooms.includes(
                        currentRoom
                    )
                ) {

                    projectMaster.rooms.push(
                        currentRoom
                    );

                    projectMaster.roomItemMap[
                        currentRoom
                    ] = [];

                }

                continue;
            }

            // =====================
            // ITEM NAME
            // =====================

            if (
                row.includes(
                    "Item Name"
                )
            ) {

                let itemName =
                    row
                        .replace(
                            "Item Name",
                            ""
                        )
                        .replace(
                            ":",
                            ""
                        )
                        .trim();

                if (
                    !itemName &&
                    rows[i + 1]
                ) {

                    itemName =
                        rows[i + 1]
                        .trim();
                }

                if (
                    !currentRoom
                ) {

                    currentRoom =
                        lastDetectedRoom;
                }

                if (
                    currentRoom &&
                    itemName
                ) {

                    currentItem =
                        itemName;

                    addItemToRoom(
                        currentRoom,
                        itemName
                    );

                    console.log(
                        "ITEM ADDED",
                        currentRoom,
                        itemName
                    );
                }

                continue;
            }

            // =====================
            // SUPER CATEGORY
            // =====================

            if (
                row.includes(
                    "Super Category"
                )
            ) {

                let superCategory =
                    row
                        .replace(
                            "Super Category",
                            ""
                        )
                        .replace(
                            ":",
                            ""
                        )
                        .trim();

                if (
                    !superCategory &&
                    rows[i + 1]
                ) {

                    superCategory =
                        rows[i + 1]
                        .trim();
                }

                if (
                    currentItem
                ) {

                    ensureItemMap(
                        currentItem
                    );

                    projectMaster
                        .itemCategoryMap[
                        currentItem
                    ]
                        .superCategory =
                        superCategory;
                }

                continue;
            }

            // =====================
            // SUB CATEGORY
            // =====================

            if (
                row.includes(
                    "Sub Super Category"
                )
            ) {

                let subCategory =
                    row
                        .replace(
                            "Sub Super Category",
                            ""
                        )
                        .replace(
                            ":",
                            ""
                        )
                        .trim();

                if (
                    !subCategory &&
                    rows[i + 1]
                ) {

                    subCategory =
                        rows[i + 1]
                        .trim();
                }

                if (
                    currentItem
                ) {

                    ensureItemMap(
                        currentItem
                    );

                    projectMaster
                        .itemCategoryMap[
                        currentItem
                    ]
                        .subCategory =
                        subCategory;
                }

                continue;
            }

            // =====================
            // FALLBACK LOCATION
            // =====================

            if (
                row.includes(
                    "Location"
                )
            ) {

                const fallbackRoom =
                    extractRoomFromDescription(
                        row
                    );

                if (
                    fallbackRoom
                ) {

                    currentRoom =
                        fallbackRoom;

                    lastDetectedRoom =
                        fallbackRoom;

                    if (
                        !projectMaster.rooms.includes(
                            currentRoom
                        )
                    ) {

                        projectMaster.rooms.push(
                            currentRoom
                        );

                        projectMaster.roomItemMap[
                            currentRoom
                        ] = [];
                    }
                }
            }
        }
    }

    populateRoomDropdown();

    console.log(
        "ROOM ITEM MAP"
    );

    console.log(
        JSON.stringify(
            projectMaster.roomItemMap,
            null,
            2
        )
    );

}
// =========================================
// ROOM DETECTION
// =========================================

function isActualRoomHeader(
    text
) {

    const ignore = [

        "Item Code",
        "Item Name",
        "Specifications",
        "Description",
        "Qty",
        "Rate",
        "Amount",
        "SP Unit Price",
        "Total Price",
        "Location",
        "Service On",
        "Super Category",
        "Sub Super Category"

    ];

    if (
        ignore.some(
            item =>
                text.includes(
                    item
                )
        )
    ) {

        return false;
    }

    return (

        text ===
        text.toUpperCase()

        &&

        text.length > 2

        &&

        text.length < 60

    );

}

function extractRoomFromDescription(
    text
) {

    const match =
        text.match(
            /Location\s*:\s*([^:]+)/i
        );

    if (
        match
    ) {

        return match[1]
            .replace(
                /Service On.*/i,
                ""
            )
            .trim();
    }

    return "";

}
// =========================================
// BUILD ROWS
// =========================================

function buildRowsFromPDF(
    items
) {

    const rows = [];

    items.sort(
        (a, b) => {

            const yDiff =
                b.transform[5] -
                a.transform[5];

            if (
                Math.abs(
                    yDiff
                ) > 3
            ) {

                return yDiff;

            }

            return (
                a.transform[4] -
                b.transform[4]
            );

        }
    );

    items.forEach(item => {

        const y =
            item.transform[5];

        let row =
            rows.find(
                r =>
                    Math.abs(
                        r.y - y
                    ) < 3
            );

        if (!row) {

            row = {

                y,

                text: []

            };

            rows.push(
                row
            );

        }

        row.text.push(
            item.str
        );

    });

    return rows.map(
        row =>
            row.text.join(
                " "
            )
    );

}

// =========================================
// EXTRACT VALUE
// =========================================

function extractValue(
    text,
    label
) {

    const index =
        text.indexOf(
            label
        );

    if (
        index === -1
    ) return "";

    return text
        .substring(
            index +
            label.length
        )
        .replace(
            ":",
            ""
        )
        .trim();

}

// =========================================
// ADD ITEM
// =========================================

function addItemToRoom(
    room,
    item
) {

    if (
        !projectMaster
            .roomItemMap[
            room
        ]
            .includes(item)
    ) {

        projectMaster
            .roomItemMap[
            room
        ]
            .push(item);

    }

    ensureItemMap(
        item
    );

}

// =========================================
// ITEM CATEGORY OBJECT
// =========================================

function ensureItemMap(
    item
) {

    if (
        !projectMaster
            .itemCategoryMap[
            item
        ]
    ) {

        projectMaster
            .itemCategoryMap[
            item
        ] = {

            superCategory:
                "",

            subCategory:
                ""

        };

    }

}

// =========================================
// LAST ITEM
// =========================================

function getLastRoomItem(
    room
) {

    const items =
        projectMaster
            .roomItemMap[
            room
        ];

    if (
        !items ||
        items.length === 0
    ) {

        return null;

    }

    return items[
        items.length - 1
    ];

}

// =========================================
// POPULATE ROOMS
// =========================================

function populateRoomDropdown() {

    roomDropdown.innerHTML =
        `
        <option value="">
        Select Room
        </option>
        `;

    projectMaster.rooms
        .forEach(room => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                room;

            option.textContent =
                room;

            roomDropdown
                .appendChild(
                    option
                );

        });

}

// =========================================
// ROOM CHANGE
// =========================================

roomDropdown?.addEventListener(
    "change",
    handleRoomChange
);

function handleRoomChange() {

    const room =
        roomDropdown.value;

    itemDropdown.innerHTML =
        "";

    if (!room) return;

    const items =
        projectMaster.roomItemMap[
            room
        ] || [];

    console.log(
        "ROOM SELECTED",
        room
    );

    console.log(
        "ITEMS",
        items
    );

    items.forEach(item => {

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

    });

}

// =========================================
// ITEM CHANGE
// =========================================

itemDropdown?.addEventListener(
    "change",
    autoSuggestCategories
);

function autoSuggestCategories() {

    const selectedItems =
        Array.from(
            itemDropdown.selectedOptions
        ).map(
            option => option.value
        );

    const categories =
        new Set();

    selectedItems.forEach(item => {

        const itemData =
            projectMaster
                .itemCategoryMap[
                item
            ];

        if (!itemData) return;

        [
            itemData.superCategory,
            itemData.subCategory
        ].forEach(value => {

            const mapped =
                CATEGORY_MAPPING[
                    value
                ];

            if (
                mapped
            ) {

                mapped.forEach(
                    category =>
                        categories.add(
                            category
                        )
                );

            }

        });

    });

    Array.from(
        categoryDropdown.options
    ).forEach(option => {

        option.selected =
            categories.has(
                option.value
            );

    });

    generateChecklist();

}

// =========================================
// RESET
// =========================================

function resetProjectMaster() {

    projectMaster.rooms = [];

    projectMaster.roomItemMap = {};

    projectMaster.itemCategoryMap = {};

    projectMaster.boqRows = [];

}
