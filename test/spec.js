describe('minimodal', function () {
    it('is in global namespace', function () {
        expect('minimodal' in window).toBe(true);
    });
});

describe("MiniModal", function () {
    var mod,
        modal,
        $ = jQuery;

    beforeEach(function () {
        mod = $('<div id="modal" class="mini-modal">' +
            '<div class="mini-modal__overlay"></div>' +
            '<div class="mini-modal__content">' +
                '<h1>A very simple modal</h1>' +

                '<div class="mini-modal__close"></div>' +
            '</div>' +
            '</div>');
        $(document.body).append(mod);

        jasmine.clock().install();

        modal = minimodal.open({modalId: 'modal'});
    });

//    it("is created", function () {
//        modal = minimodal.create({modalId: 'modal'});
//
//        expect(modal).toBeDefined();
//    });

//    it("has open function", function () {
//        expect(modal.open).toBeDefined();
//    });

    it("has opened correctly", function() {
        jasmine.clock().tick(10);

        expect($('body').hasClass(modal.settings.bodyOpenClass) && $('#modal').hasClass('open')).toBe(true);
    });
});