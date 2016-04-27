function DATASHARING(){
	this.init = function(){
		self = this;
		
		$$URL      = 'cURL.php';
		$$URL_API  = $('#url').val();
		$$FORM     = $('#basicAuthForm');
		$$USERNAME = $('#username').val();
		$$PASSWORD = $('#pwd').val();
		$$SECTION  = $('#section').val();
		$$FORMDATA = $('#basicAuthForm').find('input[name!=query]').serialize();

		$$DEBUG    = $$URL + '?' + $$FORMDATA;

		self.submitForm();
		self.getProducts();
	}

	this.submitForm = function(){
		console.log('start me up');
		$$FORM.submit(function(e){
			e.preventDefault();

			$$FORMDATA = $('#basicAuthForm').find('input[name!=query]').serialize();
			console.log($$DEBUG);

			$.ajax({
				type: "GET",
				url: $$URL,
				dataType: 'json',
				async: false,
				headers: {
					"Authorization": "Basic " + btoa($$USERNAME + ":" + $$PASSWORD)
				},
				data: $$FORM.serialize(),
				success: function (data){
					//console.log(data);
					self.display(data,$$SECTION);

					console.log('---------------');
					console.log($.objectify($('#query').val()));
					console.log($.unObjectify($$FORMDATA));
					console.log('---------------');
				}
			});
		});
	}

	this.getProducts = function(){
		$.ajax({
			type: "GET",
			url: $$URL,
			dataType: 'json',
			async: false,
			headers: {
				"Authorization": "Basic " + btoa($$USERNAME + ":" + $$PASSWORD)
			},
			data: {
					url      : $$URL_API,
					username : $$USERNAME,
					pwd      : $$PASSWORD,
					section  : 'products',
					// page     : 1,
					// size     : 1
			},
			success: function (data){
				$.each(data.content,function(){
					//console.log("%s:%s",this.course, this.productId);
				});
			}
		});
	}

	this.display = function(data,dataType){
		self = this;
		$('#results').html('');
		$$RESULTS = [];
		$$HOWMANY = $.insertCommas(data.totalElements);
		$$START   = (data.size*data.number)+1;
		$$END     = $$START+data.numberOfElements-1;
		$$RANGE   = '(' + $.insertCommas(data.size) + ' results) ' + $.insertCommas($$START) + ' thru ' + $.insertCommas($$END);
		$$B       = ['<b>','</b>']
		switch(dataType) {
    		case 'agencies':
    			/**
    			 * AGENCIES DISPLAY
    			 *
    			 * console.log('DESIGN FOR AGENCIES DATA');
    			 */

        		
        		$$RESULTS.push('<h1>' + $$HOWMANY + ' AGENCIES <small>' + $$RANGE + '</small></h1>');
        		$$RESULTS.push('<table class="table table-striped table-condensed table-hover">');
        		$$RESULTS.push('<tr>');
        		$$RESULTS.push('<th>Account Name</th>');
        		$$RESULTS.push('<th>Address</th>');
        		$$RESULTS.push('<th>Phone</th>');
        		$$RESULTS.push('<th>Status</th>');
        		$$RESULTS.push('</tr>');

        		if (typeof data.content == 'undefined') {

        			$.each(data, function(){
        				console.log(this);
        				console.log('single');
        				$$RESULTS.push('<tr>');
        					$$RESULTS.push(self.agencyCell(this.accountName,this.accountId));
        					$$RESULTS.push(self.addressCell(this.addresses));
        					$$RESULTS.push(self.phoneCell(this.phones));
        					$$RESULTS.push(self.statusCell(this.status));
        				$$RESULTS.push('</tr>');
        			});

        		} else {
        		
        			$.each(data.content, function(){
        				//console.log(this);
        				$$RESULTS.push('<tr>');
        					$$RESULTS.push(self.agencyCell(this.accountName,this.accountId));
        					$$RESULTS.push(self.addressCell(this.addresses));
        					$$RESULTS.push(self.phoneCell(this.phones));
        					$$RESULTS.push(self.statusCell(this.status));
        				$$RESULTS.push('</tr>');
        			});

        		}
        		
        		$$RESULTS.push('</table>');
        		break;
    		default:
        		console.log('CATCHALL FOR DESIGN');
		}
		$('#results').html($$RESULTS.join(' '));
	}

	// Helpers for tabular data

	this.agencyCell = function(accountName,accountId){
		return '<td><b><a href="javascript:someFunction(\'' + accountId + '\');">' + accountName + '</a></b></td>';
	}

	this.addressCell = function(addressArray){
		if (typeof addressArray != 'object') return '<td>&nbsp;</td>';
		$$AA = [];
		$.each(addressArray,function(){
        	$$AA.push('<p><span class="text-capitalize">' + $$B[0] + this.addressType + $$B[1] + '</span>');
        	$$AA.push('<br />');
        	$$AA.push(this.street);
        	$$AA.push('<br />');
        	$$AA.push(this.city + ', ' + this.state);
        	$$AA.push(this.postalCode);
        });
		return '<td class="">' + $$AA.join(' ') + '</td>';
	}
	this.phoneCell = function(phoneArray){
		// console.log(typeof phoneArray);
		if (typeof phoneArray != 'object') return '<td>&nbsp;</td>';
		var $$PA = [];
		$.each(phoneArray,function(){
			$$PA.push(this.phoneType + ': ');
			$$PA.push(this.number);
			$$PA.push('<br />');
		});
		return '<td class="text-capitalize">' + $$PA.join(' ') + '</td>';
	}

	this.statusCell = function(status){
		// console.log(typeof phoneArray);
		if (typeof status == 'undefined') return '<td>&nbsp;</td>';
		return '<td class="text-capitalize">' + status + '</td>';
	}

	this.tableMaker = function(){}
}

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
		return 1;
	}
});

function fillIn(user,pass,url){
	$('#username').val(user);
	$('#pwd').val(pwd);
	$('#url').val(url);
}