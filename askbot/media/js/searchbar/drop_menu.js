var SearchDropMenu = function () {
    WrappedElement.call(this);
    this._data = undefined;
    this._selectedItemIndex = 0;
    this._askButtonEnabled = true;
};
inherits(SearchDropMenu, WrappedElement);

SearchDropMenu.prototype.setData = function (data) {
    this._data = data;
};

SearchDropMenu.prototype.setAskHandler = function (handler) {
    this._askHandler = handler;
};

SearchDropMenu.prototype.setSearchWidget = function (widget) {
    this._searchWidget = widget;
};

SearchDropMenu.prototype.getSearchWidget = function () {
    return this._searchWidget;
};

SearchDropMenu.prototype.setAskButtonEnabled = function (isEnabled) {
    this._askButtonEnabled = isEnabled;
};

/**
 * assumes that data is already set
 */
SearchDropMenu.prototype.render = function () {
    var list = this._resultsList;
    list.empty();
    var me = this;
    $.each(this._data, function (idx, item) {
        var listItem = me.makeElement('li');
        var link = me.makeElement('a');
        link.attr('href', item.url);
        link.html(item.title);
        listItem.append(link);
        list.append(listItem);
    });
    if (this._data.length === 0) {
        list.addClass('empty');
        this._element.addClass('empty');
    } else {
        list.removeClass('empty');
        this._element.removeClass('empty');
    }
};

SearchDropMenu.prototype.clearSelectedItem = function () {
    this._selectedItemIndex = 0;
    this._resultsList.find('li').removeClass('selected');
};

/**
 * @param {number} idx position of item starting from 1 for the topmost
 * Selects item inentified by position.
 * Scrolls the list to make top of the item visible.
 */
SearchDropMenu.prototype.selectItem = function (idx) {
    //idx is 1-based index
    this._selectedItemIndex = idx;
    var list = this._resultsList;
    list.find('li').removeClass('selected');
    var item = this.getItem(idx);
    if (item && idx > 0) {
        item.addClass('selected');
        var itemTopY = item.position().top;//relative to visible area
        var curScrollTop = list.scrollTop();

        /* if item is clipped on top, scroll down */
        if (itemTopY < 0) {
            list.scrollTop(curScrollTop + itemTopY);
            return;
        }

        var listHeight = list.outerHeight();
        /* pixels above the lower border of the list */
        var itemPeepHeight = listHeight - itemTopY;
        /* pixels below the lower border */
        var itemSinkHeight = item.outerHeight() - itemPeepHeight;
        if (itemSinkHeight > 0) {
            list.scrollTop(curScrollTop + itemSinkHeight);
        }
    }

};

SearchDropMenu.prototype.getItem = function (idx) {
    return $(this._resultsList.find('li')[idx - 1]);
};

SearchDropMenu.prototype.getItemCount = function () {
    return this._resultsList.find('li').length;
};

SearchDropMenu.prototype.getSelectedItemIndex = function () {
    return this._selectedItemIndex;
};

SearchDropMenu.prototype.navigateToItem = function (idx) {
    var item = this.getItem(idx);
    if (item) {
        window.location.href = item.find('a').attr('href');
    }
};

SearchDropMenu.prototype.makeKeyHandler = function () {
    var me = this;
    return function (e) {
        var keyCode = getKeyCode(e);
        if (keyCode === 27) {//escape
            me.hide();
            return false;
        }
        if (keyCode !== 38 && keyCode !== 40 && keyCode !== 13) {
            return;
        }
        var itemCount = me.getItemCount();
        if (itemCount > 0) {
            //count is 0 with no title matches, curItem is 0 when none is selected
            var curItem = me.getSelectedItemIndex();
            if (keyCode === 38) {//upArrow
                if (curItem > 0) {
                    curItem = curItem - 1;
                }
            } else if (keyCode === 40) {//downArrow
                if (curItem < itemCount) {
                    curItem = curItem + 1;
                }
            } else if (keyCode === 13) {//enter
                if (curItem === 0) {
                    return true;
                } else {
                    me.navigateToItem(curItem);
                    return false;
                }
            }

            var widget = me.getSearchWidget();
            if (curItem === 0) {
                //activate key handlers on input box
                widget.setFullTextSearchEnabled(true);
                me.clearSelectedItem();
            } else {
                //deactivate key handlers on input box
                widget.setFullTextSearchEnabled(false);
                me.selectItem(curItem);
            }
            return false;
        }
    };
};

/** todo: change this to state management as >1 thing happens */
SearchDropMenu.prototype.showWaitIcon = function () {
    if (this._askButtonEnabled) {
        this._waitIcon.show();
        this._footer.hide();
        this._element.addClass('empty');
    }
    this._element.addClass('waiting');
};

SearchDropMenu.prototype.hideWaitIcon = function () {
    if (this._askButtonEnabled) {
        this._waitIcon.hide();
        this._footer.show();
        this._element.removeClass('empty');
    }
    this._element.removeClass('waiting');
};

SearchDropMenu.prototype.hideHeader = function () {
    if (this._header) {
        this._header.hide();
    }
};

SearchDropMenu.prototype.showHeader = function () {
    if (this._header) {
        this._header.show();
    }
};

SearchDropMenu.prototype.createDom = function () {
    this._element = this.makeElement('div');
    this._element.addClass('search-drop-menu');
    this._element.hide();

    if (askbot.data.languageCode === 'ja') {
        var warning = this.makeElement('p');
        this._header = warning;
        warning.addClass('header');
        warning.html(gettext('To see search results, 2 or more characters may be required'));
        this._element.append(warning);
    }

    this._resultsList = this.makeElement('ul');
    this._element.append(this._resultsList);
    this._element.addClass('empty');

    var waitIcon = new WaitIcon();
    waitIcon.hide();
    this._element.append(waitIcon.getElement());
    this._waitIcon = waitIcon;

    //add ask button, @todo: make into separate class?
    var footer = this.makeElement('div');
    this._element.append(footer);
    this._footer = footer;

    if (this._askButtonEnabled) {
        footer.addClass('footer');
        var button = this.makeElement('button');
        button.addClass('submit btn btn-default');
        button.html(gettext('Ask Your Question'));
        footer.append(button);
        var handler = this._askHandler;
        setupButtonEventHandlers(button, handler);
    }

    $(document).keydown(this.makeKeyHandler());
};

SearchDropMenu.prototype.isOpen = function () {
    return this._element.is(':visible');
};

SearchDropMenu.prototype.show = function () {
    var searchBar = this.getSearchWidget();
    var searchBarHeight = searchBar.getWidgetHeight();
    var topOffset = searchBar.getElement().offset().top + searchBarHeight;
    this._element.show();//show so that size calcs work
    var footerHeight = this._footer.outerHeight();
    var windowHeight = $(window).height();
    this._resultsList.css(
        'max-height',
        windowHeight - topOffset - footerHeight - 40 //what is this number?
    );
};

SearchDropMenu.prototype.hide = function () {
    this._element.hide();
};

SearchDropMenu.prototype.reset = function () {
    this._data = undefined;
    this._resultsList.empty();
    this._selectedItemIndex = 0;
    this._element.hide();
};
