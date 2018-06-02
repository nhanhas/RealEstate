const settings = require('electron-settings');
const $ = require('jQuery');
const ipc = require('electron').ipcRenderer;

//#1 - Create Filter Options
const filters = [
    {
        filterName : 'Finalidade',
        options: ['Comprar', 'Arrendar'],
    },
    {
        filterName : 'Concelho',
        options: ['Amadora', 'Cascais', 'Lisboa', 'Loures', 'Mafra', 'Odivelas', 'Sintra', 'Vila Franca', 'Porto', 'Viseu'],
    },
    {
        filterName : 'Tipo de Imóvel',
        options: ['Apartamentos', 'Armazéns', 'Escritórios', 'Garagens', 'Imóveis c/ negócio', 'Lojas', 'Moradias'],
    },
    {
        filterName : 'Nº de Quartos',
        options: ['0 Quartos', '1 Quartos', '2 Quartos', '3 Quartos', '4 Quartos', '5 Quartos', '6 Quartos', '7 Quartos'],
    }
    

]

//#2 - Iterate filters to generate templatings
filters.forEach(function(filterItem){
    //#1 - get index of filter item
    let indexOfFilter = filters.indexOf(filterItem);

    //#2 - get template of dropdown
    let template = TEMPLATE_generateDropdown(filterItem, indexOfFilter);

    //#3 - Add it to filter container
    var filterContainer = document.getElementById('filter-templates');
    filterContainer.innerHTML += template;
});

//#3 - Add Event Listener on click to popup de dialog with filters
const filterBtn = document.getElementById('filter-btn');
filterBtn.addEventListener('click', (event) => {
    if(event.target.id !== filterBtn.id && event.target.id !== '')
        return false;
    
    //#1 - First we get the filters container
    const filterContainer = document.getElementById('filter-container');
    
    //#2 - Check if filter container is hidden
    if(filterContainer.classList.contains('is-hidden')){
        document.getElementById(filterContainer.id).classList.remove('is-hidden');
    }else{
        document.getElementById(filterContainer.id).classList.add('is-hidden');
    }
});

//#4 - Add Event Listener on click each filter option
$('.dropdown-item').click(function(){
    //#1 - Get the filter index from this option
    let filterIndex = $(this).data("filter-id");
    let optionValue = $(this).text();

    //#2 - Change View Dropdown Selected to this option
    $('#filter-' + filterIndex).text(optionValue);
    $('#filter-' + filterIndex).addClass('text-blue-light');
})

//#5 - Add Event Listener on click of search
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', (event) => {
    alert('One day it will search for this filters...')
});

//#6 - Back button [only visible when details house are shown]
const backBtn = document.getElementById('close-details-btn');
backBtn.addEventListener('click', (event) => {

    //#1 - To Hide "Back Button"
    $('#close-details-btn').css('display', 'none');

    //#1 - Call function to send an IPC
    closeHouseDetails();   
});

//#A - #TEMPLATE# Generate a dropdown with options
function TEMPLATE_generateDropdown(filter, indexOfFilter){
    let dropdownItems = '\
        <div class="dropdown-menu">\
            <hr class="dropdown-hr" style="border-top: 1px solid black">';
    //#1 - Iterate dropdown items first
    filter.options.forEach(function(option){
        //#1.1 - create dropdown-item only
        let newItem = '<div class="dropdown-item" data-filter-id="'+indexOfFilter+'">'+option+'</div>';
        dropdownItems += newItem;
    });
    //#1.2 - close div of dropdown-menu
    dropdownItems += '</div>';
    
    //#2 - Create full filter template with dropdown Items
    let template = '\
        <!-- #'+indexOfFilter+' -->\
        <div class="dropdown nav-filter-dropdown">\
            <div class="text-gray-light" data-toggle="dropdown">\
                <span id="filter-'+indexOfFilter+'">'+filter.filterName+'</span><span class="pull-right">\
                    <i class="fa fa-chevron-down text-blue-light"></i>\
                </span>\
            </div>\
            '+dropdownItems+'\
        </div>';

    //#3 - Return template
    return template;

}

/******************************
 **********IPC Section*********
 ******************************/


//#B - Handler when house details is clicked [IPC sender]
function closeHouseDetails(){
    ipc.send('ipc-close-house-detail', undefined);
}


//#IPC handler when client click "+" at Home
ipc.on('showHouseDetail', function (event, houseId) {    
    //#1 - To Show "Back Button"
    $('#close-details-btn').css('display', 'grid');    
    //#2 - Change Header Title to name of the house [by id]
});