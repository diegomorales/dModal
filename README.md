#mini-modal
mini-modal is intended to be super lightweight and very customizable.
Has support for CommonJS and AMD.

##Installation
###via npm
```bash
npm install mini-modal
```

###via bower
```bash
bower install mini-modal
```

##Usage
Place this markup somewhere in `body`, preferrably at the end.
```html
<div id="dialog" class="mini-modal">
    <div class="mini-modal__overlay"></div>

    <div class="mini-modal__content">
        <!-- insert your content here -->
      
        <!-- close button needs to be somewhere inside of ni-modal__content -->
        <div class="mini-modal__close"></div>
    </div>
</div>
```

Now you can open the dialog like this:
```bash
new MiniModal('dialog');
```

###with browserify
```bash
var MiniModal = require('mini-modal');

new MiniModal('dialog');
```
##API

`new MiniModal(id, options)` returns an instance of MiniModal and opens it immediately (default behaviour).
- `id (string)`: Id to modal element. Pass it without '#'. 
- `options (object)`: Configuration for the is MiniModal instance.

###Options
- backgroundClickClose (default `true`): Close modal when clicking on the background overlay.
- escClose (default `true`): Close modal when pressing `ESC`-key.
- openImmediately (default `true`): Open modal when Instance is created. If you want to store the MiniModal instance and open it later, set it to `false`.

###Instance methods
####open()
Quite obvious.

####close()
Same here.

###Static methods
####open(id, options)
Is the same as calling `new MiniModal(id, options)`.

####close()
Closes any active modal.

####getActiveModal()
Returns MiniModal instance of the currently open modal.

##Browser Support
- Firefox
- Chrome
- Safari
- IE9+
- EDGE
- Opera

##License
Licensed under [MIT][mit].