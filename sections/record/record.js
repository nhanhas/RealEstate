const settings = require('electron-settings')
const $ = require('jQuery')
const ipc = require('electron').ipcRenderer;

//#1 - Get Main APP content, downloaded at start app
const APP_CONTENT = settings.get('content');

//#2 - Add Event Listener on click to popup de dialog with Contact
const contactBtn = document.getElementById('record-contact-btn');
contactBtn.addEventListener('click', (event) => {

    if($('#record-contact-btn').hasClass('record-contact-opened')){

        //close contact
        $('#record-contact-btn').removeClass('record-contact-opened');
        $('#record-contact-details').addClass('hidden');
        $('#record-contact-title').removeClass('hidden');
        //change chevron direction
        $('#record-contact-chevron').removeClass('fa-chevron-down');
        $('#record-contact-chevron').addClass('fa-chevron-up');

    }else{

        //open contact
        $('#record-contact-btn').addClass('record-contact-opened');
        $('#record-contact-details').removeClass('hidden');
        $('#record-contact-title').addClass('hidden');
        //change chevron direction
        $('#record-contact-chevron').removeClass('fa-chevron-up');
        $('#record-contact-chevron').addClass('fa-chevron-down');

    }


});




function number_format (number, decimals, decPoint, thousandsSep) { // eslint-disable-line camelcase

  number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
  var s = ''

  var toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec)
    return '' + (Math.round(n * k) / k)
      .toFixed(prec)
  }

  // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }

  return s.join(dec)
}


//#A - Responsible to build entire view based on house id
//received from ipc [home.js > main.js > record.js]
function renderHouseDetail(houseId){

    //#FINAL# - Show entire details!
    $('#home-section').css('display', 'none');
    $('#record-section').css('display', 'block');
    var html_imgs="";
    var imovel = APP_CONTENT.imoveis_home_page[houseId];
    for(var i = 0;i<APP_CONTENT.imoveis_home_page[houseId].img_galeria.length;i++){
      //#1 - if is index = 0 (first image), set carrosel-item as active
      if(i === 0){
        html_imgs+=" <div class='carousel-item active'>    <img class='img_house' src='"+APP_CONTENT.imoveis_home_page[houseId].img_galeria[i].images+"' style=''/> </div>";
      }        
      else{
        html_imgs+=" <div class='carousel-item'>    <img class='img_house' src='"+APP_CONTENT.imoveis_home_page[houseId].img_galeria[i].images+"' style=''/> </div>";
      }
    }
  $('#record-img-background').attr('src',APP_CONTENT.img_fundo);

  $('.record-carousel-photos .inner').html(html_imgs);
  $('.record-info-description>div').html( imovel.descricao);
  $('.title_imovel').html(imovel.titulo)
  $('.price_sell').html( number_format(imovel.preco_venda,2,'.',' ')+" €");
  $('.district').html( imovel.distrito);
  $('.town').html( imovel.concelho);
  $('.small_town').html( imovel.freguesia);

  $('.place').html( imovel.zona);
  $('.state_imov').html( imovel.estado);
  $('.referencia').html( imovel.referencia);
  $('#ref-id').html( imovel.referencia);
  $('.type').html( imovel.natureza);

  $('.tipology').html( imovel.tipologia);
  $('.area_small').html( imovel.area_util + " m2");
  $('.area_big').html( imovel.area_bruta + " m2");

  $('.energy').html( imovel['categoria-energetica']);

  $('.rooms span').html(imovel.quartos);
  $('.wcs span').html(imovel.wcs);
  $('.rooms img').attr('src',APP_CONTENT.img_quartos);
  $('.wcs img').attr('src',APP_CONTENT.img_wc);
  $('.cars span').html(imovel.carros_garagem);
  $('.area_big_icon span').html(imovel.area_bruta + " m2");
  $('.area_small_icon span').html(imovel.area_util + " m2");
  $('.cars img').attr('src',APP_CONTENT.img_n_carros);
  $('.area_big_icon img').attr('src',APP_CONTENT.img_area_bruta);
  $('.area_small_icon img').attr('src',APP_CONTENT.img_area_util);
  $('.energy_group img').attr('src',APP_CONTENT.img_classe_energetica);
  $('.energy_group span').html(imovel['categoria-energetica'].replace(' ',''));
  $('.contact_name').html(APP_CONTENT.contacto[0].nome);
  $('.contact_phone').html(APP_CONTENT.contacto[0].n_telemovel);
  $('.company_name').html(APP_CONTENT.contacto[0].imobiliaria);
  $('.contact_email').html(APP_CONTENT.contacto[0].email);
  $('.contact-photo img').attr('src',APP_CONTENT.contacto[0].imagem);
}

//#B - Responsible to return to Home view, closing details
//received from ipc [navbar.js > main.js > record.js]
function closeHouseDetail(){

    //#FINAL# - Show home!
    $('#home-section').css('display', 'block');
    $('#record-section').css('display', 'none');

}


/******************************
 **********IPC Section*********
 ******************************/

//#IPC handler when client click "+" at Home
ipc.on('showHouseDetail', function (event, houseId) {

    //#1 - Call main function responsible to render details
    renderHouseDetail(houseId);

});

//#IPC handler when client click "Back" at Navbar
ipc.on('closeHouseDetail', function (event, houseId) {

    //#1 - Call main function responsible to render home
    closeHouseDetail();

});
