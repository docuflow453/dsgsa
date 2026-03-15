// IB common functions
function GetAlert(type, bold, text) {
	var id = "alert"+Math.floor(Math.random() * 9999);;
	var types = ["warning","danger","info","success"];
	if (types.indexOf(type) == -1) {
		type = "info"
	}
	var str = '<div class="alert alert-'+type+'" id="'+id+'"><span class="alertClose" onclick="CloseAlert(\''+id+'\');">&times;</span><strong>'+bold+'</strong> '+text+'</div>';
	return str;
}
function CloseAlert(id) {
	console.log(id);
	$('#'+id).fadeOut('slow', function() {
		$('#'+id).remove();
	});
}
function isValidEmail(email) {
	var emailRegExp = /^\w(?:\w|-|'|\.(?!\.|@))*@\w(?:\w|-|\.(?!\.))*\.\w{2,10}/
	var result = email.match(emailRegExp);
	if ((result && result[0].length != email.length) || !result) {
		return false;
	} else {
		return true;
	}
}