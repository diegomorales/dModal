;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MiniModal = factory();
  }
}(this, function() {
'use strict';

var MiniModal = {},
    defaults = {
        modalOverlay: '.mini-modal__overlay',
        modalContent: '.mini-modal__content',
        modalCloseBtn: '.mini-modal__close',
        bodyOpenClass: 'mini-modal-active',
        modalOpenClass: 'open',
        backgroundClickClose: true,
        escClose: true,
        openImmediately: false,
        moveToBodyEnd: true,
        onInit: function () {},
        onBeforeOpen: function () {},
        onBeforeClose: function () {}
    },

    activeModal,
    doc = document,

    // helper functions
    removeClass = doc.documentElement.classList ? function (el, className) {
        el.classList.remove(className);
    } : function (el, className) {
        var classes = el.className.split(' '),
            pos = classes.indexOf(className);

        if (pos > -1) {
            classes.splice(pos, 1);
        }

        el.className = classes.join(' ');
    },

    assign = function () {
        for (var i = 1; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }

        return arguments[0];
    };

// static functions
MiniModal.create = function (modalId, options) {
    var settings = assign({}, defaults, options),
        m = {};

    // abort if modal doesn't exist.
    if (!(m.modal = document.getElementById(modalId))) {
        throw new Error('Element with id "' + modalId + '" not found.');
    }

    // store element references
    m.modalOverlay = m.modal.querySelector(settings.modalOverlay);
    m.modalContent = m.modal.querySelector(settings.modalContent);
    m.modalCloseBtn = m.modal.querySelector(settings.modalCloseBtn);

    // private functions
    var bindClose = function () {
            m.modalCloseBtn.addEventListener('click', m.close);

            if (settings.escClose) {
                doc.body.addEventListener('keyup', escCloseHandler);
            }

            if (settings.backgroundClickClose) {
                m.modalOverlay.addEventListener('click', m.close);
            }
        },

        unbindClose = function () {
            m.modalCloseBtn.removeEventListener('click', m.close);
            m.modalOverlay.removeEventListener('click', m.close);
            doc.body.removeEventListener('keyup', escCloseHandler);
        },

        escCloseHandler = function (e) {
            if (e.keyCode === 27) {
                m.close();
            }

            e.preventDefault();
        };

    // public functions
    m.open = function () {

        // close any open modal first.
        MiniModal.close();

        bindClose();

        // show modal. setTimeout is needed if transitions are used.
        setTimeout(function () {

            // callback
            settings.onBeforeOpen(m);

            doc.body.className += ' ' + (settings.bodyOpenClass);
            m.modal.className += ' ' + (settings.modalOpenClass);

            // store active modal, so it can be closed with static close method.
            activeModal = m;
        }, 10);
    };

    m.close = function () {

        // fire callback
        if (settings.onBeforeClose(m) !== false) {

            // hide modal
            removeClass(m.modal, settings.modalOpenClass);
            removeClass(doc.body, settings.bodyOpenClass);

            unbindClose();
            activeModal = null;
        }
    };

    settings.onInit(m);

    // move modal to end of body
    if (settings.moveToBodyEnd) {
        doc.body.appendChild(m.modal);
    }

    // show modal
    if (settings.openImmediately) {
        m.open();
    }

    return m;
};

// static functions
MiniModal.close = function () {
    activeModal && activeModal.close();
    activeModal = null;
};

MiniModal.open = function (id, options) {
    MiniModal.close();
    return MiniModal.create(id, assign(options || {}, {openImmediately: true}));
};

MiniModal.getActiveModal = function () {
    return activeModal;
};

return MiniModal;
}));
