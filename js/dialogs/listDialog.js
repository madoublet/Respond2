var listDialog = {

	dialog: null,
	mode: null, 
	moduleId: null,

	init:function(){

		listDialog.dialog = $('#listDialog');

		$('#addList').click(function(){
            
    	  var editor = $('#desc');

		  var pageTypeUniqId = $('#listPageType').val();
          
          var uniqId = 'list'+ ($(editor).find('.list').length + 1);
          
		  var display = $('#listDisplay').val();
		  var label = $('#listPageType option:selected').text();
		  label = label.toLowerCase();

		  if(pageTypeUniqId==-1){
		    message.showMessage('error', 'You must select a type of list.');
		    return;
		  }
		  
		  var html = '<div id="'+uniqId+'" data-display="'+display+'" data-type="'+pageTypeUniqId+'" class="list"';
		  html += ' data-length="'+$('#listLength').val()+'"';
		  html += ' data-orderby="'+$('#listOrderBy').val()+'"';
		  html += ' data-pageresults="'+$('#listPageResults').is(':checked')+'"';
		  html += ' data-desclength="'+$('#listDescLength').val()+'"';
		  html += ' data-label="'+label+'"><div>List '+label+'</div><span class="marker icon-list-alt" title="Module"></span><a class="remove" href="#"></a><a class="config-list" href="#"></a></div>';

		  $(editor).respondAppend(
		    html
		  );
		  
		  $(editor).respondHandleEvents();

		  $('#listDialog').modal('hide');
		});


		$('#updateList').click(function(){
		  
		  var pageTypeUniqId = listDialog.pageTypeUniqId;
		  var moduleId = listDialog.moduleId;
		  
		  var editor = $('#desc');

		  var desclength = parseInt($('#listDescLength').val());
		  
		  $('div#'+moduleId+'.list').attr('data-display', $('#listDisplay').val());
		  $('div#'+moduleId+'.list').attr('data-length', $('#listLength').val());
		  $('div#'+moduleId+'.list').attr('data-orderby', $('#listOrderBy').val());
		  $('div#'+moduleId+'.list').attr('data-pageresults', $('#listPageResults').val());
		  $('div#'+moduleId+'.list').attr('data-desclength', desclength);
		 
		  $('#listDialog').modal('hide');
		});
	},

	show:function(mode, moduleId){ // shows the dialog

		listDialog.mode = mode;
		listDialog.moduleId = moduleId;

	    if(mode=='add'){

			$('#listDialog h3').html('Add List');  // show/hide
			$('#addList').show();
			$('#updateList').hide();
			$('#showSelectOptions').show();
			$('#selectList li').removeClass('selected');
			$('#showCategoryOptions').hide();
			$('#showCategoryPageTypes').show();

			$('#listLength').val('10');   // set initial values
			$('#listOrderBy').val('Name');
			$('#listPageResults').val('false');
			$('#listDescLength').val(250);
			$('#listFeaturedOnly').val(0);

			listDialog.pageTypeUniqId = -1;

			$('#listDialog').modal('show'); // show modal
	    }
	    else{
	      $('#listDialog h3').html('Edit List');  // show/hide
	      $('#addList').hide();
	      $('#updateList').show();
	      $('#listPageTypeBlock').hide();

	      var node = $('div#'+listDialog.moduleId+'.list');   // get reference to list
	      var display = $(node).attr('data-display');
	      var type = $(node).attr('data-type');
	      var label = $(node).attr('data-label');
	      var length = $(node).attr('data-length');
	      var orderby = $(node).attr('data-orderby');
	      var pageresults = $(node).attr('data-pageresults');
	      var desclength = $(node).attr('data-desclength');

	      if(desclength==undefined){
	        desclength = 250;
	      }

	      $('#listDisplay').val(display);   // set current values
	      $('#listLength').val(length); 
	      $('#listOrderBy').val(orderby); 
	      $('#listPageResults').val(pageresults);
	      $('#listDescLength').val(desclength);
	      
	      listDialog.pageTypeUniqId = type;

	      $('#listDialog').modal('show'); // show modal
	    }
	}

}

$(document).ready(function(){
  listDialog.init();
});