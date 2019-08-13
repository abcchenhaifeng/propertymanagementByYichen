/**
 * @date: 2019年8月11日 上午10:44:09
 * @author: YiChen(李冠永)
 * @Description: 系统操作员前端控制JS
 */

let userid = null;
let startAge = null;
let endAge = null;
let username = null;
let sex = null;
let mobible = null;
let status = null;

let selectRow_id = null;

$(function() {
	setMessage("用户列表", 5000);

	// 显示列表
	$.jgrid.defaults.styleUI = 'Bootstrap';
	$("table#userinfoGrid").jqGrid({
		url: rootAddress+'user/list',
		datatype: "json",
		colModel: [
			{ label: '账号', name: 'id' },
			{ label: '姓名', name: 'username' },
			{ label: '性别', name: 'sex' },
			{ label: '年龄', name: 'age', sorttype: 'integer'},
			{ label: '手机号码', name: 'mobible' },
			{ label: '状态', name: 'status' }
		],
		viewrecords: true, 
		autowidth: true,
		height: 365,
		rowNum: 10,
		rowList:[10,20,30],
		loadonce: true,
		jsonReader : { 
		      root: "list", 
		      page: "page", 
		      total: "pageCount", 
		      records: "count", 
		      repeatitems: true, 
		      id: "id"
		},
		pager: "#userinfoGridPager",
		multiselect:false,
		onSelectRow:function(id){
			selectRow_id = id;
		}
	});
	
	// 点击检索事件处理
	$("a#SearchButton").on("click", function() {
		
		userid = $("input#userid").val();
		username = $("input#username").val();
		sex = $("select#sex").val();
		mobible = $("input#tel").val();
		status = $("select#status").val();
		startAge = $("input#startAge").val();
		endAge = $("input#endAge").val();
		
		userid = (userid == "" ? userid : null);
		username = (username == "" ? username : null);
		sex = (sex == "" ? sex : null);
		mobible = (mobible == "" ? mobible : null);
		status = (status == "" ? status : null);
		startAge = (startAge == "" ? startAge : null);
		endAge = (endAge == "" ? endAge : null);
		
		reloadList();
	});
	
	// 激活、冻结、详情
	$(".list-box a.list-link").on("click", function(e) {
		
		var url = $(this).attr("href");
		// 激活、冻结
		if(/user\/(active)|(frozen)$/.test(url)) {
			$.post(rootAddress+url,{id:selectRow_id},function(result){
            	if(result.status=="OK"){
					reloadList(); 
				}
				setMessage(result.message, 5000);
            });
            
        //  详情
		} else {
			$("section#main #dialog").load(url, () => {
				
				dialogArea = $("section#main #dialog");
				dialogArea.dialog({
					title: $(this).attr("title"),
					width: "80%",
					maxWidth: "845px",
					close: function(event, ui) {
						doSomethingWhenDialogClose();
						dialogArea.dialog("destroy");
						dialogArea.html("");
						doSomethingWhenDialogClose = function () {};
					}
				});
			});
		}

		e.preventDefault();
	});

});

// 更新jQGrid的列表显示
function reloadList() {
	$("table#userinfoGrid").jqGrid('setGridParam', {
		postData : {
			id : userid,
			username : username,
			sex : sex,
			startAge : startAge,
			endAge : endAge,
			status : status,
			mobible : mobible
		}
	}).trigger("reloadGrid");

}