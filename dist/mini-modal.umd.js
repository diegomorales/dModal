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


// Helper functions
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
    closest = function closest(startEl, selector) {
    var matches = document.querySelectorAll(selector),
        i = void 0,
        el = startEl;
    do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {

            // do nothing
        }
    } while (i < 0 && (el = el.parentElement));
    return el;
},
    prevent = function prevent(e) {
    e.preventDefault();
    e.stopPropagation();
},


// Default options
defaults = {
    bodyOpenClass: 'mini-modal-active',
    openClass: 'is-open',
    closeAttr: 'data-close',
    overlayAttr: 'data-overlay',
    contentAttr: 'data-content',
    escClose: true,
    backgroundClickClose: true,
    openImmediately: false,
    moveToBodyEnd: true
};

var activeModal = void 0;

// Static methods

/**
 * Factory for MiniModal instance.
 *
 * @param {HTMLElement|string} el - Container element or id of container element
 * @param {Object} options - Options object
 * @returns {Object} Returns a modal instance
 */
MiniModal.create = function (el, options) {
    var instance = {},
        events = {},
        settings = assign({}, defaults, options),
        clickDelegateHandler = function clickDelegateHandler(e) {
        if (closest(e.target, '[' + settings.closeAttr + ']')) {
            instance.close();

            prevent(e);
            return;
        }

        if (settings.backgroundClickClose && closest(e.target, '[' + settings.overlayAttr + ']')) {
            instance.close();

            prevent(e);
        }
    },
        keyHandler = function keyHandler(e) {
        if (settings.escClose && e.code === 'Escape') {
            instance.close();
        }
    },
        bindEvents = function bindEvents() {
        el.addEventListener('click', clickDelegateHandler);
        document.addEventListener('keyup', keyHandler);
    },
        unbindEvents = function unbindEvents() {
        el.removeEventListener('click', clickDelegateHandler);
        document.removeEventListener('keyup', keyHandler);
    },
        trigger = function trigger(eventName) {
        events.hasOwnProperty(eventName) && events[eventName]({
            modal: el,
            modalContent: el.querySelector('[' + settings.contentAttr + ']')
        });
    };

    // Public methods
    instance.open = function () {

        // Close any open modal first.
        MiniModal.close();

        bindEvents();

        // show modal. setTimeout is needed if transitions are used.
        setTimeout(function () {
            trigger('beforeOpen');

            el.addEventListener('transitionend', function transitionHandler() {

                // store active modal, so it can be closed with static close method.
                activeModal = instance;

                trigger('afterOpen');

                el.removeEventListener('transitionend', transitionHandler);
            });

            document.documentElement.classList.add(settings.bodyOpenClass);
            el.classList.add(settings.openClass);
        }, 0);
    };

    instance.close = function () {
        trigger('beforeClose');

        // Hide modal
        el.classList.remove(settings.openClass);
        document.documentElement.classList.remove(settings.bodyOpenClass);

        unbindEvents();
        activeModal = null;

        trigger('afterClose');
    };

    /**
     * Registers an event
     *
     * @param {string} eventName - Event name
     * @param {Function} callback - Callback function
     * @returns {Object} instance - Returns the modal instance. can be useful for chaining.
     */
    instance.on = function (eventName, callback) {
        if (!events.hasOwnProperty(eventName)) {

            events[eventName] = callback;
        }

        // Allow chaining
        return instance;
    };

    instance.off = function () {
        var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (eventName === '') {
            events = {};
        } else if (events.hasOwnProperty(eventName)) {
            delete events[eventName];
        }

        // Allow chaining
        return instance;
    };

    // Check if el is id or element
    if (typeof el === 'string') {
        el = document.getElementById(el);
    }

    if (!(el instanceof HTMLElement)) {
        throw new Error('MiniModal container element not found.');
    }

    // Move modal to end of body
    if (settings.moveToBodyEnd) {
        document.body.appendChild(el);
    }

    // Show modal
    if (settings.openImmediately) {
        instance.open();
    }

    return instance;
};

/**
 * Closes any active modal dialog.
 */
MiniModal.close = function () {
    activeModal && activeModal.close();
    activeModal = null;
};

/**
 * Creates a modal and immediately opens it.
 *
 * @param {HTMLElement|string} el - Container element or id of container element
 * @param {Object} options - Options object
 * @returns {Object} Returns a modal instance
 */
MiniModal.open = function (el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    MiniModal.close();
    return MiniModal.create(el, assign(options, { openImmediately: true }));
};

MiniModal.getActiveModal = function () {
    return activeModal;
};
return MiniModal;
}));
