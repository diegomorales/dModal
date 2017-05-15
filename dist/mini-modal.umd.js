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
    modalOverlayClass: 'mini-modal__overlay',
    modalContentClass: 'mini-modal__content',
    modalCloseBtnClass: 'mini-modal__close',
    bodyOpenClass: 'mini-modal-active',
    modalOpenClass: 'mini-modal--open',
    backgroundClickClose: true,
    escClose: true,
    openImmediately: false,
    moveToBodyEnd: true,
    onInit: function onInit() {},
    onBeforeOpen: function onBeforeOpen() {},
    onBeforeClose: function onBeforeClose() {}
},
    selectors = {
    modalOverlay: '[data-mini-modal-overlay]',
    modalContent: '[data-mini-modal-content]',
    modalCloseBtn: '[data-mini-modal-close]'
},
    assign = function assign() {
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                arguments[0][key] = arguments[i][key];
            }
        }
    }

    return arguments[0];
},
    doc = document;

var activeModal = void 0;

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
    m.modalOverlay.classList.add(settings.modalOverlayClass);
    m.modalContent.classList.add(settings.modalContentClass);
    m.modalCloseBtn.classList.add(settings.modalCloseBtnClass);

    var bindClose = function bindClose() {
        m.modalCloseBtn.addEventListener('click', close);

        if (settings.escClose) {
            doc.body.addEventListener('keyup', escCloseHandler);
        }

        if (settings.backgroundClickClose) {
            m.modalOverlay.addEventListener('click', close);
        }
    },
        unbindClose = function unbindClose() {
        m.modalCloseBtn.removeEventListener('click', close);
        m.modalOverlay.removeEventListener('click', close);
        doc.body.removeEventListener('keyup', escCloseHandler);
    },
        escCloseHandler = function escCloseHandler(e) {
        if (e.keyCode === 27) {
            close();
        }

        e.preventDefault();
    },
        open = function open() {

        // close any open modal first.
        MiniModal.close();

        bindClose();

        // show modal. setTimeout is needed if transitions are used.
        setTimeout(function () {

            // callback
            settings.onBeforeOpen.call(null, m);

            doc.body.classList.add(settings.bodyOpenClass);
            m.modal.classList.add(settings.modalOpenClass);

            // store active modal, so it can be closed with static close method.
            activeModal = m;
        }, 10);
    },
        close = function close() {
        if (arguments[0] && arguments[0].preventDefault) {
            arguments[0].preventDefault();
        }

        // fire callback
        if (settings.onBeforeClose.call(null, m) !== false) {

            // hide modal
            m.modal.classList.remove(settings.modalOpenClass);
            doc.body.classList.remove(settings.bodyOpenClass);

            unbindClose();
            activeModal = null;
        }
    },


    // You will need this only in very rare occasions
    trigger = function trigger(callbackName) {
        switch (callbackName) {
            case 'onInit':
                settings.onInit.call(null, m);
                break;

            case 'onBeforeOpen':
                settings.onBeforeOpen.call(null, m);
                break;

            case 'onBeforeClose':
                settings.onBeforeClose.call(null, m);

            // no default
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
    m.trigger = trigger;
    m.bindClose = bindClose;
    m.unbindClose = unbindClose;

    return m;
};

// Static functions
MiniModal.close = function () {
    activeModal && activeModal.close();
    activeModal = null;
};

MiniModal.open = function (id, options) {
    MiniModal.close();
    return MiniModal.create(id, assign(options || {}, { openImmediately: true }));
};

MiniModal.getActiveModal = function () {
    return activeModal;
};
return MiniModal;
}));
