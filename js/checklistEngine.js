// =========================================
// CHECKLIST ENGINE - VERSION 3
// =========================================

// =========================================
// DOM
// =========================================
function populateCategoryDropdown() {

    const dropdown =
        document.getElementById(
            "categoryDropdown"
        );

    if (!dropdown) {
        return;
    }

    dropdown.innerHTML = "";

    Object.keys(
        CHECKLIST_CONFIG
    ).forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category;

        option.textContent =
            formatCategoryName(
                category
            );

        dropdown.appendChild(
            option
        );

    });

}
const checklistContainer =
    document.getElementById(
        "checklistContainer"
    );

const categoryDropdown =
    document.getElementById(
        "categoryDropdown"
    );

// =========================================
// CATEGORY CHANGE
// =========================================

categoryDropdown
?.addEventListener(
    "change",
    generateChecklist
);

// =========================================
// GENERATE CHECKLIST
// =========================================

function generateChecklist() {

    if (
        !checklistContainer
    ) {
        return;
    }

    checklistContainer.innerHTML =
        "";

    const selectedCategories =
        Array.from(
            categoryDropdown
                .selectedOptions
        ).map(
            option =>
                option.value
        );

    if (
        selectedCategories.length === 0
    ) {
        return;
    }

    selectedCategories.forEach(
        category => {

            createCategoryBlock(
                category
            );

        }
    );

}

// =========================================
// CATEGORY BLOCK
// =========================================

function createCategoryBlock(
    category
) {

    const checklist =
        CHECKLIST_CONFIG[
            category
        ];

    if (
        !checklist
    ) {
        return;
    }

    const block =
        document.createElement(
            "div"
        );

    block.className =
        "category-block";

    const heading =
        document.createElement(
            "div"
        );

    heading.className =
        "category-header";

    heading.textContent =
        formatCategoryName(
            category
        );

    block.appendChild(
        heading
    );

    checklist.forEach(
        item => {

            const row =
                createChecklistItem(
                    category,
                    item
                );

            block.appendChild(
                row
            );

        }
    );

    checklistContainer.appendChild(
        block
    );

}

// =========================================
// CHECKLIST ITEM
// =========================================

function createChecklistItem(
    category,
    item
) {

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "checklist-item";

    const safeId =
        createSafeId(
            category,
            item
        );

    wrapper.innerHTML = `

        <div
            class="checklist-title">

            ${item}

        </div>

        <div
            class="status-group">

            <label>

                <input
                    type="radio"
                    name="${safeId}"
                    value="Present">

                Present

            </label>

            <label>

                <input
                    type="radio"
                    name="${safeId}"
                    value="Absent">

                Absent

            </label>

            <label>

                <input
                    type="radio"
                    name="${safeId}"
                    value="NA">

                N/A

            </label>

        </div>

        <textarea

            class="item-remark"

            placeholder="Remarks">

        </textarea>

    `;

    return wrapper;

}

// =========================================
// SAFE ID
// =========================================

function createSafeId(
    category,
    item
) {

    return (
        category +
        "_" +
        item
    )
    .replace(
        /[^a-zA-Z0-9]/g,
        "_"
    );

}

// =========================================
// FORMAT CATEGORY
// =========================================

function formatCategoryName(
    category
) {

    return category

        .replace(
            /([A-Z])/g,
            " $1"
        )

        .replace(
            /^./,
            match =>
                match.toUpperCase()
        );

}

// =========================================
// AUTO CATEGORY MAPPING
// =========================================

function autoSuggestCategories(
    itemName
) {

    const categories =
        [];

    Object.keys(
        CATEGORY_MAPPING
    ).forEach(
        key => {

            if (
                itemName
                    .toLowerCase()
                    .includes(
                        key.toLowerCase()
                    )
            ) {

                CATEGORY_MAPPING[
                    key
                ]
                .forEach(
                    category => {

                        if (
                            !categories.includes(
                                category
                            )
                        ) {

                            categories.push(
                                category
                            );

                        }

                    }
                );

            }

        }
    );

    return categories;

}

// =========================================
// AUTO SELECT CATEGORY
// =========================================

function suggestCategoryForItems(
    items
) {

    const allCategories =
        [];

    items.forEach(
        item => {

            const categories =
                autoSuggestCategories(
                    item
                );

            categories.forEach(
                category => {

                    if (
                        !allCategories.includes(
                            category
                        )
                    ) {

                        allCategories.push(
                            category
                        );

                    }

                }
            );

        }
    );

    const dropdown =
        document.getElementById(
            "categoryDropdown"
        );

    if (
        !dropdown
    ) {
        return;
    }

    Array.from(
        dropdown.options
    ).forEach(
        option => {

            option.selected =
                allCategories.includes(
                    option.value
                );

        }
    );

    generateChecklist();

}

// =========================================
// ITEM CHANGE EVENT
// =========================================

const itemDropdown =
    document.getElementById(
        "itemDropdown"
    );

itemDropdown
?.addEventListener(
    "change",
    function () {

        const items =
            Array.from(
                this.selectedOptions
            ).map(
                option =>
                    option.value
            );

        suggestCategoryForItems(
            items
        );

    }
);

// =========================================
// DEBUG
// =========================================

window.testChecklist =
    function () {

        generateChecklist();

    };

window.testCategorySuggestion =
    function () {

        const items = [

            "POP Ceiling",

            "Kitchen",

            "Wall Light",

            "Plumbing Package"

        ];

        suggestCategoryForItems(
            items
        );

    };
populateCategoryDropdown();
