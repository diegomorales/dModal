'use strict';

var minimodal = {},

    _defaults = {
        modalOverlay: '.mini-modal__overlay',
        modalContent: '.mini-modal__content',
        modalCloseBtn: '.mini-modal__close',
        bodyOpenClass: 'mini-modal--open',
        modalOpenClass: 'open',
        backgroundClickClose: true,
        escClose: true
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

    _close = function() {

        // fire callback
        this.onBeforeClose(this.modal);

        // hide modal
        _removeClass(this.modal, this.settings.modalOpenClass);
        _removeClass(_bd, this.settings.bodyOpenClass);

        // unbind events
        this.modalCloseBtn.removeEventListener('click', this.close);
        this.modalOverlay.removeEventListener('click', this.close);
        _bd.removeEventListener('keyup', this.escCloseHandler);
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

function MiniModal(options) {
    this.settings = _extend({}, options, _defaults);

    this.modal = document.getElementById(options.modalId);
    this.modalOverlay = this.modal.querySelector(this.settings.modalOverlay);
    this.modalContent = this.modal.querySelector(this.settings.modalContent);
    this.modalCloseBtn = this.modal.querySelector(this.settings.modalCloseBtn);

    this.onInit = options.onInit || _onInit();
    this.onBeforeOpen = options.onBeforeOpen || _onBeforeOpen;
    this.onBeforeClose = options.onBeforeClose || _onBeforeClose;

    this.close = _close.bind(this);
    this.escCloseHandler = _escCloseHandler.bind(this);

    // abort if modal doesn't exist.
    if (!this.modal) {
        return {
            error: 'modal dialog with id "' + options.modalId + '" not found.'
        };
    }

    this.onInit.apply(this);

    // move modal to end of body
    _bd.appendChild(this.modal);

    // show modal
    if (this.settings.openImmediately) {
        this.open();
    }
}

MiniModal.prototype.open = function() {

    // bind handlers for close
    this.modalCloseBtn.addEventListener('click', this.close);

    if (this.settings.escClose) {
        _bd.addEventListener('keyup', this.escCloseHandler);
    }

    if (this.settings.backgroundClickClose) {
        this.modalOverlay.addEventListener('click', this.close);
    }

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

minimodal.create = function(options) {
    _extend(options, { openImmediately: false });
    return new MiniModal(options);
};

minimodal.open = function(options) {

    // close other modals first
    this.close();

    _extend(options, { openImmediately: true });
    return new MiniModal(options);
};

minimodal.close = function() {
    _activeModal && _activeModal.close();
    _activeModal = null;
};
