<?php

//Script: api.php sends query Expensify Web Services API data and prints out result in JSON format.
//		  Uses curl to read the JSON result.
//
//Get paramaters:
//  url - Expensify API url. 
//  Ex. https://api.expensify.com?command=Authenticate&partnerName=XXXX&partnerPassword=XXXX&partnerUserID=XXXX&partnerUserSecret=XXXX
//

//Will only start if url is passed.
if(isset($_GET['url'])) {

	//Initialize curl with the url and its paramters
	$ch = curl_init($_GET['url']);
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
	curl_setopt( $ch, CURLOPT_HEADER, true );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	
	/*To bypass checking for ssl certificate to connect to Expensify,
	/*set options to not check for a certificate.*/
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	
	//Splits the unnecessary data to header and the JSON data we want to contents
	list( $header, $contents ) = preg_split( '/([\r\n][\r\n])\\1/', curl_exec( $ch ), 2 );
	curl_close( $ch );
	
	print $contents;
}
?>