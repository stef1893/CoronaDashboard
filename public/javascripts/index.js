const bundeslandField = document.getElementById('bundesland');
const landkreisField = document.getElementById('landkreis');
const bundeslandDrop = document.getElementById('bundeslandlist');
const landkreisDrop = document.getElementById('landkreislist');
const casesElement = document.getElementById('cases');
const deathsElement = document.getElementById('deaths')

bundeslandField.placeholder = 'Select Bundesland';
landkreisField.placeholder = 'Select Landkreis';

let valueArrayBl = []
let valueArrayLk = []

var loc = 0
let startDate = new Date()
let endDate = new Date()

$.getJSON('data/_/_', function (data) {
    $.each(data.geo, function (key, val) {
        item = document.createElement('li')                                                         // Create DropDown li's
        item.id = 'li_' + key
        item.appendChild(document.createTextNode(val.Name));
        bundeslandDrop.appendChild(item)                                                            // Append li to DropDown-List
        valueArrayBl.push(val.Name)
    })
}).done(function (n) {
    let dropdownArrayBl = [...document.querySelectorAll('ul#bundeslandlist.value-list li')];
    let dropdownArrayLk = [...document.querySelectorAll('ul#landkreislist.value-list li')];

    // Show li items on focus
    bundeslandField.addEventListener('focus', () => {
        bundeslandField.placeholder = 'Type to filter';
        bundeslandDrop.classList.add('open');
        dropdownArrayBl.forEach(bundeslandDrop => {
            bundeslandDrop.classList.remove('closed');
        });
    });

    landkreisField.addEventListener('focus', () => {
        landkreisField.placeholder = 'Type to filter';
        landkreisDrop.classList.add('open');
        dropdownArrayLk.forEach(landkreisDrop => {
            landkreisDrop.classList.remove('closed');
        });
    });

    // lose focus on click on !dropdown
    document.addEventListener('click', (evt) => {
        const isDropdownBl = bundeslandDrop.contains(evt.target);
        const isDropdownLk = landkreisDrop.contains(evt.target);
        const isInputBl = bundeslandField.contains(evt.target);
        const isInputLk = landkreisField.contains(evt.target);
        if (!isDropdownBl && !isInputBl) {
            bundeslandDrop.classList.remove('open');
        }
        if (!isDropdownLk && !isInputLk) {
            landkreisDrop.classList.remove('open');
        }
    });

    // set placeholder on blur again
    bundeslandField.addEventListener('blur', () => {
        bundeslandField.placeholder = 'Select Bundesland';
        bundeslandDrop.classList.remove('open');
    });

    landkreisField.addEventListener('blur', () => {
        landkreisField.placeholder = 'Select Landkreis';
        landkreisDrop.classList.remove('open');
    });

    // set clicked bl_li as selected and generate li's for lk dropdown
    dropdownArrayBl.forEach(item => {
        item.addEventListener('click', (evt) => {
            setLvl1Location(item.id.slice(3))
        });
        dropdownArrayBl.forEach(bundeslandDrop => {
            bundeslandDrop.classList.add('closed');
        })
    })

    // auto complete
    bundeslandField.addEventListener('input', () => {
        bundeslandDrop.classList.add('open');
        let inputValue = bundeslandField.value.toLowerCase();
        if (inputValue.length > 0) {
            for (let j = 0; j < valueArrayBl.length; j++) {
                if (!(inputValue.substring(0, inputValue.length) === valueArrayBl[j].substring(0, inputValue.length).toLowerCase())) {
                    dropdownArrayBl[j].classList.add('closed');
                } else {
                    dropdownArrayBl[j].classList.remove('closed');
                }
            }
        } else {
            for (let i = 0; i < dropdownArrayBl.length; i++) {
                dropdownArrayBl[i].classList.remove('closed');
            }
        }
    });

    landkreisField.addEventListener('input', () => {
        landkreisDrop.classList.add('open');
        let inputValue = landkreisField.value.toLowerCase();
        if (inputValue.length > 0) {
            for (let j = 0; j < valueArrayLk.length; j++) {
                if (!(inputValue.substring(0, inputValue.length) === valueArrayLk[j].substring(0, inputValue.length).toLowerCase())) {
                    dropdownArrayLk[j].classList.add('closed');
                } else {
                    dropdownArrayLk[j].classList.remove('closed');
                }
            }
        } else {
            for (let i = 0; i < dropdownArrayLk.length; i++) {
                dropdownArrayLk[i].classList.remove('closed');
            }
        }
    });

    // fill data fields
    setDataFields('_', 'All', false)
})

let subNav = document.getElementById('subNav')
let dateRange = document.getElementById('DateRange')
let inOrOut = true

function setDataFields(date, level1, level2) {
    let url = 'api/' + date + '/' + level1 + '/'
    if (level2) {
        url += level2 + '/'
    }
    $.getJSON(url, function() {} )
    .done(function( data ) {
        casesElement.innerHTML = data[Object.keys(data)[0]].cases
        deathsElement.innerHTML = data[Object.keys(data)[0]].deaths
    })
}

function setLvl1Location(id) {
    console.log(loc)
    let dateString = startDate.getFullYear() + '-' + startDate.getMonth() + '-' + startDate.getDate() + '_' + endDate.getFullYear() + '-' + endDate.getMonth()+ '-' + endDate.getDate()
    document.getElementById(loc).style.display = 'block'
    document.getElementById(id).style.display = 'none'
    loc = id
    $.getJSON('data/' + dateString + '/' + loc + '/', function (data) {
        bundeslandField.value = data.geo[id].Name
        landkreisField.value = ''
        $(landkreisDrop).empty()
        valueArrayLk = []                                                                           // Empty Level2 DropDown Menu
        $.each(data.geo[id].Level2, function (key, val) {
            lk_item = document.createElement('li')
            lk_item.id = 'li_' + key
            lk_item.appendChild(document.createTextNode(val.Name));
            landkreisDrop.appendChild(lk_item)
            valueArrayLk.push(val.Name) 
        })
        dropdownArrayLk = [...document.querySelectorAll('ul#landkreislist.value-list li')]
        dropdownArrayLk.forEach(item => {
            item.addEventListener('click', (evt) => {
                landkreisField.value = item.val;
                dropdownArrayLk.forEach(landkreisDrop => {
                    landkreisDrop.classList.add('closed');
                });
            });
        })
        console.log('data/' + dateString + '/' + loc + '/')
    })
}

dateRange.addEventListener("click", function() {
    if (inOrOut) {
        subNav.style.transform = "translateY(4rem)"
        dateRange.style.transform = "translateY(4rem) scale(-1,-1)"
        inOrOut = false
    } else {
        subNav.style.transform = "translateY(0)"
        dateRange.style.transform = "translateY(0) scale(1,1)"
        inOrOut = true
    }
})
