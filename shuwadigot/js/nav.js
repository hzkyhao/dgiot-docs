
var menuData = [
    {
        "menuId": "1",
        "title": "系统管理",
        "menuIdParent": "2",
        "url":'index1.html'
    },
    {
        "menuId": "2",
        "title": "决策分析",
        "menuIdParent": "0"
    },
    {
        "menuId": "3",
        "title": "运营决策",
        "menuIdParent": "0"
    },
    {
        "menuId": "4",
        "title": "知识库",
        "menuIdParent": "0"
    },
    {
        "menuId": "5",
        "title": "运营分析",
        "menuIdParent": "3",
        "url":'index1.html'
    },
    {
        "menuId": "6",
        "title": "决策分析2",
        "menuIdParent": "3",
        "url":'index1.html'
    },
    {
        "menuId": "7",
        "title": "运营管理",
        "menuIdParent": "3",
        "url":'index1.html'
    },
    {
        "menuId": "8",
        "title": "决策管理",
        "menuIdParent": "3",
        "url":'index1.html'
    },
    {
        "menuId": "9",
        "title": "决策支持",
        "menuIdParent": "4",
        "url":'index1.html'
    },
    {
        "menuId": "10",
        "title": "人员信息",
        "menuIdParent": "9"
    },
    {
        "menuId": "11",
        "title": "人员管理",
        "menuIdParent": "9",
        "url":'index1.html'
    },
    {
        "menuId": "12",
        "title": "人员排班",
        "menuIdParent": "9",
        "url":'index1.html'
    },
    {
        "menuId": "13",
        "title": "系统菜单",
        "menuIdParent": "10",
        "url":'index1.html'
    },
    {
        "menuId": "14",
        "title": "模块菜单",
        "menuIdParent": "10",
        "url":'index1.html'
    },
    {
        "menuId": "15",
        "title": "菜单编辑",
        "menuIdParent": "10"
    },
    {
        "menuId": "16",
        "title": "地点管理",
        "menuIdParent": "14",
        "url":'index1.html'
    },
    {
        "menuId": "17",
        "title": "科室管理",
        "menuIdParent": "14",
        "url":'index1.html'
    },
    {
        "menuId": "18",
        "title": "图片管理",
        "menuIdParent": "0"
    },
    {
        "menuId": "19",
        "title": "存储信息",
        "menuIdParent": "0"
    },
    {
        "menuId": "20",
        "title": "人员信息",
        "menuIdParent": "0"
    },
    {
        "menuId": "21",
        "title": "机构信息",
        "menuIdParent": "0"
    },
    {
        "menuId": "22",
        "title": "机构管理",
        "menuIdParent": "21",
        "url":'index1.html'
    },
    {
        "menuId": "23",
        "title": "机构添加",
        "menuIdParent": "21",
        "url":'index1.html'
    },
    {
        "menuId": "24",
        "title": "随机生成",
        "menuIdParent": "1",
        "url":'index1.html'
    }

];


/*普通json 转成树形json*/
function listToTree(list, pid) {
    var ret = [];//一个存放结果的临时数组
    for (var i in list) {
        if (list[i].menuIdParent == pid) {//如果当前项的父id等于要查找的父id，进行递归
            list[i].children = listToTree(list, list[i].menuId);
            ret.push(list[i]);//把当前项保存到临时数组中
        }
    }
    return ret;//递归结束后返回结果
    
}

var tree = listToTree(menuData, 0);//调用函数，传入要转换的普通json和树中顶级元素的pid
/*顶级元素的pid：在本例中为0，相当于一级菜单的父节点编号为0*/


/*根据处理过的树形json数据生成一级菜单*/
function showTreeFirst(data) {
    var dataLength = data.length;
    if (dataLength < 7) {//最多生成五个菜单，其余隐藏
        // console.log("dataLength < 6")
        for (var i = 0; i < dataLength; i++) {
            if (data[i].children.length) {//如果有子集
                var html = ' <li class="dropdown"> ' +
                    '<a href="#" data-toggle="dropdown" id="' + data[i].menuId+ '" data-submenu="" > ' + data[i].title + ' </a>' +
                    ' <ul class="dropdown-menu" id="submenu_' + data[i].menuId + '"></ul> </li>  ';
                $("#systemWebMenu").append(html);
            } else {
                var html = ' <li> <a href="#" data-toggle="dropdown" data-submenu=""  id="' + data[i].menuId + '" > ' + data[i].title + ' </a> </li> ';
                $("#systemWebMenu").append(html);
            }
        }
    } else {//最多生成五个菜单，其余隐藏

       /* 先成前五个菜单*/
        for (var i = 0; i < 6; i++) {
            if (data[i].children.length) {//如果有子集
                var html = '  <li class="dropdown">' +
                    ' <a href="#" data-toggle="dropdown"  id="' + data[i].menuId + '" data-submenu=""> ' + data[i].title + '<strong class="caret" style="margin-left:10px"></strong> </a> ' +
                    '<ul class="dropdown-menu" id="submenu_' + data[i].menuId + '"></ul> </li>  ';
                $("#systemWebMenu").append(html);
            } else {
                var html = ' <li> <a href="#" data-toggle="dropdown" data-submenu=""  id="' + data[i].menuId +'" data-url='+data[i].url+'> ' + data[i].title + ' </a> </li> ';
                $("#systemWebMenu").append(html);
            }
        }
        /* 生成“更多”按钮*/
        var html = ' <li class="dropdown"> <a href="#" data-toggle="dropdown" data-submenu=""   id="' + data[i].menuId
            + '" menutitle="' + data[i].title+'">更多<strong class="caret" style="margin-left:10px"></strong> </a> ' +
            '<ul class="dropdown-menu" id="moreDropdownMenu"> </ul> </li>';
        $("#systemWebMenu").append(html);

        /* 生成“更多”按钮下的其他一级隐藏菜单*/
        for (var i = 6; i < dataLength; i++) {
            if (data[i].children.length) {//如果有子集
                var html = ' <li class="dropdown-submenu"> <a type="bitton" href="javascript(0)" id="'+ data[i].menuId +'" data-url='+data[i].url+'>' + data[i].title + '</a> ' + '<ul class="dropdown-menu" id="submenu_' + data[i].menuId + '"> </ul>'
                $("#moreDropdownMenu").append(html);
            } else {
                var html = '<li><a id="'+data[i].menuId+'"  >' + data[i].title + '</a> </li>'
                $("#moreDropdownMenu").append(html);
            }
        }

    }


}


/*根据处理过的树形json数据递归生成一级菜单以外的其他菜单*/
function showTree(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].children.length) {//如果有子集
            /* 先判断父节点是否存在*/
            if ($("#submenu_" + data[i].menuIdParent).size() == 0) {
                showTree(data[i].children);//递归调用子集
            } else {
                var html = '<li class="dropdown-submenu">' +
                    ' <a id="'+data[i].menuId+'" >' + data[i].title + '</a>' +
                    '<ul class="dropdown-menu" id="submenu_'+data[i].menuId+'"> </ul>'
                $("#submenu_"+data[i].menuIdParent).append(html);
                showTree(data[i].children);//递归调用子集
            }

        } else {//没有子集直接显示
            var html = '<li><a  id="'+data[i].menuId+'" data-url='+data[i].url+' class="endmenu">'+data[i].title+'</a> </li>'
            $("#submenu_" + data[i].menuIdParent).append(html);
        }
    }
}







