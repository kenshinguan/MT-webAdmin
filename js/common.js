/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-1 implementation in JavaScript                  (c) Chris Veness 2002-2014 / MIT Licence  */
/*                                                                                                */
/*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
/*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/* jshint node:true *//* global define, escape, unescape */
'use strict';


/**
 * SHA-1 hash function reference implementation.
 *
 * @namespace
 */
var Sha1 = {};


/**
 * Generates SHA-1 hash of string.
 *
 * @param   {string} msg - (Unicode) string to be hashed.
 * @returns {string} Hash of msg as hex character string.
 */
Sha1.hash = function(msg) {
    // convert string to UTF-8, as SHA only deals with byte-streams
    msg = msg.utf8Encode();

    // constants [§4.2.1]
    var K = [ 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6 ];

    // PREPROCESSING

    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
            (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

    // set initial hash value [§5.3.1]
    var H0 = 0x67452301;
    var H1 = 0xefcdab89;
    var H2 = 0x98badcfe;
    var H3 = 0x10325476;
    var H4 = 0xc3d2e1f0;

    // HASH COMPUTATION [§6.1.2]

    var W = new Array(80); var a, b, c, d, e;
    for (var i=0; i<N; i++) {

        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<80; t++) W[t] = Sha1.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);

        // 2 - initialise five working variables a, b, c, d, e with previous hash value
        a = H0; b = H1; c = H2; d = H3; e = H4;

        // 3 - main loop
        for (var t=0; t<80; t++) {
            var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
            var T = (Sha1.ROTL(a,5) + Sha1.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
            e = d;
            d = c;
            c = Sha1.ROTL(b, 30);
            b = a;
            a = T;
        }

        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H0 = (H0+a) & 0xffffffff;
        H1 = (H1+b) & 0xffffffff;
        H2 = (H2+c) & 0xffffffff;
        H3 = (H3+d) & 0xffffffff;
        H4 = (H4+e) & 0xffffffff;
    }

    return Sha1.toHexStr(H0) + Sha1.toHexStr(H1) + Sha1.toHexStr(H2) +
        Sha1.toHexStr(H3) + Sha1.toHexStr(H4);
};


/**
 * Function 'f' [§4.1.1].
 * @private
 */
Sha1.f = function(s, x, y, z)  {
    switch (s) {
        case 0: return (x & y) ^ (~x & z);           // Ch()
        case 1: return  x ^ y  ^  z;                 // Parity()
        case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
        case 3: return  x ^ y  ^  z;                 // Parity()
    }
};

/**
 * Rotates left (circular left shift) value x by n positions [§3.2.5].
 * @private
 */
Sha1.ROTL = function(x, n) {
    return (x<<n) | (x>>>(32-n));
};


/**
 * Hexadecimal representation of a number.
 * @private
 */
Sha1.toHexStr = function(n) {
    // note can't use toString(16) as it is implementation-dependant,
    // and in IE returns signed numbers when used on full words
    var s="", v;
    for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
    return s;
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


/** Extend String object with method to encode multi-byte string to utf8
 *  - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html */
if (typeof String.prototype.utf8Encode == 'undefined') {
    String.prototype.utf8Encode = function() {
        return unescape( encodeURIComponent( this ) );
    };
}

/** Extend String object with method to decode utf8 string to multi-byte */
if (typeof String.prototype.utf8Decode == 'undefined') {
    String.prototype.utf8Decode = function() {
        try {
            return decodeURIComponent( escape( this ) );
        } catch (e) {
            return this; // invalid UTF-8? return as-is
        }
    };
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

window.sha1 = Sha1.hash;

window.appId = 'A6916773725236';
window.key = '5E977177-C292-A40A-021D-6CFD129361F4';

window.now = Date.now();
window.appKey = sha1(appId + "UZ" + key + "UZ" + now) + "." + now;

window.service = 'https://d.apicloud.com/mcm/api/';

window.session = JSON.parse(localStorage.getItem('$session') || '{"sessionId":""}');
window.userInfo = JSON.parse(localStorage.getItem('$userInfo') || null);

window.operater = '';
if(window.userInfo) {
	operater = userInfo.id
}
$(function() {
		//$(".aside-nav a").click(function () {
		//    $(".aside-nav a.active").removeClass("active");
		//    $(this).addClass("active");
		//});
		//$(".aside-nav li").click(function () {
		//    $(".aside-nav li.active").removeClass("active");
		//    $(this).addClass("active");
		//});
		//全选
		$(".cardTable ").on("change", "#allCheck", function() {
			var isChecked = $(this).is(':checked');
			$(".cardTable input[name=check]").prop("checked", isChecked);
		});
		//判断是否全选
		//$(".cardTable ").on("change", "input[name=check]", function () {
		//    $(".cardTable input[name=check]").each(function () {
		//        if (!$(this).prop("checked")) {
		//            $(".cardTable #allCheck").prop("checked", false);
		//            return false;
		//        }
		//    })
		//});
	})
	/*验证手机号码*/
var checkPhone = function(phone) {
	phone = phone || '';
	var pattern = /^1[3|4|5|8][0-9]\d{8}$/;
	if(!pattern.test(phone)) return false;
	return true;
};
var checkEmail = function(email) {
		email = email || '';
		var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;;
		if(!pattern.test(email)) return false;
		return true;
	}
	//检查是否至少选择了一项
function isOneChecked(obj) {

	var checkboxInputs = $(obj + ':checked'),
		flag;

	if(checkboxInputs.length) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}
/*==========表格通用事件=========
//by Skipjack
//last Update 20160411 18:00
=============================*/
var tableHandler = (function($) {
	"use strict";
	var obj = {};

	// 表格中的全选按钮
	obj.checkAll = function(t, b) {
		var table = t || $('table'),
			btn = b || '.check-all';

		table.on('click', btn, function() {
			var $me = $(this),
				isMeChecked = $me.is(':checked');
			table.find('[type=checkbox]').prop('checked', isMeChecked);
		});
	};

	//检查是否至少选择了一项
	obj.isOneChecked = function(table) {
		var checkboxInputs = $(table + ' input:checked') || $('table input:checked'),
			flag;
		if(checkboxInputs.length) {
			flag = true;
		} else {
			flag = false;
		}
		return flag;
	};

	//顶部nav点击事件
	return obj;
}(jQuery));

/**
 * 时间处理，转换为具体格式的字符串等操作
 */
var timeHandler = (function() {
	/**
	 * time to string
	 * @param {object} [object] - 参数对象，可选，包含date(时间对象，默认为当前时间)、separator(分割符，默认为'-')、isSecondIn(是否包含秒，默认为false)
	 * @author Skipjack
	 */
	function timeToString(object) {
		object = object || {};
		date = object.date || new Date();
		separator = object.separator || '-';
		isSecondIn = object.isSecondIn || false;

		var year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hour = date.getHours(),
			minutes = date.getMinutes(),
			second = date.getSeconds();

		return year + separator + (month > 9 ? month : '0' + month) + separator + day + ' ' + (hour > 9 ? hour : '0' + hour) + ':' + (minutes > 9 ? minutes : '0' + minutes) + (isSecondIn ? ':' + (second > 9 ? second : '0' + second) : '');
	}

	return {
		timeToString: timeToString
	}
}());

//添加水印，兼容IE8
function placeholderfun() {

	if(!isPlaceholer()) {
		function GetStringNumValue(pxstr) {
			return pxstr.substring(0, pxstr.length - 2);
		}

		$('input[placeholder],textarea[placeholder]').each(function() {
			var $element = $(this),
				placeholder = $element.attr('placeholder');
			if($element.attr('type') != 'password') { //非密码  
				if($element.val() === "") {
					$element.val(placeholder).addClass('placeholder');
					$element.css('color', '#999');
				}
				$element.focus(function() {
					if($element.val() === placeholder) {
						$element.val("").removeClass('placeholder');
						$element.css('color', '#000');
					}
				}).blur(function() {
					if($element.val() === "") {
						//if($element.val()==="" &&  ($element.attr('type') != 'password')){    
						$element.val(placeholder).addClass('placeholder');
						$element.css('color', '#ccc');
					} else if($element.val() == placeholder) {
						$element.css('color', '#999');
					} else {
						$element.css('color', '#000');
					}
				}).closest('form').submit(function() {
					if($element.val() === placeholder) {
						$element.val('');
					}
				});
			} else { //密码框  
				if(placeholder) {
					// 文本框ID  
					var elementId = $element.attr('id');
					if(!elementId) {
						var now = new Date();
						elementId = 'lbl_placeholder' + now.getSeconds() + now.getMilliseconds();
						$element.attr('id', elementId);
					}
				} //end of if (placeholder)  
				// 添加label标签，用于显示placeholder的值  
				var $label = $('<label>', {
					html: $element.val() ? '' : placeholder,
					'for': elementId,
					css: {
						position: 'absolute',
						cursor: 'text',
						color: '#999',
						fontSize: $element.css('fontSize'),
						fontWeight: 'normal',
						zIndex: '99999',
						fontFamily: $element.css('fontFamily')
					}
				}).insertBefore($element);
				// 绑定事件  
				var _setPosition = function() {

					$label.css({
						marginTop: '10px',
						marginLeft: '10px'
					});
				};
				var _resetPlaceholder = function() {
					if($element.val()) {
						$label.html(null);
					} else {
						_setPosition();
						$label.html(placeholder);
					}
				};
				_setPosition();
				$element.on('focus blur input keyup propertychange resetplaceholder', _resetPlaceholder);
			}
		});
	}
}
//判断浏览器是否支持某属性
function isPlaceholer() {
	var input = document.createElement("input");
	return "placeholder" in input;
}
//调用

$(function() {
		placeholderfun();
	})
	//阻止事件冒泡
function stopPropagation(e) {
	if(e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	};
};
//页面分页
var _TOTAL = 14, //总页数
	_NUM = 1, //当前页数
	_PAGE_SIZE = 1; //页数大小
function pager(num, total) {
	var str = "";
	if(total <= 5) {
		str = "";
		for(var i = 0; i < total; i++) {
			str += '<li data-page="' + i + '"><a href="#">' + (i + 1) + '</a></li>';
		}

	} else {
		if(num <= 5) {
			str = "";
			for(var i = 0; i < 5; i++) {
				str += '<li data-page="' + i + '"><a href="#">' + (i + 1) + '</a></li> ';
			}
			str = '  <li class="previous " title="1"><a href="#">上一页</a></li>' + str + '<li><a href="javascri:void(0)">…</a></li> <li class="next"><a href="#">下一页</a></li>';

		} else {
			if(num >= (total - 4)) {
				str = "";
				for(var i = 5; i > 0; i--) {
					str += '<li data-page="' + (total + 1 - i) + '"><a href="#">' + (total + 1 - i) + '</a></li> ';
				}
				str = '  <li class="previous " title="1"><a href="#">上一页</a></li><li><a href="javascri:void(0)">…</a></li> ' + str + '<li class="next"><a href="#">下一页</a></li>';

			} else {
				str = "";
				for(var i = 5; i > 0; i--) {
					str += '<li data-page="' + (num + 3 - i) + '"><a href="#">' + (num + 3 - i) + '</a></li> ';
				}
				str = '  <li class="previous " title="1"><a href="#">上一页</a></li><li><a href="javascri:void(0)">…</a></li> ' + str + '<li><a href="javascri:void(0)">…</a></li><li class="next"><a href="#">下一页</a></li>';

			}
		}

	}
	$(".pager").html(str);
	$(".pager li[data-page='" + num + "']").addClass("active").siblings("li").removeClass("active");

	// $(".pager li").eq(num).addClass("active").siblings("li").removeClass("active");

	//如果是第一页
	if(num == 1) {
		$(".pager .previous").addClass("disabled");
	}
	//如果是最后一页
	if(num >= total) {
		$(".pager .next").addClass("disabled");

	}
}
function setpagesize(size) {
	_PAGE_SIZE = size;
}
$(function() {
		_NUM = $(".pager li.active a").text();
		//页数
		$(".pager").on("click", "li", function() {
			//上一页
			if($(this).hasClass("previous") && !$(this).hasClass("disabled") && _NUM > 0) {
				_NUM--;
				pager(_NUM, _TOTAL);
				// var aa = Number($("#page").val());
				// $("#page").val(aa - 1);
				// getdata(aa - 1);
				getdata(_NUM);

				//$("#selectCondition").submit();
			}
			//下一页
			else if($(this).hasClass("next") && !$(this).hasClass("disabled") && _NUM <= _TOTAL) {
				_NUM++;
				pager(_NUM, _TOTAL);
				// var aa = Number($("#page").val());
				// $("#page").val(aa + 1);
				// getdata(aa + 1);

				getdata(_NUM);

				// $("#selectCondition").submit();
			} else {
				var thisnum = parseInt($(this).attr("data-page"));
				if(thisnum) {
					_NUM = thisnum;
					pager(_NUM, _TOTAL);
					$("#page").val(thisnum);
					getdata(_NUM);
					//  $("#selectCondition").submit();
				} else {
					_NUM = thisnum;
					pager(_NUM, _TOTAL);
					$("#page").val(thisnum);
					getdata(thisnum);
				}
			}
		});
		//跳转页数
		$("#gotopage").on("click", function() {
			gotopage();
		});

	})
	//选择行数
function changeCondition() {
	$("#page").val("1");
	$("#selectCondition").submit();
}
//Enter键跳转页面
$(document).keydown(function(event) {
	getKey(event);
});

function getKey(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode == 13) { //

		if($("#numtxt").is(":focus")) {

			gotopage();
		} else if($("#selectconditionname").is(":focus")) {
			$("#page").val("1");
			$("#selectCondition").submit();
		} else {
			//do nothing
		}

	}
}

function gotopage() {
	var thisnum = $.trim($("#numtxt").val());
	var txt = /^[0-9]*[1-9][0-9]*$/;
	if(txt.test(thisnum) && parseInt(thisnum) <= _TOTAL) {
		_NUM = thisnum;
		pager(_NUM, _TOTAL);
		$("#page").val(thisnum);
		getdata(thisnum);
	} else {
		var msg = $.zui.messager.show('请输入不大于' + _TOTAL + '正整数', {
			placement: 'top',
			time: '1000'
		});
		$("#numtxt").val("");
	}
}

//时间控件，需要引用datetimepicker.js
//选择年
$.fn.selectYear = function(options) {
	var opt = {
		format: 'yyyy'
	}
	$.extend(opt, options);
	if(this.is('input[type=text]')) {
		this.datetimepicker({
			format: opt.format,
			weekStart: 1,
			autoclose: true,
			startView: 4,
			minView: 4,
			forceParse: false, //必须设置，否则每次解析错，会变成1899年。
			language: 'zh-CN'
		});
	}
	return this;
};
//选择月
$.fn.selectMonth = function(options) {
	var opt = {
		format: 'yyyy-mm'
	}
	$.extend(opt, options);
	if(this.is('input[type=text]')) {
		this.datetimepicker({
			format: opt.format,
			weekStart: 1,
			autoclose: true,
			startView: 3,
			minView: 4,
			forceParse: false, //必须设置，否则每次解析错，会变成1899年。
			language: 'zh-CN'
		});
	}
	return this;
};
//选择天
$.fn.selecDay = function(options) {
	var opt = {
		format: 'yyyy-mm-dd'
	}
	$.extend(opt, options);
	if(this.is('input[type=text]')) {
		this.datetimepicker({
			format: opt.format,
			weekStart: 1,
			autoclose: true,
			startView: 2,
			minView: 2,
			forceParse: false, //必须设置，否则每次解析错，会变成1899年。
			language: 'zh-CN'
		});
	}
	return this;
};
//选择时间
$.fn.selecTime = function(options) {
	var opt = {
		format: 'yyyy-mm-dd hh:ii'
	}
	$.extend(opt, options);
	if(this.is('input[type=text]')) {
		this.datetimepicker({
			format: opt.format,
			weekStart: 1,
			autoclose: true,
			startView: 2,
			minView: 1,
			forceParse: false, //必须设置，否则每次解析错，会变成1899年。
			language: 'zh-CN'
		});
	}
	return this;
};
//选择时间
$.fn.selectime = function(options) {
	var opt = {
		format: 'hh:ii'
	}
	$.extend(opt, options);
	if(this.is('input[type=text]')) {
		this.datetimepicker({
	        language:  "zh-CN",
	        weekStart: 1,
	        todayBtn:  1,
	        autoclose: 1,
	        todayHighlight: 1,
	        startView: 1,
	        minView: 0,
	        maxView: 1,
	        forceParse: 0,
	        format: opt.format
		});
	}
	return this;
};

function ultZeroize(v, l) {
	var z = "";
	l = l || 2;
	v = String(v);
	for(var i = 0; i < l - v.length; i++) {
		z += "0";
	}
	return z + v;
};
/*选择抄送人*/
//选择抄送人
$(function() {
	$(".chaosongren-select").on("click", "input[type=checkbox]", function() {
		$me = $(this);
		if($me.is(":checked")) {
			var str = '<p data-id="' + $me.attr("id") + '">' + $me.parents("label").text() + '</p>';
			$(".chaosongren-result").append(str);
		} else {
			$(".chaosongren-result p[data-id=" + $me.attr("id") + "]").remove();
		}
	});
	$("#isaddCopyUser").change(function() {
		if($(this).is(":checked")) {
			$("#addCopyUser.hidden").removeClass("hidden");
			$(".copyUserlist.hidden").removeClass("hidden")
		} else {
			$("#addCopyUser").addClass("hidden");
			$(".copyUserlist").addClass("hidden");
		}
	})
	$("#addCopyUser").on("click", function() {
		showCopyUser();
	});

});

//初始化弹出框
function showCopyUser() {
	$("#chaosongren").find("input[type=checkbox]").prop("checked", false);
	$("#chaosongren .chaosongren-result").html("");
	//添加之前添加过的。
	var str = '';
	$(".copyUserlist span.active").each(function() {
		var $me = $(this);
		$(".chaosongren-select input[type=checkbox][id=" + $me.attr("data-id") + "]").prop("checked", true);
		str += '<p data-id="' + $me.attr("data-id") + '">' + $me.text() + '</p>';
	});
	$("#chaosongren .chaosongren-result").html(str);
	$("#chaosongren").modal("show");
}

function saveCopyUser() {
	var str = "";
	$(".copyUserlist span.active").remove();
	$(".chaosongren-select input[type=checkbox]:checked").each(function() {

		console.log($(this).attr("id"));
		str += '<span class="active" data-id=' + $(this).attr("id") + '>' + $(this).parents("label").text() + '<a href="javascript:void(0)" onclick="delCopyUser(this)">×</a></span>';
	});
	$(".copyUserlist").append(str);
	$("#chaosongren").modal("hide");
}

function delCopyUser(obj) {
	$(obj).parent("span").remove();
}
//判断是否是整数或两位小数

//判断是不是正数
function Ontst(obj) {

	// var Tst = /^[+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
	//  var Tst = /^([+-]?)\d*\.\d+$/;
	//var Tst = /^(?!^0\d+|.*0$)^[0-9]{1,16}(\.[0-9]{1,2})?$|^0$/;
	var Tst = /^[+]?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
	var Txt = $.trim($(obj).val());
	if(Txt) {
		if(Tst.test(Txt) == false) {
			$(obj).val("0");
			alert("请输入正数");

		}
	} else {
		$(obj).val("0");
	}
}

function isInt(obj) {
	var Tst = /^([+]?)(\d+)$/;
	var Txt = $.trim($(obj).val());
	if(Txt) {
		if(Tst.test(Txt) == false) {
			$(obj).val("0");
			alert("请输入整数");

		}
	} else {
		$(obj).val("0");
	}
}

/**
 * 搜索关键字
 */
function searchkey() {
	var word = '';
	$('#searchKey').click(function(e) {
		e.stopPropagation();
		word = this.value;
		if(word.length > 0) {
			$('#searchlist').removeClass('hidden');
		}
	});

	$('#searchKey').on('keyup', function() {
		word = this.value;
		$('#searchlist').addClass('hidden');

		if(word.length > 0) {
			$('#searchlist').removeClass('hidden');
			$('#searchlist .list-group a span').each(function(i, spantxt) {
				spantxt.innerText = word;
			})
		} else {
			$('#searchlist').addClass('hidden');
		}

	});

	$(window).on('click', function(event) {
		$('#searchlist').addClass('hidden'); // 如不是则隐藏元素   
	});
	$('.input-remove .icon-remove-circle').click(function() {
		$('#searchKey').val('');
		$('#searchlist .list-group-item span').text('');
		$('#searchKey').focus();
	});
	$('#searchlist .list-group a').click(function() {
		$('#searchlist .list-group a.active').removeClass('active');
		$(this).addClass('active');

	});
}
