'use strict';

var _defaults = {
        modalOverlay: '.mini-modal__overlay',
        modalContent: '.mini-modal__content',
        modalCloseBtn: '.mini-modal__close',
        bodyOpenClass: 'mini-modal--open',
        modalOpenClass: 'open',
        backgroundClickClose: true,
        escClose: true,
        openImmediately: true,
        moveToBodyEnd: true
    },

    _activeModal,
    _bd = document.body,

    // helper functions
    _extend = function() {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }

        return arguments[0];
    },

    _removeClass = function(el, classname) {
        var classes = el.className.split(' '),
            pos = classes.indexOf(classname);

        if (pos > -1) {
            classes.splice(pos, 1);
        }

        el.className = classes.join(' ');
    },

    // bind handlers for close
    _bindClose = function() {
        this.modalCloseBtn.addEventListener('click', this.close);

        if (this.settings.escClose) {
            _bd.addEventListener('keyup', this._escCloseHandler);
        }

        if (this.settings.backgroundClickClose) {
            this.modalOverlay.addEventListener('click', this.close);
        }
    },

    _unbindClose = function() {
        this.modalCloseBtn.removeEventListener('click', this.close);
        this.modalOverlay.removeEventListener('click', this.close);
        _bd.removeEventListener('keyup', this._escCloseHandler);
    },

    _close = function() {

        // fire callback
        this.onBeforeClose(this.modal);

        // hide modal
        _removeClass(this.modal, this.settings.modalOpenClass);
        _removeClass(_bd, this.settings.bodyOpenClass);

        this._unbindClose();
    },

    _escCloseHandler = function(e) {
        if (e.keyCode === 27) {
            this.close();
        }

        e.preventDefault();
    },

    // callbacks
    _onInit = function() {},
    _onBeforeOpen = function() {},
    _onBeforeClose = function() {};

var MiniModal = function(modalId, options) {
    this.settings = _extend({}, _defaults, options || {});

    this.modal = document.getElementById(modalId);

    // abort if modal doesn't exist.
    if (!this.modal) {
        return {
            error: 'Element with id "' + modalId + '" not found.'
        };
    }

    this.modalOverlay = this.modal.querySelector(this.settings.modalOverlay);
    this.modalContent = this.modal.querySelector(this.settings.modalContent);
    this.modalCloseBtn = this.modal.querySelector(this.settings.modalCloseBtn);

    this.onInit = this.settings.onInit || _onInit;
    this.onBeforeOpen = this.settings.onBeforeOpen || _onBeforeOpen;
    this.onBeforeClose = this.settings.onBeforeClose || _onBeforeClose;

    this.close = _close.bind(this);
    this._escCloseHandler = _escCloseHandler.bind(this);
    this._bindClose = _bindClose.bind(this);
    this._unbindClose = _unbindClose.bind(this);

    // callback
    this.onInit.apply(this);

    // move modal to end of body
    if (this.settings.moveToBodyEnd) {
        _bd.appendChild(this.modal);
    }

    // show modal
    if (this.settings.openImmediately) {
        this.open();
    }
};

MiniModal.prototype.open = function() {
    this._bindClose();

    // show modal. setTimeout is needed if transitions are used.
    setTimeout(function() {

        // callback
        this.onBeforeOpen(this.modal);

        _bd.className += ' ' + (this.settings.bodyOpenClass);
        this.modal.className += ' ' + (this.settings.modalOpenClass);

        // store active modal, so it can be closed with static close method.
        _activeModal = this;
    }.bind(this), 10);
};

// static functions
MiniModal.close = function() {
    _activeModal && _activeModal.close();
    _activeModal = null;
};

MiniModal.open = function(el, options) {
    MiniModal.close();

    _extend(options || {}, {openImmediately: true});

    return new MiniModal(el, options);
};

MiniModal.getActiveModal = function() {
    return _activeModal;
};
