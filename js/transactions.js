//Transaction.js: Initializes the application and does the corresponding action
//					based on the user input.
//Initialization:
//	Assumes authToken cookie is not set. Hides entire UI.
//Two phases:
//
//	Phase 1: authToken cookie is not found.
//		1. Login form appears.
//		2. Once submitted, passes API query data.
//		3. If jsonCode "200" is returned,
//			hides login form, sets authToken cookie, and begins phase 2.
//		4. If failed, Login error appears and ask the user to try again.
//
//	Phase 2: authToken cookie is found.
//		1. Sign out, transaction table, and create transactions form appears.
//		2. Download the Transaction list to be displayed in table.
//			Displays error if data cannot be downloaded.
//		3. If sign out is selected, 
//			authToken cookie is deleted. UI is hidden, and login form appears.
//			Back to phase 1.
//		4. If create transaction form is filled and submitted,
//			a. Checks validity to data being passed.
//			b. If jsonCode "200" is returned,
//				Success message appears asking user to reload to see the new list
//				or add another one.
//			c. Else, sends a error message
//
//	########################################################################################

//Global api variable. Every api url will start with this.
var api = "https://api.expensify.com/?";

//	########################################################################################


$(document).ready(function() {
	
	//Initialize the createForm date calandar
	$("#datepicker").datepicker({ changeMonth: true, changeYear: true, dateFormat: "yy-mm-dd"});
	
	//Initialize transactions list table using jqGrid
	jQuery("#list").jqGrid({
		datatype: "local",
		height: 250,
		colNames:[
			'Created',
			'Inserted',
			'wasModified',
			'Modified',
			'TransactionID',
			'Currency',
			'Amount',
			'Converted Amount',
			'Modified Amount',
			'Merchant',
			'Modified Merchant',
			'Bank',
			'CardID',
			'CardNumber',
			'Receipt Filename',
			'ReceiptID',
			'ReportID',
			'ExternalID',
			'Billable', 
			'Reimbursable',
			'Unverified',
			'Category',
			'Comment',
			'Details',
			'Tag',
			'MCC',
			'ModifiedMCC',
			'TransactionHash',
			'ReceiptObject',
			'AutoCategory',
			'Editable'
			],
		colModel:[
			{name:'created', index: 'created', width:100 },
			{name:'inserted', index: 'inserted', width:100 },
			{name:'modified', index: 'modified', width:100 },
			{name:'modifiedCreated', index:'modifiedCreated', width:100 },
			{name:'transactionID', index: 'transactionID', width:100 },
			{name:'currency', index: 'currency', width:55 },
			{name:'amount',index:'amount', width:80, align:"right",sorttype:"float"},
			{name:'convertedAmount', index: 'convertedAmount', width:100 , align:"right",sorttype:"float"},
			{name:'modifiedAmount', index: 'modifiedAmount', width:100 , align:"right",sorttype:"float"},
			{name:'merchant', index: 'merchant', width:100 },
			{name:'modifiedMerchant', index: 'modifiedMerchant', width:100 },
			{name:'bank', index: 'bank', width:100 },
			{name:'cardID', index: 'cardID', width:50 },
			{name:'cardNumber', index: 'cardNumber', width:100 },
			{name:'receiptFilename', index: 'receiptFilename', width:100 },
			{name:'receiptID', index: 'receiptID', width:60 },
			{name:'reportID', index: 'reportID', width:50 },
			{name:'externalID', index: 'externalID', width:100 },
			{name:'billable', index: 'billable', width:100 },
			{name:'reimbursable', index: 'reimbursable', width:100 },
			{name:'unverified', index: 'unverified', width:100 },
			{name:'category', index: 'category', width:100 },
			{name:'comment', index: 'comment', width:100 },
			{name:'details', index: 'details', width:100 },
			{name:'tag', index: 'tag', width:50 },
			{name:'mcc', index: 'mcc', width:100 },
			{name:'modifiedMCC', index: 'modifiedMCC', width:100 },
			{name:'transactionHash', index: 'transactionHash', width:100 },
			{name:'receiptObject', index: 'receiptObject', width:100 },
			{name:'autoCategory', index: 'autoCategory', width:100 },
			{name:'editable', index: 'editable', width:100 }
			],
			rowNum:100,
			rowList:[10,20,50,100],
			pager: '#pager',
			sortname: 'created',
			sortorder: 'desc',
			multiselect: false,
			viewrecords: true,
			caption: "Your Transactions",
			sortable: true,
			ajaxGridOptions: {cache: false}
	});
	jQuery("#list").jqGrid('navGrid','#pager',{edit:false,add:false,del:false});

	//Hides the irrelevant data of the table since a lot of entries are blank 
	jQuery("#list").jqGrid('hideCol',['bank', 'cardNumber', 'mcc', 'editable', 'autoCategory', 
		'modifiedMCC', 'receiptObject', 'transactionHash', 'modified', 'externalID', 'modifiedCreated',
		'details', 'comment', 'modifiedAmount', 'modifiedMerchant', 'convertedAmount', 'receiptFilename',
		'tag', 'receiptID', 'reportID']);
	
	//Hides UI divs
	$('#table').hide();
	$('#errorConsole').hide();
	$('#createError').hide();
	$('#loginForm').hide();
	$('#createForm').hide();
	$('#signOut').hide();
	
	//Button UI setup
	$('[name=Login]').button();
	$('[name=Create]').button();
	$("button:first").button();
	
	//Below is actions common in phase 2 and "from phase 1 to phase 2" transition
	
	//Sign out button action: Deletes login cookie and show relevant UI
	$("button:first").click(function() {
			//jQuery cookie is deleted
			$.cookie('the_cookie', null, { expires: 1, path: '/' });
			
			//Hides everything but Sign In form
			$('#errorConsole').slideUp();
			$('#signOut').slideUp();
			$('#loginForm').slideDown();
			jQuery("#list").jqGrid('clearGridData',false);
			$('#table').slideUp();
			$('#createForm').slideUp();
			
			return false;
			});
	
	//Create Transactions form action: Sends CreateTransaction query
	$('form[name=createForm]').submit(function() {
		
		//create error console is hidden
		$('#createError').slideUp();
		
		//Checks if amount is valid
		if(isNaN(parseInt($('[name=amount]').val()))) {
			$('#createError').html("<h2>Amount is invalid.</h2>").slideDown();
			return false;
		}
		
		//Sets up api url query
		var command = "command=CreateTransaction",
		authToken = "&authToken=" + $.cookie('the_cookie'),
		created = "&created=" + $("#datepicker").datepicker().val(),
		amount = "&amount=" + $('[name=amount]').val(),
		merchant = "&merchant=" + encodeURI($('[name=merchant]').val()),
		url = api + command + authToken + created 
			+ amount + merchant;
		
		//Slides up as a sign that it is attempting to create
		$('#createForm').slideUp();
		
		//Sends url to api.php to get JSON data
		$.getJSON( "./api.php", {url: url}, function(data){
			
			/*JSON data is first converted to a string.
			  JSON string is then parsed to seperate parameters and
			  converted to a JS object.*/
			var obj = jQuery.parseJSON(JSON.stringify( data, null, 2 ));
			if(obj.jsonCode == '200') {
				$('#createError').html("<h1>Success! Add another or reload to see updated "
					+"Transaction List.</h1>").slideDown();
				$('#createForm').slideDown();
			} else {
				$('#createError').html("<h2>Server error. Try Again!</h2>").slideDown();
			}
		});
		
		return false;
	});
	
	/*Sign in form action: Sends authenticate API query*/
	$('form[name=loginForm]').submit(function() {
		$('#errorConsole').slideUp();
		
		//API url set up
		var command = "command=Authenticate",
		partnerName = "&partnerName=applicant",
		partnerPassword = "&partnerPassword=d7c3119c6cdab02d68d9",
		userID = "&partnerUserID=" + $('[name=partnerUserID]').val(),
		userSecret = "&partnerUserSecret=" + $('[name=partnerUserSecret]').val(),
		url = api + command + partnerName + partnerPassword 
			+ userID + userSecret + "&useExpensifyLogin=true";
	
		//pass url to api.php to get authToken data
		$.getJSON( "./api.php", {url: url}, function(data){
			var obj = jQuery.parseJSON(JSON.stringify( data, null, 2 ));
			if(obj.jsonCode == '200') {
				$('#errorConsole').html("<h1>Loading...</h1>").slideDown();
				$('#signOut').slideDown();
				$('#loginForm').slideUp();
				
				//Set authToken cookie, expiring in a day
				$.cookie('the_cookie', obj.authToken, { expires: 1, path: '/' });
				
				
				//Set api url to download transaction list data using GET
				command = "command=Get";
				var authToken = "&authToken=" + obj.authToken,
				returnValueList = "&returnValueList=transactionList";
				url = api + command + authToken + returnValueList;
				
				//Prevent browsers to cache data in order to show updates.
				$.ajaxSetup({ cache: false });
				$.getJSON("./api.php", {url: url}, function(data){
					obj = jQuery.parseJSON(JSON.stringify( data, null, 2 ));
						if(obj.jsonCode == '200') {
							$('#table').slideDown();
							$('#createForm').slideDown();
							for(var i=0;i<=obj.transactionList.length;i++)
								jQuery("#list").jqGrid('addRowData',i+1,obj.transactionList[i]);
						
							jQuery("#list").setGridParam({ rowNum: 100 }).trigger("reloadGrid");
							$('#errorConsole').html("<h1>Welcome!</h1>");
						} else {
							//Error condition just in case GET isn't working
							$('#errorConsole').html("<h2>Download error. Refresh to try again!</h2>").slideDown();
						}	
				});
			
			} else {//Sign in errors
				$('#errorConsole').html("<h2>Invalid email/password. Try Again!</h2>").slideDown();
			}
		});
			return false;
	});
	
	/*Phase 1 starts here. Should not worry about create or sign out actions occurring.
		Their UI is hidden from the user.*/
	if($.cookie('the_cookie') == null) {
		$('#loginForm').slideDown();
	}
	//Phase 2 starts here. Login form stays hidden, and other UI appears.
	else {
	
		//Welcome status
		$('#errorConsole').html("<h1>Welcome back! Loading list...<h1>").slideDown(); 
		$('#signOut').slideDown();
		
		//Download transactions list. Exactly the same as above.
		var command = "command=Get",
		authToken = "&authToken=" + $.cookie('the_cookie'),
		returnValueList = "&returnValueList=transactionList",
		url = api + command + authToken + returnValueList;
		
		$.ajaxSetup({ cache: false });
		$.getJSON( "./api.php", {url: url}, function(data){
			var obj = jQuery.parseJSON(JSON.stringify( data, null, 2 ));
				if(obj.jsonCode == '200') {
					$('#table').slideDown();
					
					for(var i=0;i<=obj.transactionList.length;i++)
						jQuery("#list").jqGrid('addRowData',i+1,obj.transactionList[i]);					
					
					jQuery("#list").setGridParam({ rowNum: 100 }).trigger("reloadGrid");
					$('#errorConsole').html("<h1>Welcome back!<h1>");
				} else {
					//Error condition just in case GET isn't working
					$('#errorConsole').html("<h2>Download error. Refresh to try again!</h2>").slideDown();
				}	 
		});
		
		$('#table').slideDown();
		$('#createForm').slideDown();
	}
});