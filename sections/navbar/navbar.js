const settings = require('electron-settings')

const filterBtn = document.getElementById('filter-btn');

//#1 - Add Event Listener on click to popup de dialog with filters
filterBtn.addEventListener('click', (event) => {
    //#1 - First we get the filters container
    const filterContainer = document.getElementById('filter-container');
    
    //#2 - Check if filter container is hidden
    if(filterContainer.classList.contains('is-hidden')){
        document.getElementById(filterContainer.id).classList.remove('is-hidden');
    }else{
        document.getElementById(filterContainer.id).classList.add('is-hidden');
    }

});
