<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en" dir="ltr">  
  <head>
    <title>Expensify Transactions MiniApp</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    
	<link rel="icon"          type="image/x-icon" href="https://www.expensify.com/favicon.ico" />
    <link rel="shortcut icon" type="image/x-icon" href="https://www.expensify.com/favicon.ico" />
	
	<!-- Loaded jqGrid and jQueryUI template css files to its features working correctly -->
	<link rel="stylesheet" type="text/css" media="screen" href="css/mytweakedui/jquery-ui-1.8.21.custom.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="css/ui.jqgrid.css" />
	
	<!-- Loaded jQuery, jqGrid, jQueryUI -->
    <script src="js/jquery-1.7.2.min.js" type="text/javascript"></script>
	<script src="js/grid.locale-en.js" type="text/javascript"></script>
	<script src="js/jquery.jqGrid.min.js" type="text/javascript"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js" type="text/javascript"></script>
	
	<!-- Helpful jQuery plugins for stringify JSON and setting cookies-->
	<script type="text/javascript" src="js/json2.js"></script>
	<script type="text/javascript" src="js/jquery-cookie.js"></script>
	
	<!-- My main JS file -->
	<script type="text/javascript" src="js/transactions.js"></script>
	
	<img src="https://d2k5nsl2zxldvw.cloudfront.net/images/logo.png" width="500" height="100" />
  </head>
  
  <body>
  
	<!-- Displays Sign In status and errors -->
	<div id='errorConsole'></div>
	<div id='signOut'> <button>Sign out</button>  </div>
	
	<!-- Sign In form, should only show up when cookie is not set -->
	<div id="loginForm">
		<form method='post' action='./index.php' name='loginForm'>
		<h1>Username:</h1><br />
		<input type='text' name='partnerUserID'/> <br />
		<h1>Password:</h1><br />
		<input type='password' name='partnerUserSecret'/><br />
		<input type='submit' name='Login' value='Sign in'/>
		</form>
	</div>
  
	<!-- Transaction List table. Only shows up after authorized.
	 Uses jqGrid to sort the table -->
	<div id="table"> 
		<table id="list" border = "1"></table>
		<div id="pager"></div>
	</div>
  
	<!-- Create New Transaction form. Only shows up after authorized -->
	<div id="createForm">
		<h1>Add New Transaction</h1>
		<!-- Displays Create Transaction status and errors -->
		<div id='createError'></div>
		<form method='post' action='./index.php' name='createForm'>
		<h3>Date:</h3>
		<!-- Use datepicker jQueryUI plugin to make sure date is validated -->
		<div id="datepicker"></div>
		<h3>Amount (in pennies):</h3>
		<input type='text' name='amount'/><br />
		<h3>Merchant Name:</h3>
		<input type='text' name='merchant'/><br />
		<input type='submit' name='Create' value='Add'/>
		</form>
	</div>
	
	
  
  </body>
</html>