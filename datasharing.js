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
		self.prevNext();
	}

	this.submitForm = function(){
		self = this;
		$$FORM.submit(function(e){
			e.preventDefault();
			$$FORMDATA = $('#basicAuthForm').find('input[name!=query]').serialize();
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
					self.display(data,$$SECTION);
					fromForm = $.extend($.objectify($$FORMDATA),$.objectify($('#query').val()));
					fromForm.qVars = $.objectify($('#query').val());
					console.log(fromForm);
					console.log('--^-fromForm---------------');
					self.lookAhead(fromForm,data);
					self.lookBehind(fromForm,data);
				}
			});
		});
	}

	this.prevNext = function(allData,data){
		self = this;
		console.log(self.collectData());
		console.log(allData);
		$('#next').click(function(e){
			e.preventDefault();
			console.log('whut');
			_data = self.collectData();
			lookAhead = {
				username : _data.username,
				pwd : _data.pwd,
				url : _data.url,
				section : _data.section,
				page : _data.number+1,
				size : _data.size
			};
			lookAhead.query = '?page=' + lookAhead.page + '&size=' + lookAhead.size;
			$('#query').val(lookAhead.query);
		});	
	}

	this.collectData = function(){
		$$FORMDATA    = $('#basicAuthForm').find('input[name!=query]').serialize();
		allData       = $.extend($.objectify($$FORMDATA),$.objectify($('#query').val()));
		allData.qVars = $.objectify($('#query').val());
		return allData;
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
		$$RANGE   = '(' + $.insertCommas(data.size) + ' result' + $.singlePlural(data.size) + ') ' + $.insertCommas($$START) + ' thru ' + $.insertCommas($$END);
		i         = $$START;
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
        		$$RESULTS.push('<th class="align-right">#</th>');
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
        					$$RESULTS.push(self.countCell(i));
        					$$RESULTS.push(self.agencyCell(this.accountName,this.accountId));
        					$$RESULTS.push(self.addressCell(this.addresses));
        					$$RESULTS.push(self.phoneCell(this.phones));
        					$$RESULTS.push(self.statusCell(this.status));
        				$$RESULTS.push('</tr>');
        				i++;
        			});

        		}
        		
        		$$RESULTS.push('</table>');
        		break;
    		default:
        		console.log('CATCHALL FOR DESIGN');
		}
		$('#results').html($$RESULTS.join(' '));
	}

	/**
	 *
	 * Reusable helper functions for tabular data.
	 *
	 */

	this.countCell = function(n){
		return '<td class="align-right">' + n + '</td>';
	}

	this.agencyCell = function(accountName,accountId){
		return '<td><b><a href="javascript:someFunction(\'' + accountId + '\');">' + accountName + '</a></b></td>';
	}

	this.addressCell = function(addressArray){
		if (typeof addressArray != 'object') return '<td>&nbsp;</td>';
		$$AA = [];
		$.each(addressArray,function(){
        	$$AA.push('<p><span class="text-capitalize"><b>' + this.addressType + '</b></span>');
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
			$$PA.push(self.phoneLink(this.number));
			$$PA.push('<br />');
		});
		return '<td class="text-capitalize">' + $$PA.join(' ') + '</td>';
	}

	this.statusCell = function(status){
		// console.log(typeof phoneArray);
		if (typeof status == 'undefined') return '<td>&nbsp;</td>';
		return '<td class="text-capitalize">' + status + '</td>';
	}

	this.phoneLink = function(n){
		return '<a href="tel:' + $.sanitizePhoneNumber(n) + '">' + n + '</a>';
	}

	this.lookAhead = function(fromForm,fromResults){
		lookAhead = {
			username : fromForm.username,
			pwd : fromForm.pwd,
			url : fromForm.url,
			section : fromForm.section,
			page : fromResults.number+1,
			size : fromResults.size
		};
		lookAhead.query = '?page=' + lookAhead.page + '&size=' + lookAhead.size;
		$('#next').val(lookAhead.query);
		console.log(lookAhead);
	}

	this.lookBehind = function(fromForm,fromResults){
		lookBehind = {
			username : fromForm.username,
			pwd : fromForm.pwd,
			url : fromForm.url,
			section : fromForm.section,
			page : fromResults.number-1,
			size : fromResults.size
		};
		lookBehind.query = '?page=' + lookBehind.page + '&size=' + lookBehind.size;
		$('#prev').val(lookBehind.query);
		console.log(lookBehind);
	}

}