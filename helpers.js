jQuery.extend({
	getQueryParameters : function(str) {
		return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){
		return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
	},
	objectify : function(str){
		return $.getQueryParameters(str);
	},
	unObjectify : function(obj){
		return JSON.parse(JSON.stringify(obj));
	},
	ucWords : function(str){
		str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});
		return str;
	},
	insertCommas : function(n){
		if (typeof n == 'undefined') return false;
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	singlePlural : function(n,options){
		var options = (typeof options != 'undefined') ? options : ['','s'] ;
		var sP = (n == 1) ? options[0] : options[1] ;
		return sP;
	},
	sanitizePhoneNumber : function(n){
		return n.replace(/[^0-9]+/g, "");
	},
	fillIn : function(user,pass,url){
		$('#username').val(user);
		$('#pwd').val(pwd);
		$('#url').val(url);
	}
});