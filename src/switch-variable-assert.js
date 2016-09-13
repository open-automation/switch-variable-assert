// Wish list
/*
	Numeric
	Length equal to
	Length greater than
	Length less than
  */

function jobArrived( s : Switch, job : Job )
{
	var outcome = s.getPropertyValue("Outcome");

	var handleAssert =  function(index, failures){
		var tag = s.getPropertyValue( "Tag" + index );
		var variable = s.getPropertyValue( "Variable" + index );
		var assertAcceptableValues = s.getPropertyValueList( "AssertAcceptableValues" + index );
		var assertNotBlank = s.getPropertyValue( "AssertNotBlank" + index );

		// Assert not blank
		var assertNotBlankFunction = function(variable, failures)
		{
			if(variable == ""){
				failures.push(
					{
						tag: tag,
						variable: variable,
						message: "Blank value found for tag '" + tag + "'.",
						outcome: outcome
					}
				);
				return false;
			}
			return true;
		}

		// Assert acceptable values
		var assertAcceptableValuesFunction = function(variable, failures, assertAcceptableValues)
		{

			var isFound = false;
			var acceptableString = '';

			for (i = 0; i < assertAcceptableValues.length; i += 1) {

				acceptableString += "'" + assertAcceptableValues[i] + "'";
				if(i !== assertAcceptableValues.length-1){
					acceptableString += ', ';
				}

				if(assertAcceptableValues[i] == variable){
					isFound = true;
				}
	        }

			if(isFound && variable !== ""){
				return true;
			} else {
				failures.push(
					{
						tag: tag,
						variable: variable,
						message: "Unacceptable value '" + variable + "' found for tag '" + tag + "'. Acceptable values are: " + acceptableString + ".",
						outcome: outcome
					}
				);
				return false;
			}

		}

		// Main
		if(tag){

			// Test if empty
			if(assertNotBlank == "Yes"){
				assertNotBlankFunction(variable, failures);
			}

			// Test is values are correct
			if(assertAcceptableValues.length > 0 && assertAcceptableValues[0] !== ""){
				assertAcceptableValuesFunction(variable, failures, assertAcceptableValues);
			}

		}
		return failures;
	}

	var sendJob = function( failures ){
		var logLevel = -1;
		var dataLevel = 1;

		if(failures.length > 0){

			failure = failures[0];

			// Debuging, warning, and failing
			if(outcome == "Warn"){
				logLevel = 2;
				dataLevel = 2;
			}
			if(outcome == "Error"){
				logLevel = 3;
				dataLevel = 3;
			}

			// Warn
			s.log(logLevel, failures.length + ' failures found.');

			// Log each failed assert
			for (i = 0; i < failures.length; i += 1) {
				s.log(logLevel, failures[i].message);
	       }

		}

		// Send out
		job.sendToData(dataLevel, job.getPath() );
	}

	// Do it
	var failures = [];

	failures = handleAssert(1, failures);
	failures = handleAssert(2, failures);
	failures = handleAssert(3, failures);

	sendJob(failures);
}
