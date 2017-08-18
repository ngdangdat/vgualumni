/**
  Displays non-existing tags,
  when a separate tag search input is enabled
  This whole feature (tag search) may be removed.
 */
var TagWarningBox = function () {
    WrappedElement.call(this);
    this._tags = [];
};
inherits(TagWarningBox, WrappedElement);

TagWarningBox.prototype.createDom = function () {
    this._element = this.makeElement('div');
    this._element.css('display', 'block');
    this._element.css('margin', '0 0 13px 2px');
    this._element.addClass('non-existing-tags');
    this._warning = this.makeElement('p');
    this._element.append(this._warning);
    this._tag_container = this.makeElement('ul');
    this._tag_container.addClass('tags');
    this._element.append(this._tag_container);
    this._element.append($('<div class="clearfix"></div>'));
    this._element.hide();
};

TagWarningBox.prototype.clear = function () {
    this._tags = [];
    if (this._tag_container) {
        this._tag_container.empty();
    }
    this._warning.hide();
    this._element.hide();
};

TagWarningBox.prototype.addTag = function (tag_name) {
    var tag = new Tag();
    tag.setName(tag_name);
    tag.setLinkable(false);
    tag.setDeletable(false);
    var elem = this.getElement();
    this._tag_container.append(tag.getElement());
    this._tag_container.css('display', 'block');
    this._tags.push(tag);
    elem.show();
};

TagWarningBox.prototype.showWarning = function () {
    this._warning.html(
        ngettext(
            'Sorry, this tag does not exist',
            'Sorry, these tags do not exist',
            this._tags.length
        )
    );
    this._warning.show();
};

