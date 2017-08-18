var AskForm = function () {
    Form.call(this);
};
inherits(AskForm, Form);

AskForm.prototype.getOpenEditorHandler = function (editor, openLink) {
    return function() {
        var openHandler = editor.getOpenHandler();
        openLink.remove();
        openHandler();
    };
};

AskForm.prototype.decorate = function (element) {
    getSuperClass(AskForm).decorate.call(this, element);
    var openLink = element.find('.js-question-body-trigger');
    var editorElement = element.find('.folded-editor');

    if (openLink.length && editorElement.length) {
        var editor = new FoldedEditor();
        editor.decorate(editorElement);
        var handler = this.getOpenEditorHandler(editor, openLink);
        setupButtonEventHandlers(openLink, handler);
    }
};
