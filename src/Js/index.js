$(document).ready(function () {
    const months = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
    const colors = ["bg-blue-200", "bg-blue-300", "bg-green-200", "bg-green-300", "bg-yellow-200", "bg-yellow-300", "bg-orange-200", "bg-orange-300", "bg-purple-200", "bg-purple-300", "bg-purple-500", "bg-blue-400"];
    let index = 0;

    months.forEach(month => {
        const monthColor = colors[index];
        $("#monthsGrid").append(
            `<div class="min-h-[200px] bg-white rounded-xl shadow-lg overflow-hidden">
                <h2 class="${monthColor} rounded-t-xl text-2xl flex justify-center ">${month}</h2>
                <input type="text" class=" border w-full" placeholder="Célok, feladatok..."></input>
                <ul class="h-full hover:overflow-y-auto" id="${month}Entries"></ul>
            </div>`
        );
        index++;
    });

    $("#employees").on("change", function() {
        const selectedName = $(this).val();
        $(".month-entry").hide();
        months.forEach(month => {
            const monthId = month + "Entries";
            const monthEntries = JSON.parse(localStorage.getItem(selectedName + month + "Entries")) || [];
            monthEntries.forEach(entry => {
                const entryHtml = `<li class="border-b p-2 month-entry">${entry}
                    <button class="float-right ml-2" type="button">
                        <span class="material-symbols-outlined text-red-500">delete</span>
                    </button></li>`;
                $(`#${monthId}`).append(entryHtml);
            });
        });
    });

    $(`#monthsGrid`).on('keydown', `input[type="text"]`, function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = $(this).val().trim();
            if (input) {
                const monthId = $(this).siblings('ul').attr('id');
                const selectedName = $("#employees").val();
                const storageKey = selectedName + monthId;
                $(`#${monthId}`).append(
                    `<li class="border-b p-2">${input}
                        <button class="float-right ml-2" type="button">
                            <span class="material-symbols-outlined text-red-500">
                                delete
                            </span>
                        </button>
                    </li>`
                );
                const currentEntries = JSON.parse(localStorage.getItem(storageKey)) || [];
                currentEntries.push(input);
                localStorage.setItem(storageKey, JSON.stringify(currentEntries));
                $(this).val('');
            }
        }
    });

    $(`#monthsGrid`).on('click', `button`, function() {
        const item = $(this).parent();
        const monthId = item.parent().attr('id');
        const selectedName = $("#employees").val();
        const itemText = item.contents().get(0).nodeValue.trim();
        item.remove();
        const storageKey = selectedName + monthId;
        const currentEntries = JSON.parse(localStorage.getItem(storageKey)) || [];
        const updatedEntries = currentEntries.filter(entry => entry !== itemText);
        localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    });
});