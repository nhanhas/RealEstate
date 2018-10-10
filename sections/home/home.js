const settings = require('electron-settings')
const $ = require('jQuery')
const ipc = require('electron').ipcRenderer;

//#1 - Get Main APP content, downloaded at start app
const APP_CONTENT = settings.get('content');
console.log(APP_CONTENT);
let HOUSE_POSITION=0;

let keys = Object.keys(APP_CONTENT.imoveis_home_page);

//#2 - Handler to click "+" to show details
$('.home-details-more').click(function(){
    //#1 - Get the filter index from this option
    let houseId = $(this).closest('.house-tile').attr("data-attr");

    showHouseDetails(houseId);
})



//#4 - Fullscreen movie
$('.fullscreen-bg').click(function(){
  $(this).fadeOut(1000);
});

//#5 - Load Owner Parameters
function loadRealEstateParameters(){

  //#1 - Nothing much, just colors, logos etc
  $('#home-img-background').attr('src',APP_CONTENT.img_fundo);
  $('#nav-selection-title').html(APP_CONTENT.titulo_nome);
  $('#nav-selection-subtitle').html(APP_CONTENT.subtitulo);
  $('#close-details-btn span').html(APP_CONTENT.texto_btn_auxiliar);
  $('#filter-btn>span').first().html(APP_CONTENT.texto_btn_filtrar);
  $('.nav-logo img').attr('src',APP_CONTENT.img_logo);
  $('.text-blue-light').css('color',APP_CONTENT.cor_primaria);
  $('.container-blue-light').css('color',APP_CONTENT.cor_primaria); 
  $('.nav').css('border-top',"40px solid "+ APP_CONTENT.cor_superior);
  $('.text-blue-dark').css("color",APP_CONTENT.cor_secundaria);
  $('.nav-border-thin').css('background-color',APP_CONTENT.cor_inferior);
  $('.container-blue-light').css('background-color',APP_CONTENT.cor_primaria); 
  $('.text-blue-dark').css('color',APP_CONTENT.cor_secundaria);
  $('.text-gray-light').css('color',APP_CONTENT.cor_secundaria);
  $('.nav').css("border-top","20px solid" + APP_CONTENT.cor_secundaria);

  //#2 - Pass a cycle
  setTimeout(function(){
    $('.filter-expand-btn').css('color',APP_CONTENT.cor_primaria); 
    $('.filter-clear-btn').css('color',APP_CONTENT.cor_primaria); 
  });
    
}

//#6 - Load Houses (this function is responsible to build entire carousel)
function loadAssets(filters){

  var assetToShow = [];
  //#A - This will return a single "Square" of an Asset
  var TEMPLATE_getSingleAsset = function(assetID, asset, index){
    let template = '\
        <div class="col-md-3">\
            \
            <!--#TEMPLATE#-->\
            <div id="house-'+index+'" class="house-tile" data-attr="'+assetID+'">\
                <!-- Photo -->\
                <div class="home-photo">\
                    <div class=inner>\
                  <img src="'+asset.img_galeria[0].images+'"> </div>\
                </div>\
                <!-- details -->\
                <div class="home-details">\
                    <!-- More details btn -->\
                    <div data-house-id="1" class="home-details-more text-blue-light">\
                        <div class="home-details-circle"><i class="fa fa-plus fa-lg"></i></div>\
                    </div>\
                \
                    <!-- Type and Rooms -->\
                    <div class="text-size-lg text-bold text-blue-dark title_house">'+asset.titulo+'</div>\
                    <!-- City -->\
                    <div class="text-size-lg text-blue-dark location_house">'+asset.subtitulo+'</div>\
                    <!-- Price -->\
                    <div class="text-size-lg text-bold text-blue-light price_sell">Venda: <span>'+number_format(asset.preco_venda,2,'.',' ')+'€</span></div>\
                </div>\
                \
                <!-- House Ribbon -->\
                <div class="house-tile-ribbon container-blue-light text-size-splus text-white">\
                    IMÓVEL DA BANCA\
                </div>\
                \
            </div>\
            \
        </div>';

    return template;
  };

  //#B - This will return a single PAGE of a carousel
  var TEMPLATE_getSingleCarouselPage = function(assets, isFirstPage){
    let template = '\
        <!-- 1 slide = 4 houses -->\
        <div class="carousel-item '+(isFirstPage ? 'active' : '')+'">\
            <div class="row">\
            '+assets+'\
            </div>\
        </div>\
    ';

    return template;
  };

  //#C - This will return True/False if Asset is in Filter condition
  var AUX_isAssetValid = function(asset, filters){
    let isValid = true;
    //#1 - iterate filters, must be an AND conditions
    filters.forEach(function(filterItem){
      //#2 - distinct fields to validate
      switch (filterItem.filterName.toUpperCase()) {
        case 'FINALIDADE':
          isValid = isValid && true; //TODO
          break;
        case 'CONCELHO':
          isValid = isValid && (asset.concelho === filterItem.filterValue);
          break;
        case 'TIPO DE IMÓVEL':
          isValid = isValid && (asset.natureza === filterItem.filterValue);
          break;
        case 'Nº DE QUARTOS':
          isValid = isValid && (asset.quartos === filterItem.filterValue);
          break; 
      }
    });

    return isValid
  };

  //#1 - first we get all assets template (iterate assets)
  for(var i = 0; i < keys.length; i++ ){

    let assetID = keys[i];

    //#3 - Get template
    let assetTemplate = TEMPLATE_getSingleAsset(assetID, APP_CONTENT.imoveis_home_page[assetID], i);
    
    //#4 - Store it into array of assets (templates) (NOT using filters)
    if(!filters){
      assetToShow.push(assetTemplate);
    }else{
      //#1 - first we get all assets template (USING filters)
      //#1.1 - Check if asset contemplated in filter
      let isAssetValid = AUX_isAssetValid(APP_CONTENT.imoveis_home_page[assetID], filters);
      if(isAssetValid){
        //#1.2 - Store it in case of valid
        assetToShow.push(assetTemplate);
      }

    }
  }

  //#5 - Now that we have all templated assets, subdivide in 4 and create carousel items
  let CAROUSEL_MAX_ASSETS = 4;
  let htmlToPage = '';
  //#6 - Create each carousel page item
  for(var i = 0; i < assetToShow.length; i=i+CAROUSEL_MAX_ASSETS){

    let assetsToAssign = assetToShow.slice(i, i+CAROUSEL_MAX_ASSETS);
    //#7 - transform array of CAROUSEL_MAX_ASSETS tempalate into 1 string
    let assetsPageContentTemplate = '';
    assetsToAssign.forEach(function(asset){
      assetsPageContentTemplate += asset;
    });
    //#8 - Get Page Carousel Template with content
    htmlToPage += TEMPLATE_getSingleCarouselPage(assetsPageContentTemplate, (i === 0 ? true : false));
            
  }

  //#FINALLY add to html DOM
  $('.carousel-inner').html(htmlToPage);

  //# - Handler to click "+" to show details
  $('.home-details-more').click(function(){
    //#1 - Get the filter index from this option
    let houseId = $(this).closest('.house-tile').attr("data-attr");

    showHouseDetails(houseId);
  })


  //OLD...
  /*
  var pos=0;
  for(i=0;i<keys.length && i<4;i++){
    pos=HOUSE_POSITION+i;
    $('#house-'+(i+1) + ' .home-photo img').attr('src',APP_CONTENT.imoveis_home_page[keys[pos]].img_galeria[0].images);
    $('#house-'+(i+1) + ' .title_house').html(APP_CONTENT.imoveis_home_page[keys[pos]].titulo);
    $('#house-'+(i+1) + ' .location_house').html(APP_CONTENT.imoveis_home_page[keys[pos]].subtitulo);
    $('#house-'+(i+1) + ' .price_sell span').html(number_format(APP_CONTENT.imoveis_home_page[keys[pos]].preco_venda,2,'.',' '));
    $('#house-'+(i+1)).attr('data-attr',keys[pos]);
  }//OLD END...*/
}

//#AUX - number formating AUX
function number_format (number, decimals, decPoint, thousandsSep) { 
  // eslint-disable-line camelcase

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


/**
 * 
 * STARTING home
 * Parameters and Assets
 */
loadRealEstateParameters();
loadAssets(undefined);


/******************************
 **********IPC Section*********
 ******************************/

//#A - Handler when house details is clicked [IPC sender]
function showHouseDetails(houseId){
    ipc.send('ipc-show-house-detail', houseId);
}

//#IPC when user click "filter" on Navbar to filter results
ipc.on('loadAssets', function (event, filters) {

  //#1 - Call main function responsible to render assets filtered
  loadAssets(filters);

});

