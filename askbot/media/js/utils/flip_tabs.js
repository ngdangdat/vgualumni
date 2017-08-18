var FlipTabs = function () {
    WrappedElement.call(this);
};
inherits(FlipTabs, WrappedElement);

FlipTabs.prototype.getTabHandler = function (tab) {
    var targetSel = tab.data('target');
    var target = this._element.find(targetSel);
    var contentItems = this._element.find('.flip-content');
    var allTabs = this._tabs;
    return function () {
        contentItems.removeClass('flip-content-active');
        target.addClass('flip-content-active');
        allTabs.addClass('flip-tab-active');
        tab.removeClass('flip-tab-active');
        return false;
    };
};

FlipTabs.prototype.decorate = function (element) {
    this._element = element;
    var tabs = element.find('.flip-tab');
    this._tabs = tabs;
    var me = this;
    $.each(tabs, function(idx, item) {
        var tab = $(item);
        var trigger = tab.find('.trigger');
        if (trigger.length === 0) {
            trigger = tab;
        }
        setupButtonEventHandlers(trigger, me.getTabHandler(tab));
    });
};

(function () {
    var tabs = $('.flip-tabs');
    $.each(tabs, function(idx, item) {
        var tabs = $(item);
        var flipper = new FlipTabs();
        flipper.decorate(tabs);
    });
})();
