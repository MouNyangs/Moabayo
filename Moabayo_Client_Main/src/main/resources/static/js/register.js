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

		document.getElementById("searchAddress").addEventListener("click", function () {
		  new daum.Postcode({
		    oncomplete: function (data) {
		      // 우편번호와 기본주소 자동 입력
		      document.getElementById("zipCode").value = data.zonecode;
		      document.getElementById("address").value = data.roadAddress || data.address;

		      // 커서를 상세주소 입력칸으로 자동 이동
		      document.getElementById("addressDetail").focus();
		    }
		  }).open();
		});



		document.getElementById("loginId").addEventListener("input", function () {
		  const loginId = this.value;
		  const msgSpan = document.getElementById("idCheckMsg");

		  if (loginId.length < 4) {
		    msgSpan.textContent = "4자 이상 입력하세요.";
		    msgSpan.style.color = "gray";
		    return;
		  }

		  $.ajax({
		    url: "/registration/checkId",
		    type: "GET",
		    data: { loginId: loginId },
		    success: function (res) {
		      if (res === "duplicate") {
		        msgSpan.textContent = "이미 사용 중인 아이디입니다.";
		        msgSpan.style.color = "red";
		      } else {
		        msgSpan.textContent = "사용 가능한 아이디입니다.";
		        msgSpan.style.color = "green";
		      }
		    },
		    error: function () {
		      msgSpan.textContent = "서버 오류 발생";
		      msgSpan.style.color = "orange";
		    }
		  });
		});