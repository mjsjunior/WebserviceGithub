$( document ).ready(function() {
	var api = "https://api.github.com"
	var endPoint = "client_id=8535bac83251149ac427&client_secret=0e7a3f067fb90c1a2f45c2e771dff96bed954989"
	var per_page = 30; 
	var userGlobal;
	var totalPaginas;
    $('#buscar').submit(function(){
    	var user = $('#user').val();
    	//var user = 'mjsjunior'
    	
    	carregarUser(user);
    	return false;
    });

    function carregarUser(user){
    	$('#erro').empty();

    	var url = api+"/users/"+user+'?'+endPoint;
   
    	$.ajax({
         url: url+endPoint,
         type: "GET",
         statusCode: {
		    404: function() {
				$('#erro').append("<p>Usuario "+user+" não existe</p>");
		    }
		  },
         data: $(this).serialize(),
         success: function(d) {
         	  montarApresentacaoUser(d);
           
         }
       });
    }

    function montarApresentacaoUser(user){
    	var nome = "";
    	if(user['name'])
    		nome = user['name']
    	else
    		nome = user['login']
    	$('#page').val(1);
    	$('#info h4 .name').text(' '+nome);
    	$('#info h6 .followers').text(' '+user['followers']);
    	$('#pagination').hide();

    	if(user['followers'] > per_page){
    		totalPaginas = Math.ceil(user['followers']/per_page);
    		$('#pagination').show();
    	}
    	userGlobal = user;
    	listarSeguidores(user['followers_url']+'?page=0&per_page='+per_page+'&'+endPoint);
    	$('#info').show();
    }

    $('#nextPage').click(function(){
    	var page = $('#page').val();
    	page = parseInt(page) + 1;
    	if(page > totalPaginas){
    		page = totalPaginas;
    	}

    	$('#page').val(page);
    	var url = userGlobal['followers_url']+'?page='+page+'&per_page='+per_page+'&'+endPoint;
    	listarSeguidores(url)
    })

     $('#prevPage').click(function(){
    	var page = $('#page').val();

    	page = parseInt(page) - 1;
    	if(page < 0)
    		page = 0;
    	$('#page').val(page);
   		
    	var url = userGlobal['followers_url']+'?page='+page+'&per_page='+per_page+'&'+endPoint;
    	listarSeguidores(url)
    })

    function listarSeguidores(url){
    	$.ajax({
         url: url,
         type: "GET",
         data: $(this).serialize(),
         success: function(d) {
           montarFollowersUser(d);
         }
       });
    }

    function montarFollowersUser(data){
    	$.each(data,function(i){
    			$('#followers').empty();
    			//console.log(data[i]['login']);
    			var seguidor = obterUsuario(data[i]['login']);

    			seguidor.success(function(user){
    				
    				var nome = ""
    				if(user['name'])
    					nome = user['name']
    				else
    					nome = data[i]['login']


    			$('#followers').append("<div class='linha col s4'><div class='seguidor' id='"+data[i]['login']+"'><a class='clickSeguidor' href='#"+data[i]['login']+"'><input class='login' type='hidden' value='"+data[i]['login']+"'><img src='"+data[i]['avatar_url']+"'> "+nome+" </a></div></div>");
    			

    			})
    			//console.log(seguidor);
    })

    	$('#followers').show();
    }

    function obterUsuario(user){
    	var url = api+"/users/"+user;
    	return $.ajax({
         url: url+'?'+endPoint,
         type: "GET",
         data: $(this).serialize(),
         
       });
    	
    }



    $("#followers").on("click",".seguidor", function(){
    	var user = $(this).find('.login').val();
    	$('.repositorio').remove();
    	$('.linha').removeClass('s12 listRepo');
    	$('.linha').addClass('s4');
    	    	$(this).parent().removeClass('s4');
    	$(this).parent().addClass('s12 center-align listRepo');


	    $.ajax({
         url: api+"/users/"+user+"/repos?"+endPoint,
         type: "GET",
         data: $(this).serialize(),
         success: function(d) {
           adicionarRepositorios(d,user);
         }
       });
	});

	function adicionarRepositorios(d,id){
		$('#'+id+' p').empty();
		$.each(d,function(i){
			$('#'+id).append('<p class="repositorio"> <a target="_blank" href="'+d[i]['html_url']+'"><i class="fa fa-link"></i> '+d[i]['name']+'</a></p>');
		})
		return false;
	}




/*
	$('#followers-table').append("<tr class='seguidor' id='"+data[i]['login']+"'><td> <img src='"+data[i]['avatar_url']+"'> "+data[i]['login']+" <td></tr>");
    	
*/


});

