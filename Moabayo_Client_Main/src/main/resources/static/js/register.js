document
	.getElementById("searchAddress")
	.addEventListener(
		"click",
		function() {
			new daum.Postcode(
				{
					oncomplete: function(data) {
						var fullAddr = data.address;
						document.getElementById("address").value = fullAddr;
					}
				}).open();
		});