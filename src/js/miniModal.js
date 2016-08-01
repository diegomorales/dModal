'use strict';

var MiniModal = {},
    defaults = {
        modalOverlayClass: 'mini-modal__overlay',
        modalContentClass: 'mini-modal__content',
        modalCloseBtnClass: 'mini-modal__close',
        bodyOpenClass: 'mini-modal-active',
        modalOpenClass: 'mini-modal--open',
        backgroundClickClose: true,
        escClose: true,
        openImmediately: false,
        moveToBodyEnd: true,
        onInit: function () {},
        onBeforeOpen: function () {},
        onBeforeClose: function () {}
    },

    selectors = {
        modalOverlay: '[data-mini-modal-overlay]',
        modalContent: '[data-mini-modal-content]',
        modalCloseBtn: '[data-mini-modal-close]'
    },

    activeModal,
    doc = document,

    // helper functions
    addClass= doc.documentElement.classList ? function (el, className) {
        el.classList.add(className);
    } : function (el, className) {
        el.className += ' ' + className;
    },

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
    m.modalOverlay = m.modal.querySelector(selectors.modalOverlay);
    m.modalContent = m.modal.querySelector(selectors.modalContent);
    m.modalCloseBtn = m.modal.querySelector(selectors.modalCloseBtn);

    // add styling classes
    addClass(m.modalOverlay, settings.modalOverlayClass);
    addClass(m.modalContent, settings.modalContentClass);
    addClass(m.modalCloseBtn, settings.modalCloseBtnClass);

    var bindClose = function () {
            m.modalCloseBtn.addEventListener('click', close);

            if (settings.escClose) {
                doc.body.addEventListener('keyup', escCloseHandler);
            }

            if (settings.backgroundClickClose) {
                m.modalOverlay.addEventListener('click', close);
            }
        },

        unbindClose = function () {
            m.modalCloseBtn.removeEventListener('click', close);
            m.modalOverlay.removeEventListener('click', close);
            doc.body.removeEventListener('keyup', escCloseHandler);
        },

        escCloseHandler = function (e) {
            if (e.keyCode === 27) {
                close();
            }

            e.preventDefault();
        },

        open = function () {

            // close any open modal first.
            MiniModal.close();

            bindClose();

            // show modal. setTimeout is needed if transitions are used.
            setTimeout(function () {

                // callback
                settings.onBeforeOpen.call(null, m);

                addClass(doc.body, settings.bodyOpenClass);
                addClass(m.modal, settings.modalOpenClass);

                // store active modal, so it can be closed with static close method.
                activeModal = m;
            }, 10);
        },

        close = function () {
            if (arguments[0] && arguments[0].preventDefault) {
                arguments[0].preventDefault();
            }

            // fire callback
            if (settings.onBeforeClose.call(null, m) !== false) {

                // hide modal
                removeClass(m.modal, settings.modalOpenClass);
                removeClass(doc.body, settings.bodyOpenClass);

                unbindClose();
                activeModal = null;
            }
        };

    settings.onInit.call(null, m);

    // move modal to end of body
    if (settings.moveToBodyEnd) {
        doc.body.appendChild(m.modal);
    }

    // show modal
    if (settings.openImmediately) {
        open();
    }

    // export functions to instance
    m.open = open;
    m.close = close;
    m._bindClose = bindClose;
    m._unbindClose = unbindClose;

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
