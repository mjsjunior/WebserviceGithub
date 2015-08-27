$( document ).ready(function() {
	var api = "https://api.github.com"
	var endPoint = "?client_id=8535bac83251149ac427&client_secret=0e7a3f067fb90c1a2f45c2e771dff96bed954989"
	var userGlobal = "abc";
    $('#buscar').submit(function(){
    	var user = $('#user').val();
    	//var user = 'mjsjunior'
    	
    	carregarUser(user);
    	return false;
    });

    function carregarUser(user){
    	var url = api+"/users/"+user+endPoint;
   
    	$.ajax({
         url: url+endPoint,
         type: "GET",
         data: $(this).serialize(),
         success: function(d) {
         	alert(d['message']);
         	  montarApresentacaoUser(d);
           
         }
       });
    }

    function montarApresentacaoUser(user){
    	$('#info h4 .name').text(' '+user['name']);
    	$('#info h6 .followers').text(' '+user['followers']);
    	listarSeguidores(user['followers_url']);
    	$('#info').show();
    }

    function listarSeguidores(url){
    	$.ajax({
         url: url+endPoint,
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
    				$('#followers').append("<div class='row'><div class='seguidor' id='"+data[i]['login']+"'><a class='clickSeguidor' href='#'><input class='login' type='hidden' value='"+data[i]['login']+"'><img src='"+data[i]['avatar_url']+"'> "+user['name']+" </a></div></div>");
    	
    			})
    			//console.log(seguidor);
    })

    	$('#followers').show();
    }

    function obterUsuario(user){
    	var url = api+"/users/"+user;
   		var us = "abc";	
    	return $.ajax({
         url: url+endPoint,
         type: "GET",
         data: $(this).serialize(),
         
       });
    	
    }



    $("#followers").on("click",".clickSeguidor", function(){
    	var user = $(this).find('.login').val();
    	$('.repositorio').remove();
	    $.ajax({
         url: api+"/users/"+user+"/repos"+endPoint,
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
			$('#'+id).append('<p class="repositorio"> <a target="_blank" href="'+d[i]['html_url']+'">'+d[i]['name']+'</a></p>');
		})
		return false;
	}




/*
	$('#followers-table').append("<tr class='seguidor' id='"+data[i]['login']+"'><td> <img src='"+data[i]['avatar_url']+"'> "+data[i]['login']+" <td></tr>");
    	
*/


});

