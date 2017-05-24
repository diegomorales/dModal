const MiniModal = {},

    // Helper functions
    assign = function () {
        for (let i = 1; i < arguments.length; i++) {
            for (let key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }

        return arguments[0];
    },

    closest = (startEl, selector) => {
        let matches = document.querySelectorAll(selector),
            i,
            el = startEl;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {

                // do nothing
            }

        } while ((i < 0) && (el = el.parentElement));
        return el;
    },

    prevent = (e) => {
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

let activeModal;

// Static methods

/**
 * Factory for MiniModal instance.
 *
 * @param {HTMLElement|string} el - Container element or id of container element
 * @param {Object} options - Options object
 * @returns {Object} Returns a modal instance
 */
MiniModal.create = (el, options) => {
    let instance = {},
        events = {},
        settings = assign({}, defaults, options),

        clickDelegateHandler = (e) => {
            if (closest(e.target, `[${settings.closeAttr}]`)) {
                instance.close();

                prevent(e);
                return;
            }

            if (settings.backgroundClickClose && closest(e.target, `[${settings.overlayAttr}]`)) {
                instance.close();

                prevent(e);
            }
        },

        keyHandler = (e) => {
            if (settings.escClose && e.code === 'Escape') {
                instance.close();
            }
        },

        bindEvents = () => {
            el.addEventListener('click', clickDelegateHandler);
            document.addEventListener('keyup', keyHandler);
        },

        unbindEvents = () => {
            el.removeEventListener('click', clickDelegateHandler);
            document.removeEventListener('keyup', keyHandler);
        },

        trigger = (eventName) => {
            events.hasOwnProperty(eventName) && events[eventName]({
                modal: el,
                modalContent: el.querySelector(`[${settings.contentAttr}]`)
            });
        };

    // Public methods
    instance.open = () => {

        // Close any open modal first.
        MiniModal.close();

        bindEvents();

        // show modal. setTimeout is needed if transitions are used.
        requestAnimationFrame(() => {
            trigger('beforeOpen');

            el.addEventListener('transitionend', function transitionHandler() {

                // store active modal, so it can be closed with static close method.
                activeModal = instance;

                trigger('afterOpen');

                el.removeEventListener('transitionend', transitionHandler);
            });

            document.documentElement.classList.add(settings.bodyOpenClass);
            el.classList.add(settings.openClass);
        });
    };

    instance.close = () => {
        trigger('beforeClose');

        el.addEventListener('transitionend', function transitionHandler() {
            unbindEvents();
            activeModal = null;

            trigger('afterClose');

            el.removeEventListener('transitionend', transitionHandler);
        });

        // Hide modal
        el.classList.remove(settings.openClass);
        document.documentElement.classList.remove(settings.bodyOpenClass);
    };

    /**
     * Registers an event
     *
     * @param {string} eventName - Event name
     * @param {Function} callback - Callback function
     * @returns {Object} instance - Returns the modal instance. can be useful for chaining.
     */
    instance.on = (eventName, callback) => {
        if (!events.hasOwnProperty(eventName)) {

            events[eventName] = callback;
        }

        // Allow chaining
        return instance;
    };

    instance.off = (eventName = '') => {
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
MiniModal.close = () => {
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
MiniModal.open = (el, options = {}) => {
    MiniModal.close();
    return MiniModal.create(el, assign(options, {openImmediately: true}));
};

MiniModal.getActiveModal = () => activeModal;

export default MiniModal;
