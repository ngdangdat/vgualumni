/** Group of response notifications batched by 
    question */
var NotifsGroup = function () {
    WrappedElement.call(this);
};
inherits(NotifsGroup, WrappedElement);

NotifsGroup.prototype.getMessageCheckboxes = function () {
    return this._element.find('.message input[type="checkbox"]');
};

NotifsGroup.prototype.getCheckTitleHandler = function () {
    var me = this;
    var titleCb = this._titleCb;
    return function () {
        var msgBoxes = me.getMessageCheckboxes();
        if (titleCb.prop('checked')) {
            msgBoxes.prop('checked', true);
        } else {
            msgBoxes.prop('checked', false);
        }
    };
};

NotifsGroup.prototype.decorate = function (element) {
    this._element = element;
    var titleCb = element.find('h2 input[type="checkbox"]');
    this._titleCb = titleCb;
    setupButtonEventHandlers(titleCb, this.getCheckTitleHandler());
};
