$(document).ready(function () {
    const months = [
        { name: "Január", days: 31 },
        { name: "Február", days: 28 },
        { name: "Március", days: 31 },
        { name: "Április", days: 30 },
        { name: "Május", days: 31 },
        { name: "Június", days: 30 },
        { name: "Július", days: 31 },
        { name: "Augusztus", days: 31 },
        { name: "Szeptember", days: 30 },
        { name: "Október", days: 31 },
        { name: "November", days: 30 },
        { name: "December", days: 31 }
    ];
    const colors = ["bg-blue-200", "bg-blue-300", "bg-green-200", "bg-green-300", "bg-yellow-200", "bg-yellow-300", "bg-orange-200", "bg-orange-300", "bg-purple-200", "bg-purple-300", "bg-purple-500", "bg-blue-400"];
    let index = 0;

    months.forEach(month => {
        const monthColor = colors[index];
        $("#monthsGrid").append(
            `<div class="min-h-[200px] bg-white rounded-xl shadow-lg overflow-hidden month relative" data-month="${month.name}">
                <h2 class="${monthColor} monthName rounded-t-xl text-2xl flex justify-center cursor-pointer">${month.name}</h2>
                <input type="text" class=" border w-full" placeholder="Célok, feladatok..."></input>
                <ul class="h-full hover:overflow-y-auto" id="${month.name}Entries"></ul>
            </div>`
        );
        index++;
    });

    function renderDays(thisMonth) {
        const month= months.find((m) => m.name === thisMonth);
        if (!month) {
            console.error(`Incorrect month name: ${thisMonth}`);
            return;
        }
        $("#monthsGrid").empty();
        $("#monthsGrid").append(
            `<div class="absolute mx-auto bg-white w-3/4 rounded-xl shadow-lg p-4">
                <h2 class="text-2xl text-center">${month.name} Napjai</h2>
                <div id="${month.name}Days" class="grid grid-cols-7 gap-2 mt-4"></div>
            </div>`
        );

        for (let day = 1; day <= month.days; day++) {
            const dayKey = `${month.name}Day${day}`;
            const dayEntries = JSON.parse(localStorage.getItem(dayKey)) || [];
            const entryText = dayEntries.length > 0 ? dayEntries.join(', ') : '';
            $(`#${month.name}Days`).append(
                `<div class="day flex flex-col p-2 border rounded bg-blue-100 text-center cursor-pointer" data-day="${day}">
                    <span class="font-medium text-lg">${day}</span>
                    <input type="text" class="hidden day-input border w-full mx-auto p-2" placeholder="Célok, feladatok..." value="${entryText}">
                </div>`
            );
        }
    }

    $(document).on("click", ".monthName", function() {
        const monthName = $(this).closest('.month').data("month");
        renderDays(monthName);
    });

    $("#employees").on("change", function() {
        const selectedName = $(this).val();
        $(".month-entry").hide();

        months.forEach(month => {
            const monthId = month.name + "Entries";
            const monthEntries = JSON.parse(localStorage.getItem(selectedName + month.name + "Entries")) || [];
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

    $(document).on('keydown', '.day-input', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = $(this).val().trim();
            if (input) {
                const day = $(this).closest('.day').data('day');
                const monthName = $(this).closest('#monthsGrid').find('h2').text().trim();
                const storageKey = `${monthName}Day${day}`;
                const currentEntries = JSON.parse(localStorage.getItem(storageKey)) || [];
                currentEntries.push(input);
                localStorage.setItem(storageKey, JSON.stringify(currentEntries));
                $(this).val('');
                $(this).addClass('hidden');
            }
        }
    });

    $(document).on('click', '.day', function() {
        const input = $(this).find('.day-input');
        input.toggleClass('hidden');
        if (!input.hasClass('hidden')) {
            input.focus();
        }
    });
});