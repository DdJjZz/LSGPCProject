$(document).ready(function () {
    $('#companyTable').dataTable({
        "bFilter": false,
        "bLengthChange": false,
        "autoWidth": false,
        "paginationType": "simple",
        // "ordering": false,
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "抱歉，没有找到",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前一页",
                "sNext": "后一页",
                "sLast": "尾页"
            },
        },
        "pageLength": 15,
        dom:'Bfrtip',
        buttons: [
            {
                extend: 'excel',//使用 excel扩展
                text: '导出为Excel',// 显示文字
                exportOptions: {
                    //自定义导出选项
                    //如：可自定义导出那些列，那些行
                    //TODO...
                }
            }
        ]
    });
});