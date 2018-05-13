const settings = require('electron-settings')
const $ = require('jQuery')

//#1 - Add Event Listener on click to popup de dialog with filters
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


//#2 - Add Event Listener on click each filter option
$('.dropdown-item').click(function(){
    //#1 - Get the filter index from this option
    let filterIndex = $(this).data("filter-id");
    let optionValue = $(this).text();

    //#2 - Change View Dropdown Selected to this option
    $('#filter-' + filterIndex).text(optionValue);
    $('#filter-' + filterIndex).addClass('text-blue-light');
})


