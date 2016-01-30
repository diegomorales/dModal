'use strict';

var dModal = {},

    _defaults = {
        modalOverlay: '.d-modal-overlay',
        modalContent: '.d-modal-content',
        modalCloseBtn: '.d-modal-close',
        bodyOpenClass: 'd-modal-open',
        modalOpenClass: 'open',
        backgroundClickClose: true,
        escClose: true
    },

    _bd = document.body,

    _close = function() {

        // fire callback
        this.onBeforeClose(this.modal);

        // hide modal
        this.modal.classList.remove(this.settings.modalOpenClass);
        _bd.classList.remove(this.settings.bodyOpenClass);

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

    // helper function
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

    // callbacks
    _onBeforeOpen = function() {},
    _onBeforeClose = function() {};

function DModal(options) {
    this.settings = _extend({}, options, _defaults);

    this.modal = document.getElementById(options.modalId);
    this.modalOverlay = this.modal.querySelector(this.settings.modalOverlay);
    this.modalContent = this.modal.querySelector(this.settings.modalContent);
    this.modalCloseBtn = this.modal.querySelector(this.settings.modalCloseBtn);

    this.onBeforeOpen = options.onBeforeOpen || _onBeforeOpen;
    this.onBeforeClose = options.onBeforeClose || _onBeforeClose;

    // abort if modal doesn't exist.
    if (!this.modal) {
        return {
            error: 'modal dialog with id "' + options.modalId + '" not found.'
        };
    }

    // move modal to end of body
    _bd.appendChild(this.modal);

    this.open();

    // close btn
    this.close = _close.bind(this);
    this.escCloseHandler = _escCloseHandler.bind(this);

    this.modalCloseBtn.addEventListener('click', this.close);

    if (this.settings.escClose) {
        _bd.addEventListener('keyup', this.escCloseHandler);
    }

    if (this.settings.backgroundClickClose) {
        this.modalOverlay.addEventListener('click', this.close);
    }
}

DModal.prototype.open = function() {

    // show modal. setTimeout is needed if transitions are used.
    setTimeout(function() {
        // callback
        this.onBeforeOpen(this.modal);

        _bd.classList.add(this.settings.bodyOpenClass);
        this.modal.classList.add(this.settings.modalOpenClass);
    }.bind(this), 10);
};

dModal.open = function(options) {
    return new DModal(options);
};
