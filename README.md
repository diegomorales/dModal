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
    <div data-mini-modal-overlay></div>

    <div data-mini-modal-content>
        <!-- insert your content here -->
        
      
        <!-- close button needs to be somewhere inside of ni-modal__content -->
        <div data-mini-modal-close></div>
    </div>
</div>
```

Now you can open the dialog like this:
```bash
MiniModal.open('dialog');
```

###with browserify
```bash
var MiniModal = require('mini-modal');

MiniModal.open('dialog');
```
##API

###MiniModal.create(id, options)
Returns an instance of MiniModal.
- `id (string)`: Id to modal element. Pass it without '#'. 
- `options (object)`: Configuration for the MiniModal instance.

###MiniModal.open(id, options)
Also returns an instance of MiniModal and opens it immediately.
- `id (string)`: Id to modal element. Pass it without '#'. 
- `options (object)`: Configuration for the MiniModal instance.

###MiniModal.close()
Closes any active modal.

###MiniModal.getActiveModal()
Returns MiniModal instance of the currently open modal.


###Options
- backgroundClickClose (default `true`): Close modal when clicking on the background overlay.
- escClose (default `true`): Close modal when pressing `ESC`-key.
- openImmediately (default `true`): Open modal when Instance is created. If you want to store the MiniModal instance and open it later, set it to `false`.

###Instance methods
####open()
Quite obvious.

####close()
Same here.



##Browser Support
- Firefox
- Chrome
- Safari
- IE9+
- EDGE
- Opera

##License
Licensed under [MIT][mit].