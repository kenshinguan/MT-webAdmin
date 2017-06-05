$(function () {
   
    $(".checkBoxbar label").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
        else {
            $(this).addClass("active");
        }
    });
    $("form input[type=text]").each(function () {
        $(this).focus(function () {
            $(this).parents("tr").find(".tip").attr("class","tip");
            
        });
        $(this).blur(function () {
            //$(this).next("img").hide();
            //校验是否为空
            if ($(this).hasClass("txt") && !$(this).hasClass("time")) {
                if ($(this).val() == "") {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    return false;
                }
                else {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
                }
            }
            //校验手机号
            if ($(this).hasClass("tel") && $(this).val() != "") {
                if ($(this).isMobile($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    return false;
                }
            }
            //校验固定电话或手机号
            if ($(this).hasClass("phone") && $(this).val() != "") {
            	if ($(this).isTel($(this).val()) || $(this).isMobile($(this).val())) {
            		$(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
            		
            	}
            	else {
            		$(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
            		return false;
            	}
            }
            //校验身份证号码
            if ($(this).hasClass("IdCardNo") && $(this).val() != "") {
                if ($(this).isIdCardNo($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    return false;
                }
            }
            //校验护照号码

            /*if ($(this).hasClass("Passport") && $(this).val() != "") {
                if ($(this).isPassport($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    return false;
                }
            }*/
            //校验邮箱
            if ($(this).hasClass("email") && $(this).val() != "") {
                if ($(this).isEmail($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    return false;
                }
            }
            //校验护照或身份证
           /* if ($(this).hasClass("IdNo") && $(this).val() != "") {
                if ($(this).isIdCardNo($(this).val()) || $(this).isPassport($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");

                    return false;
                }
            }*/

        });

        $(this).change(function () {
            if ($(this).hasClass("time")) {
                if ($(this).hasClass("txt") && $(this).val() == "") {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    return false;
                }else {
                	if($(this).hasClass("judgeTime") ){
                		var workTime = $("#workTime").val();
                    	var entryTime = $("#entryTime").val();
                    	var contractStart = $("#contractStart").val();
                    	if(workTime != ""){
                    		if(entryTime < workTime){
                    			$("#entryTime").parents("tr").find(".tip").addClass("error").removeClass("ok");
                    		}else{
                    			if(contractStart < entryTime){
                        			$("#contractStart").parents("tr").find(".tip").addClass("error").removeClass("ok");
                        		}else{
                        			$("#entryTime").parents("tr").find(".tip").addClass("ok").removeClass("error");
                        			$("#contractStart").parents("tr").find(".tip").addClass("ok").removeClass("error");
                        		}
                    		}
                    	}else{
                			if(contractStart < entryTime){
                    			$("#contractStart").parents("tr").find(".tip").addClass("error").removeClass("ok");
                    		}else{
                    			$("#entryTime").parents("tr").find(".tip").addClass("ok").removeClass("error");
                    			$("#contractStart").parents("tr").find(".tip").addClass("ok").removeClass("error");
                    		}
                		}
                    }else if($(this).hasClass("judgeTime2")){
                    	var entrySchooltime = $("#entrySchooltime").val();
                    	var graduateTime = $("#graduateTime").val();
                		if(graduateTime < entrySchooltime){
                			$("#graduateTime").parents("tr").find(".tip").addClass("error").removeClass("ok");
                		}else{
                			$("#entrySchooltime").parents("tr").find(".tip").addClass("ok").removeClass("error");
                			$("#graduateTime").parents("tr").find(".tip").addClass("ok").removeClass("error");
                		}
                    }else{
                    	$(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
                    }
                }
            }
        });

    });
    //提交的时候校验
    $("form input#submitBtn").click(function () {
        var flag = true;
        //校验是否为空
        $("form .txt").each(function () {
            if ($(this).val() == "") {
                $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                flag = false;
            }
            else {
                $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
            }

        });
        //校验手机号
        $("form input[type=text].tel").each(function () {
            if ($(this).val() != "") {
                if ($(this).isMobile($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });
        //校验固定电话或手机号
        $("form input[type=text].phone").each(function () {
        	if ($(this).val() != "") {
        		if ($(this).isTel($(this).val()) || $(this).isMobile($(this).val())) {
        			$(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
        			
        		}
        		else {
        			$(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
        			flag = false;
        		}
        	}
        });
        //校验身份证号码
        $("form input[type=text].IdCardNo").each(function () {
            if ($(this).val() != "") {
                if ($(this).isIdCardNo($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });
        //校验护照号码
        /*$("form input[type=text].Passport").each(function () {
            if ($(this).val() != "") {
                if ($(this).isPassport($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });*/
        //校验邮箱
        $("form input[type=text].email").each(function () {
            if ($(this).val() != "") {
                if ($(this).isEmail($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });
        //校验护照或身份证
        /*$("form input[type=text].IdNo").each(function () {
            if ($(this).val() != "") {
                if ($(this).isIdCardNo($(this).val()) || $(this).isPassport($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });*/
        //护照和身份证必须输入一个
        var IdCardNo = $("form input[type=text].IdCardNo").val();
        var Passport = $("form input[type=text].Passport").val();
        if (IdCardNo == "" && Passport == "") {
            //   $("form input[type=text].IdCardNo").focus();
        	$("form input[type=text].IdCardNo").parents("tr").find(".tip").addClass("error").removeClass("ok");
        	$("form input[type=text].Passport").parents("tr").find(".tip").addClass("error").removeClass("ok");
            $("form .idtip").show();
            flag = false;
        }
        else {
        	$("form input[type=text].IdCardNo").parents("tr").find(".tip").addClass("ok").removeClass("error");
        	$("form input[type=text].Passport").parents("tr").find(".tip").addClass("ok").removeClass("error");
            $("form .idtip").hide();
        }

        if (flag == true) {
            $("#subType").val("1");
            $("#registerForm").submit();
        }else{
        	$("#submitPromote").html("信息有误，请核对再提交！");
        }
    });

    //保存的时候校验
    $("#savedraft").click(function () {
        var flag = true;
        //校验是否为空
        $("form .txt").each(function () {
            if ($(this).val() == "") {
                $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                flag = false;
            }
            else {
                $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
            }

        });
      //校验手机号
        $("form input[type=text].tel").each(function () {
            if ($(this).val() != "") {
                if ($(this).isMobile($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });
        //校验固定电话或手机号
        $("form input[type=text].phone").each(function () {
        	if ($(this).val() != "") {
        		if ($(this).isTel($(this).val()) || $(this).isMobile($(this).val())) {
        			$(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
        			
        		}
        		else {
        			$(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
        			flag = false;
        		}
        	}
        });
        //校验身份证号码
        $("form input[type=text].IdCardNo").each(function () {
            if ($(this).val() != "") {
                if ($(this).isIdCardNo($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });
        //校验护照号码
        /*$("form input[type=text].Passport").each(function () {
            if ($(this).val() != "") {
                if ($(this).isPassport($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });*/
        //校验邮箱
        $("form input[type=text].email").each(function () {
            if ($(this).val() != "") {
                if ($(this).isEmail($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");

                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });
        //校验护照或身份证
        /*$("form input[type=text].IdNo").each(function () {
            if ($(this).val() != "") {
                if ($(this).isIdCardNo($(this).val()) || $(this).isPassport($(this).val())) {
                    $(this).parents("tr").find(".tip").addClass("ok").removeClass("error");
                }
                else {
                    $(this).parents("tr").find(".tip").addClass("error").removeClass("ok");
                    flag = false;
                }
            }
        });*/
        //护照和身份证必须输入一个
        var IdCardNo = $("form input[type=text].IdCardNo").val();
        var Passport = $("form input[type=text].Passport").val();
        if (IdCardNo == "" && Passport == "") {
            //$("form input[type=text].IdCardNo").focus();
        	$("form input[type=text].IdCardNo").parents("tr").find(".tip").addClass("error").removeClass("ok");
        	$("form input[type=text].Passport").parents("tr").find(".tip").addClass("error").removeClass("ok");
            $("form .idtip").show();
            flag = false;
        }
        else {
        	$("form input[type=text].IdCardNo").parents("tr").find(".tip").addClass("ok").removeClass("error");
        	$("form input[type=text].Passport").parents("tr").find(".tip").addClass("ok").removeClass("error");
            $("form .idtip").hide();
        }

        if (flag == true) {
            $("#subType").val("0");
            $("#registerForm").submit();
        }else{
        	$("#submitPromote").html("信息有误，请核对再提交！");
        }
    });

    $("#register").click(function () {
        $(".bg").css({ "display": "block" });
        $(".registertypeWindows").css({ "display": "block" });
    });

    $(".sureregisterButton").click(function () {
        if ($("#registertype").val() == "1") {
            $("#registerEmployeeform").submit();
        } else {
            $("#registerStudentform").submit();
        }
        $(".bg").css({ "display": "none" });
        $(".registertypeWindows").css({ "display": "none" });
    });

    $(".cancelregisterButton").click(function () {
        $(".bg").css({ "display": "none" });
        $(".registertypeWindows").css({ "display": "none" });
    });
    
    
    
    
    //单元、部门联动
    $("#dept").change(function () {
        //清空城市下拉框中的内容，除提示信息外
        $("#unit option").remove();
        var $option = $("<option value=\"\"></option>");
        $("#unit").append($option);
        //获取选中的省份
        var dept = $(this).val();
        var url = "getUnits?time=" + new Date().getTime();
        var sendData = { "dept": dept };
        $.post(url, sendData, function (data) {
            //解析字符串
            var jsonString = eval(data);
            var size = jsonString.units.length;
            for (var i = 0; i < size; i++) {
                //获取每一个城市
                var deptName = jsonString.units[i].deptName;
                var deptId = jsonString.units[i].deptId;
                var $option = $("<option value=" + deptId + ">" + deptName + "</option>");
                $("#unit").append($option);
            };
        });
    });

    //省市二级联动菜单
    //省份-城市
    $("#domicile").change(function () {
        //清空城市下拉框中的内容，除提示信息外
        $("#domicilecity option").remove();
        //获取选中的省份
        var domicile = $(this).val();
        var url = "getCities?time=" + new Date().getTime();
        var sendData = { "province": domicile };
        $.post(url, sendData, function (data) {
            //解析字符串
            var jsonString = eval(data);
            var size = jsonString.cities.length;
            for (var i = 0; i < size; i++) {
                //获取每一个城市
                var city = jsonString.cities[i].regionName;
                var cityid = jsonString.cities[i].regionId;
                var $option = $("<option value=" + cityid + ">" + city + "</option>");
                $("#domicilecity").append($option);
            };
        });
    });

    $("#nativeplace").change(function () {
        //清空城市下拉框中的内容，除提示信息外
        $("#nativeplacecity option").remove();
        //获取选中的省份
        var nativeplace = $(this).val();
        var url = "getCities?time=" + new Date().getTime();
        var sendData = { "province": nativeplace };
        $.post(url, sendData, function (data) {
            //解析字符串
            var jsonString = eval(data);
            var size = jsonString.cities.length;
            for (var i = 0; i < size; i++) {
                //获取每一个城市
                var city = jsonString.cities[i].regionName;
                var cityid = jsonString.cities[i].regionId;
                var $option = $("<option value=" + cityid + ">" + city + "</option>");
                $("#nativeplacecity").append($option);
            };
        });
    });

    $("#check1").change(function () {
        if ($("#check1").is(':checked')) {
            $("#oversea").val("Y");
        } else {
            $("#oversea").val("N");
        }
    });
    $("#check2").change(function () {
        if ($("#check2").is(':checked')) {
            $("#isDisaster").val("Y");
        } else {
            $("#isDisaster").val("N");
        }
    });
    $("#check3").change(function () {
        if ($("#check3").is(':checked')) {
            $("#isDisable").val("Y");
        } else {
            $("#isDisable").val("N");
        }
    });
    $("#check4").change(function () {
        if ($("#check4").is(':checked')) {
            $("#isInfect").val("Y");
        } else {
            $("#isInfect").val("N");
        }
    });


    $("#registerSearch").click(function () {
       
        var search = $("#searchInput").val();
        var url = "getRegisterInfo?time=" + new Date().getTime();
        var sendData = { "search": search };
        if (search != "") {
            $.post(url, sendData, function (data) {
                //解析字符串
                var jsonString = eval(data);
                var msg = jsonString.msg;
                $(".tag").html(msg);
                $(".tag").removeClass("hide");
            });
        }
    });
    //清空按钮
    $(".create img").click(function () {
         $(this).prev("input[type=text]").val("");
        $(this).prev("input[type=text]").focus();
        $(this).parents("tr").find(".tip").removeClass("ok");
    });
});
$.fn.isTel = function (s) {
    var pattern = /\d{3,4}-\d{7,8}/;
    if (!pattern.exec(s)){
    	return false;
    }else{
    	var flag = false;
    	$.ajax({
    		type : "post",
    		url : "checkPhone?time=" + new Date().getTime(),
    		data: { "phone": s },
    		dataType : "json",
    		async : false,
    		success: function(data){
    			var json = eval(data);
                var msg = json.msg;
                if(msg == "suc"){
                	flag = true;
                }else{
                	flag = false;
                }
    		}
    	});
    	return flag;
    }
    
};

$.fn.isMobile = function (s) {
    var pattern = /^1[3|4|5|8][0-9]\d{8}$/;
    if (!pattern.exec(s)){
    	return false;
    }else{
    	var flag = false;
    	$.ajax({
    		type : "post",
    		url : "checkPhone?time=" + new Date().getTime(),
    		data: { "phone": s },
    		dataType : "json",
    		async : false,
    		success: function(data){
    			var json = eval(data);
                var msg = json.msg;
                if(msg == "suc"){
                	flag = true;
                }else{
                	flag = false;
                }
    		}
    	});
    	return flag;
    }
};
// 身份证号码验证 
$.fn.isIdCardNo = function (s) {
    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/;//15位身份证
    var pattern = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/;//18位身份证
    //var check = /^\d{15}$/;//15位身份证
    //var pattern = /^\d{17}(\d|X|x)$/;//18位身份证
    if (s.length == 18) {
        if (!pattern.exec(s)) return false;
    }
    else if (s.length == 15) {
        if (!check.exec(s)) return false;
    }
    else {
        return false;
    }
    var flag = false;
	$.ajax({
		type : "post",
		url : "checkCard?time=" + new Date().getTime(),
		data: { "card": s },
		dataType : "json",
		async : false,
		success: function(data){
			var json = eval(data);
            var msg = json.msg;
            if(msg == "suc"){
            	flag = true;
            }else{
            	flag = false;
            }
		}
	});
	return flag;
};
//护照编号验证
$.fn.isPassport = function (s) {
    var pattern = /(P\d{7})|(G\d{8})/;
    if (!pattern.exec(s)){
    	return false;
    }else{
    	var flag = false;
    	$.ajax({
    		type : "post",
    		url : "checkPassport?time=" + new Date().getTime(),
    		data: { "passport": s },
    		dataType : "json",
    		async : false,
    		success: function(data){
    			var json = eval(data);
                var msg = json.msg;
                if(msg == "suc"){
                	flag = true;
                }else{
                	flag = false;
                }
    		}
    	});
    	return flag;
    }
};
//邮箱验证
$.fn.isEmail = function (s) {
    var pattern = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/;
    if (!pattern.exec(s)) return false;
    return true;
};