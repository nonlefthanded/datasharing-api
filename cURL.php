<?php
	
	// $login = 'egMGs5YkzMOsg0JAXgOQw';
	// $password = 'plfkTFmb4yGJJSpQl9fUJg';
	// $url = 'http://pps-sandbox.americas.nwea.pvt:8080';

	$login   = $_GET['username'];
	$pwd     = $_GET['pwd'];
	$url     = $_GET['url'];
	$section = $_GET['section'];
	$query   = $_GET['query'];

	$url     = $url . '/' . $section . '/' . $query;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
	curl_setopt($ch, CURLOPT_USERPWD, "$login:$pwd");
	$result = curl_exec($ch);
	curl_close($ch);  

	echo($result);
?>