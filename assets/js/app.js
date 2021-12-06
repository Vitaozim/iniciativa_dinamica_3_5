jQuery(document).ready(function($) {
	var $formIniciativa = $("#form-iniciativa tbody");
	var $btAddNovo = $("#adicionar-novo");
	var $btGerar = $("#gerar-iniciativas");
	var $tabelaGerada = $("#iniciativas-geradas table tbody");
	var $historico = $("#historico ul");

	if (localStorage.getItem("pessoasComuns") !== undefined) {
		$.each(JSON.parse(localStorage.getItem("pessoasComuns")), function(index, val) {
			 var $cloneInputsPessoa = $formIniciativa.children("tr").last().clone(true,true);
			 $cloneInputsPessoa
			 	.find("input")
			 	.filter(".nome")
			 	.val(val["nome"])
			 	.end()
			 	.filter(".iniciativa")
			 	.val(val["bonus-ini"])
			 	.end()
			 	.filter(".mod-des")
			 	.val(val["mod-des"])
			 	.end().end()
			 	.find(".player-ou-npc")
			 	.removeClass('npc player').addClass(val["player-ou-npc"])
			 	.end()
			 	.find(".vivo-ou-morto")
			 	.removeClass('vivo morto').addClass(val["vivo-ou-morto"])

			$formIniciativa.append($cloneInputsPessoa);
		});
	}


	

	$formIniciativa
	.find("input").on('blur', function(event) {
		if ($.trim($(this).val()) === "") {$(this).val(0)}
	})
	.end()
	.find(".player-ou-npc").on('click', function(event) {
		$(this).toggleClass('player npc');
	})
	.end()
	.find(".vivo-ou-morto").on('click', function(event) {
		$(this).toggleClass('vivo morto');
	})
	.end()
	.find(".duplicar").on('click', function(event) {
		var $pessoaDessaBt = $(this).closest("tr");
		var $clone = $pessoaDessaBt.clone(true, true);
		$pessoaDessaBt.after($clone);

	})
	.end()
	.find(".excluir").on('click', function(event) {
		var $pessoaDessaBt = $(this).closest("tr");
		$pessoaDessaBt
		.addClass("excluido")
		.on('animationend', function(event) {
			$(this).off("animationend").remove();
		});

	});




	$btAddNovo.on('click', function(event) {
		var $clone = $formIniciativa.find("tr").last().clone(true, true);
		$clone
			.find("input")
			.filter(".nome")
			.val("")
			.end()
			.filter(".iniciativa")
			.val(0)
			.end()
			.filter(".mod-des")
			.val(0)
			.end().end()
			.find(".player-ou-npc")
			.addClass("player").removeClass('npc')
			.end()
			.find(".vivo-ou-morto")
			.addClass("vivo").removeClass('morto');
		$formIniciativa.append($clone);

	});



	$btGerar.on('click', function(event) {
		var dadosPessoas = [];
		var dadosLocalStorage = [];

		if ($("#iniciativas-geradas").hasClass("visivel")) {
			var $novoLi = $("<li></li>");
			$novoLi.append($("#iniciativas-geradas").children().clone(false));
			$historico.prepend($novoLi);
		}
		$("#iniciativas-geradas").addClass('visivel');
		$formIniciativa.children("tr").each(function(index, el) {
			if ($(el).find(".nome").val() !== "") {

				// var chanceDadoEspecial = Math.floor(Math.random()*10)+1;

				// var iniRolada;

				// if (chanceDadoEspecial <= 2) {iniRolada = 1}
				// else if(chanceDadoEspecial >= 8) {iniRolada = 20}
				// else {iniRolada = Math.floor(Math.random()*20)+1;}

				var iniRolada = Math.floor(Math.random()*20)+1;
				var bonusIni = parseInt($(el).find(".iniciativa").val());
				var modDes = parseInt($(el).find(".mod-des").val());
				dadosPessoas.push({
					"ini-rolada": iniRolada,
					"nome": $(el).find(".nome").val(),
					"bonus-ini": bonusIni,
					"mod-des": modDes,
					"ini-total": iniRolada+bonusIni+(modDes*1/100),
					"player-ou-npc": $(el).find(".player-ou-npc").hasClass("player") ? "player" : "npc",
					"vivo-ou-morto": $(el).find(".vivo-ou-morto").hasClass("vivo") ? "vivo" : "morto"
				});

				dadosLocalStorage.push({
					"nome": $(el).find(".nome").val(),
					"bonus-ini": bonusIni,
					"mod-des": modDes,
					"player-ou-npc": $(el).find(".player-ou-npc").hasClass("player") ? "player" : "npc",
					"vivo-ou-morto": $(el).find(".vivo-ou-morto").hasClass("vivo") ? "vivo" : "morto"
				})
			}
		});

		localStorage.setItem("pessoasComuns", JSON.stringify(dadosLocalStorage));

		console.log(localStorage.getItem("pessoasComuns"));
		dadosPessoas.sort(function(a,b){
			if (a["ini-rolada"] === 20) {
				if (b["ini-rolada"] === 20) {
					console.log(a["nome"]+" e "+b["nome"]+" tiraram 20...")
					if (a["ini-total"] >= b["ini-total"]) {
						console.log("...mas "+a["nome"]+" tem mais iniciativa (ou igual), então ganhou");
						return -1;
					}else{
						console.log("...mas "+a["nome"]+" tem menor iniciativa, então perdeu");
						return 1;
					}
				} else{
					console.log(a["nome"]+" tirou 20, sucesso decisivo contra "+b["nome"])
					return -1
				}
			}
			else if(a["ini-rolada"] === 1){
				if (b["ini-rolada"] === 1) {
					console.log(a["nome"]+" e "+b["nome"]+" tiraram 1...")
					if (a["ini-total"] >= b["ini-total"]) {
						console.log("...mas "+a["nome"]+" tem mais iniciativa (ou igual), então ganhou");
						return -1;
					}else{
						return 1;
						console.log("...mas "+a["nome"]+" tem menor iniciativa, então perdeu");

					}
				} else{
					console.log(a["nome"]+" tirou 1, falha crítica contra "+b["nome"])
					return 1;
				}
			}
			else{
				if (b["ini-rolada"] === 20) {
					console.log("deu ruim para"+a["nome"]+", "+b["nome"]+" tirou 20!");
					return 1;
				}else if (b["ini-rolada"] === 1) {
					console.log("sossega, "+a["nome"]+", "+b["nome"]+" tirou 1!");
					return -1;
				}else if (a["ini-total"]>=b["ini-total"]) {
					console.log(a["nome"]+" foi melhor que "+b["nome"]);
					return -1;
				} else{ 
					console.log(a["nome"]+" foi pior que "+b["nome"]);
					return 1;
				}
			}
			
		})

		// console.log(dadosPessoas);

		var idBatalha = $("#nome-batalha .nome-batalha").val();
		var d = new Date();
		
		$("#iniciativas-geradas time").text(
			(d.getDate().toString().length === 1 ? "0" : "")+d.getDate()+
			"/"+
			((d.getMonth()+1).toString().length === 1 ? "0" : "")+(d.getMonth()+1)+
			"/"+
			(d.getYear()-100+2000)+
			", às "+
			(d.getHours().toString().length === 1 ? "0" : "")+d.getHours()+
			":"+
			(d.getMinutes().toString().length === 1 ? "0" : "")+d.getMinutes()
		);
		$("#iniciativas-geradas .nome-batalha").text(idBatalha === "" ? "Um combate qualquer": idBatalha);
		$("#iniciativas-geradas .rodadas .n-rodada").text($("#nome-batalha .n-rodada").val());

		$("#nome-batalha .n-rodada").val(parseInt($("#nome-batalha .n-rodada").val())+1);


		$tabelaGerada.children().not(".template").remove();

		$.each(dadosPessoas, function(index, val) {
			var $clonePessoaGerada = $tabelaGerada.children(".template").clone(false, false);
			$clonePessoaGerada
			.removeClass("template")
			.addClass((val["vivo-ou-morto"] === "morto" ? "morto": "")+(val["player-ou-npc"] === "player" ? " player": ""))
			.find(".ini-total")
				.addClass(val["ini-rolada"] === 1 ? "um-no-dado" : val["ini-rolada"] === 20 ? "vinte-no-dado" : "")
				.attr("data-soma", val["ini-rolada"].toString()+(val["bonus-ini"] >= 0 ? "+" : "")+val["bonus-ini"].toString())
				.text(Math.round(val["ini-total"]))
			.end()
			.find(".nome")
				.text(val["nome"])
			.end()
			.find(".mod-des")
				.text(val["mod-des"])
			.end()
			.find(".player-ou-npc")
				.addClass(val["player-ou-npc"])
			.end()
			.find(".vivo-ou-morto")
				.addClass(val["vivo-ou-morto"]);

			$tabelaGerada.append($clonePessoaGerada);
			 
		});
	});

});