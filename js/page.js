/**
 * 具体页面的js文件，各功能之间用自己的命名空间隔离开避免污染全局变量
 * @version 1.0 20160527
 */

/**
 * 任务单详情页面js
 * @author Skipjack
 */
var taskDetail = (function($) {
    var obj = {};

    /**
     * 编辑任务描述
     */
    function _editDescription() {
        $('.task-list-detail').on('click', 'button[data-type]', function() {
            var $me = $(this),
                type = $me.attr('data-type'),
                target = $me.attr('data-target'),
                targetItem = $(target);

            switch (type) {
                case 'editBtn':
                    $me.addClass('hidden')
                        .siblings().removeClass('hidden');
                    targetItem.length && targetItem.removeAttr('readonly disabled').focus();
                    break;

                case 'saveBtn':
                    if (targetItem.val().length) {
                        // ajax code goes here 运行保存事件，保存成功回调运行下列代码
                        $me.addClass('hidden')
                            .siblings().removeClass('hidden')
                            .siblings('[data-type=cancelBtn]').addClass('hidden');
                        targetItem.length && targetItem.attr({
                            readonly: 'readonly',
                            disabled: 'disabled'
                        });
                    } else {
                        targetItem.length && targetItem.focus();
                        var msg = $.zui.messager.show('请输入任务描述内容再保存', { placement: 'bottom', type: 'warning' });
                    }
                    break;

                case 'cancelBtn':
                    $me.addClass('hidden')
                        .siblings().removeClass('hidden')
                        .siblings('[data-type=saveBtn]').addClass('hidden');
                    targetItem.length && targetItem.attr({
                        readonly: 'readonly',
                        disabled: 'disabled'
                    });
                    break;

                default:
                    break;
            }
        });
    }

    /**
     * 任务清单添加和删除任务，输入任务备注
     */
    function _editTodo() {
        var addBtn = $('#addTodo');
        //添加任务项
        $('.task-list-detail').on('click', '#addTodo', function() {
            if ($('#todoList ul li').length) {
                $('#todoList .no-data').remove();
            }
            var $me = $(this),
                currentLists = $('#todoList ul li');

            $me.attr('disabled', 'disabled');
            var htmlTemplate = '<li><input type="checkbox"><span class="task-label">任务' + (currentLists.length + 1) + '</span><input class="todo-notes active" type="text" placeholder="请输入备注" /><span class="edit-task-delete">删除</span></li>';
            $(htmlTemplate).appendTo('#todoList ul');
        });

        //删除任务项
        $('#todoList').on('click', '.edit-task-delete', function() {
            var $me = $(this),
                listItem = $me.parent('li');

            listItem.remove();
            if (!$('#todoList ul li').length) {
                $('<li class="text-center no-data">没有任务</li>').appendTo('#todoList ul');
            }
            addBtn.removeAttr('disabled');
        });

        //保存任务项
        $('#todoList').on('keyup', '.todo-notes', function(event) {
            var $me = $(this);
            if (event.which === 13) {
                $.trim($me.val()) ? function(){
                    $me.attr('readonly', 'readonly');
                    addBtn.removeAttr('disabled');
                }()
                : $.zui.messager.show('请输入任务备注', { placement: 'bottom', type: 'warning' });
            }
        });
    }

    /**
     * 添加关联项目
     */
    function _addRelatedProject() {
        $('#addRelatedProject').on('click', '#addBtn', function() {
            var inputs = $('#addRelatedProject form input[type=text]'),
                valueArray = [],
                timeString = timeHandler.timeToString({separator: '/', isSecondIn: true});

            inputs.each(function() {
                var $item = $(this),
                    value = $.trim($item.val());

                if (!value) {
                    $item.focus();
                    var msg = $.zui.messager.show('请输入完整信息后再添加', { placement: 'bottom', type: 'warning' });
                } else {
                    valueArray.push(value);
                }
            });
            if (valueArray.length === inputs.length) {
                alert(timeString);
                //ajax goes here 运行添加关联项目事件，完成后隐藏模态框
                $('#addRelatedProject').modal('hide');
            }
        })
    }

    /**
     * 初始化
     */
    function init() {
        _editDescription();
        _editTodo();
        _addRelatedProject();
    }

    obj.init = init;

    return obj;
}(jQuery));
