/**
 * @constructor
 */
var TagSearch = function () {
    WrappedElement.call(this);
    this._isRunning = false;
};
inherits(TagSearch, WrappedElement);

TagSearch.prototype.getQuery = function () {
    return $.trim(this._element.val());
};

TagSearch.prototype.setQuery = function (val) {
    this._element.val(val);
};

TagSearch.prototype.getSort = function () {
    //todo: read it off the page
    var link = $('.tabBar a.on');
    if (link.length === 1) {
        var sort = link.attr('id').replace('sort_', '');
        if (sort === 'name' || sort === 'used') {
            return sort;
        }
    }
    return 'name';
};

TagSearch.prototype.getIsRunning = function () {
    return this._isRunning;
};

TagSearch.prototype.setIsRunning = function (val) {
    this._isRunning = val;
};

TagSearch.prototype.renderResult = function (html) {
    this._contentBox.html(html);
};

TagSearch.prototype.runSearch = function () {
    var query = this.getQuery();
    var data = {
        'query': query,
        'sort': this.getSort(),
        'page': '1'
    };
    var me = this;
    $.ajax({
        dataType: 'json',
        data: data,
        cache: false,
        url: askbot.urls.tags,
        success: function (data) {
            if (data.success) {
                me.renderResult(data.html);
                me.setIsRunning(false);
                //rerun if query changed meanwhile
                if (query !== me.getQuery()) {
                    me.runSearch();
                }
            }
        },
        error: function () { me.setIsRunning(false); }
    });
    me.setIsRunning(true);
};

TagSearch.prototype.makeKeyUpHandler = function () {
    var me = this;
    return function (evt) {
        var keyCode = getKeyCode(evt);
        if (me.getIsRunning() === false) {
            me.runSearch();
        }
    };
};

TagSearch.prototype.makeKeyDownHandler = function () {
    var me = this;
    var xButton = this._xButton;
    return function (evt) {
        var query = me.getQuery();
        var keyCode = getKeyCode(evt);
        if (keyCode === 27) {//escape
            me.setQuery('');
            xButton.hide();
            return;
        }
        if (keyCode === 8 || keyCode === 48) {//del or backspace
            if (query.length === 1) {
                xButton.hide();
            }
        } else {
            xButton.show();
        }
    };
};

TagSearch.prototype.reset = function () {
    if (this.getIsRunning() === false) {
        this.setQuery('');
        this._xButton.hide();
        this.runSearch();
        this._element.focus();
    }
};

TagSearch.prototype.decorate = function (element) {
    this._element = element;
    this._contentBox = $('#ContentLeft');
    this._xButton = $('input[name=reset_query]');
    element.keyup(this.makeKeyUpHandler());
    element.keydown(this.makeKeyDownHandler());

    var me = this;
    this._xButton.click(function () { me.reset(); });
};
