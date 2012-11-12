# Expensify Trans Mini App: Create and download your Expensify transaction list. #

Version: 1.5, Updated: 6/28/2012

Expensify Trans Mini App allows users to access their transactions on the web.

## Main files ##
index.php - Layout how the application UI is displayed.
js/transactions.js - Sends the user input to api.php and changes the UI accordingly.
api.php - Sends Expensify Web Services API query to servers. Uses cURL.

## Examples ##
expensifytest@mailinator.com account can be used to test each feature.

## To-do List ##
-Other accounts can be used
-Secure sign in (using Expensify SSO?)
-Optimize loading transaction table
-Change Billable, Reimbursable, and Verified outputs. 
-Show new columns if necessary. Test account had a lot of blank data!
-Ensure browser compatability

## Release History ##

1.5 - (6/28/2012) Fixed cookies not deleting correct. Close an h1 tag. Made sure table isn't cached.
	Should work in IE now.
1.0 - (6/28/2012) Initial release. Only works with expensifytest@mailinator.com account so far.

