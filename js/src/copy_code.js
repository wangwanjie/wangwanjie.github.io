/*页面载入完成后，创建复制按钮*/
!function (e, t, a) {
    /* code */
    var initCopyCode = function () {
        var copyHtml = '';
        copyHtml += '<button class="btn-copy" data-clipboard-snippet="">';
        copyHtml += '  <i class="fa fa-copy"></i><span>拷贝</span>';
        copyHtml += '</button>';
        $(".highlight .code pre").before(copyHtml);
        var clipboard = new ClipboardJS('.btn-copy', {
            target: function (trigger) {
                return trigger.nextElementSibling;
            }
        });

        clipboard.on('success', $(function (e) {
            $(".btn-copy").click(function () {
                swal({
                    title: "",
                    text: '复制成功',
                    html: false,
                    timer: 500,
                    showConfirmButton: false
                });
            });
        }));
    }
    initCopyCode();
}(window, document);